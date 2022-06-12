import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";
import DefaultLayout from "../../../components/default_layout";
import useCardData from "../../../hooks/useCardData";
import useIsTwoSided from "../../../hooks/useIsTwoSided";
import Database from "../../../utils/database";

// Constants

const IMAGE_HEIGHT = 523;
const IMAGE_WIDTH = 375;
const IMAGE_QUALITY = 25;

const DataBox: FC<{ children: ReactNode; top?: boolean; bottom?: boolean }> = ({
  children,
  top = false,
  bottom = false,
}) => {
  return (
    <div
      className={`px-3 py-2 w-[25vw] text-left border-x ${
        top ? "border-t" : ""
      } ${bottom ? "border-b" : ""}`}
    >
      {children}
    </div>
  );
};

const CardPage: FC<{ name: string; id: string }> = ({ id }) => {
  const cardData = useCardData(id);
  const isTwoSided = useIsTwoSided(id);

  if (cardData === undefined) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>
          {`${cardData["name"] ? cardData["name"] + " - " : ""}`}Rise to
          Ragnarök - Bindafall
        </title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <Image
              src={`/card_imgs/${
                cardData["image_file"] ? cardData["image_file"] : ""
              }`}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              quality={IMAGE_QUALITY}
            />
            {cardData["backside_file"] && cardData["backside_file"] !== "" ? (
              <div className="mt-3">
                <Image
                  src={`/card_imgs/${cardData["backside_file"]}`}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  quality={IMAGE_QUALITY}
                ></Image>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <DataBox top>
              {cardData["name"] && cardData["mana_cost"]
                ? `${cardData["name"]} ${cardData["mana_cost"]}`
                : ""}
            </DataBox>
            <DataBox top>
              {cardData["type_line"] ? cardData["type_line"] : ""}
            </DataBox>
            <DataBox top>
              {cardData["mechanics_text"] ? cardData["mechanics_text"] : ""}
            </DataBox>
            {cardData["power"] &&
            cardData["toughness"] &&
            cardData["power"] !== "" &&
            cardData["toughness"] !== "" ? (
              <DataBox top>
                {`${cardData["power"]}/${cardData["toughness"]}`}
              </DataBox>
            ) : null}
            {isTwoSided ? (
              <>
                <DataBox top>
                  {cardData["backside_name"]
                    ? `${cardData["backside_name"]} ${
                        cardData["backside_mana_cost"] &&
                        cardData["backside_mana_cost"] !== ""
                          ? cardData["backside_mana_cost"]
                          : ""
                      }`
                    : ""}
                </DataBox>
                <DataBox top>
                  {cardData["backside_typeline"]
                    ? `${
                        cardData["backside_color"] &&
                        cardData["backside_color]"] !== ""
                          ? cardData["backside_color"] +
                            " " +
                            cardData["backside_typeline"]
                          : cardData["backside_typeline"]
                      }`
                    : ""}
                </DataBox>
                <DataBox top>
                  {cardData["backside_mechanics_text"]
                    ? cardData["backside_mechanics_text"]
                    : ""}
                </DataBox>
                {cardData["backside_power"] &&
                cardData["backside_toughness"] &&
                cardData["backside_power"] !== "" &&
                cardData["backside_toughness"] !== "" ? (
                  <DataBox top>
                    {`${cardData["backside_power"]}/${cardData["backside_toughness"]}`}
                  </DataBox>
                ) : null}
              </>
            ) : null}
            {cardData["illustrator"] && cardData["illustrator_portfolio"] ? (
              <DataBox
                top
                bottom={
                  (cardData["backside_illustrator"] === undefined ||
                    cardData["backside_illustrator"] === "") &&
                  (cardData["errata_acknowledgements"] === undefined ||
                    cardData["errata_acknowledgements"] === "")
                }
              >
                Illustrated by{" "}
                <Link href={cardData["illustrator_portfolio"]}>
                  {cardData["illustrator"]}
                </Link>
              </DataBox>
            ) : null}
            {cardData["backside_illustrator"] &&
            cardData["backside_illustrator_portfolio"] &&
            cardData["backside_illustrator"] !== "" ? (
              <DataBox
                top
                bottom={
                  cardData["errata_acknowledgements"] === undefined ||
                  cardData["errata_acknowledgements"] === ""
                }
              >
                Backside art illustrated by{" "}
                <Link href={cardData["backside_illustrator_portfolio"]}>
                  {cardData["backside_illustrator"]}
                </Link>
              </DataBox>
            ) : null}
            {cardData["errata_acknowledgements"] &&
            cardData["errata_acknowledgements"] !== "" ? (
              <DataBox top bottom>
                Errata and Acknowledgements:
                {"  " + cardData["errata_acknowledgements"]}
              </DataBox>
            ) : null}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const numCards = await Database.nontoken_count();
  const paths: Array<{ params: { id: string; name: string } }> = [];

  // for each card, get it's name and add that to an array
  for (const i of [...Array(numCards - 1).keys()]) {
    const id = `${i + 1}`;
    const name = await Database.route_name(id);
    paths.push({ params: { id: id, name: name } });
  }

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({
  params,
}: GetStaticPropsContext) => {
  if (params === undefined) throw new Error("Could not get params!");
  const name = params.name;
  const id = params.id;
  return {
    props: { name, id },
  };
};

export default CardPage;
