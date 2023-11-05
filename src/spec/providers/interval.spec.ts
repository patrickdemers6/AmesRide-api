import { beforeEach, describe, it } from "mocha";
import Interval from "../../providers/interval";
import sinon from "sinon";
import { expect } from "chai";

describe("interval", () => {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it("triggers callback every x seconds", () => {
    const stub = sinon.stub();
    const interval = new Interval(1, stub);
    interval.start();
    clock.tick(1000);
    expect(stub.callCount).to.equal(2);

    clock.tick(10000);
    expect(stub.callCount).to.equal(12);
  });

  it("stops triggering callback after stop", () => {
    const stub = sinon.stub();
    const interval = new Interval(1, stub);
    interval.start();
    clock.tick(1000);
    expect(stub.callCount).to.equal(2);

    interval.stop();

    clock.tick(10000);
    expect(stub.callCount).to.equal(2);
  });

  it("triggers callback on start", () => {
    const stub = sinon.stub();
    const interval = new Interval(5, stub);
    interval.start();
    expect(stub.callCount).to.equal(1);
  });
});
