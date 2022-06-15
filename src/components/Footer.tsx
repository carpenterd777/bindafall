import { FC } from "react";

const FooterText: FC<{ children: string }> = ({ children }) => {
  return <div className="text-xs text-zinc-700">{children}</div>;
};

const Footer: FC = () => {
  return (
    <div className="bg-zinc-900 p-5 flex flex-col place-content-center">
      <FooterText>
        Bindafall is not produced by, endorsed by, supported by, or affiliated
        with Wizards of the Coast or Scryfall.
      </FooterText>
      <FooterText>
        {`Copyright © ${new Date()
          .getUTCFullYear()
          .toString()} David Carpenter`}
      </FooterText>
    </div>
  );
};

export default Footer;
