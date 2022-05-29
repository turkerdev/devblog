import type { GetServerSideProps, NextPage } from "next";
import { PatchInput, TPatchInput } from "../../lib/validations/post";
import { ZodFormattedError } from "zod";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { ArrowClockwise } from "phosphor-react";
import MarkdownView from "../../components/MarkdownView";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { prisma } from "../../lib/db";

interface Props {
  adminKey: string;
  title: string;
  preview: string;
  content: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const adminKey = ctx.req.cookies.admin_key;
  const isValid = adminKey === process.env.ADMIN_KEY;
  const params = ctx.params;
  const slug = params?.slug;

  if (!adminKey || !isValid || typeof slug !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const blog = await prisma.blog.findUnique({ where: { slug } });

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      adminKey,
      slug,
      title: blog.title,
      content: blog.content,
      preview: blog.preview,
    },
  };
};

const Edit: NextPage<Props> = (props) => {
  const [formbody, setFormBody] = useState<Partial<TPatchInput>>({
    adminKey: props.adminKey,
    content: props.content,
    preview: props.preview,
    title: props.title,
    slug: props.slug,
  });
  const [formerror, setFormError] = useState<ZodFormattedError<TPatchInput>>();
  const router = useRouter();

  useEffect(() => {
    const res = PatchInput.safeParse(formbody);
    const data = res.success ? undefined : res.error.format();
    setFormError(data);
  }, [formbody]);

  const { isLoading, mutate } = useMutation<{}, AxiosError, TPatchInput>(
    async (input) => (await axios.patch("/api/post", input)).data,
    {
      onError: () => {
        toast.error("Something went wrong 😔");
      },
      onSuccess: () => {
        toast.success(`Post updated successfully 🎉 click to go.`, {
          onClick: () => router.push(`/${props.slug}`),
        });
      },
    }
  );

  function tryMutate() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TPatchInput);
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
          value={formbody.title}
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
          value={formbody.preview}
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
          value={formbody.content}
          onChange={(e) =>
            setFormBody((body) => ({ ...body, content: e.target.value }))
          }
        ></textarea>
        <MarkdownView
          className="w-full overflow-auto outline-none border border-neutral-700 focus:border-neutral-400 rounded bg-transparent px-1"
          src={formbody.content || ""}
        />
      </div>
    </div>
  );
};

export default Edit;
