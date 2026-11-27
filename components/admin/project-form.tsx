"use client";

import { Eye, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { createProject, updateProject } from "@/actions/projects";
import { EMPTY_DOC } from "@/lib/projects/rich-text";
import { projectInputSchema, type ProjectFormValues } from "@/lib/projects/schema";
import { slugify } from "@/lib/projects/urls";

import { ConfirmDialog } from "./confirm-dialog";
import { Field, ResultsEditor, StringListEditor, TagInput, fieldProps } from "./form-fields";
import { GalleryUploader } from "./gallery-uploader";
import { ImageUploader } from "./image-uploader";
import { ProjectPreview, toArticleData } from "./project-preview";
import { RichTextEditor } from "./rich-text-editor";
import { ui } from "./styles";

export const emptyProject = (): ProjectFormValues => ({
  title: "",
  slug: "",
  category: "",
  heroMetric: "",
  heroMetricLabel: "",
  description: "",
  content: EMPTY_DOC,
  image: "",
  imageAlt: "",
  gallery: [],
  highlights: [],
  results: [],
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  clientName: "",
  completedAt: "",
  featured: false,
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
});

type Props = { mode: "create" } | { mode: "edit"; id: string; initial: ProjectFormValues };

function Section({ number, title, description, children }: { number: number; title: string; description: string; children: ReactNode }) {
  const headingId = useId();
  return (
    <section className={ui.card} aria-labelledby={headingId}>
      <div className="mb-6 flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffbc16] text-sm font-black" aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 id={headingId} className="text-xl font-black tracking-tight">
            {title}
          </h2>
          <p className="text-sm font-medium text-[#3c2f21]/60">{description}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function ProjectForm(props: Props) {
  const router = useRouter();
  const editing = props.mode === "edit";
  const initial = props.mode === "edit" ? props.initial : emptyProject();

  const [values, setValues] = useState<ProjectFormValues>(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const contentLabelId = useId();

  const dirty = JSON.stringify(values) !== baseline;

  // Warn before the tab is closed/reloaded with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = Object.fromEntries(Object.entries(current).filter(([name]) => name !== key && !name.startsWith(`${key}.`)));
      return Object.keys(next).length === Object.keys(current).length ? current : next;
    });
  };

  const showErrors = (fieldErrors: Record<string, string>, message: string) => {
    setErrors(fieldErrors);
    toast.error(message);
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const target =
        first === "content"
          ? document.querySelector<HTMLElement>(".rich-editor .ProseMirror")
          : document.getElementById(`field-${first.replaceAll(".", "-")}`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus({ preventScroll: true });
    });
  };

  const submit = () => {
    const parsed = projectInputSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
      return showErrors(fieldErrors, "Please fix the highlighted fields.");
    }

    startTransition(async () => {
      const result = props.mode === "edit" ? await updateProject(props.id, values) : await createProject(values);
      if (!result.ok) return showErrors(result.fieldErrors ?? {}, result.error);

      toast.success(props.mode === "edit" ? "Project saved." : "Project created.");
      if (props.mode === "edit") {
        setBaseline(JSON.stringify(values));
        router.refresh();
      } else {
        setBaseline(JSON.stringify(values)); // clears the unsaved-changes guard before navigating
        router.push("/admin/projects");
      }
    });
  };

  const openPreview = () => {
    if (!toArticleData(values)) {
      toast.error("Add a featured image to preview this project.");
      return;
    }
    setPreviewOpen(true);
  };

  const err = (key: string) => errors[key];
  const errorCount = Object.keys(errors).length;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="space-y-6 pb-28"
    >
      {errorCount > 0 && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {errorCount === 1 ? "1 field needs your attention." : `${errorCount} fields need your attention.`}
        </div>
      )}

      <Section number={1} title="Basic information" description="What the project is called and how it appears on the listing card.">
        <Field id="field-title" label="Title" required error={err("title")} counter={{ value: values.title.length, max: 120 }}>
          <input
            {...fieldProps("field-title", err("title"))}
            value={values.title}
            onChange={(event) => {
              const title = event.target.value;
              set("title", title);
              if (!slugTouched) set("slug", slugify(title));
            }}
            className={ui.input}
            placeholder="EcoShop Australia"
            autoComplete="off"
          />
        </Field>
        <Field
          id="field-slug"
          label="URL slug"
          required
          error={err("slug")}
          hint={
            editing
              ? "Changing the slug changes the public URL — links to the old address will stop working."
              : "Generated from the title. Lowercase letters, numbers and hyphens."
          }
        >
          <div className="flex items-stretch overflow-hidden rounded-2xl">
            <span className="flex items-center rounded-l-2xl border border-r-0 border-[#3c2f21]/15 bg-[#f8f9fa] px-4 text-sm font-bold text-[#3c2f21]/60">
              /projects/
            </span>
            <input
              {...fieldProps("field-slug", err("slug"), true)}
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set("slug", event.target.value.toLowerCase());
              }}
              className={`${ui.input} rounded-l-none`}
              placeholder="ecoshop-australia"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="field-category" label="Category" required error={err("category")}>
            <input {...fieldProps("field-category", err("category"))} value={values.category} onChange={(event) => set("category", event.target.value)} className={ui.input} placeholder="RETAIL" />
          </Field>
          <Field id="field-heroMetric" label="Headline metric" required error={err("heroMetric")}>
            <input {...fieldProps("field-heroMetric", err("heroMetric"))} value={values.heroMetric} onChange={(event) => set("heroMetric", event.target.value)} className={ui.input} placeholder="1.2M" />
          </Field>
          <Field id="field-heroMetricLabel" label="Metric label" required error={err("heroMetricLabel")}>
            <input {...fieldProps("field-heroMetricLabel", err("heroMetricLabel"))} value={values.heroMetricLabel} onChange={(event) => set("heroMetricLabel", event.target.value)} className={ui.input} placeholder="NEW LEADS CAPTURED" />
          </Field>
        </div>
        <Field id="field-description" label="Short description" required error={err("description")} counter={{ value: values.description.length, max: 300 }} hint="Shown on the project card and used as the default meta description.">
          <textarea {...fieldProps("field-description", err("description"), true)} value={values.description} onChange={(event) => set("description", event.target.value)} rows={3} className={ui.input} />
        </Field>
      </Section>

      <Section number={2} title="Project content" description="The case study itself — the long description, deliverables and results.">
        <div>
          <p id={contentLabelId} className={`${ui.label} mb-2`}>
            Full description <span className="text-red-600" aria-hidden="true">*</span>
          </p>
          <RichTextEditor
            value={values.content}
            onChange={(doc) => set("content", doc)}
            labelId={contentLabelId}
            invalid={Boolean(err("content"))}
            describedBy={err("content") ? "field-content-error" : undefined}
          />
          {err("content") && (
            <p id="field-content-error" role="alert" className={ui.error}>
              {err("content")}
            </p>
          )}
          <p className={ui.hint}>Headings start at level 2 — the project title is the page&apos;s main heading.</p>
        </div>
        <div>
          <p className={`${ui.label} mb-2`}>Key deliverables</p>
          <StringListEditor idPrefix="field-highlights" value={values.highlights} onChange={(items) => set("highlights", items)} max={8} placeholder="Technical SEO architecture refactor" addLabel="Add deliverable" errors={errors} />
        </div>
        <div>
          <p className={`${ui.label} mb-1`}>Results</p>
          <p className={`${ui.hint} mb-3`}>The first two results appear as chips on the listing card; all appear on the project page.</p>
          <ResultsEditor value={values.results} onChange={(items) => set("results", items)} max={6} errors={errors} />
        </div>
      </Section>

      <Section number={3} title="Media and images" description="The featured image appears on the card, the project page and social shares.">
        <Field id="field-image" label="Featured image" required error={err("image")}>
          <ImageUploader id="field-image" value={values.image} onChange={(url) => set("image", url)} invalid={Boolean(err("image"))} describedBy={err("image") ? "field-image-error" : undefined} />
        </Field>
        <Field id="field-imageAlt" label="Featured image alt text" error={err("imageAlt")} counter={{ value: (values.imageAlt ?? "").length, max: 160 }} hint="Describe the image for screen readers. Defaults to the project title.">
          <input {...fieldProps("field-imageAlt", err("imageAlt"), true)} value={values.imageAlt ?? ""} onChange={(event) => set("imageAlt", event.target.value)} className={ui.input} />
        </Field>
        <div>
          <p className={`${ui.label} mb-2`}>Additional images</p>
          <GalleryUploader value={values.gallery} onChange={(urls) => set("gallery", urls)} />
          {err("gallery") && <p role="alert" className={ui.error}>{err("gallery")}</p>}
        </div>
      </Section>

      <Section number={4} title="Technologies and links" description="Tools used and where people can see the work.">
        <Field id="field-technologies" label="Technologies used" error={err("technologies")} hint="Press Enter or comma to add each one.">
          <TagInput id="field-technologies" value={values.technologies} onChange={(tags) => set("technologies", tags)} max={20} placeholder="Google Ads, Looker Studio…" error={err("technologies")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="field-liveUrl" label="Live project URL" error={err("liveUrl")}>
            <input {...fieldProps("field-liveUrl", err("liveUrl"))} type="url" inputMode="url" value={values.liveUrl ?? ""} onChange={(event) => set("liveUrl", event.target.value)} className={ui.input} placeholder="https://example.com" />
          </Field>
          <Field id="field-githubUrl" label="GitHub URL" error={err("githubUrl")}>
            <input {...fieldProps("field-githubUrl", err("githubUrl"))} type="url" inputMode="url" value={values.githubUrl ?? ""} onChange={(event) => set("githubUrl", event.target.value)} className={ui.input} placeholder="https://github.com/…" />
          </Field>
          <Field id="field-clientName" label="Client name" error={err("clientName")}>
            <input {...fieldProps("field-clientName", err("clientName"))} value={values.clientName ?? ""} onChange={(event) => set("clientName", event.target.value)} className={ui.input} />
          </Field>
          <Field id="field-completedAt" label="Completion date" error={err("completedAt")}>
            <input {...fieldProps("field-completedAt", err("completedAt"))} type="date" value={values.completedAt ?? ""} onChange={(event) => set("completedAt", event.target.value)} className={ui.input} />
          </Field>
        </div>
      </Section>

      <Section number={5} title="SEO settings" description="Optional overrides for search engines and social previews.">
        <Field id="field-seoTitle" label="SEO title" error={err("seoTitle")} counter={{ value: (values.seoTitle ?? "").length, max: 70 }} hint="Defaults to “Project title | Case Study”.">
          <input {...fieldProps("field-seoTitle", err("seoTitle"), true)} value={values.seoTitle ?? ""} onChange={(event) => set("seoTitle", event.target.value)} className={ui.input} />
        </Field>
        <Field id="field-seoDescription" label="SEO description" error={err("seoDescription")} counter={{ value: (values.seoDescription ?? "").length, max: 170 }} hint="Defaults to the short description.">
          <textarea {...fieldProps("field-seoDescription", err("seoDescription"), true)} value={values.seoDescription ?? ""} onChange={(event) => set("seoDescription", event.target.value)} rows={3} className={ui.input} />
        </Field>
      </Section>

      <Section number={6} title="Publishing settings" description="Drafts are only visible here. Published projects appear on the public site immediately.">
        <fieldset>
          <legend className={`${ui.label} mb-3`}>Status</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["DRAFT", "Draft", "Hidden from visitors. Only you can see it."],
                ["PUBLISHED", "Published", "Live on the projects page and at its own URL."],
              ] as const
            ).map(([value, label, help]) => (
              <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:checked]:border-[#ffbc16] has-[:checked]:bg-[#ffbc16]/10 border-[#3c2f21]/15 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#d28a2d]`}>
                <input id={value === "DRAFT" ? "field-status" : undefined} type="radio" name="status" value={value} checked={values.status === value} onChange={() => set("status", value)} className="mt-1 size-4 accent-[#ffbc16]" />
                <span>
                  <span className="block text-sm font-black">{label}</span>
                  <span className="block text-xs font-medium text-[#3c2f21]/60">{help}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={values.featured} onChange={(event) => set("featured", event.target.checked)} className="mt-1 size-4 accent-[#ffbc16]" />
          <span>
            <span className="block text-sm font-black">Featured project</span>
            <span className="block text-xs font-medium text-[#3c2f21]/60">Featured projects are listed first.</span>
          </span>
        </label>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#3c2f21]/10 bg-white/90 px-4 py-3 backdrop-blur-xl lg:left-72">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 sm:px-4">
          <p className="text-xs font-bold text-[#3c2f21]/60" role="status">
            {pending ? "Saving…" : dirty ? "You have unsaved changes." : editing ? "All changes saved." : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => (dirty ? setLeaveOpen(true) : router.push("/admin/projects"))} disabled={pending} className={ui.btnSecondary}>
              Cancel
            </button>
            <button type="button" onClick={openPreview} disabled={pending} className={ui.btnSecondary}>
              <Eye className="size-4" aria-hidden="true" /> Preview
            </button>
            <button type="submit" disabled={pending || (editing && !dirty)} className={ui.btnAccent}>
              {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {editing ? "Save changes" : "Create project"}
            </button>
          </div>
        </div>
      </div>

      <ProjectPreview open={previewOpen} onOpenChange={setPreviewOpen} data={previewOpen ? toArticleData(values) : null} status={values.status} />
      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Discard unsaved changes?"
        description="You have edits that haven't been saved. If you leave now they will be lost."
        confirmLabel="Discard changes"
        onConfirm={() => {
          setBaseline(JSON.stringify(values));
          router.push("/admin/projects");
        }}
      />
    </form>
  );
}
