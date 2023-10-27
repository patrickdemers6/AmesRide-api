import { fromUnixTime } from "date-fns";
import Long from "long";

class Time {
  hours: number;
  minutes: number;

  constructor(hours: number, minutes: number) {
    if (minutes < 0) throw "minutes cannot be negative";
    if (hours < 0) throw "hours cannot be negative";

    this.hours = hours;
    this.minutes = minutes;
  }

  static fromShortTimeString(time: string) {
    const hours = Number.parseInt(time.substring(0, 2));
    const minutes = Number.parseInt(time.substring(3, 5));

    return new Time(hours, minutes);
  }

  static fromDateString(dateString: string) {
    const date = new Date(dateString);
    return Time.fromDate(date);
  }

  static fromSeconds(s: number) {
    return Time.fromDate(new Date(s * 1000));
  }

  static copy(time: Time) {
    return new Time(time.hours, time.minutes);
  }

  static fromDate(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return new Time(hours, minutes);
  }

  static now() {
    return Time.fromDate(new Date());
  }

  setHours(hours: number) {
    if (hours < 0) throw "hours cannot be negative";

    this.hours = hours;
  }

  setMinutes(minutes: number) {
    if (minutes < 0) throw "minutes cannot be negative";

    this.minutes = minutes;
  }

  toInteger() {
    return this.hours * 60 + this.minutes;
  }

  addMinutes(minutes: number) {
    const newMinutesValue = this.toInteger() + minutes;

    this.hours = Math.floor(newMinutesValue / 60);
    this.minutes = newMinutesValue % 60;

    return this;
  }
}

export default Time;
