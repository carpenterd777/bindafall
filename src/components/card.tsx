import Image from "next/image";
import { useEffect, useState } from "react";
import Database from "../utils/database";

const db = new Database();

const Card: React.FC<{ id: string; token: boolean }> = ({ id, token }) => {
  const [filename, setFilename] = useState<string>();
  useEffect(() => {
    void (async () => {
      if (token) {
        setFilename(await db.token_image_filepath_of(id));
      } else {
        setFilename(await db.image_filepath_of(id));
      }
    })();
  });
  return (
    <div className="w-64">
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
