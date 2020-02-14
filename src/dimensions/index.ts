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
  readonly units: { [unitName: string]: symbol };
}

export function defineDimension(
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

  const baseUnitSymbol = Symbol(`${baseUnitName} [${dimensionName}]`);
  const units: { [unitName: string]: symbol } = {
    [baseUnitName]: baseUnitSymbol
  };

  const fromBaseConverters: Map<
    symbol,
    (baseUnits: number) => number
  > = new Map();
  const toBaseConverters: Map<
    symbol,
    (baseUnits: number) => number
  > = new Map();

  fromBaseConverters.set(baseUnitSymbol, (u: number): number => u);
  toBaseConverters.set(baseUnitSymbol, (u: number): number => u);

  for (const [unitName, converter] of Object.entries(unitMappings)) {
    const sym = Symbol(`${unitName} [${dimensionName}]`);
    units[unitName] = sym;
    if (typeof converter === "number") {
      toBaseConverters.set(
        sym,
        (otherUnits: number): number => otherUnits * converter
      );
      fromBaseConverters.set(
        sym,
        (baseUnits: number): number => baseUnits / converter
      );
    } else {
      toBaseConverters.set(sym, converter.toBase);
      fromBaseConverters.set(sym, converter.fromBase);
    }
  }

  const dim: Dimension = {
    [dimensionName]: (
      value: number,
      from: Unit,
      to: Unit = baseUnitSymbol
    ): number => {
      const fromSymbol: symbol = typeof from === "symbol" ? from : units[from];
      const toBaseUnits = toBaseConverters.get(fromSymbol);
      if (!toBaseUnits) {
        throw new Error(
          `Unknown unit ${String(from)} for dimension ${dimensionName}`
        );
      }

      const toSymbol: symbol = typeof to === "symbol" ? to : units[to];
      const fromBaseUnits = fromBaseConverters.get(toSymbol);
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
