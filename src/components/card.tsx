import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useCardData from "../hooks/useCardData";
import useIsTwoSided from "../hooks/useIsTwoSided";
import useRouteName from "../hooks/useRouteName";
import Database from "../utils/database";

const FEATURE_FLIP = process.env.NEXT_PUBLIC_FEATURE_FLIP === "true"; // feature toggle

const Card: React.FC<{ id: string; token: boolean }> = ({ id, token }) => {
  const [filename, setFilename] = useState<string>();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>(
    "bg-red-500 text-white"
  );
  const isTwoSided = useIsTwoSided(id);
  useEffect(() => {
    void (async () => {
      if (token) {
        setFilename(await Database.token_image_filepath_of(id));
      } else {
        if (isFlipped && isTwoSided) {
          setFilename(await Database.backside_image_filepath_of(id));
        } else {
          setFilename(await Database.image_filepath_of(id));
        }
      }
    })();
  }, [isFlipped]);
  const cardData = useCardData(id, token);
  const routeName = useRouteName(id, token);

  return (
    <div className="w-64 relative">
      {FEATURE_FLIP && isTwoSided && !token ? (
        <button
          className={
            "absolute top-20 right-2 z-[1] border border-red-800 m-3 p-0.5 opacity-80 " +
            buttonColor
          }
          onMouseDown={() => {
            setButtonColor("bg-white text-red-500");
            setIsFlipped(!isFlipped);
          }}
          onMouseUp={() => {
            setButtonColor("bg-red-500 text-white");
          }}
        >
          Flip
        </button>
      ) : (
        ""
      )}
      {filename !== undefined ? (
        <Link
          href={
            cardData && cardData["id"] && routeName
              ? `/${token ? "token" : "card"}/${cardData["id"]}/${routeName}`
              : ""
          }
          passHref
        >
          <a>
            <Image
              src={`/card_imgs/${filename}`}
              width={375}
              height={523}
              quality={10}
              layout="responsive"
              priority
            />
          </a>
        </Link>
      ) : null}
    </div>
  );
};

export default Card;
