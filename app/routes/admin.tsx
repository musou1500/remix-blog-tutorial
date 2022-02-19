import { Link, Outlet, useLoaderData } from "remix";
import { getPosts } from "~/post";
import { InferLoaderType } from "~/types";
import styles from "~/styles/admin.css";

export const loader = getPosts;

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Admin = () => {
  const posts = useLoaderData<InferLoaderType<typeof loader>>();
  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to={`/admin/posts/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
