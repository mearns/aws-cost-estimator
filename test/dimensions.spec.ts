/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint @typescript-eslint/ban-ts-ignore: 0 */

// Module under test
import * as dimensions from "../src/dimensions";

// Support
import { expect } from "chai";
// import sinon from "sinon";
// import sinonChai from "sinon-chai";
// use(sinonChai);

describe("dimensions", () => {
  describe("defineDimension", () => {
    it("a simple time dimension", () => {
      const time = dimensions.dimension("time", "seconds", {
        milliseconds: 0.001,
        minutes: 60,
        hours: 60 * 60,
        days: 24 * 60 * 60
      });
      const { milliseconds, seconds, minutes, hours, days } = time.units;

      expect(time(30, seconds, minutes)).to.equal(0.5);
      expect(time(90, minutes, hours)).to.equal(1.5);
      expect(time(3.5, days, hours)).to.equal(84);
      expect(time(2250, milliseconds, seconds)).to.equal(2.25);
    });
  });
});
