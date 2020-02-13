import { DimensionWithUnits, defineDimension, Dimension, Unit } from ".";

const _time: DimensionWithUnits = defineDimension("time", "seconds", {
  microseconds: 1e-6,
  milliseconds: 1e-3,
  minutes: 60,
  hours: 60 * 60,
  days: 24 * 60 * 60,
  weeks: 7 * 24 * 60 * 60,
  months: 30 * 24 * 60 * 60,
  years: 365.25 * 24 * 60 * 60
});

const units: { [unitName: string]: symbol } = { ..._time.units };
units.ms = _time.units.milliseconds;
units.us = _time.units.microseconds;
units.μs = _time.units.microseconds;

export const {
  microseconds,
  us,
  μs,
  milliseconds,
  ms,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  months,
  years
} = units;

interface TimeUnits {
  microseconds: Unit;
  us: Unit;
  μs: Unit;
  milliseconds: Unit;
  ms: Unit;
  seconds: Unit;
  minutes: Unit;
  hours: Unit;
  days: Unit;
  weeks: Unit;
  months: Unit;
  years: Unit;
}

interface TimeDimension extends Dimension, TimeUnits {}

const time: TimeDimension = Object.assign(
  _time,
  (units as unknown) as TimeUnits
);
export default time;
