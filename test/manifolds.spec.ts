/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint @typescript-eslint/ban-ts-ignore: 0 */

// Module under test
import * as manifolds from "../src/manifolds";

// Support
import { expect } from "chai";
import time from "../src/dimensions/time";
import mass from "../src/dimensions/mass";
import distance from "../src/dimensions/distance";
// import sinon from "sinon";
// import sinonChai from "sinon-chai";
// use(sinonChai);

describe("manifolds", () => {
  it("should multiply manifolds correctly", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3]
    ]);
    const b = manifolds.manifold([
      [distance, 1],
      [mass, -5]
    ]);

    const r = manifolds.multiply(a, b);
    expect(r(time)).to.equal(-1);
    expect(r(mass)).to.equal(-2);
    expect(r(distance)).to.equal(1);
  });

  it("should filter out 0-degree dimensions", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3]
    ]);
    const b = manifolds.manifold([
      [mass, -3],
      [distance, 2]
    ]);

    const r = manifolds.multiply(a, b);
    expect(r(time)).to.equal(-1);
    expect(r(mass)).to.equal(0);
    expect(r(distance)).to.equal(2);

    const allDims = [...r];
    expect(allDims).to.have.length(2);
    expect(allDims).to.include(time);
    expect(allDims).to.include(distance);
    expect(allDims).to.not.include(mass);
  });

  it("should divide manifolds correctly", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3]
    ]);
    const b = manifolds.manifold([
      [distance, 1],
      [mass, -5]
    ]);

    const r = manifolds.divide(a, b);
    expect(r(time)).to.equal(-1);
    expect(r(mass)).to.equal(8);
    expect(r(distance)).to.equal(-1);
  });

  it("should correctly test for equality", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3]
    ]);
    const b = manifolds.manifold([
      [mass, 3],
      [time, -1]
    ]);

    expect(manifolds.equal(a, b)).to.be.true;
  });

  it("should correctly test for equality with zero degrees", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3],
      [distance, 0]
    ]);
    const b = manifolds.manifold([
      [mass, 3],
      [time, -1]
    ]);

    expect(manifolds.equal(a, b)).to.be.true;
  });

  it("should correctly test for inequality", () => {
    const a = manifolds.manifold([
      [time, -1],
      [mass, 3]
    ]);
    const b = manifolds.manifold([
      [mass, 3],
      [time, -2]
    ]);

    expect(manifolds.equal(a, b)).to.be.false;
  });
});
