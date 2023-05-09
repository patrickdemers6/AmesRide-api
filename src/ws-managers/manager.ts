/**
 * Tracks a user's subscriptions and automatically sends updates.
 */

import { managerSubscribeCount, subscribedUserCountGuage } from "../monitoring";

class Manager<T> {
  subscribers: { [key: string]: { socket: UserSocket; key: string } } = {};

  /**
   * Data stores mapping from key (which a user subscribes to) to a string.
   * A string is stored for the value is already stringified.
   * By only mapping to strings, JSON.stringify is not called on every emit.
   */
  data: T;

  eventName: string;
  provider: RealtimeProvider<T>;
  #interval: NodeJS.Timer;
  #loggingEventType;

  #ignoreCount: number;

  constructor(
    eventName: string,
    realtimeProvider: RealtimeProvider<T>,
    loggingEventType = ""
  ) {
    this.eventName = eventName;
    this.provider = realtimeProvider;
    this.#loggingEventType = loggingEventType;
    this.#ignoreCount = 0;

    if (this.#loggingEventType)
      subscribedUserCountGuage.labels({ type: this.#loggingEventType }).set(0);

    realtimeProvider.on("data", this.#handleData.bind(this));
  }

  /**
   * Saves new data and sends it to subscribers.
   * @param data freshest data available
   */
  async #handleData(data) {
    await this.#updateData(data);
    this.#sendToAllSubscribers();
  }

  /**
   * Adds a subscriber and their associated stopId. If the subscriber was previously associated with a different stopId, the previous stopId will be overwritten.
   * @param socket The socket associated with the subscriber.
   * @param key The key of data this user would like to receive.
   */
  addSubscriber(socket: UserSocket, key: string) {
    const isNewSubscriber = !this.subscribers[socket.id];
    this.subscribers[socket.id] = { socket, key };
    this.#sendToOneSubscriber(socket.id);

    managerSubscribeCount.labels({ type: this.#loggingEventType, key }).inc(1);

    if (this.#loggingEventType && isNewSubscriber) {
      subscribedUserCountGuage
        .labels({
          type: this.#loggingEventType,
        })
        .inc(1);
    }
  }

  /**
   * Stop alerting a user with updated data.
   * @param socket The socket associated with the subscriber to remove.
   */
  removeSubscriber(socket: UserSocket) {
    if (!this.subscribers[socket.id]) return false;

    if (this.#loggingEventType) {
      subscribedUserCountGuage
        .labels({
          type: this.#loggingEventType,
        })
        .dec(1);
    }

    delete this.subscribers[socket.id];
    return true;
  }

  /**
   * Update internal state with fresh data.
   */
  async #updateData(data): Promise<void> {
    const [updatedData, isIgnoreSuggested] = data; // await this.provider.#processData();

    if (isIgnoreSuggested) {
      if (this.#ignoreCount < 4) {
        ++this.#ignoreCount;
        return;
      } else {
        // 4 empties have been ignored, assume feed is actually empty
      }
    } else {
      this.#ignoreCount = 0;
    }

    if (updatedData) this.data = updatedData;
  }

  /**
   * Emit arrival times to all subscribers.
   */
  #sendToAllSubscribers() {
    Object.values(this.subscribers).forEach((subscriber) => {
      this.#emit(subscriber);
    });
  }

  /**
   * Send arrival times to a single subscriber.
   * @param sessionId The unique identifier provided by the user's socket.
   */
  #sendToOneSubscriber(sessionId: string) {
    this.#emit(this.subscribers[sessionId]);
  }

  /**
   * Emits updated arrival data to a subscriber.
   * @param subscriber details of the subscriber to emit to
   */
  #emit(subscriber: { socket: UserSocket; key: string }) {
    if (!this.data) return;
    subscriber.socket.emit(this.eventName, {
      data: this.data[subscriber.key],
      k: subscriber.key,
    });
  }

  /**
   * Shutsdowmn this manager. It will stop grabbing data and sending it to users.
   */
  kill() {
    clearInterval(this.#interval);
  }
}

export default Manager;
