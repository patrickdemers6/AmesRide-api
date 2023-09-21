import { expect } from "chai";
import {
  indexObjectArray,
  indexObjectArrayMultiple,
} from "../../utils/indexObjectArray";

describe("indexObjectArray", () => {
  it("indexes by specified key", () => {
    const obj1 = { id: "1", foo: "bar" };
    const obj2 = { id: "2", other: "data" };
    const data = [obj1, obj2];
    const result = indexObjectArray(data, "id");
    expect(result).to.deep.equal({
      "1": obj1,
      "2": obj2,
    });
  });
});

describe("indexObjectArrayMultiple", () => {
  it("indexes by specified key", () => {
    const obj1 = { id: "1", foo: "bar" };
    const obj2 = { id: "2", other: "data" };
    const obj3 = { id: "1", other: "data" };
    const data = [obj1, obj2, obj3];
    const result = indexObjectArrayMultiple(data, "id");
    expect(result).to.deep.equal({
      "1": [obj1, obj3],
      "2": [obj2],
    });
  });
});
