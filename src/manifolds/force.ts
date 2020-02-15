import { Manifold, manifold } from ".";
import distance from "../dimensions/distance";
import mass from "../dimensions/mass";
import time from "../dimensions/time";
import { scalar, scale } from "../scalars";
import { shear } from "../shears";
import { vector } from "../vectors";

export const force: Manifold = manifold([
  [mass.dim, 1],
  [distance.dim, 1],
  [time.dim, -2]
]);

export const Newtons = scalar(
  1,
  shear(
    vector([
      [mass.dim, [mass.kilograms]],
      [distance.dim, [distance.meters]],
      [time.dim, [time.seconds, time.seconds]]
    ]),
    force
  )
);
export const Pounds = scale(4.44822, Newtons);
