"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import { isSafeLinkUrl } from "@/lib/projects/urls";

import "./rich-text-editor.css";
import { ui } from "./styles";
import { ACCEPTED_IMAGE_TYPES, uploadImage, validateImageFile } from "./upload";

type ToolProps = { label: string; icon: LucideIcon; active?: boolean; disabled?: boolean; onClick: () => void };

function Tool({ label, icon: Icon, active, disabled, onClick }: ToolProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor selection when a toolbar button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-xl transition-colors disabled:opacity-40 ${ui.focus} ${
        active ? "bg-[#3c2f21] text-white" : "text-[#3c2f21] hover:bg-[#ffbc16]/25"
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}

const Divider = () => <span className="mx-1 h-6 w-px bg-[#3c2f21]/15" aria-hidden="true" />;

type Panel = { kind: "link"; url: string } | { kind: "image"; src: string; alt: string } | null;

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      justify: e.isActive({ textAlign: "justify" }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const chain = () => editor.chain().focus();

  // Enter confirms and Escape dismisses; Enter must never bubble up and submit the project form.
  const onPanelKey = (event: KeyboardEvent<HTMLInputElement>, confirm: () => void) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setPanel(null);
    }
  };

  const openLink = () => {
    setMessage(null);
    setPanel({ kind: "link", url: (editor.getAttributes("link").href as string | undefined) ?? "" });
  };

  const applyLink = () => {
    if (panel?.kind !== "link") return;
    let url = panel.url.trim();
    if (url && !/^([a-z][a-z0-9+.-]*:|\/)/i.test(url)) url = `https://${url}`;
    if (!url) chain().extendMarkRange("link").unsetLink().run();
    else if (!isSafeLinkUrl(url)) return setMessage("Links must start with http://, https://, mailto: or /.");
    else chain().extendMarkRange("link").setLink({ href: url }).run();
    setPanel(null);
    setMessage(null);
  };

  const pickImage = async (file: File) => {
    setMessage(null);
    const problem = validateImageFile(file);
    if (problem) return setMessage(problem);
    setUploading(0);
    try {
      const src = await uploadImage(file, setUploading);
      setPanel({ kind: "image", src, alt: "" });
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  const insertImage = () => {
    if (panel?.kind !== "image") return;
    chain().setImage({ src: panel.src, alt: panel.alt.trim() }).run();
    setPanel(null);
  };

  return (
    <div className="rounded-t-2xl border-b border-[#3c2f21]/10 bg-[#f8f9fa] p-2">
      <div role="toolbar" aria-label="Text formatting" className="flex flex-wrap items-center gap-0.5">
        <Tool label="Bold" icon={Bold} active={state.bold} onClick={() => chain().toggleBold().run()} />
        <Tool label="Italic" icon={Italic} active={state.italic} onClick={() => chain().toggleItalic().run()} />
        <Tool label="Underline" icon={Underline} active={state.underline} onClick={() => chain().toggleUnderline().run()} />
        <Tool label="Strikethrough" icon={Strikethrough} active={state.strike} onClick={() => chain().toggleStrike().run()} />
        <Tool label="Inline code" icon={Code} active={state.code} onClick={() => chain().toggleCode().run()} />
        <Divider />
        <Tool label="Heading 2" icon={Heading2} active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
        <Tool label="Heading 3" icon={Heading3} active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
        <Tool label="Heading 4" icon={Heading4} active={state.h4} onClick={() => chain().toggleHeading({ level: 4 }).run()} />
        <Divider />
        <Tool label="Bulleted list" icon={List} active={state.bullet} onClick={() => chain().toggleBulletList().run()} />
        <Tool label="Numbered list" icon={ListOrdered} active={state.ordered} onClick={() => chain().toggleOrderedList().run()} />
        <Tool label="Blockquote" icon={Quote} active={state.quote} onClick={() => chain().toggleBlockquote().run()} />
        <Tool label="Code block" icon={Code2} active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
        <Tool label="Divider line" icon={Minus} onClick={() => chain().setHorizontalRule().run()} />
        <Divider />
        <Tool label="Align left" icon={AlignLeft} active={state.left} onClick={() => chain().setTextAlign("left").run()} />
        <Tool label="Align center" icon={AlignCenter} active={state.center} onClick={() => chain().setTextAlign("center").run()} />
        <Tool label="Align right" icon={AlignRight} active={state.right} onClick={() => chain().setTextAlign("right").run()} />
        <Tool label="Justify" icon={AlignJustify} active={state.justify} onClick={() => chain().setTextAlign("justify").run()} />
        <Divider />
        <Tool label="Add link" icon={Link2} active={state.link} onClick={openLink} />
        {state.link && <Tool label="Remove link" icon={Unlink} onClick={() => chain().extendMarkRange("link").unsetLink().run()} />}
        <Tool
          label="Insert image"
          icon={uploading === null ? ImagePlus : LoaderCircle}
          disabled={uploading !== null}
          onClick={() => fileRef.current?.click()}
        />
        <Divider />
        <Tool label="Undo" icon={Undo2} disabled={!state.canUndo} onClick={() => chain().undo().run()} />
        <Tool label="Redo" icon={Redo2} disabled={!state.canRedo} onClick={() => chain().redo().run()} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        aria-label="Upload image for content"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void pickImage(file);
        }}
      />

      {uploading !== null && (
        <p role="status" className="mt-2 px-2 text-xs font-bold">
          Uploading image… {uploading}%
        </p>
      )}

      {panel?.kind === "link" && (
        // Not a <form>: this toolbar lives inside the project form, and forms cannot nest.
        <div role="group" aria-label="Link" className="mt-2 flex flex-wrap items-center gap-2 px-1">
          <label htmlFor="editor-link" className="sr-only">
            Link URL
          </label>
          <input
            id="editor-link"
            autoFocus
            value={panel.url}
            onChange={(event) => setPanel({ kind: "link", url: event.target.value })}
            onKeyDown={(event) => onPanelKey(event, applyLink)}
            placeholder="https://example.com (empty removes the link)"
            className={`${ui.input} min-w-48 flex-1 py-2`}
          />
          <button type="button" onClick={applyLink} className={`${ui.btnPrimary} py-2`}>
            Apply
          </button>
          <button type="button" onClick={() => setPanel(null)} className={`${ui.btnSecondary} py-2`}>
            Cancel
          </button>
        </div>
      )}

      {panel?.kind === "image" && (
        <div role="group" aria-label="Image details" className="mt-2 flex flex-wrap items-center gap-2 px-1">
          <label htmlFor="editor-alt" className="sr-only">
            Image description (alt text)
          </label>
          <input
            id="editor-alt"
            autoFocus
            value={panel.alt}
            onChange={(event) => setPanel({ ...panel, alt: event.target.value })}
            onKeyDown={(event) => onPanelKey(event, insertImage)}
            placeholder="Describe the image (alt text, for accessibility)"
            maxLength={200}
            className={`${ui.input} min-w-48 flex-1 py-2`}
          />
          <button type="button" onClick={insertImage} className={`${ui.btnPrimary} py-2`}>
            Insert image
          </button>
          <button type="button" onClick={() => setPanel(null)} className={`${ui.btnSecondary} py-2`}>
            Discard
          </button>
        </div>
      )}

      {message && (
        <p role="alert" className="mt-2 px-2 text-xs font-bold text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}

type Props = {
  value: unknown;
  onChange: (doc: unknown) => void;
  labelId: string;
  invalid?: boolean;
  describedBy?: string;
};

export function RichTextEditor({ value, onChange, labelId, invalid, describedBy }: Props) {
  const editor = useEditor({
    immediatelyRender: false, // avoids SSR hydration mismatches
    content: value as object,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer nofollow" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ allowBase64: false }),
    ],
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
      },
    },
    // ProseMirror attrs are null-prototype objects, which cannot be passed to server actions; plain-JSON them.
    onUpdate: ({ editor: current }) => onChange(JSON.parse(JSON.stringify(current.getJSON()))),
  });

  return (
    <div
      className={`rich-editor rounded-2xl border bg-white transition focus-within:border-[#ffbc16] focus-within:ring-4 focus-within:ring-[#ffbc16]/25 ${
        invalid ? "border-red-500" : "border-[#3c2f21]/15"
      }`}
    >
      {editor ? <Toolbar editor={editor} /> : <div className="h-14 rounded-t-2xl bg-[#f8f9fa]" />}
      <EditorContent editor={editor} data-lenis-prevent />
    </div>
  );
}
