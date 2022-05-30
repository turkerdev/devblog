import React from "react";
import { marked } from "marked";

interface Props {
  content: string;
  className?: string;
}

const MarkdownView: React.FC<Props> = ({ content, className }) => {
  return (
    <div
      className={className}
      id="md"
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
};

export default MarkdownView;
