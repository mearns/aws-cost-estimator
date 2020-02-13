# aws-cost-estimator

## Concepts

A **dimension** is a specific dimension by which things are measured: e.g., time, or cost, or storage. dimensions
are not interchangeable.

Each dimension has one or more associated **units**, which is a particular unit for measuring that dimension. For
instance, the _time_ dimension might have units like _seconds_ and _minutes_. All units for a given dimension are
interchangeable according to some mapping. In the most general case, this mapping is not 1-to-1, not invertible,
and not fixed over time. For example, the dimension _lambda-runtime_ is measured in hundreds of milliseconds, rounded
up, so 123ms and 132ms are both mapped to 2 hundreds-of-ms: this is neither 1-to-1 nor invertible (2 hundreds-of-ms
would not be inverted to 123ms or 132ms, it would be converted to 200ms). An example of a mapping that is not fixed
in time would be different currencies for the _cost_ dimension.

The dimension is capable of converting values between any of its units. In practice, this is usually imlemented by
defining one **base unit** and defining all other units in terms of its mapping to and from this base unit, but this
is up to the dimension itself.

A **manifold** is a map from dimensions to integers, where the integers define the exponent of that dimension. E.g., a Newton
is defined as kilogram meters per second per second, so this would have a manifold of `{ mass: 1, distance: 1, time: -2 }`.
Note that manifolds don't specific units, so a Newton would not _be_ a manifold, it would _have_ an implicit manifold
indicated by it's units.

A **vector** is a collection of units. A vector can be **applied** to a manifold if for every dimension the magnitude of the
exponent of that dimension in the manifold is equal to the number of units of that dimension in the vector. For instance, the vector
`[ kilogram, meter, second, second ]` could be applied to the _force_ manifold, `{ mass: 1, distance: 1, time: -2 }`.
However, it could also be applied to an entirely different manifold `{ mass: -1, distance: 1, time: 2 }`.
A vector applied to a manifold is a **shear**.

So a Newton is a shear of `([ kg, m, s, s ], { mass: 1, distance: 1, time: -2 })`.

XXX: No, a vector is a mapping of dimensions to numbers, where the numbers tell how to scale a base-unit value in that
dimension. E.g., `(g * m)` would probably be `{ mass: 0.001, distance: 1 }`, and `(kg * cm / hour / min)` would be
`{ mass: 1, distance: 0.01, time: (60 * 3600) }`.

A **scalar** is the two tuple of a number and a shear. For instance, 4 Netwons. Being a shear, it has an implicit manifold (and
also a vector, but a vector is not terribly useful). A **scalar** can be **scaled** by a value into another scalar in the same manifold
by changing its vector while keeping its manifold.

Scalars can be added if and only if they have the same shear. If they have the same manifold but different vector, they can be
scaled to a common vector and then added.

Scalars can be multiplied regardless of their vector or manifold, producing a scalar with a new vector and new manifold. When
scalars are multiplied, the resulting scalar has a vector which is the union of the operands' vectors, and the resulting scalar's
manifold is the product of of the operands' manifolds. Manifolds are multiplied by adding the integer values for corresponding dimensions
(note that missing dimensions implicitly have an exponent of 0).
