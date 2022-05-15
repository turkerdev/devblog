import React, { createRef, useEffect, useState } from "react";
import { marked } from "marked";

interface Props {
  src: string;
  className?: string;
}

const MarkdownView: React.FC<Props> = ({ src, className }) => {
  const ref = createRef<HTMLDivElement>();
  const [md, setMD] = useState("");

  useEffect(() => {
    setMD(marked.parse(src));
  }, [src]);

  useEffect(() => {
    ref.current!.innerHTML = md;
  }, [md]);

  return <div className={className} id="md" ref={ref} />;
};

export default MarkdownView;
