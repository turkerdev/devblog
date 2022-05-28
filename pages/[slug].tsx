import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";
import { prisma } from "../lib/db";
import MarkdownView from "../components/MarkdownView";
import { z } from "zod";
import Head from "next/head";

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
  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.preview} />
      </Head>
      <div className="w-[460px] sm:w-[560px] md:w-[620px] lg:w-[700px] xl:w-[860px] 2xl:w-[1080px] mx-auto">
        <div className="my-4 py-4 px-6">
          <h1 className="text-center text-5xl pt-8 pb-4">{blog.title}</h1>
          <p className="text-neutral-400 text-center">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(blog.createdAt))}
          </p>
          <MarkdownView className="my-6" src={blog.content} />
        </div>
      </div>
    </>
  );
};

export default Blog;
