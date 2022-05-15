import type { GetServerSideProps, NextPage } from "next";
import { Input, TInput, TOutput } from "../lib/validations/create";
import { ZodFormattedError } from "zod";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { ArrowClockwise } from "phosphor-react";
import MarkdownView from "../components/MarkdownView";
import { toast } from "react-toastify";

interface Props {
  adminKey: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const adminKey = ctx.req.cookies.admin_key;
  const isValid = adminKey === process.env.ADMIN_KEY;

  if (!adminKey || !isValid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      adminKey,
    },
  };
};

const Create: NextPage<Props> = ({ adminKey }) => {
  const [formbody, setFormBody] = useState<Partial<TInput>>({ adminKey });
  const [formerror, setFormError] = useState<ZodFormattedError<TInput>>();
  const [src, setSrc] = useState("");

  useEffect(() => {
    const res = Input.safeParse(formbody);
    const data = res.success ? undefined : res.error.format();
    setFormError(data);
  }, [formbody]);

  useEffect(() => {
    setFormBody((body) => ({ ...body, content: src }));
  }, [src]);

  const { isLoading, mutate } = useMutation<TOutput, AxiosError, TInput>(
    async (input) => (await axios.post("/api/create", input)).data,
    {
      onError: () => {
        toast.error("Something went wrong 😔");
      },
      onSuccess: (data) => {
        toast.success(`Blog created successfully @ ${data.slug}`);
      },
    }
  );

  function tryMutate() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TInput);
  }

  return (
    <div className="p-5">
      <div className="flex">
        <button
          className={`rounded p-1 px-4 
          ${isLoading && "animate-pulse"}
          ${!formerror && !isLoading && "hover:bg-cyan-600"}
          ${formerror ? "bg-cyan-900" : "bg-cyan-700"}`}
          onClick={() => tryMutate()}
          disabled={isLoading || !!formerror}
        >
          {isLoading ? (
            <>
              <ArrowClockwise className="inline-block animate-spin mr-2" />
              publishing...
            </>
          ) : (
            "publish"
          )}
        </button>
      </div>
      <div className="mt-2 block w-64 mx-auto">
        <input
          className="w-full"
          type="text"
          placeholder="title"
          onChange={(e) =>
            setFormBody((body) => ({ ...body, title: e.target.value }))
          }
        />
        {formerror?.title?._errors.map((err, i) => (
          <p key={i} className="text-red-500">
            • {err}
          </p>
        ))}
        <textarea
          className="w-full mt-2 resize-none"
          placeholder="preview"
          onChange={(e) =>
            setFormBody((body) => ({ ...body, preview: e.target.value }))
          }
        ></textarea>
        {formerror?.preview?._errors.map((err, i) => (
          <p key={i} className="text-red-500">
            • {err}
          </p>
        ))}
      </div>
      <div className="flex mt-5 gap-5 h-[600px]">
        <textarea
          className="w-full resize-none"
          onChange={(e) => setSrc(e.target.value)}
        ></textarea>
        <MarkdownView
          className="w-full overflow-auto outline-none border border-neutral-700 focus:border-neutral-400 rounded bg-transparent px-1"
          src={src}
        />
      </div>
    </div>
  );
};

export default Create;
