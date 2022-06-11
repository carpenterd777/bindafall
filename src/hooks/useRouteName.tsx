import { useEffect, useState } from "react";
import Database from "../utils/database";

const useRouteName = (id: string, token: boolean): string | undefined => {
  const db = new Database();
  const [routeName, setRouteName] = useState<string>();
  useEffect(() => {
    void (async () => {
      setRouteName(await db.route_name(id, token));
    })();
  }, [routeName]);
  return routeName;
};

export default useRouteName;
