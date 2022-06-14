import Link from "next/link";
import { FC } from "react";

const Button: FC<{ href: string; text: string }> = ({ href, text }) => {
  return (
    <div
      className={
        "bg-zinc-900 text-white hover:bg-zinc-600 rounded-md border border-white px-3 mx-2 my-auto h-1/2"
      }
    >
      <Link href={href} passHref>
        <a>{text}</a>
      </Link>
    </div>
  );
};

const Header: FC = () => {
  return (
    <div className="bg-zinc-900 flex flex-row justify-center lg:justify-start">
      <Link href={"/"} passHref>
        <a>
          <h1 className="text-white lg:mx-36 py-3 text-4xl">Bindafall</h1>
        </a>
      </Link>
      <div className="hidden lg:flex flex-row w-2/3 justify-end">
        <Button href="/printer_size.zip" text="Printer Size Images" />
        <Button href="/mpc_size.zip" text="MPC Size Images" />
      </div>
    </div>
  );
};

export default Header;
