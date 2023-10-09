class Interval {
  #callback: () => void;

  #interval: NodeJS.Timer;

  #seconds: number;

  constructor(seconds: number, callback: () => void) {
    this.#callback = callback;
    this.#seconds = seconds;
  }

  start() {
    this.#callback();
    this.#interval = setInterval(this.#callback, this.#seconds * 1000);
  }

  stop() {
    clearInterval(this.#interval);
  }
}

export default Interval;
