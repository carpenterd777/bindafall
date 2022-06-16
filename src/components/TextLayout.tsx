import { FC, ReactNode } from "react";

const TextLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main>
      <div className="mx-4 lg:mx-72 my-6 text-left h-[100vh]">{children}</div>
    </main>
  );
};

export default TextLayout;
