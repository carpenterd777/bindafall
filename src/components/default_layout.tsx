import { FC, ReactNode } from "react";

const DefaultLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main>
      <div className="mx-4 lg:mx-36 my-6 text-center">{children}</div>
    </main>
  );
};

export default DefaultLayout;
