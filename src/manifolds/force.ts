import { Manifold, manifold } from ".";
import distance from "../dimensions/distance";
import mass from "../dimensions/mass";
import time from "../dimensions/time";
import { scalar, scale } from "../scalars";

export const force: Manifold = manifold([
  [mass.dim, 1],
  [distance.dim, 1],
  [time.dim, -2]
]);

export const Newtons = scalar(1, force);
export const Pounds = scale(4.44822, Newtons);
