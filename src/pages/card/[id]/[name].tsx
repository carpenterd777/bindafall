import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import useCardData from "../../../hooks/useCardData";
import Database from "../../../utils/database";

const CardPage = ({ id }: { name: string; id: string }): JSX.Element => {
  const cardData = useCardData(id);

  if (cardData === undefined) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{cardData["name"]} - Rise to Ragnarök - Bindafall</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const db = new Database();

  const numCards = await db.nontoken_count();
  const paths: Array<{ params: { id: string; name: string } }> = [];

  // for each card, get it's name and add that to an array
  for (const i of [...Array(numCards - 1).keys()]) {
    const id = `${i + 1}`;
    const name = await db.route_name(id);
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
