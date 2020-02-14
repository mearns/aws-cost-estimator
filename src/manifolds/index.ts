import * as dimensions from "../dimensions";

export type DimExponent = number;

type ManifoldMap = (dim: dimensions.Dimension) => DimExponent;

export interface Manifold extends ManifoldMap {
  readonly [Symbol.iterator]: () => Iterator<
    [dimensions.Dimension, DimExponent]
  >;
}

export function manifold(
  elements: Iterable<[dimensions.Dimension, DimExponent]>
): Manifold {
  const map: Map<dimensions.Dimension, DimExponent> = new Map(elements);
  const m: Manifold = Object.assign(
    (dim: dimensions.Dimension): DimExponent => map.get(dim) || 0,
    {
      [Symbol.iterator]: map[Symbol.iterator]
    }
  );
  return m;
}

function manifoldDimensions(
  manifold: Manifold
): Iterable<dimensions.Dimension> {
  return [...manifold].map(([dim]) => dim);
}

export function multiplyManifolds(a: Manifold, b: Manifold): Manifold {
  const product: [dimensions.Dimension, DimExponent][] = [];
  const allDims: Set<dimensions.Dimension> = new Set([
    ...manifoldDimensions(a),
    ...manifoldDimensions(b)
  ]);
  for (const dim of allDims) {
    product.push([dim, (a(dim) || 0) + (b(dim) || 0)]);
  }
  return manifold(product);
}

export function invertManifold(a: Manifold): Manifold {
  return manifold([...a].map(([dim, number]) => [dim, -number]));
}

export function divideManifolds(numer: Manifold, denom: Manifold): Manifold {
  return multiplyManifolds(numer, invertManifold(denom));
}

export function manifoldsAreEqual(a: Manifold, b: Manifold): boolean {
  const allDims: Set<dimensions.Dimension> = new Set([
    ...manifoldDimensions(a),
    ...manifoldDimensions(b)
  ]);
  for (const dim of allDims) {
    if (a(dim) !== b(dim)) {
      return false;
    }
  }
  return true;
}
