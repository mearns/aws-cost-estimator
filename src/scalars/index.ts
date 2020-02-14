import {
  Manifold,
  manifoldsAreEqual,
  multiplyManifolds,
  divideManifolds
} from "../manifolds";

export interface Scalar {
  readonly manifold: Manifold;
  readonly magnitude: number;
}

export function scalar(magnitude: number, manifold: Manifold): Scalar {
  return Object.freeze({
    magnitude,
    manifold
  });
}

export function add(a: Scalar, b: Scalar): Scalar {
  if (manifoldsAreEqual(a.manifold, b.manifold)) {
    return { manifold: a.manifold, magnitude: a.magnitude + b.magnitude };
  }
  throw new TypeError("Manifolds are not convertible");
}

export function scale(k: number, a: Scalar): Scalar {
  return {
    manifold: a.manifold,
    magnitude: a.magnitude * k
  };
}

export function multiply(a: Scalar, b: Scalar): Scalar {
  return {
    manifold: multiplyManifolds(a.manifold, b.manifold),
    magnitude: a.magnitude * b.magnitude
  };
}

export function divide(numer: Scalar, denom: Scalar): Scalar {
  return {
    manifold: divideManifolds(numer.manifold, denom.manifold),
    magnitude: numer.magnitude / denom.magnitude
  };
}
