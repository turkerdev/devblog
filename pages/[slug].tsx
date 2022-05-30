import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { prisma } from "../lib/db";
import MarkdownView from "../components/MarkdownView";
import { z } from "zod";
import Head from "next/head";
import { useMutation } from "react-query";
import { TDeleteInput } from "../lib/validations/post";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import cookie from "cookie";
import Link from "next/link";

interface Props {
  blog: {
    title: string;
    content: string;
    createdAt: string;
    preview: string;
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const paramsSchema = z.object({
    slug: z.string(),
  });

  const validation = await paramsSchema.spa(ctx.params);

  if (!validation.success) {
    return {
      notFound: true,
    };
  }

  const rawBlog = await prisma.blog.findFirst({
    where: {
      slug: validation.data.slug,
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
      preview: true,
    },
  });

  if (!rawBlog) {
    return {
      notFound: true,
    };
  }

  const blog: Props["blog"] = {
    content: rawBlog.content,
    title: rawBlog.title,
    createdAt: rawBlog.createdAt.toUTCString(),
    preview: rawBlog.preview,
  };

  return {
    props: { blog },
  };
};

const Blog: NextPage<Props> = ({ blog }) => {
  const [adminKey, setAdminKey] = useState("");
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setAdminKey(cookies.admin_key);
  }, []);

  const { isLoading, mutate } = useMutation<{}, AxiosError, TDeleteInput>(
    async (input) => (await axios.delete("/api/post", { params: input })).data,
    {
      onError: () => {
        toast.error("Something went wrong 😔");
      },
      onSuccess: () => {
        toast.success(`Post deleted successfully.`);
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      },
    }
  );

  function tryMutate() {
    if (isLoading) {
      return;
    }

    if (typeof slug !== "string") {
      return;
    }

    if (!adminKey) {
      return;
    }

    mutate({ slug, adminKey });
  }

  return (
    <>
      <Head>
        <title>{blog.title} | turker.dev</title>
        <meta name="description" content={blog.preview} />
      </Head>
      <div className="sm:w-[560px] md:w-[620px] lg:w-[700px] xl:w-[860px] 2xl:w-[1080px] mx-auto">
        <div className="my-4 py-4 px-6">
          {adminKey && (
            <div className="border-y border-neutral-600 py-4 px-4 gap-2 flex">
              <Link href={`${slug}/edit`}>
                <a className="text-neutral-500 border rounded px-2 border-neutral-600 hover:text-amber-500 hover:border-amber-500">
                  Edit
                </a>
              </Link>
              <button
                className="text-neutral-500 border rounded px-2 border-neutral-600 hover:text-red-500 hover:border-red-500"
                onClick={tryMutate}
              >
                Delete
              </button>
            </div>
          )}
          <h1 className="text-center text-5xl pt-8 pb-4 font-serif">
            {blog.title}
          </h1>
          <p className="text-neutral-400 text-center">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(blog.createdAt))}
          </p>
          <MarkdownView className="my-6" content={blog.content} />
        </div>
      </div>
    </>
  );
};

export default Blog;
