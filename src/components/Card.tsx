import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FEATURE_FLIP = process.env.NEXT_PUBLIC_FEATURE_FLIP === "true"; // feature toggle

const Card: React.FC<{
  filename?: string;
  backsideFilename?: string | null;
  routeName?: string;
}> = ({ filename, backsideFilename, routeName }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>(
    "bg-red-500 text-white"
  );

  const isTwoSided =
    backsideFilename !== undefined || backsideFilename !== null;
  return (
    <div className="">
      {FEATURE_FLIP && isTwoSided ? (
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
        <Link href={routeName || "404"} passHref>
          <a>
            <Image
              src={`/card_imgs/${filename}`}
              width={375}
              height={523}
              quality={10}
              priority
            />
          </a>
        </Link>
      ) : null}
    </div>
  );
};

export default Card;
