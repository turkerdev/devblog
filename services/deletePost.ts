import { prisma } from "../lib/db";

type Post = {
  slug: string;
};

async function deletePost(post: Post) {
  await prisma.blog.delete({
    where: {
      slug: post.slug,
    },
  });
}

export default deletePost;
