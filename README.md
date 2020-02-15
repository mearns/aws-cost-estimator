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

A **vector** is a map from dimensions to collections of units in that dimension.

A **manifold** is a map from dimensions to integers, where the integers define the _degree_ of that dimension. E.g., a Newton
is defined as kilogram meters per second per second, so this would have a manifold of `{ mass: 1, distance: 1, time: -2 }`.
Note that manifolds don't specific units, so a Newton would not _be_ a manifold, it would _have_ an implicit manifold
indicated by it's units. Instead, a Newton would be a shear.

A **shear** is the pairing of a vector and a manifold. A shear is only valid if cardinality of each set of units in the vector
is equal to the magnitude of the degree of the corresponding dimensions in the manifold. For instance, a Newton would be a shear
in the force manifold, defined by:
`( { mass: [kilograms], distance: [meters], time: [ seconds, seconds ] }, { mass: 1, distance: 1, time: -2 } )`

Shears are **similar** if and only if they have the same manifold. Shear's are **equal** if and only if they have the same
vector and manifold.

A **scalar** is the two tuple of a number and a shear.

Scalars can be added if and only if they have the same shear. Scalars can be **scaled** to a different, _similar_ shear by multiplying
the value of the scalar by a factor which scales the units from the one shear to the other.

Scalars can be multiplied regardless of their shear, even in different manifolds, producing a scalar with a new number and new shear (in
a new manifold). When scalars are multiplied, the resulting scalar has a number which is the product of the operands' numbers, and the resulting scalar's
manifold is the product of of the operands' manifolds. Manifolds are multiplied by adding the integer values for corresponding dimensions
(note that missing dimensions implicitly have an exponent of 0).
