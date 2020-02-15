import { Unit, Dimension } from "../dimensions";
import * as manifolds from "../manifolds";
import * as vectors from "../vectors";

interface ShearDimension {
  readonly units: Unit[];
  readonly isPositive: boolean;
}

type ShearMap = (dim: Dimension) => ShearDimension;

export interface Shear extends ShearMap {
  [Symbol.iterator]: () => Iterator<Dimension>;
}

function stringHelper(unitDegreeMap): string {
  const numUnits = [...unitDegreeMap.keys()].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
  const numElements: string[] = numUnits.map((u: Unit) => {
    const d = unitDegreeMap.get(u);
    if (d === 1) {
      return String(u);
    }
    return `${String(u)}^${d}`;
  });
  if (numElements.length > 1) {
    return `(${numElements.join(" ")})`;
  }
  return numElements[0];
}

/**
 * Apply the given vector to the given manifolds to great a shear.
 */
export function shear(
  vector: vectors.Vector,
  manifold: manifolds.Manifold
): Shear {
  const map: Map<Dimension, ShearDimension> = new Map();
  const numUnitDegrees: Map<Unit, number> = new Map();
  const denUnitDegrees: Map<Unit, number> = new Map();

  const allDims: Set<Dimension> = new Set([...vector, ...manifold]);
  for (const dim of allDims) {
    const degree = manifold(dim);
    const units = vector(dim);
    if (typeof degree === "undefined") {
      throw new TypeError(
        `Vector and Manifold and incompatible: Manifold is missing dimension ${dim}`
      );
    }
    if (typeof units === "undefined") {
      throw new TypeError(
        `Vector and Manifold and incompatible: Vector is missing dimension ${dim}`
      );
    }
    if (Math.abs(degree) !== units.length) {
      throw new TypeError(
        `Vector and Manifold and incompatible: degrees are different for dimension ${dim}`
      );
    }
    if (degree !== 0) {
      map.set(dim, { isPositive: degree > 0, units: [...units] });
      if (degree < 0) {
        for (const unit of units) {
          denUnitDegrees.set(unit, (denUnitDegrees.get(unit) || 0) + 1);
        }
      } else {
        for (const unit of units) {
          numUnitDegrees.set(unit, (numUnitDegrees.get(unit) || 0) + 1);
        }
      }
    }
  }
  const toString = (): string => {
    const numeratorString = stringHelper(numUnitDegrees);
    const denominatorString = stringHelper(denUnitDegrees);
    if (numeratorString) {
      if (denominatorString) {
        return `${numeratorString} / ${denominatorString}`;
      }
      return numeratorString;
    } else if (denominatorString) {
      return `1 / ${denominatorString}`;
    }
    return "";
  };
  return Object.assign((dim: Dimension) => map.get(dim), {
    [Symbol.iterator]: () => map.keys()[Symbol.iterator](),
    toString
  });
}

/**
 * Return the vector of the shear.
 */
export function vector(shear: Shear): vectors.Vector {
  return vectors.vector([...shear].map(dim => [dim, shear(dim).units]));
}

/**
 * Return the manifold of the shear.
 */
export function manifold(shear: Shear): manifolds.Manifold {
  return manifolds.manifold(
    [...shear].map(dim => {
      const { isPositive, units } = shear(dim);
      return [dim, (isPositive ? 1 : -1) * units.length];
    })
  );
}

/**
 * Determine if two shears are similar. Shears are similar if and only if
 * they have equal manifolds.
 */
export function similar(a: Shear, b: Shear): boolean {
  return manifolds.equal(manifold(a), manifold(b));
}

export function equal(a: Shear, b: Shear): boolean {
  return similar(a, b) && vectors.equal(vector(a), vector(b));
}
