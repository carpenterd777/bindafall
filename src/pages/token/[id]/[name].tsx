import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Database from "../../../utils/database";

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
  const numTokens = await Database.token_count();
  const paths: Array<{ params: { id: string; name: string } }> = [];

  // for each token, get its route name and add it to the list
  for (const i of [...Array(numTokens).keys()]) {
    const id = `${i + 1}`;
    const name = await Database.route_name(id, true);
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
  return {
    props: { name },
  };
};

export default CardPage;
