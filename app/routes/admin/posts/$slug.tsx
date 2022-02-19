import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
  redirect,
  LoaderFunction,
  ActionFunction,
  useLocation,
} from "remix";
import { getPost, PostDetail, updatePost, UpdatePost } from "~/post";

type EditPostErrors = Partial<{
  title: boolean;
  slug: boolean;
  markdown: boolean;
}>;

export const loader: LoaderFunction = ({ params }) => {
  if (!params.slug) {
    throw new Error();
  }

  return getPost(params.slug);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: EditPostErrors = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  if (!title || !slug || !markdown) {
    throw new Error();
  }

  await updatePost({ title, slug, markdown } as UpdatePost);
  return redirect("/admin");
};

const EditPost = () => {
  const post = useLoaderData<PostDetail>();
  const errors = useActionData<EditPostErrors>();
  const transition = useTransition();
  const location = useLocation();

  return (
    <Form method="post" key={location.key}>
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" defaultValue={post.title} />
          {errors?.title && <em>Title is required</em>}
        </label>
      </p>
      <p>
        <label>
          Post Slug: <input type="text" name="slug" defaultValue={post.slug} />
          {errors?.slug && <em>slug is required</em>}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={post.markdown}
        />
        {errors?.markdown && <em>markdown is required</em>}
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Updating..." : "Update Post"}
        </button>
      </p>
    </Form>
  );
};

export default EditPost;
