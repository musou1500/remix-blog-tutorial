import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { createPost, NewPost } from "~/post";

type NewPostErrors = Partial<{
  title: boolean;
  slug: boolean;
  markdown: boolean;
}>;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: NewPostErrors = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  if (!title || !slug || !markdown) {
    throw new Error();
  }

  await createPost({ title, slug, markdown } as NewPost);
  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData<NewPostErrors>();
  const transition = useTransition();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title: <input type="text" name="title" />
          {errors?.title && <em>Title is required</em>}
        </label>
      </p>
      <p>
        <label>
          Post Slug: <input type="text" name="slug" />
          {errors?.slug && <em>slug is required</em>}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
        {errors?.markdown && <em>markdown is required</em>}
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
