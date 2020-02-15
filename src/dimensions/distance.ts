import { DimensionWithUnits, dimension, Dimension, Unit } from ".";

const _distance: DimensionWithUnits = dimension("distance", "meters", {
  micrometers: 1e-6,
  millimeters: 1e-3,
  centimeters: 1e-2,
  kilometers: 1e3,

  parsec: 3.086e16,
  astronomicalUnit: 1.496e11,

  inches: 0.0254,
  feet: 0.3048,
  miles: 1609.34,
  leagues: 5556,

  smoots: 1.7018
});

const units: { [unitName: string]: Unit } = { ..._distance.units };
units.um = units.micrometers;
units.μm = units.micrometers;
units.mm = units.millimeters;
units.cm = units.centimeters;
units.m = units.meters;
units.km = units.kilometers;
units.au = units.astronomicalUnit;

export const {
  micrometers,
  um,
  μm,
  millimeters,
  mm,
  centimeters,
  cm,
  meters,
  m,
  kilometers,
  km,
  parsec,
  astronomicalUnit,
  au,
  inches,
  feet,
  miles,
  leagues,
  smoots
} = units;

interface DistanceUnits {
  micrometers: Unit;
  um: Unit;
  μm: Unit;
  millimeters: Unit;
  mm: Unit;
  centimeters: Unit;
  cm: Unit;
  meters: Unit;
  m: Unit;
  kilometers: Unit;
  km: Unit;
  parsec: Unit;
  astronomicalUnit: Unit;
  au: Unit;
  inches: Unit;
  feet: Unit;
  miles: Unit;
  leagues: Unit;
  smoots: Unit;
}

interface DistanceDimension extends Dimension, DistanceUnits {
  readonly dim: Dimension;
}

const distance: DistanceDimension = Object.assign(
  _distance,
  (units as unknown) as DistanceUnits
);
export default distance;
