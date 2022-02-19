import { LoaderFunction } from "remix";

export type InferLoaderType<T extends LoaderFunction> = Awaited<ReturnType<T>>;
