import Head from "next/head";
import Image from "next/image";
import RtRSetSymbol from "../../public/rtr-set-symbol.png";

export const Home = (): JSX.Element => {
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
              <div className="text-sm">75 cards • Released 2022-05-28</div>
            </div>
          </div>
        </div>

        <div className="mx-[3em] my-6">
          <div className="w-full bg-red-300 h-[1px] block"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
