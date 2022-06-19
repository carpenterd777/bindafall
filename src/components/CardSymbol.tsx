import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { getSymbolSvg } from "../utils/symbols";

const IMG_DIM = 25;

const CardSymbol: FC<{ symbol: string }> = ({ symbol }) => {
  const [src, setSrc] = useState<string>("/rtr-set-symbol.png");
  useEffect(() => {
    void (async () => {
      setSrc(await getSymbolSvg(symbol));
    })();
  });
  return <Image src={src} height={IMG_DIM} width={IMG_DIM} />;
};

export default CardSymbol;
