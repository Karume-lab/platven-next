"use client";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { FC } from "react";

interface Props {
  markdownContent: string;
}

const MarkdownRenderer: FC<Props> = async ({ markdownContent }) => {
  const mdxSource = await serialize(markdownContent);
  return <MDXRemote {...mdxSource} />;
};

export default MarkdownRenderer;
