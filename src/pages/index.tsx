import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import RtRSetSymbol from "../../public/rtr-set-symbol.png";
import Database from "../utils/database";

const useCardCount = () => {
  const db = new Database();
  const [count, setCount] = useState<number>();
  useEffect(() => {
    void (async () => {
      setCount(await db.card_count());
    })();
  }, [count]);
  return count;
};

export const Home = (): JSX.Element => {
  const count = useCardCount();

  return (
    <div>
      <Head>
        <title>Bindafall - Rise to Ragnarök</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Set Header */}
        <div className="w-full bg-red-500 py-1">
          <div className="px-[10em] flex flex-row">
            <div className="w-8 my-auto mx-2">
              <Image
                src={RtRSetSymbol}
                width={1620}
                height={1408}
                layout="responsive"
              />
            </div>
            <div>
              <div className="font-bold text-lg">Rise to Ragnarök (RTR)</div>
              <div className="text-sm">
                {count ? `${count.toString()} cards •` : ""} Released 2022-05-28
              </div>
            </div>
          </div>
        </div>

        <div className="mx-[9em] my-6">
          <div className="w-full bg-red-300 h-[1px] block"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
