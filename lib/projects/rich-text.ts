import { isAllowedImageUrl, isSafeLinkUrl } from "./urls";

// Rich text is stored as a ProseMirror (Tiptap) JSON document and rendered by
// our own React renderer, never as raw HTML. `sanitizeDoc` rebuilds the tree
// from an allow-list, so unknown nodes, marks, attributes and unsafe URLs
// cannot be persisted even if a request bypasses the editor.

export type RichMark =
  | { type: "bold" | "italic" | "underline" | "strike" | "code" }
  | { type: "link"; attrs: { href: string } };

export type RichNode = {
  type: string;
  attrs?: Record<string, string | number>;
  marks?: RichMark[];
  text?: string;
  content?: RichNode[];
};

export type RichDoc = { type: "doc"; content: RichNode[] };

export const EMPTY_DOC: RichDoc = { type: "doc", content: [{ type: "paragraph" }] };

const MAX_DEPTH = 8;
const MAX_NODES = 5000;
const ALIGNMENTS = new Set(["left", "center", "right", "justify"]);
const SIMPLE_MARKS = new Set(["bold", "italic", "underline", "strike", "code"]);

class InvalidDocError extends Error {}

function cleanMarks(marks: unknown): RichMark[] | undefined {
  if (!Array.isArray(marks)) return undefined;
  const out: RichMark[] = [];
  for (const mark of marks) {
    const type = (mark as { type?: unknown })?.type;
    if (typeof type !== "string") continue;
    if (SIMPLE_MARKS.has(type)) {
      out.push({ type } as RichMark);
    } else if (type === "link") {
      const href = (mark as { attrs?: { href?: unknown } }).attrs?.href;
      if (typeof href === "string" && isSafeLinkUrl(href.trim())) {
        out.push({ type: "link", attrs: { href: href.trim() } });
      }
    }
  }
  return out.length ? out : undefined;
}

const isInline = (node: RichNode) => node.type === "text" || node.type === "hardBreak";
const isBlock = (node: RichNode) => node.type !== "text" && node.type !== "listItem" && node.type !== "hardBreak";

function cleanNode(node: unknown, depth: number, counter: { n: number }): RichNode | null {
  if (typeof node !== "object" || node === null) return null;
  if (depth > MAX_DEPTH || ++counter.n > MAX_NODES) {
    throw new InvalidDocError("Content is too large or too deeply nested.");
  }

  const raw = node as {
    type?: unknown;
    attrs?: Record<string, unknown>;
    marks?: unknown;
    text?: unknown;
    content?: unknown;
  };
  if (typeof raw.type !== "string") return null;
  const type = raw.type;

  const children = (allowed: (child: RichNode) => boolean) =>
    (Array.isArray(raw.content) ? raw.content : [])
      .map((child) => cleanNode(child, depth + 1, counter))
      .filter((child): child is RichNode => child !== null && allowed(child));

  const align =
    typeof raw.attrs?.textAlign === "string" && ALIGNMENTS.has(raw.attrs.textAlign)
      ? raw.attrs.textAlign
      : undefined;

  switch (type) {
    case "text": {
      if (typeof raw.text !== "string" || raw.text.length === 0) return null;
      return { type, text: raw.text.slice(0, 20000), marks: cleanMarks(raw.marks) };
    }
    case "hardBreak":
    case "horizontalRule":
      return { type };
    case "image": {
      const src = typeof raw.attrs?.src === "string" ? raw.attrs.src : "";
      if (!isAllowedImageUrl(src)) return null;
      const alt = typeof raw.attrs?.alt === "string" ? raw.attrs.alt.slice(0, 200) : "";
      return { type, attrs: { src, alt } };
    }
    case "paragraph":
      return { type, attrs: align ? { textAlign: align } : undefined, content: children(isInline) };
    case "heading": {
      const level = Number(raw.attrs?.level);
      const attrs: Record<string, string | number> = { level: level >= 2 && level <= 4 ? level : 2 };
      if (align) attrs.textAlign = align;
      return { type, attrs, content: children(isInline) };
    }
    case "codeBlock":
      return {
        type,
        content: children((c) => c.type === "text").map((c) => ({ type: "text", text: c.text })),
      };
    case "blockquote":
    case "listItem":
      return { type, content: children(isBlock) };
    case "bulletList":
      return { type, content: children((c) => c.type === "listItem") };
    case "orderedList": {
      const start = Number(raw.attrs?.start);
      return {
        type,
        attrs: { start: Number.isInteger(start) && start > 0 && start < 10000 ? start : 1 },
        content: children((c) => c.type === "listItem"),
      };
    }
    default:
      return null;
  }
}

/** Returns a clean document, or throws if the input is not a usable document. */
export function sanitizeDoc(input: unknown): RichDoc {
  if (typeof input !== "object" || input === null || (input as { type?: unknown }).type !== "doc") {
    throw new InvalidDocError("Content is not a valid document.");
  }
  const counter = { n: 0 };
  const root = input as { content?: unknown };
  const content = (Array.isArray(root.content) ? root.content : [])
    .map((child) => cleanNode(child, 1, counter))
    .filter((child): child is RichNode => child !== null && isBlock(child));
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

export function isInvalidDocError(error: unknown): error is Error {
  return error instanceof InvalidDocError;
}

function hasContent(node: RichNode): boolean {
  if (node.type === "image" || node.type === "horizontalRule") return true;
  if (node.type === "text") return Boolean(node.text?.trim());
  return (node.content ?? []).some(hasContent);
}

export const isDocEmpty = (doc: RichDoc) => !doc.content.some(hasContent);

/** Plain text, used for fallback SEO descriptions. */
export function docToPlainText(doc: RichDoc): string {
  const parts: string[] = [];
  const walk = (node: RichNode) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (["paragraph", "heading", "listItem", "blockquote"].includes(node.type)) parts.push(" ");
  };
  doc.content.forEach(walk);
  return parts.join("").replace(/\s+/g, " ").trim();
}

export function textToDoc(text: string): RichDoc {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    type: "doc",
    content: paragraphs.map((p) => ({ type: "paragraph", content: [{ type: "text", text: p }] })),
  };
}
