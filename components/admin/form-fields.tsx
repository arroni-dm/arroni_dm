"use client";

import { Plus, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ui } from "./styles";

/** aria + id wiring shared by every input so errors and hints are announced. */
export function fieldProps(id: string, error?: string, hint?: boolean) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
  };
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  counter?: { value: number; max: number };
  children: ReactNode;
};

export function Field({ id, label, required, hint, error, counter, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={ui.label}>
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        {counter && (
          <span className={`text-xs font-bold ${counter.value > counter.max ? "text-red-600" : "text-[#3c2f21]/50"}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className={ui.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TagInput({ id, value, onChange, max, placeholder, error }: { id: string; value: string[]; onChange: (tags: string[]) => void; max: number; placeholder: string; error?: string }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tags = draft
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !value.some((existing) => existing.toLowerCase() === tag.toLowerCase()));
    if (tags.length) onChange([...value, ...tags].slice(0, max));
    setDraft("");
  };

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2" aria-label="Added technologies">
          {value.map((tag) => (
            <li key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[#3c2f21]/10 bg-[#ffbc16]/15 py-1 pr-1.5 pl-3.5 text-xs font-bold">
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className={`flex size-5 items-center justify-center rounded-full hover:bg-[#3c2f21] hover:text-white ${ui.focus}`}
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        {...fieldProps(id, error, true)}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            commit();
          } else if (event.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        disabled={value.length >= max}
        placeholder={value.length >= max ? `Maximum of ${max} reached` : placeholder}
        className={ui.input}
      />
    </div>
  );
}

export function StringListEditor({ idPrefix, value, onChange, max, placeholder, addLabel, errors }: { idPrefix: string; value: string[]; onChange: (items: string[]) => void; max: number; placeholder: string; addLabel: string; errors: Record<string, string> }) {
  return (
    <div className="space-y-3">
      {value.map((item, index) => {
        const id = `${idPrefix}-${index}`;
        const error = errors[`${idPrefix.replace("field-", "")}.${index}`];
        return (
          <div key={index}>
            <div className="flex gap-2">
              <label htmlFor={id} className="sr-only">
                Item {index + 1}
              </label>
              <input
                {...fieldProps(id, error)}
                value={item}
                maxLength={120}
                onChange={(event) => onChange(value.map((current, i) => (i === index ? event.target.value : current)))}
                placeholder={placeholder}
                className={ui.input}
              />
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className={`${ui.btnIcon} size-12 shrink-0`} aria-label={`Remove item ${index + 1}`}>
                <X className="size-4" />
              </button>
            </div>
            {error && (
              <p id={`${id}-error`} role="alert" className={ui.error}>
                {error}
              </p>
            )}
          </div>
        );
      })}
      <button type="button" onClick={() => onChange([...value, ""])} disabled={value.length >= max} className={ui.btnSecondary}>
        <Plus className="size-4" aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}

type Result = { value: string; label: string };

export function ResultsEditor({ value, onChange, max, errors }: { value: Result[]; onChange: (items: Result[]) => void; max: number; errors: Record<string, string> }) {
  const update = (index: number, patch: Partial<Result>) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {value.map((item, index) => {
        const valueError = errors[`results.${index}.value`];
        const labelError = errors[`results.${index}.label`];
        return (
          <div key={index} className="grid gap-2 sm:grid-cols-[10rem_1fr_auto]">
            <div>
              <label htmlFor={`field-results-${index}-value`} className="sr-only">
                Result {index + 1} value
              </label>
              <input {...fieldProps(`field-results-${index}-value`, valueError)} value={item.value} maxLength={30} onChange={(event) => update(index, { value: event.target.value })} placeholder="+820%" className={ui.input} />
              {valueError && <p id={`field-results-${index}-value-error`} role="alert" className={ui.error}>{valueError}</p>}
            </div>
            <div>
              <label htmlFor={`field-results-${index}-label`} className="sr-only">
                Result {index + 1} label
              </label>
              <input {...fieldProps(`field-results-${index}-label`, labelError)} value={item.label} maxLength={60} onChange={(event) => update(index, { label: event.target.value })} placeholder="ORGANIC TRAFFIC" className={ui.input} />
              {labelError && <p id={`field-results-${index}-label-error`} role="alert" className={ui.error}>{labelError}</p>}
            </div>
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className={`${ui.btnIcon} size-12 shrink-0`} aria-label={`Remove result ${index + 1}`}>
              <X className="size-4" />
            </button>
          </div>
        );
      })}
      <button type="button" onClick={() => onChange([...value, { value: "", label: "" }])} disabled={value.length >= max} className={ui.btnSecondary}>
        <Plus className="size-4" aria-hidden="true" /> Add result
      </button>
    </div>
  );
}
