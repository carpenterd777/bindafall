import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import RtRSetSymbol from "../../public/rtr-set-symbol.png";
import Card from "../components/card";
import DefaultLayout from "../components/DefaultLayout";
import CardType from "../types/card";
import Database from "../utils/database";

export const Home: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ count, nontoken, token, filenames, backsideFilenames, routeNames }) => {
  return (
    <div>
      <Head>
        <title>Rise to Ragnarök - Bindafall</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Set Header */}
        <div className="w-full bg-red-500 py-1">
          <div className="lg:px-[10em] flex flex-row justify-center lg:justify-start">
            <div className="w-8 my-auto mx-2">
              <Image src={RtRSetSymbol} width={1620} height={1408} />
            </div>
            <div>
              <div className="font-bold text-lg">Rise to Ragnarök (RTR)</div>
              <div className="text-sm">
                {`${count.toString()} cards •`} Released 2022-06-11
              </div>
            </div>
          </div>
        </div>

        <DefaultLayout>
          <h2 className="text-red-500">
            IN BOOSTERS
            {` • ${nontoken.toString()} cards`}
          </h2>
          <div className="w-full bg-red-300 h-[1px] block mb-6"></div>
          <div className="lg:grid lg:gap-x-2 lg:gap-y-2 lg:grid-cols-4">
            {[...Array(nontoken).keys()]
              .map(index => index + 1)
              .map(id => {
                return (
                  <Card
                    filename={filenames[id - 1]}
                    backsideFilename={backsideFilenames[id - 1]}
                    routeName={`/card/${id}/${routeNames[id - 1] || ""}`}
                    key={`card-${id}`}
                  />
                );
              })}
          </div>
          <h2 className="text-red-500">
            TOKENS
            {` • ${token.toString()} cards`}
          </h2>
          <div className="w-full bg-red-300 h-[1px] block mb-6"></div>
          <div className="lg:grid gap-x-2 gap-y-2 grid-cols-4">
            {[...Array(token).keys()]
              .map(index => index + 1)
              .map(id => {
                const arrPosition = id + nontoken - 1;
                return (
                  <Card
                    filename={filenames[arrPosition]}
                    backsideFilename={backsideFilenames[arrPosition]}
                    routeName={`/token/${id}/${routeNames[arrPosition] || ""}`}
                    key={`token-${id}`}
                  />
                );
              })}
          </div>
        </DefaultLayout>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  count: number;
  token: number;
  nontoken: number;
  filenames: Array<string>;
  backsideFilenames: Array<string | null>;
  routeNames: Array<string>;
}> = async () => {
  const count = await Database.card_count();
  const token = await Database.token_count();
  const nontoken = count - token;

  const cards: Array<CardType> = [];

  // add nontokens
  for (let i = 1; i < nontoken + 1; i++) {
    cards.push(await Database.card_data(i, false));
  }

  // add tokens
  for (let i = 1; i < token + 1; i++) {
    cards.push(await Database.card_data(i, true));
  }

  const routeNames = await Promise.all(
    cards.map(async card =>
      card["is_token?"] === "Y"
        ? await Database.route_name(card.id, true)
        : await Database.route_name(card.id, false)
    )
  );

  return {
    props: {
      count: count,
      token: token,
      nontoken: nontoken,
      filenames: cards.map(card => card.image_file),
      backsideFilenames: cards
        .map(card => card.backside_file)
        .map(filename => (filename === "" ? null : filename)),
      routeNames: routeNames,
    },
  };
};

export default Home;
