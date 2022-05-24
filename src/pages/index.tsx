import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import RtRSetSymbol from "../../public/rtr-set-symbol.png";
import Card from "../components/card";
import Database from "../utils/database";

const useCounts = () => {
  const db = new Database();
  const [count, setCount] = useState<number>();
  const [nontoken, setNontoken] = useState<number>();
  const [token, setToken] = useState<number>();
  useEffect(() => {
    void (async () => {
      setCount(await db.card_count());
      setNontoken(await db.nontoken_count());
      setToken(await db.token_count());
    })();
  }, [count, nontoken, token]);
  return { count, nontoken, token };
};

export const Home = (): JSX.Element => {
  const { count, nontoken, token } = useCounts();

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

        <div className="mx-36 my-6 text-center">
          <h2 className="text-red-500">
            IN BOOSTERS
            {nontoken ? ` • ${nontoken.toString()} cards` : ""}
          </h2>
          <div className="w-full bg-red-300 h-[1px] block mb-6"></div>
          <div className="grid gap-x-2 gap-y-2 grid-cols-4">
            {[...Array(nontoken ? nontoken : 0).keys()]
              .map((_, index) => index + 1)
              .map(id => {
                return <Card id={id.toString()} token={false} />;
              })}
          </div>
          <h2 className="text-red-500">
            TOKENS
            {token ? ` • ${token.toString()} cards` : ""}
          </h2>
          <div className="w-full bg-red-300 h-[1px] block mb-6"></div>
          <div className="grid gap-x-2 gap-y-2 grid-cols-4">
            {[...Array(token ? token : 0).keys()]
              .map((_, index) => index + 1)
              .map(id => {
                return <Card id={id.toString()} token={true} />;
              })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
