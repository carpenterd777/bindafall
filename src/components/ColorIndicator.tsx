import { FC } from "react";

export type MTGColor = "W" | "U" | "B" | "R" | "G";

const ColorIndicator: FC<{
  color: [MTGColor] | [MTGColor, MTGColor] | null;
}> = ({ color }) => {
  if (color === null) return null;
  const MTGColorToHexColor: Record<MTGColor, string> = {
    B: "#393736",
    W: "#FAFDE8",
    U: "#3277a7",
    G: "#38614C",
    R: "#DA3946",
  };
  const MTGColorToName: Record<MTGColor, string> = {
    B: "Black",
    W: "White",
    U: "Blue",
    R: "Red",
    G: "Green",
  };
  if (
    color[0] === undefined ||
    (color.length === 2 && color[1] === undefined)
  ) {
    throw new Error("ColorIndicator: could not find color");
  }
  const text =
    color.length === 1
      ? `Color Indicator: ${MTGColorToName[color[0]]}`
      : `Color Indicator: ${MTGColorToName[color[0]]} and ${
          MTGColorToName[color[1]]
        }`;
  return (
    <abbr
      className={
        "block rounded-full w-[13px] h-[13px] m-2 border border-[#333] cursor-help "
      }
      title={text}
      style={
        color.length === 2
          ? {
              background: `linear-gradient(135deg, ${
                MTGColorToHexColor[color[0]]
              } 50%, ${MTGColorToHexColor[color[1]]} 50%)`,
            }
          : { backgroundColor: MTGColorToHexColor[color[0]] }
      }
    >
      {/* {text} */}
    </abbr>
  );
};

export default ColorIndicator;
