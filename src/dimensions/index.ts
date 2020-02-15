export type Unit = string | symbol;

export type Dimension = (value: number, from: Unit, to?: Unit) => number;

export type BasePerUnitRatio = number;

export type UnitToUnitConverter =
  | {
      fromBase: (baseUnits: number) => number;
      toBase: (otherUnits: number) => number;
    }
  | BasePerUnitRatio;

export interface DimensionWithUnits extends Dimension {
  readonly dim: Dimension;
  readonly units: { [unitName: string]: Unit };
}

export function dimension(
  dimensionName: string,
  baseUnitName: string,
  unitMappings: {
    [unitName: string]: UnitToUnitConverter;
  }
): DimensionWithUnits {
  if (typeof unitMappings[baseUnitName] !== "undefined") {
    throw new Error(
      "Dimension cannot define a custom converter for the base-unit"
    );
  }

  const units: { [unitName: string]: string } = {
    [baseUnitName]: baseUnitName
  };

  const fromBaseConverters: Map<
    Unit,
    (baseUnits: number) => number
  > = new Map();
  const toBaseConverters: Map<Unit, (baseUnits: number) => number> = new Map();

  fromBaseConverters.set(baseUnitName, (u: number): number => u);
  toBaseConverters.set(baseUnitName, (u: number): number => u);

  for (const [unitName, converter] of Object.entries(unitMappings)) {
    units[unitName] = unitName;
    if (typeof converter === "number") {
      toBaseConverters.set(
        unitName,
        (otherUnits: number): number => otherUnits * converter
      );
      fromBaseConverters.set(
        unitName,
        (baseUnits: number): number => baseUnits / converter
      );
    } else {
      toBaseConverters.set(unitName, converter.toBase);
      fromBaseConverters.set(unitName, converter.fromBase);
    }
  }

  const dim: Dimension = {
    [dimensionName]: (
      value: number,
      from: Unit,
      to: Unit = baseUnitName
    ): number => {
      const toBaseUnits = toBaseConverters.get(from);
      if (!toBaseUnits) {
        throw new Error(
          `Unknown unit ${String(from)} for dimension ${dimensionName}`
        );
      }

      const fromBaseUnits = fromBaseConverters.get(to);
      if (!fromBaseUnits) {
        throw new Error(
          `Unknown unit ${String(to)} for dimension ${dimensionName}`
        );
      }
      const inBaseUnits: number = toBaseUnits(value);
      return fromBaseUnits(inBaseUnits);
    }
  }[dimensionName];

  return Object.assign(dim, { dim, units });
}
