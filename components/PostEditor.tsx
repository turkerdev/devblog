import { useState } from "react";
import { ZodFormattedError } from "zod";
import { TCreateInput, TPatchInput } from "../lib/validations/post";
import MarkdownView from "./MarkdownView";

type Props = {
  content?: string;
  preview?: string;
  title?: string;
  createdAt?: string;
  contentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  previewChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  titleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formerror?: ZodFormattedError<TCreateInput | TPatchInput>;
  tryMutate: () => void;
};

export default function PostEditor(props: Props) {
  const [state, setState] = useState<"Edit" | "Preview">("Edit");

  return (
    <div className="w-[460px] sm:w-[560px] md:w-[620px] lg:w-[700px] xl:w-[860px] 2xl:w-[1080px] mx-auto">
      <div className="my-4 py-4 px-6">
        <div className="border-y border-neutral-600 py-4 px-4 gap-2 flex flex-wrap">
          <button
            className="text-neutral-500 border rounded px-2 border-neutral-600 hover:text-green-500 hover:border-green-500"
            onClick={props.tryMutate}
          >
            Publish
          </button>
          <button
            className="text-neutral-500 border rounded px-2 border-neutral-600 hover:text-amber-500 hover:border-amber-500"
            onClick={() =>
              setState((currentState) =>
                currentState === "Edit" ? "Preview" : "Edit"
              )
            }
          >
            {state === "Edit" ? "Preview" : "Edit"}
          </button>

          <input
            type="text"
            placeholder="Enter preview"
            className="w-80"
            value={props.preview}
            onChange={(e) => props.previewChange(e)}
          />
          {props.formerror?.preview?._errors.map((err, i) => (
            <p key={i} className="text-red-500">
              • {err}
            </p>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter title"
          className="text-center w-full text-5xl pt-8 pb-4 font-serif border-0"
          value={props.title}
          onChange={(e) => props.titleChange(e)}
        />
        {props.formerror?.title?._errors.map((err, i) => (
          <p key={i} className="text-red-500 text-center">
            • {err}
          </p>
        ))}
        <p className="text-neutral-400 text-center">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
          }).format(new Date(props.createdAt || Date.now()))}
        </p>
        {state === "Preview" ? (
          <MarkdownView className="my-6" src={props.content || ""} />
        ) : (
          <>
            <textarea
              className={`w-full my-6 resize-none h-[570px] border-none`}
              placeholder="Enter content"
              value={props.content}
              onChange={(e) => props.contentChange(e)}
            />
            {props.formerror?.content?._errors.map((err, i) => (
              <p key={i} className="text-red-500">
                • {err}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
