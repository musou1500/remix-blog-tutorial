import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import { getPost } from "~/post";
import { InferLoaderType } from "~/types";

export const loader = async ({ params }: DataFunctionArgs) => {
  if (!params.slug) {
    throw new Error();
  }

  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<InferLoaderType<typeof loader>>();
  return <div dangerouslySetInnerHTML={{ __html: post.html }} />;
}
