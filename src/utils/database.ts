/* eslint-disable @typescript-eslint/require-await */
import { parse } from "@vanillaes/csv";
import { data } from "./data";

// maps for private variable storage
const parsed = new WeakMap<ThisType<Database>, Array<Array<string>>>();

enum CardField {
  ID,
  NAME,
  IMAGE_FILE,
  IS_TOKEN,
  BACKSIDE_FILE,
}

/**
 * Handles all database operations.
 */
class Database {
  constructor() {
    parsed.set(this, parse(data.toString()) as string[][]);
  }

  /**
   * How many cards are currently in the database.
   * @returns The number of cards in the database including tokens
   */
  async card_count(): Promise<number> {
    // parsed is a 2D array. since each element will be card data, we can simply use the length of
    // this array to know how many cards there are. the header is not a card, subtract 1.
    const table = parsed.get(this);
    if (table) {
      return table.length - 1;
    }
    throw new Error("card_count: no database found");
  }

  /**
   * How many tokens are currently in the database
   * @returns the number of tokens currently in the database
   */
  async token_count(): Promise<number> {
    // check if table can be read
    const table = parsed.get(this);
    if (table === undefined) {
      throw new Error("token_count: no database found");
    }

    // find the length of the array of tokens
    return table.filter(card_data => {
      const is_token = card_data[3];
      if (is_token === undefined)
        throw new Error("token_count: card missing id");
      // tokens have an id starting with T
      return is_token === "Y";
    }).length;
  }

  /**
   * Counts the number of nontoken cards are in the database.
   * @returns the number of nontoken cards
   */
  async nontoken_count(): Promise<number> {
    // check if table exists
    const table = parsed.get(this);
    if (table === undefined)
      throw new Error("nontoken_count: database could not be found");

    const card_count = await this.card_count();
    const token_count = await this.token_count();

    return card_count - token_count;
  }

  /**
   * Gets the path of the backside image from the database.
   * @param id the id of the card of which to get the backside image of
   * @returns the path leading to the backside image
   */
  async backside_image_filepath_of(id: string): Promise<string> {
    return this._map_from_field_to_field(
      CardField.ID,
      CardField.BACKSIDE_FILE,
      "backside_image_filepath_of",
      "backside image filepath",
      false
    )(id);
  }

  async image_filepath_of(id: string): Promise<string> {
    return this._map_from_field_to_field(
      CardField.ID,
      CardField.IMAGE_FILE,
      "image_filepath_of",
      "image filepath",
      false
    )(id);
  }

  async token_image_filepath_of(id: string): Promise<string> {
    return this._map_from_field_to_field(
      CardField.ID,
      CardField.IMAGE_FILE,
      "token_image_filepath_of",
      "image filepath",
      true
    )(id);
  }

  // Private methods
  _map_from_field_to_field(
    src_field: number,
    dest_field: number,
    name: string,
    field_name: string,
    tokens: boolean
  ): (src: string) => Promise<string> {
    return async (src: string): Promise<string> => {
      // check if table exists
      const table = parsed.get(this);
      if (table === undefined)
        throw new Error(`${name}: database could not be found`);

      // filter out all cards that do not have a field like src, result will be first index in array
      const results = table.filter(card_data => {
        const _src = card_data[src_field];
        const _is_token = card_data[3];
        if (_src === undefined)
          throw new Error(`${name}: card missing ${field_name}`);
        if (tokens) {
          return src === _src && _is_token === "Y";
        }
        return src === _src && _is_token !== "Y";
      });

      // check that there was at least 1 match
      if (results.length === 0 || results[0] === undefined)
        throw new Error(`${name}: no card with ${field_name} ${src}`);

      // get the first match and its data
      const _dest = results[0][dest_field];

      // check that something is there
      if (_dest === undefined)
        throw new Error(`${name}: card missing ${field_name}`);

      return _dest;
    };
  }
}

export default Database;
