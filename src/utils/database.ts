import { MongoClient } from "mongodb";
import Card from "../types/card";

// ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js
// mongo client configuration
const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env");
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

/**
 * Thrown if a method that takes an ID as a parameter is unable to find a card with the passed ID.
 */
class IdOutOfRangeError extends Error {
  constructor(method_name: string, id: number, token = false) {
    super();
    this.message = `${method_name}: could not find ${
      token ? "token" : "card"
    } with id ${id}`;
  }
}

/**
 * Handles all database operations.
 */
class Database {
  /**
   * How many cards are currently in the database.
   * @returns The number of cards in the database including tokens
   */
  static async card_count(): Promise<number> {
    const c = await clientPromise;
    const collection = c.db("bindafall").collection("cards");
    return collection.countDocuments();
  }

  /**
   * How many tokens are currently in the database
   * @returns the number of tokens currently in the database
   */
  static async token_count(): Promise<number> {
    const c = await clientPromise;
    const collection = c.db("bindafall").collection<Card>("cards");

    const result_field = "num_tokens";
    const cursor = collection.aggregate([
      {
        $match: { "is_token?": "Y" },
      },
      {
        $count: result_field,
      },
    ]);
    for await (const result of cursor) {
      return result[result_field] as number;
    }
    throw new Error("token_count: unable to retrieve result from cursor");
  }

  /**
   * Counts the number of nontoken cards are in the database.
   * @returns the number of nontoken cards
   */
  static async nontoken_count(): Promise<number> {
    const card_count = await Database.card_count();
    const token_count = await Database.token_count();

    return card_count - token_count;
  }

  /**
   * Gets the path of the backside image from the database.
   * @param id the id of the card of which to get the backside image of
   * @returns the path leading to the backside image
   */
  static async backside_image_filepath_of(id: number): Promise<string> {
    const cardData = await Database.card_data(id);
    return cardData.backside_file;
  }

  static async image_filepath_of(id: number): Promise<string> {
    const cardData = await Database.card_data(id);
    return cardData.image_file;
  }

  static async token_image_filepath_of(id: number): Promise<string> {
    const cardData = await Database.card_data(id, true);
    return cardData.image_file;
  }

  static async is_two_sided(id: number): Promise<boolean> {
    const cardData = await Database.card_data(id);
    return cardData.backside_file !== "";
  }

  /**
   * Returns an object containing all of the data for a card.
   * @param id the id of the card
   * @param token whether this is a token id
   * @returns an object containing all of the data for that card
   */
  static async card_data(id: number, token = false): Promise<Card> {
    const method_name = "card_data";

    const collection = (await clientPromise)
      .db("bindafall")
      .collection<Card>("cards");
    const tokenMatcher = token ? "Y" : "";
    const res = await collection.findOne({
      "id": id,
      "is_token?": tokenMatcher,
    });

    if (res === null) {
      throw new IdOutOfRangeError(method_name, id, token);
    }

    return res;
  }

  /**
   * The name of the route that should be built to display information about this card.
   * @param id the id of the card
   * @param token whether or not this is a card or token id
   * @returns a route name
   */
  static async route_name(id: number, token = false): Promise<string> {
    // build route name from front name and back name (if applicable)
    let route_name = "";
    const card = await Database.card_data(id, token);
    route_name += this._clean_string(card.name);
    if (card.backside_name !== "") {
      route_name += "_";
      route_name += Database._clean_string(card.backside_name);
    }
    return route_name;
  }

  static async get_alike_cards_by_name(
    name: string
  ): Promise<Array<{ id: number; name: string; route_name: string }>> {
    const aggCursor = (await clientPromise)
      .db("bindafall")
      .collection<Card>("cards")
      .aggregate<Card>([
        {
          $search: {
            index: "default",
            text: {
              path: ["name", "backside_name"],
              query: name,
              fuzzy: {},
            },
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
          },
        },
      ]);

    const arr = await aggCursor.toArray();
    return Promise.all(
      arr.map(async item => {
        return {
          id: item.id,
          name: item.name,
          route_name: await Database.route_name(item.id, false),
        };
      })
    );
  }

  // Private methods
  static _clean_string(s: string): string {
    return s
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/,/g, "")
      .replace(/'/g, "");
  }
}

export default Database;
