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
import PostEditor from "../../components/PostEditor";

interface Props {
  adminKey: string;
  title: string;
  preview: string;
  content: string;
  slug: string;
  createdAt: string;
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
      createdAt: blog.createdAt.toUTCString(),
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
        toast.success(`🎉 Post updated successfully. 👆 Click to go.`, {
          onClick: () => router.push(`/${props.slug}`),
        });
      },
    }
  );

  function tryPublish() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TPatchInput);
  }

  return (
    <PostEditor
      content={formbody.content}
      title={formbody.title}
      preview={formbody.preview}
      contentChange={(e) => {
        setFormBody((body) => ({ ...body, content: e.target.value }));
      }}
      titleChange={(e) =>
        setFormBody((body) => ({ ...body, title: e.target.value }))
      }
      previewChange={(e) =>
        setFormBody((body) => ({ ...body, preview: e.target.value }))
      }
      formerror={formerror}
      createdAt={props.createdAt}
      tryPublish={tryPublish}
    />
  );
};

export default Edit;
