import { DimensionWithUnits, defineDimension, Dimension, Unit } from ".";

const _mass: DimensionWithUnits = defineDimension("mass", "kilograms", {
  milligrams: 1e-6,
  grams: 1e-3,
  megagrams: 1e6
});

const units: { [unitName: string]: symbol } = { ..._mass.units };
units.mg = units.milligrams;
units.g = units.grams;
units.kg = units.kilograms;

export const { milligrams, mg, grams, g, kilograms, kg, megagrams } = units;

interface MassUnits {
  milligrams: Unit;
  mg: Unit;
  grams: Unit;
  g: Unit;
  kilograms: Unit;
  kg: Unit;
  megagrams: Unit;
}

interface MassDimension extends Dimension, MassUnits {
  readonly dim: Dimension;
}

const mass: MassDimension = Object.assign(
  _mass,
  (units as unknown) as MassUnits
);
export default mass;
