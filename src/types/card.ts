import { ObjectId } from "mongodb";

type Card = {
  "_id": ObjectId | undefined;
  "id": number;
  "name": string;
  "image_file": string;
  "is_token?": "Y" | "";
  "backside_file": string;
  "mana_cost": string;
  "type_line": string;
  "mechanics_text": string;
  "flavor_text": string;
  "power": number | "";
  "toughness": number | "";
  "backside_name": string;
  "backside_typeline": string;
  "backside_mana_cost": string;
  "backside_color": string;
  "backside_mechanics_text": string;
  "backside_flavor_text": string;
  "backside_power": number | "";
  "backside_toughness": number | "";
  "illustrator": string;
  "illustrator_portfolio": string;
  "backside_illustrator": string;
  "backside_illustrator_portfolio": string;
  "errata_acknowledgements": string;
};

export default Card;
