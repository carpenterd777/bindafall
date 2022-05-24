/* eslint-disable @typescript-eslint/require-await */
import { parse } from "@vanillaes/csv";
import { data } from "./data";

// maps for private variable storage
const parsed = new WeakMap<ThisType<Database>, Array<Array<string>>>();

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
      const id = card_data[0];
      if (id === undefined) throw new Error("token_count: card missing id");
      // tokens have an id starting with T
      return id[0] === "T";
    }).length;
  }

  async nontoken_count(): Promise<number> {
    // check if table exists
    const table = parsed.get(this);
    if (table === undefined)
      throw new Error("nontoken_count: database could not be found");

    const card_count = await this.card_count();
    const token_count = await this.token_count();

    return card_count - token_count;
  }

  async backside_image_filepath_of(id: string): Promise<string> {
    const table = parsed.get(this);
    if (table === undefined)
      throw new Error(
        "backside_image_filepath_of: database could not be found"
      );

    const results = table.filter(card_data => {
      const _id = card_data[0];
      if (_id === undefined)
        throw new Error("backside_image_filepath_of: card missing id");
      return _id === id;
    });

    if (results.length === 0 || results[0] === undefined)
      throw new Error(`backside_image_filepath_of: no card with id ${id}`);

    const path = results[0][4];

    if (path === undefined)
      throw new Error(
        "backside_image_filepath_of: card missing backside_image_file"
      );

    return path;
  }
}

export default Database;
