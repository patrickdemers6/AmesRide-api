class Interval {
  #callback: () => void;
  #interval: NodeJS.Timeout;
  #seconds: number;

  constructor(seconds: number, callback: () => void) {
    this.#callback = callback;
    this.#seconds = seconds;
  }

  start() {
    this.#callback();
    this.#interval = setInterval(this.#callback, this.#seconds * 1000);
    return this;
  }

  stop() {
    clearInterval(this.#interval);
    return this;
  }
}

export default Interval;
