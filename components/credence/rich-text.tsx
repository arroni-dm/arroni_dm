import Image from "next/image";
import type { ReactNode } from "react";

import type { RichDoc, RichMark, RichNode } from "@/lib/projects/rich-text";

// Renders the stored JSON document as React elements. There is no
// dangerouslySetInnerHTML anywhere: unknown node types render nothing, and
// hrefs/srcs were allow-listed when the document was saved (and again on read).

const ALIGN: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const HEADING_CLASS: Record<number, string> = {
  3: "text-2xl font-bold tracking-tight text-[#3c2f21] mt-8 mb-3",
  4: "text-xl font-bold text-[#3c2f21] mt-6 mb-2",
  5: "text-lg font-bold text-[#3c2f21] mt-5 mb-2",
};

function applyMark(mark: RichMark, children: ReactNode, key: string): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong key={key}>{children}</strong>;
    case "italic":
      return <em key={key}>{children}</em>;
    case "underline":
      return <u key={key}>{children}</u>;
    case "strike":
      return <s key={key}>{children}</s>;
    case "code":
      return (
        <code key={key} className="rounded bg-[#3c2f21]/8 px-1.5 py-0.5 font-mono text-[0.9em]">
          {children}
        </code>
      );
    case "link": {
      const external = /^https?:/i.test(mark.attrs.href);
      return (
        <a
          key={key}
          href={mark.attrs.href}
          className="font-semibold text-[#3c2f21] underline decoration-[#ffbc16] decoration-2 underline-offset-4 hover:text-[#d28a2d]"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
  }
}

function renderChildren(nodes: RichNode[] | undefined, path: string): ReactNode {
  return nodes?.map((node, index) => renderNode(node, `${path}.${index}`));
}

function renderNode(node: RichNode, key: string): ReactNode {
  const align = typeof node.attrs?.textAlign === "string" ? ALIGN[node.attrs.textAlign] : undefined;

  switch (node.type) {
    case "text":
      return (node.marks ?? []).reduce<ReactNode>((acc, mark, i) => applyMark(mark, acc, `${key}.m${i}`), node.text);
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} className="my-8 border-[#3c2f21]/10" />;
    case "paragraph":
      return (
        <p key={key} className={`leading-relaxed ${align ?? ""}`}>
          {node.content?.length ? renderChildren(node.content, key) : <br />}
        </p>
      );
    case "heading": {
      // The page title is the <h1> and "Project Overview" is an <h2>, so
      // content headings start one level lower (editor h2 → h3, h3 → h4, h4 → h5).
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 2), 4) + 1;
      const Tag = `h${level}` as "h3" | "h4" | "h5";
      return (
        <Tag key={key} className={`${HEADING_CLASS[level]} ${align ?? ""}`}>
          {renderChildren(node.content, key)}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-1.5 pl-6 marker:text-[#ffbc16]">
          {renderChildren(node.content, key)}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} start={Number(node.attrs?.start ?? 1)} className="list-decimal space-y-1.5 pl-6 marker:font-bold marker:text-[#d28a2d]">
          {renderChildren(node.content, key)}
        </ol>
      );
    case "listItem":
      return (
        <li key={key} className="[&>p]:leading-relaxed">
          {renderChildren(node.content, key)}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="space-y-3 border-l-4 border-[#ffbc16] bg-[#ffbc16]/10 py-3 pr-4 pl-5 text-[#3c2f21]/90 italic rounded-r-2xl">
          {renderChildren(node.content, key)}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="overflow-x-auto rounded-2xl bg-[#3c2f21] p-5 text-sm leading-relaxed text-white">
          <code className="font-mono">{node.content?.map((child) => child.text).join("")}</code>
        </pre>
      );
    case "image": {
      const src = String(node.attrs?.src ?? "");
      if (!src) return null;
      return (
        <figure key={key} className="my-6">
          <Image
            src={src}
            alt={String(node.attrs?.alt ?? "")}
            width={1200}
            height={675}
            sizes="(max-width: 1023px) 100vw, 900px"
            className="h-auto w-full rounded-2xl border border-[#3c2f21]/10"
          />
        </figure>
      );
    }
    default:
      return null;
  }
}

export function RichText({ doc, className = "" }: { doc: RichDoc; className?: string }) {
  return <div className={`space-y-4 text-lg text-gray-700 ${className}`}>{renderChildren(doc.content, "r")}</div>;
}
