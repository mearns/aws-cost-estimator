/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint @typescript-eslint/ban-ts-ignore: 0 */

// Module under test
import time, * as _time from "../../src/dimensions/time";

// Support
import { expect } from "chai";
// import sinon from "sinon";
// import sinonChai from "sinon-chai";
// use(sinonChai);

describe("time dimension", () => {
  describe("the dimension", () => {
    it("should handle common conversions", () => {
      const { milliseconds, seconds, minutes, hours, days } = time;

      expect(time(30, seconds, minutes)).to.equal(0.5);
      expect(time(90, minutes, hours)).to.equal(1.5);
      expect(time(3.5, days, hours)).to.equal(84);
      expect(time(2250, milliseconds, seconds)).to.equal(2.25);
    });
  });

  describe("the units", () => {
    it("should define the expected units with correct conversion to base units", () => {
      const { ms, us, milliseconds, seconds, minutes, hours, days } = _time;
      expect(time(123, seconds, seconds)).to.equal(123);
      expect(time(1, minutes, seconds)).to.equal(60);
      expect(time(1, hours, seconds)).to.equal(3600);
      expect(time(1, days, seconds)).to.equal(24 * 3600);
      expect(time(1, milliseconds, seconds)).to.equal(1e-3);
      expect(time(1, ms, seconds)).to.equal(1e-3);
      expect(time(1, us, seconds)).to.equal(1e-6);
    });
  });
});
