import { expect } from "chai";
import Time from "../../providers/time";
import Sinon from "sinon";
import Long from "long";

const systemDate = new Date(2030, 5, 3, 4, 19, 30);

describe("Time", () => {
  beforeEach(() => {
    Sinon.useFakeTimers(systemDate);
  });

  afterEach(() => {
    Sinon.restore();
  });

  describe("#copy", () => {
    it("creates an identical clone", () => {
      const time = new Time(4, 19);
      const clone = Time.copy(time);
      expect(clone.hours).to.equal(4);
      expect(clone.minutes).to.equal(19);
    });
  });

  describe("#fromDate", () => {
    it("gets minutes and hours", () => {
      const d = new Date();
      const time = Time.fromDate(d);
      expect(time.hours).to.equal(d.getHours());
      expect(time.minutes).to.equal(d.getMinutes());
    });
  });

  describe("#now", () => {
    it("gets data from current time", () => {
      const time = Time.now();
      expect(time.hours).to.equal(systemDate.getHours());
      expect(time.minutes).to.equal(systemDate.getMinutes());
    });
  });

  describe("#addMinutes", () => {
    it("adds positive minutes in same hour", () => {
      const time = new Time(4, 0);
      time.addMinutes(10);
      expect(time.hours).to.equal(4);
      expect(time.minutes).to.equal(10);
    });

    it("adds positive minutes to new hour", () => {
      const time = new Time(4, 0);
      time.addMinutes(75);
      expect(time.hours).to.equal(5);
      expect(time.minutes).to.equal(15);
    });

    it("adds positive minutes in same hour", () => {
      const time = new Time(4, 20);
      time.addMinutes(-10);
      expect(time.hours).to.equal(4);
      expect(time.minutes).to.equal(10);
    });

    it("adds negative minutes to new hour", () => {
      const time = new Time(4, 0);
      time.addMinutes(-75);
      expect(time.hours).to.equal(2);
      expect(time.minutes).to.equal(45);
    });
  });

  describe("#toInteger", () => {
    it("returns minutes into day", () => {
      const time = new Time(1, 10);
      expect(time.toInteger()).to.equal(70);
    });
  });

  describe("constructor", () => {
    it("creates with proper time", () => {
      const time = new Time(1, 11);
      expect(time.hours).to.equal(1);
      expect(time.minutes).to.equal(11);
    });
    it("rejects negative minutes", () => {
      expect(() => new Time(1, -11)).to.throw("minutes cannot be negative");
    });
    it("rejects negative hours", () => {
      expect(() => new Time(-1, 11)).to.throw("hours cannot be negative");
    });
  });

  describe("#fromShortTimeString", () => {
    it("parses hours and minutes", () => {
      const time = Time.fromShortTimeString("02:03:00");
      expect(time.hours).to.equal(2);
      expect(time.minutes).to.equal(3);
    });
  });

  describe("#fromDateString", () => {
    it("parses iso date string", () => {
      const time = Time.fromDateString("2023-10-27T03:58:26.833");
      expect(time.hours).to.equal(3);
      expect(time.minutes).to.equal(58);
    });
    it("parses date string", () => {
      const time = Time.fromDateString(
        "Thu Oct 26 2023 23:01:48 GMT-0500 (Central Daylight Time)"
      );
      // TZ=UTC, thus time reported in UTC (5 hours added) not Central Daylight Time
      expect(time.hours).to.equal(4);
      expect(time.minutes).to.equal(1);
    });
  });

  describe("#fromLong", () => {
    it("reads long", () => {
      const ms = systemDate.getTime();
      const time = Time.fromSeconds(ms / 1000);
      expect(time.hours).to.equal(4);
      expect(time.minutes).to.equal(19);
    });
  });

  describe("#setHours", () => {
    it("sets hours", () => {
      const time = new Time(0, 0);
      time.setHours(1);
      expect(time.hours).to.equal(1);
      time.setHours(23);
      expect(time.hours).to.equal(23);
    });

    it("rejects negative hours", () => {
      expect(() => new Time(0, 0).setHours(-1)).to.throw(
        "hours cannot be negative"
      );
    });
  });

  describe("#setMinutes", () => {
    it("sets minutes", () => {
      const time = new Time(0, 0);
      time.setMinutes(1);
      expect(time.minutes).to.equal(1);
      time.setMinutes(23);
      expect(time.minutes).to.equal(23);
    });

    it("rejects negative minutes", () => {
      expect(() => new Time(1, 11).setMinutes(-1)).to.throw(
        "minutes cannot be negative"
      );
    });
  });
});
