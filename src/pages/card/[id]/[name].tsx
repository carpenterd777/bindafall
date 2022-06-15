import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { FC, ReactNode } from "react";
import DefaultLayout from "../../../components/DefaultLayout";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import TextLink from "../../../components/TextLink";
import Card from "../../../types/card";
import Database from "../../../utils/database";

// Constants

const IMAGE_HEIGHT = 523;
const IMAGE_WIDTH = 375;
const IMAGE_QUALITY = 45;

const DataBox: FC<{
  children: ReactNode;
  top?: boolean;
  bottom?: boolean;
  italic?: boolean;
}> = ({ children, top = false, bottom = false, italic = false }) => {
  return (
    <div
      className={`px-3 py-2 lg:w-[25vw] text-left border-x ${
        top ? "border-t" : ""
      } ${bottom ? "border-b" : ""} ${italic ? "italic" : ""}`}
    >
      {children}
    </div>
  );
};

const CardPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  cardData,
  isTwoSided,
}) => {
  const tabTitle = isTwoSided
    ? `${cardData.name} // ${cardData.backside_name}`
    : cardData.name;
  return (
    <>
      <Head>
        <title>{`${tabTitle + " - "}`}Rise to Ragnarök - Bindafall</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <DefaultLayout>
        <div className="lg:flex flex-row justify-center">
          <div className="flex flex-col">
            <Image
              src={`/card_imgs/${cardData.image_file}`}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              quality={IMAGE_QUALITY}
              priority
            />
            {cardData.backside_file !== "" ? (
              <div className="mt-3">
                <Image
                  src={`/card_imgs/${cardData.backside_file}`}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  quality={IMAGE_QUALITY}
                ></Image>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <DataBox top>{`${cardData.name} ${cardData.mana_cost}`}</DataBox>
            <DataBox top bottom>
              {cardData.type_line}
            </DataBox>
            {cardData.mechanics_text.split("\n").map(line => {
              return <DataBox>{line}</DataBox>;
            })}
            {cardData.flavor_text !== "" ? (
              <DataBox italic>{cardData.flavor_text}</DataBox>
            ) : null}
            {cardData.power !== "" && cardData.toughness !== "" ? (
              <DataBox top>{`${cardData.power}/${cardData.toughness}`}</DataBox>
            ) : null}
            {isTwoSided ? (
              <>
                <DataBox top>
                  {`${cardData.backside_name} ${
                    cardData.backside_mana_cost &&
                    cardData.backside_mana_cost !== ""
                      ? cardData.backside_mana_cost
                      : ""
                  }`}
                </DataBox>
                <DataBox top bottom>
                  {`${
                    cardData.backside_color !== ""
                      ? cardData.backside_color +
                        " " +
                        cardData.backside_typeline
                      : cardData.backside_typeline
                  }`}
                </DataBox>
                {cardData.backside_mechanics_text.split("\n").map(line => {
                  return <DataBox>{line}</DataBox>;
                })}
                <DataBox italic>{cardData.backside_flavor_text}</DataBox>
                {cardData.backside_power !== "" &&
                cardData.backside_toughness !== "" ? (
                  <DataBox top>
                    {`${cardData.backside_power}/${cardData.backside_toughness}`}
                  </DataBox>
                ) : null}
              </>
            ) : null}
            {cardData.illustrator !== "" &&
            cardData.illustrator_portfolio !== "" ? (
              <DataBox
                top
                bottom={
                  cardData.backside_illustrator === "" &&
                  cardData.errata_acknowledgements === ""
                }
              >
                Illustrated by{" "}
                <TextLink
                  href={cardData.illustrator_portfolio}
                  text={cardData.illustrator}
                />
              </DataBox>
            ) : null}
            {cardData.backside_illustrator !== "" &&
            cardData.backside_illustrator_portfolio !== "" ? (
              <DataBox top bottom={cardData.errata_acknowledgements === ""}>
                Backside art illustrated by{" "}
                <TextLink
                  href={cardData.backside_illustrator_portfolio}
                  text={cardData.backside_illustrator}
                />
              </DataBox>
            ) : null}
            {cardData.errata_acknowledgements !== "" ? (
              <DataBox top bottom>
                Errata and Acknowledgements:
                {"  " + cardData.errata_acknowledgements}
              </DataBox>
            ) : null}
          </div>
        </div>
      </DefaultLayout>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const numCards = await Database.nontoken_count();
  const paths: Array<{ params: { id: string; name: string } }> = [];

  // for each card, get it's name and add that to an array
  for (const i of [...Array(numCards).keys()]) {
    const id = i + 1;
    const name = await Database.route_name(id);
    paths.push({ params: { id: id.toString(), name: name } });
  }

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  cardData: Omit<Card, "_id">;
  isTwoSided: boolean;
}> = async ({ params }: GetStaticPropsContext) => {
  if (params === undefined) throw new Error("Could not get params!");
  const id = params.id;

  if (id === undefined || typeof id !== "string") {
    throw new Error("Could not get id from params!");
  }

  const idAsNum = parseInt(id);
  const cardData = await Database.card_data(idAsNum, false);
  delete cardData._id;
  const isTwoSided = await Database.is_two_sided(idAsNum);
  return {
    props: { cardData, isTwoSided },
  };
};

export default CardPage;
