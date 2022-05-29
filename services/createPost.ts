import { nanoid } from "nanoid";
import slugify from "slugify";
import { prisma } from "../lib/db";

type Post = {
  content: string;
  title: string;
  preview: string;
};

async function createPost(post: Post) {
  const slug = `${slugify(post.title)}_${nanoid(4)}`;

  await prisma.blog.create({
    data: {
      title: post.title,
      content: post.content,
      preview: post.preview,
      slug,
    },
  });

  return {
    slug,
  };
}

export default createPost;
