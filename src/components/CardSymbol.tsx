import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { getSymbolSvg } from "../utils/symbols";

const IMG_DIM = 15;

/**
 * Renders an image of a card symbol.
 *
 * Note: there is no need to wrap in "{}" - this is automatically done for you in the component.
 * @param symbol a string representing a symbol.
 * @returns an image of a card symbol
 */
const CardSymbol: FC<{ symbol: string }> = ({ symbol }) => {
  const [src, setSrc] = useState<string>("/rtr-set-symbol.png");
  useEffect(() => {
    void (async () => {
      setSrc(await getSymbolSvg(`{${symbol}}`));
    })();
  });
  return (
    <Image
      src={src}
      height={IMG_DIM}
      width={IMG_DIM}
      style={{
        marginLeft: 1,
        marginRight: 1,
      }}
    />
  );
};

export default CardSymbol;
