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
 * Thrown if the database could not be found, built, or reached.
 */
class DatabaseNotFoundError extends Error {
  constructor(method_name: string) {
    super();
    this.message = `${method_name}: database could not be found`;
  }
}

/**
 * Thrown if data from the database that was expected to be found was not there.
 */
class MissingDataError extends Error {
  constructor(method_name: string, missing_data: string) {
    super();
    this.message = `${method_name}: ${missing_data} could not be found in database`;
  }
}

/**
 * Thrown if a method that takes an ID as a parameter is unable to find a card with the passed ID.
 */
class IdOutOfRangeError extends Error {
  constructor(method_name: string, id: string) {
    super();
    this.message = `${method_name}: could not find card with id ${id}`;
  }
}

/**
 * Handles all database operations.
 */
class Database {
  constructor() {
    parsed.set(this, parse(data) as string[][]);
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

  async is_two_sided(id: string): Promise<boolean> {
    const table = parsed.get(this);
    if (table === undefined)
      throw new Error("is_two_sided: database could not be found");

    const results = table.filter(card_data => {
      return (
        card_data[CardField.BACKSIDE_FILE] !== "" &&
        card_data[CardField.ID] === id
      );
    });

    return results.length === 1;
  }

  /**
   * Returns an object containing all of the data for a card.
   * @param id the id of the card
   * @param token whether this is a token id
   * @returns an object containing all of the data for that card
   */
  async card_data(id: string, token = false): Promise<Record<string, string>> {
    const method_name = "card_data";
    const table = parsed.get(this);
    if (table === undefined) throw new DatabaseNotFoundError(method_name);

    const field_names = table[0];
    if (field_names === undefined)
      throw new MissingDataError(method_name, "field names");

    const card = table.filter(data => {
      if (token) {
        return data[CardField.ID] === id && data[CardField.IS_TOKEN] === "Y";
      }
      return data[CardField.ID] === id;
    })[0];
    if (card === undefined) throw new IdOutOfRangeError(method_name, id);

    const card_obj: Record<string, string> = {};
    for (let i = 0; i < field_names.length; i++) {
      const field_name = field_names[i];
      const field_data = card[i];
      if (field_name === undefined || field_data === undefined) {
        throw new Error(
          "card_data: exceeded length of array when generating card object"
        );
      }
      card_obj[field_name] = field_data;
    }

    return card_obj;
  }

  /**
   * The name of the route that should be built to display information about this card.
   * @param id the id of the card
   * @param token whether or not this is a card or token id
   * @returns a route name
   */
  async route_name(id: string, token = false): Promise<string> {
    const method_name = "route_name";
    const table = parsed.get(this);
    if (table === undefined) throw new DatabaseNotFoundError(method_name);

    // build route name from front name and back name (if applicable)

    let route_name = "";

    const card = await this.card_data(id, token);

    const first_part = card["name"];
    if (first_part === undefined)
      throw new MissingDataError(method_name, "name");
    route_name += this._clean_string(first_part);

    const is_two_sided = await this.is_two_sided(id);
    if (is_two_sided) {
      const second_part = card["backside_name"];
      if (second_part === undefined)
        throw new MissingDataError(method_name, "backside name");
      route_name += this._clean_string(second_part);
    }

    return route_name;
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

  _clean_string(s: string): string {
    return s
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/,/g, "")
      .replace(/'/g, "");
  }
}

export default Database;
