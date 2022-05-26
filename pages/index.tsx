import type { GetStaticProps, NextPage } from "next";
import cookie from "cookie";
import { useEffect, useState } from "react";
import Link from "next/link";
import { prisma } from "../lib/db";
import { FilePlus } from "phosphor-react";

interface Props {
  blogs: {
    slug: string;
    title: string;
    preview: string;
    createdAt: string;
  }[];
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const rawBlogs = await prisma.blog.findMany({
    select: {
      slug: true,
      title: true,
      preview: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const blogs: Props["blogs"] = rawBlogs.map((blog) => ({
    slug: blog.slug,
    preview: blog.preview,
    title: blog.title,
    createdAt: blog.createdAt.toUTCString(),
  }));

  return {
    props: { blogs },
  };
};

const Home: NextPage<Props> = ({ blogs }) => {
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setAdmin(!!cookies.admin_key || false);
  }, []);

  return (
    <div className="w-[460px] sm:w-[500px] md:w-[520px] lg:w-[560px] xl:w-[640px] 2xl:w-[720px] mx-auto">
      {isAdmin && (
        <Link href="/create">
          <a>
            <div className="p-5 border rounded border-neutral-600 my-6 bg-neutral-800 cursor-pointer group">
              <h2 className="text-3xl text-neutral-400 flex justify-center items-center gap-2 group-hover:text-neutral-200">
                <FilePlus />
                Create
              </h2>
            </div>
          </a>
        </Link>
      )}
      {blogs.map((blog) => (
        <Link href={`/${blog.slug}`} key={blog.slug}>
          <a>
            <div className="p-5 border rounded border-neutral-600 my-6 bg-neutral-800 cursor-pointer">
              <h2 className="text-3xl">{blog.title}</h2>
              <p className="text-neutral-400">{blog.preview}</p>
              <p className="text-neutral-500 text-right mt-1">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(blog.createdAt))}
              </p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Home;
