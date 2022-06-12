import { useEffect, useState } from "react";
import Database from "../utils/database";

const useIsTwoSided = (id: string): boolean => {
  const [isTwoSided, setIsTwoSided] = useState<boolean>(false);
  useEffect(() => {
    void (async () => {
      setIsTwoSided(await Database.is_two_sided(id));
    })();
  }, [isTwoSided]);
  return isTwoSided;
};

export default useIsTwoSided;
