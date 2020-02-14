# aws-cost-estimator

## Concepts

A **dimension** is a specific dimension by which things are measured: e.g., time, or cost, or storage. dimensions
are not interchangeable.

Each dimension has a one or more associated **units**, including exactly one **baseUnit**. These are particular
units for measuring that dimension. For
instance, the _time_ dimension might have units like _seconds_ and _minutes_. All units for a given dimension are
interchangeable according to some mapping. In the most general case, this mapping is not 1-to-1, not invertible,
and not fixed over time. For example, the dimension _lambda-runtime_ is measured in hundreds of milliseconds, rounded
up, so 123ms and 132ms are both mapped to 2 hundreds-of-ms: this is neither 1-to-1 nor invertible (2 hundreds-of-ms
would not be inverted to 123ms or 132ms, it would be converted to 200ms). An example of a mapping that is not fixed
in time would be different currencies for the _cost_ dimension.

The dimension is responsible of converting values between any of its units.

A **manifold** is a map from dimensions to integers, where the integers define the exponent of that dimension. E.g., a Newton
is defined as kilogram meters per second per second, so this would have a manifold of `{ mass: 1, distance: 1, time: -2 }`.
Note that manifolds don't specific units, so a Newton would not _be_ a manifold, it would _have_ an implicit manifold
indicated by it's units.

A **scalar** is the two tuple of a number and a manifold. For instance, 4 Newtons would be `(4, { mass: 1, distance: 1, time: -2 })`,
assuming the base unit of _mass_ is a kilogram, the base unit of _distance_ is a meter, and the base unit of _time_ is seconds. This
evalutes as `4 kg * m / s / s`;

Scalars can be added if and only if they have the same manifold.

Scalars can be multiplied regardless of their manifold, producing a scalar with a new number and new manifold. When
scalars are multiplied, the resulting scalar has a number which is the product of the operands' numbers, and the resulting scalar's
manifold is the product of of the operands' manifolds. Manifolds are multiplied by adding the integer values for corresponding dimensions
(note that missing dimensions implicitly have an exponent of 0).
