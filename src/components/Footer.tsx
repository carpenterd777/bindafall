import Link from "next/link";
import { FC } from "react";

const FooterText: FC<{ children: string }> = ({ children }) => {
  return <div className="text-xs text-zinc-700">{children}</div>;
};

const Footer: FC = () => {
  return (
    <div className="bg-zinc-900 p-5">
      <FooterText>
        Bindafall is not produced by, endorsed by, supported by, or affiliated
        with Wizards of the Coast or Scryfall.
      </FooterText>
      <FooterText>
        {`Copyright © ${new Date()
          .getUTCFullYear()
          .toString()} David Carpenter`}
      </FooterText>
      <Link href={"https://github.com/carpenterd777/bindafall"} passHref>
        <a className="text-xs text-zinc-700 underline">Github Repository</a>
      </Link>
    </div>
  );
};

export default Footer;
