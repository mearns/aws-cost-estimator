import * as dimensions from "../dimensions";

export type DimExponent = number;

type ManifoldMap = (dim: dimensions.Dimension) => DimExponent;

export interface Manifold extends ManifoldMap {
  readonly [Symbol.iterator]: () => Iterator<dimensions.Dimension>;
}

export function manifold(
  elements: Iterable<[dimensions.Dimension, DimExponent]>
): Manifold {
  const map: Map<dimensions.Dimension, DimExponent> = new Map(elements);
  const m: Manifold = Object.assign(
    (dim: dimensions.Dimension): DimExponent => map.get(dim) || 0,
    {
      [Symbol.iterator]: () => map.keys()[Symbol.iterator]()
    }
  );
  return m;
}

export function multiply(a: Manifold, b: Manifold): Manifold {
  const product: [dimensions.Dimension, DimExponent][] = [];
  const allDims: Set<dimensions.Dimension> = new Set([...a, ...b]);
  for (const dim of allDims) {
    product.push([dim, (a(dim) || 0) + (b(dim) || 0)]);
  }
  return manifold(product);
}

export function invert(a: Manifold): Manifold {
  return manifold([...a].map(dim => [dim, -a(dim)]));
}

export function divide(numer: Manifold, denom: Manifold): Manifold {
  return multiply(numer, invert(denom));
}

export function equal(a: Manifold, b: Manifold): boolean {
  const allDims: Set<dimensions.Dimension> = new Set([...a, ...b]);
  for (const dim of allDims) {
    if (a(dim) !== b(dim)) {
      return false;
    }
  }
  return true;
}
