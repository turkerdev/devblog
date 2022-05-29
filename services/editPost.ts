import { prisma } from "../lib/db";

type Post = {
  slug: string;
  content: string;
  title: string;
  preview: string;
};

async function editPost(post: Post) {
  await prisma.blog.update({
    where: {
      slug: post.slug,
    },
    data: {
      title: post.title,
      content: post.content,
      preview: post.preview,
    },
  });
}

export default editPost;
