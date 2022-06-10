import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Database from "../../utils/database";

const CardPage = (): JSX.Element => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <>
      <Head>
        <title>{name} - Rise to Ragnarök - Bindafall</title>
        <meta name="description" content="Preview of custom cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const db = new Database();
  const numCards = await db.card_count();

  const allNames: Array<string> = [];
  // for each card, get it's name and add that to an array
  for (const i of [...Array(numCards).keys()]) {
    const id = `${i + 1}`;
    const name = await db.route_name(id);
    allNames.push(name);
  }

  return {
    paths: allNames,
    fallback: false,
  };
};

export default CardPage;
