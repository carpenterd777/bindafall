import Link from "next/link";
import { FC } from "react";

const TextLink: FC<{ href: string; text: string }> = ({ href, text }) => {
  return (
    <Link href={href} passHref>
      <a className="text-red-600 underline">{text}</a>
    </Link>
  );
};

export default TextLink;
