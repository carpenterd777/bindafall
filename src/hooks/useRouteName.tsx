import { useEffect, useState } from "react";
import Database from "../utils/database";

const useRouteName = (id: string, token: boolean): string | undefined => {
  const [routeName, setRouteName] = useState<string>();
  useEffect(() => {
    void (async () => {
      setRouteName(await Database.route_name(id, token));
    })();
  }, [routeName]);
  return routeName;
};

export default useRouteName;
