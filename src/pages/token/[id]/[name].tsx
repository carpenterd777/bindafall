import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import DefaultLayout from "../../../components/DefaultLayout";
import Card from "../../../types/card";
import Database from "../../../utils/database";
import TextLink from "../../../components/TextLink";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// Constants

const IMAGE_HEIGHT = 523;
const IMAGE_WIDTH = 375;
const IMAGE_QUALITY = 45;

const TokenPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  cardData,
}) => {
  return (
    <>
      <Head>
        <title> Token: {cardData.name} - Rise to Ragnarök - Bindafall</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <DefaultLayout>
        <Image
          src={`/card_imgs/${cardData.image_file}`}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          quality={IMAGE_QUALITY}
          priority
        />
        {cardData.illustrator !== "" &&
        cardData.illustrator_portfolio !== "" ? (
          <div>
            Illustrated by{" "}
            <TextLink
              href={cardData.illustrator_portfolio}
              text={cardData.illustrator}
            />
          </div>
        ) : null}
      </DefaultLayout>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const numCards = await Database.token_count();
  const paths: Array<{ params: { id: string; name: string } }> = [];

  // for each card, get it's name and add that to an array
  for (const i of [...Array(numCards).keys()]) {
    const id = i + 1;
    const name = await Database.route_name(id, true);
    paths.push({ params: { id: id.toString(), name: name } });
  }

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  cardData: Omit<Card, "_id">;
}> = async ({ params }: GetStaticPropsContext) => {
  if (params === undefined) throw new Error("Could not get params!");
  const id = params.id;

  if (id === undefined || typeof id !== "string") {
    throw new Error("Could not get id from params!");
  }

  const idAsNum = parseInt(id);
  const cardData = await Database.card_data(idAsNum, true);
  delete cardData._id;
  return {
    props: { cardData },
  };
};

export default TokenPage;
