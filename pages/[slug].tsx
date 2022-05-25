import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React from "react";
import { prisma } from "../lib/db";
import MarkdownView from "../components/MarkdownView";
import { z } from "zod";

interface Props {
  blog: {
    title: string;
    content: string;
    createdAt: string;
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
  };

  return {
    props: { blog },
  };
};

const Blog: NextPage<Props> = ({ blog }) => {
  return (
    <div className="w-[460px] sm:w-[560px] md:w-[620px] lg:w-[700px] xl:w-[860px] 2xl:w-[1080px] mx-auto">
      <div className="border rounded my-4 border-neutral-600 py-4 px-6 bg-neutral-800">
        <h1 className="text-center text-5xl py-8">{blog.title}</h1>
        <MarkdownView className="my-6" src={blog.content} />
        <p className="text-neutral-400 text-right">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
          }).format(new Date(blog.createdAt))}
        </p>
      </div>
    </div>
  );
};

export default Blog;
