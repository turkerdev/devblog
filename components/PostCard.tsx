import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  preview: string;
  createdAt: string;
};

export default function BlogCard(props: Props) {
  return (
    <div className="px-24 md:px-48 lg:px-56 2xl:px-96 py-4 hover:bg-neutral-800">
      <div>
        <h2 className="text-3xl">{props.title}</h2>
        <p className="text-neutral-400">{props.preview}</p>
        <div className="flex items-center justify-between mt-2 text-neutral-500">
          <Link href={`/${props.slug}`} key={props.slug}>
            <a className="cursor-pointer border rounded px-2 border-neutral-600 hover:border-amber-500 hover:text-amber-500">
              Read More
            </a>
          </Link>
          <p className="text-right mt-1">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(props.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
}
