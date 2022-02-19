import * as fs from "fs/promises";
import parseFrontMatter from "front-matter";
import * as path from "path";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
};

export type PostDetail = Post & { html: string; markdown: string };

export interface PostMarkdownAttributes {
  title: string;
}

export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export type UpdatePost = {
  title: string;
  slug: string;
  markdown: string;
};

const postsPath = path.join(__dirname, "..", "posts");
const getPostPath = (slug: string) => path.join(postsPath, slug + ".md");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return typeof attributes.title === "string";
}

export const getPosts = async (): Promise<Post[]> => {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter(file.toString());
      if (isValidPostAttributes(attributes)) {
        return {
          slug: filename.replace(/\.md$/, ""),
          title: attributes.title,
        };
      }
      throw new Error();
    })
  );
};

export const getPost = async (slug: string): Promise<PostDetail> => {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const markdown = file.toString();
  const { attributes, body } = parseFrontMatter(markdown);
  if (isValidPostAttributes(attributes)) {
    const html = marked(body);
    return { slug, title: attributes.title, html, markdown };
  }

  throw new Error();
};

export const createPost = async (post: NewPost): Promise<PostDetail> => {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(getPostPath(post.slug), md);
  return getPost(post.slug);
};

export const updatePost = async (post: UpdatePost) => {
  await fs.stat(getPostPath(post.slug));
  await fs.writeFile(getPostPath(post.slug), post.markdown);
  return getPost(post.slug);
};
