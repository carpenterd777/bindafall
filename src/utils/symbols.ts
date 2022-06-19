export type ScryfallSymbologyResponse = {
  object: string;
  has_more: boolean;
  data: Array<{
    object: string;
    symbol: string;
    svg_uri: string;
    loose_variant: string | null;
    english: string;
    transposable: boolean;
    represents_mana: boolean;
    cmc: number | null;
    appears_in_mana_costs: boolean;
    funny: boolean;
    colors: Array<string>;
    gatherer_alternates: string | null;
  }>;
};

export const getSymbolSvg = async (symbol: string): Promise<string> => {
  const options = {
    hostname: "https://api.scryfall.com",
    port: 443,
    path: "/symbology",
    method: "GET",
  };
  const res = await fetch(`${options.hostname}${options.path}`);
  const json = (await res.json()) as ScryfallSymbologyResponse;
  const match = json.data.filter(symObj => {
    return symObj.symbol === symbol;
  })[0];
  if (match) {
    return match.svg_uri;
  }
  throw new Error(`getSymbolSvg: could not get svg for symbol ${symbol}`);
};
