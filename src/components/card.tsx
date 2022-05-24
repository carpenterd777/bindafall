import Image from "next/image";
import { useEffect, useState } from "react";
import Database from "../utils/database";

const db = new Database();

const Card: React.FC<{ id: string; token: boolean }> = ({ id, token }) => {
  const [filename, setFilename] = useState<string>();
  const [isTwoSided, setIsTwoSided] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>(
    "bg-red-500 text-white"
  );
  useEffect(() => {
    void (async () => {
      if (token) {
        setFilename(await db.token_image_filepath_of(id));
      } else {
        setIsTwoSided(await db.is_two_sided(id));
        if (isFlipped && isTwoSided) {
          setFilename(await db.backside_image_filepath_of(id));
        } else {
          setFilename(await db.image_filepath_of(id));
        }
      }
    })();
  }, [filename, isTwoSided, isFlipped]);

  return (
    <div className="w-64 relative">
      {isTwoSided ? (
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
      <Image
        src={`/card_imgs/${filename ? filename : ""}`}
        width={375}
        height={523}
        layout="responsive"
      />
    </div>
  );
};

export default Card;
