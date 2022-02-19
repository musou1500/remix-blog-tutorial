import { useLoaderData, Link, LoaderFunction } from "remix";
import { getPosts } from "~/post";
import { InferLoaderType } from "~/types";

export const loader = getPosts;

export default function Posts() {
  const posts = useLoaderData<InferLoaderType<typeof loader>>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
