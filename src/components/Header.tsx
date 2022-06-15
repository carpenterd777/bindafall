import Link from "next/link";
import Image from "next/image";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Search from "./Search";

const ICON_DIM = 35;

const links = [
  {
    href: "https://www.moxfield.com/decks/8QDMc-F-70am_vWrAbDXdA",
    text: "Draft Cube Cardlist",
  },
  {
    href: "https://doc-0s-ao-docs.googleusercontent.com/docs/securesc/7ilkudbp9f3jkukkqbgl66pvbd3ij1bd/tmm1amuplud6i03625kf0agkkmieka35/1655241675000/03615410982393913713/03615410982393913713/19O-A9uWtpg4pDnMkIT0GZnz4Wqj7IXVS?e=download&ax=ACxEAsYIOq-BX_J7L9TBhagaKcc4KMwESZZGVvvOYnwEtD_P9IQrdaA-ItCrmHRZdW2PcUxX_JCZi4xaECKFZLRqvjnu8dEjvPpzQ9k_47F8ssrKsAGpPaRI7UNh9KSJW3IgZ-KE9fHQdudJzsMtGP7G9Q7ZZGNwSv7aoVOZfLJ_pATMlIvC-rdKgnnVJL1CNel0a486oyFhRVFaAdjZ4PogRlzm2Ni_myTHT5upMN4h-eMZtxMht-WJIakAXSY-6vBy2TZsBhWj2_gsPnZjz8xYcvHEGTbfEG2VEZZZm_dPWltX5wPzyICfr9eHolG6qeidlEEKuZV_6apNv6pi8PQzUxY_iPZnFKUmrFgSPtusP4IWcFB3tStWqVhmNsA7vTp1W3NQ6QiAXfFDp2QdeMSh3R31r0izZhjQA8iqSxrXlWEG-dME0PzXOeAaJXiS4NXJEOour2JlljAmxCQ50Gd2bso_Jr0LbUnMSVhTsnYvQCFpetewFGLpWrF2Nuaz4fMFkEH_-8A3ThKcJk3aUXIRZySKu8wNy7lpG9AYiJSvRrHjcAXX1D9yzJbjSAafWU2-hhfWcDFfhZT1uNx785Ckdk-waGyQIUnvD_PSvkTswANyB_0k4gVeD376aTK5FGDozhCoOldC1OdWj7LdjpILE7jUpmCv6-aND3SUx7_LXN4h9TTSe0uSs-JIxk5nFNnBN69_e5vn2lbVp19IcpmFkpfjmaskk5gHnzLXZy-Q9l_IX3WRbiJq&authuser=0&nonce=h6fksa4cdvcee&user=03615410982393913713&hash=9ore53i8kf68qhtd0f5ifqtn3uocih95",
    text: "Printer Size Images",
  },
  {
    href: "https://drive.google.com/u/0/uc?id=13enHesnBST-uqu3x1M_hatixlpTbbZ-I&export=download&confirm=t",
    text: "MPC Size Images",
  },
];

const LinkDrawer: FC<{
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ setIsDrawerVisible }) => {
  return (
    <div className="absolute h-[300vh] w-full bg-zinc-900 flex flex-col z-20 content-center">
      <div className="border-b border-zinc-600 text-white px-3 my-1 underline">
        <button
          onClick={() => {
            setIsDrawerVisible(false);
          }}
        >
          <Image src={"/xmark-solid.svg"} width={ICON_DIM} height={ICON_DIM} />
        </button>
      </div>
      <div
        className="border-b border-zinc-600 text-white px-10 py-2 underline"
        onClick={() => {
          setIsDrawerVisible(false);
        }}
      >
        <Link href={"/"}>Home</Link>
      </div>
      {links.map(({ href, text }) => {
        return (
          <div
            className="border-b border-zinc-600 text-white px-10 py-2 underline"
            key={`menu-link-${text}`}
          >
            <Link href={href}>{text}</Link>
          </div>
        );
      })}
      <div className="px-3 mt-5">
        <Search />
      </div>
    </div>
  );
};

const Button: FC<{ href: string; text: string }> = ({ href, text }) => {
  return (
    <div
      className={
        "bg-zinc-900 text-white hover:bg-zinc-600 rounded-md border border-white px-3 mx-2 my-auto h-1/2"
      }
    >
      <Link href={href} passHref>
        <a>{text}</a>
      </Link>
    </div>
  );
};

const Header: FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  return (
    <div className="bg-zinc-900 flex flex-row justify-center lg:justify-start">
      {isDrawerVisible ? (
        <LinkDrawer setIsDrawerVisible={setIsDrawerVisible} />
      ) : null}
      <div className="fixed left-4 top-3 lg:hidden">
        <button
          className="hover:cursor-pointer"
          onClick={() => {
            setIsDrawerVisible(true);
          }}
        >
          <Image src={"/bars-solid.svg"} width={ICON_DIM} height={ICON_DIM} />
        </button>
      </div>
      <Link href={"/"} passHref>
        <a>
          <h1 className="text-white lg:mx-36 py-3 text-4xl">Bindafall</h1>
        </a>
      </Link>
      <div className="hidden lg:flex flex-row w-2/3 justify-end">
        <Search />
        {links.map(({ href, text }) => {
          return (
            <Button href={href} text={text} key={`header-button-${text}`} />
          );
        })}
      </div>
    </div>
  );
};

export default Header;
