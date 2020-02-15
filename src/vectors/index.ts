import * as dimensions from "../dimensions";

type VectorMap = (dim: dimensions.Dimension) => dimensions.Unit[];

export interface Vector extends VectorMap {
  readonly [Symbol.iterator]: () => Iterator<dimensions.Dimension>;
}

export function vector(
  elements: Iterable<[dimensions.Dimension, dimensions.Unit[]]>
): Vector {
  const map: Map<dimensions.Dimension, dimensions.Unit[]> = new Map(elements);
  const v: Vector = Object.assign(
    (dim: dimensions.Dimension): dimensions.Unit[] => map.get(dim) || [],
    {
      [Symbol.iterator]: () => map.keys()[Symbol.iterator]()
    }
  );
  return v;
}

export function equal(a: Vector, b: Vector): boolean {
  const allDims: Set<dimensions.Dimension> = new Set([...a, ...b]);
  for (const dim of allDims) {
    const aUnits = a(dim);
    const bUnits = b(dim);
    if ((aUnits && !bUnits) || (bUnits && !aUnits)) {
      return false;
    }
    if (aUnits.length !== bUnits.length) {
      return false;
    }
    aUnits.sort();
    bUnits.sort();
    for (const idx in aUnits) {
      if (aUnits[idx] !== bUnits[idx]) {
        return false;
      }
    }
  }
  return true;
}
