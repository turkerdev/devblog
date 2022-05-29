import React from "react";
import { marked } from "marked";

interface Props {
  src: string;
  className?: string;
}

const MarkdownView: React.FC<Props> = ({ src, className }) => {
  return (
    <div
      className={className}
      id="md"
      dangerouslySetInnerHTML={{ __html: marked.parse(src) }}
    />
  );
};

export default MarkdownView;
