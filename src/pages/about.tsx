import { FC, ReactChild } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextLayout from "../components/TextLayout";
import TextLink from "../components/TextLink";

const Text: FC<{ children: Array<ReactChild> | ReactChild }> = ({
  children,
}) => {
  return <div className="py-2 text-justify">{children}</div>;
};

const AboutPage: FC = ({}) => {
  return (
    <>
      <Header />
      <TextLayout>
        <h2 className="text-3xl py-2">About</h2>
        <Text>
          The cards here are custom cards based around a Dungeons & Dragons
          campaign that my friends and I have been part of for about a year.
          This campaign has been one of my favorites so far and so I created
          this faux <i>Magic the Gathering</i> set in its honor. The campaign is
          titled "Rise to Ragnarök" and is Norse-themed, so the cards reference
          Nordic pop culture or the Kaldheim set. Playing <i>Magic</i> is one of
          my group's favorite pasttimes, and I'm a fan of using{" "}
          <TextLink href={"https://scryfall.com/"} text={"Scryfall"} /> to look
          up information about the cards - that's what inspired the design of
          this site. I want to share the high quality renders of the image files
          in case anyone wanted to proxy the cards for fun (as I did to play
          with my group). I thought it would be fun to design and play a draft
          cube including these cards, all themed around our campaign setting;
          that's what the decklist is.
        </Text>
        <Text>
          To create the card frames, I used{" "}
          <TextLink
            href={"https://magicseteditor.boards.net/"}
            text={"Magic Set Editor"}
          />
          . To edit the images into the frame, I used{" "}
          <TextLink href={"https://www.gimp.org/"} text={"GIMP"} />. To print
          the cards, I used{" "}
          <TextLink
            href={"https://www.makeplayingcards.com/"}
            text={"MakePlayingCards.com"}
          />
          .
        </Text>
        <h3 className="text-2xl py-2">Art Credit</h3>
        <Text>
          I borrowed art that was posted online for this project. I tried to
          attribute the artist when I could figure out with confidence who they
          were. If you are uncomfortable seeing your art here or your art has
          been misattributed, please let me know at{" "}
          <TextLink
            href={"mailto:mmmthegame2@gmail.com"}
            text={"mmmthegame2@gmail.com"}
          />{" "}
          and I will update this site. This project is not monetized in any way.
        </Text>
      </TextLayout>
      <Footer />
    </>
  );
};

export default AboutPage;
