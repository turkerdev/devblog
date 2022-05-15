import { NextApiHandler } from "next";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { prisma } from "../../lib/db";
import { Input, Output, TOutput } from "../../lib/validations/create";

const handler: NextApiHandler<
  TOutput | "Not Found" | "Not Allowed" | "Internal Server Error"
> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send("Not Found");
  }

  const { content, title, preview, adminKey } = await Input.parseAsync(
    req.body
  );

  const isValid = adminKey === process.env.ADMIN_KEY;

  if (!isValid) {
    return res.status(401).send("Not Allowed");
  }

  const slug = `${slugify(title)}_${nanoid(4)}`;

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      preview,
      slug,
    },
  });

  const json: TOutput = {
    slug: blog.slug,
  };

  try {
    await res.unstable_revalidate("/");
    return res.json(await Output.parseAsync(json));
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export default handler;
