import * as shears from "../shears";

type Scalar = () => {
  readonly value: number;
  readonly shear: shears.Shear;
};

/**
 * Create a scalar.
 */
export function scalar(value: number, shear: shears.Shear): Scalar {
  const s: Scalar = () => ({
    value,
    shear
  });
  s.toString = (): string => `(${value}  ${shear})`;
  return s;
}

/**
 * Get the numeric value from a given scalar.
 */
export function value(scalar: Scalar): number {
  return scalar().value;
}

/**
 * Get the shear from a given scalar.
 */
export function shear(scalar: Scalar): shears.Shear {
  return scalar().shear;
}

/**
 * Multiply a scalar by a specified factor, returning a new scalar.
 */
export function scale(k: number, a: Scalar): Scalar {
  return scalar(k * value(a), shear(a));
}

export function negate(a: Scalar): Scalar {
  return scale(-1, a);
}

export function reshear(a: Scalar, targetShear: shears.Shear): Scalar {
  const startingShear: shears.Shear = shear(a);
  if (shears.similar(startingShear, targetShear)) {
    throw new TypeError("Shears are not similar");
  }
  let scale = 1;
  for (const dim of targetShear) {
    const { units: startingUnits } = startingShear(dim);
    const { isPositive, units: targetUnits } = targetShear(dim);
    for (const idx in startingUnits) {
      const conversion = dim(1, startingUnits[idx], targetUnits[idx]);
      if (isPositive) {
        scale *= conversion;
      } else {
        scale /= conversion;
      }
    }
  }
  return scalar(value(a) * scale, targetShear);
}

/**
 * Add two scalars with congruent shears to produce a new scalar
 * in the same shear.
 *
 * @throws {TypeError} If the shear's are not congruent.
 */
export function add(a: Scalar, b: Scalar): Scalar {
  const aShear = shear(a);
  const bShear = shear(b);
  if (shears.equal(aShear, bShear)) {
    return scalar(value(a) + value(b), aShear);
  }
  throw new TypeError("Manifolds are not convertible");
}
