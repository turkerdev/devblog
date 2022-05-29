import type { GetServerSideProps, NextPage } from "next";
import {
  CreateInput,
  TCreateInput,
  TCreateOutput,
} from "../lib/validations/post";
import { ZodFormattedError } from "zod";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { ArrowClockwise } from "phosphor-react";
import MarkdownView from "../components/MarkdownView";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { marked } from "marked";
import PostEditor from "../components/PostEditor";

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
  const [formbody, setFormBody] = useState<Partial<TCreateInput>>({ adminKey });
  const [formerror, setFormError] = useState<ZodFormattedError<TCreateInput>>();
  const router = useRouter();

  useEffect(() => {
    const res = CreateInput.safeParse(formbody);
    const data = res.success ? undefined : res.error.format();
    setFormError(data);
  }, [formbody]);

  const { isLoading, mutate } = useMutation<
    TCreateOutput,
    AxiosError,
    TCreateInput
  >(async (input) => (await axios.post("/api/post", input)).data, {
    onError: () => {
      toast.error("Something went wrong 😔");
    },
    onSuccess: (data) => {
      toast.success(`🎉 Post created successfully. 👆 Click to go.`, {
        onClick: () => router.push(`/${data.slug}`),
      });
    },
  });

  function tryMutate() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TCreateInput);
  }

  return (
    <PostEditor
      contentChange={(e) => {
        setFormBody((body) => ({ ...body, content: e.target.value }));
      }}
      titleChange={(e) =>
        setFormBody((body) => ({ ...body, title: e.target.value }))
      }
      previewChange={(e) =>
        setFormBody((body) => ({ ...body, preview: e.target.value }))
      }
      content={formbody.content}
      formerror={formerror}
      tryMutate={tryMutate}
    />
  );
};

export default Create;
