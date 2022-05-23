import { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next";
import "../styles/globals.css";

// Allow the object default bc that's built in to Next.js
// eslint-disable-next-line @typescript-eslint/ban-types
type ExtendedAppProps<P = {}> = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, P> & {
    title: string;
    description: string;
  };
};

export const MyApp = ({
  Component,
  pageProps,
}: ExtendedAppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default MyApp;
