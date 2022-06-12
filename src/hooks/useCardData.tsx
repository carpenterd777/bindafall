import { useEffect, useState } from "react";
import Database from "../utils/database";

const useCardData = (
  id: string,
  token = false
): Record<string, string> | undefined => {
  const [cardData, setCardData] = useState<Record<string, string>>();
  useEffect(() => {
    void (async () => {
      setCardData(await Database.card_data(id, token));
    })();
  }, [cardData]);
  return cardData;
};

export default useCardData;
