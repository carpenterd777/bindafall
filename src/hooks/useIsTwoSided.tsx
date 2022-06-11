import { useEffect, useState } from "react";
import Database from "../utils/database";

const useIsTwoSided = (id: string): boolean => {
  const db = new Database();
  const [isTwoSided, setIsTwoSided] = useState<boolean>(false);
  useEffect(() => {
    void (async () => {
      setIsTwoSided(await db.is_two_sided(id));
    })();
  });
  return isTwoSided;
};

export default useIsTwoSided;
