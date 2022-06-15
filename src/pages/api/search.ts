import { NextApiRequest, NextApiResponse } from "next";
import Database from "../../utils/database";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.setHeader("Content-Type", "application/json");
  if (typeof req.query.name !== "string") {
    res.statusCode = 400; // bad request
    res.end(JSON.stringify({ error: "Enter one name" }));
    return;
  }
  const results = await Database.get_alike_cards_by_name(req.query.name || "");
  res.statusCode = 200; // OK
  res.end(JSON.stringify({ results }));
};

export default search;
