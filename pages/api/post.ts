import { NextApiHandler } from "next";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { prisma } from "../../lib/db";
import {
  CreateInput,
  CreateOutput,
  DeleteInput,
  PatchInput,
  TCreateOutput,
} from "../../lib/validations/post";
import createPost from "../../services/createPost";
import deletePost from "../../services/deletePost";
import editPost from "../../services/editPost";

const handler: NextApiHandler<
  TCreateOutput | "Not Found" | "Not Allowed" | "Internal Server Error" | "OK"
> = async (req, res) => {
  if (req.method === "POST") {
    const { content, title, preview, adminKey } = await CreateInput.parseAsync(
      req.body
    );

    const isValid = adminKey === process.env.ADMIN_KEY;
    if (!isValid) {
      return res.status(401).send("Not Allowed");
    }

    const post = await createPost({ title, content, preview });

    const json: TCreateOutput = {
      slug: post.slug,
    };

    try {
      await res.unstable_revalidate("/");
      return res.json(await CreateOutput.parseAsync(json));
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    const { slug, adminKey } = await DeleteInput.parseAsync(req.query);

    const isValid = adminKey === process.env.ADMIN_KEY;
    if (!isValid) {
      return res.status(401).send("Not Allowed");
    }

    await deletePost({ slug });

    try {
      await res.unstable_revalidate("/");
      await res.unstable_revalidate(`/${slug}`);
      return res.send("OK");
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  } else if (req.method === "PATCH") {
    const { content, title, preview, adminKey, slug } =
      await PatchInput.parseAsync(req.body);

    const isValid = adminKey === process.env.ADMIN_KEY;
    if (!isValid) {
      return res.status(401).send("Not Allowed");
    }

    await editPost({ slug, title, content, preview });

    try {
      await res.unstable_revalidate("/");
      await res.unstable_revalidate(`/${slug}`);
      return res.send("OK");
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(404).send("Not Found");
};

export default handler;
