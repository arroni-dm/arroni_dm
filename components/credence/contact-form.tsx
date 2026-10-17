"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { sendEmail } from "@/actions/contact";

type Field = "name" | "email" | "inquiry";
const fields: { id: Field; label: string; placeholder: string }[] = [
  { id: "name", label: "Name", placeholder: "Jane Doe" },
  { id: "email", label: "Business Email", placeholder: "jane@company.com" },
  { id: "inquiry", label: "Inquiry", placeholder: "How can we help you?" },
];
const fieldClass = "block w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3.5 text-base text-[#1a1a1a] transition-all placeholder:text-[#737373] focus:border-[#ffbc16] focus:outline-none focus:ring-1 focus:ring-[#ffbc16] aria-invalid:border-red-600 aria-invalid:focus:ring-red-600";
const fieldDelays = ["delay-100", "delay-175", "delay-250"];

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const submissionInFlight = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [deliveryError, setDeliveryError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const elements = event.currentTarget.elements;
    const nextErrors: Partial<Record<Field, string>> = {};
    for (const { id, label } of fields) {
      const control = elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement;
      if (!control.value.trim()) nextErrors[id] = `Please enter your ${label.toLowerCase()}.`;
      else if (id === "email" && (!control.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim()))) nextErrors[id] = "Please enter a valid email address.";
      else if (control.value.trim().length > (id === "inquiry" ? 5000 : id === "email" ? 254 : 100)) nextErrors[id] = `Please use no more than ${id === "inquiry" ? "5,000" : id === "email" ? "254" : "100"} characters.`;
    }
    setErrors(nextErrors);
    setDeliveryError("");
    setSuccessMessage("");
    const firstInvalid = fields.find(({ id }) => nextErrors[id]);
    if (firstInvalid) {
      (elements.namedItem(firstInvalid.id) as HTMLElement).focus();
      return;
    }
    const values = new FormData(event.currentTarget);
    submissionInFlight.current = true;
    startTransition(async () => {
      try {
        const result = await sendEmail({
          name: String(values.get("name") ?? ""),
          email: String(values.get("email") ?? ""),
          inqueryMessage: String(values.get("inquiry") ?? ""),
        });

        if (result.success) {
          form.current?.reset();
          setSuccessMessage(result.message);
        } else {
          setDeliveryError(result.message);
        }
      } catch {
        setDeliveryError("We couldn't send your message. Please check your connection and try again. Your entries are still here.");
      } finally {
        submissionInFlight.current = false;
      }
    });
  }

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-xl sm:p-10">
      <form id="contact-form" ref={form} noValidate onSubmit={submit} aria-busy={isPending} aria-describedby="contact-delivery-note" className="flex scroll-mt-[120px] flex-col gap-6">
        <div className="space-y-4">
          {fields.map(({ id, label, placeholder }, index) => {
            const common = {
              id: `contact-${id}`, name: id, required: true, placeholder,
              maxLength: id === "inquiry" ? 5000 : id === "email" ? 254 : 100,
              readOnly: isPending,
              "aria-invalid": Boolean(errors[id]),
              "aria-describedby": errors[id] ? `contact-${id}-error` : undefined,
              onChange: () => { setErrors(previous => ({ ...previous, [id]: undefined })); setDeliveryError(""); setSuccessMessage(""); },
            };
            return (
              <div key={id} className={`animate-in fill-mode-backwards fade-in-75 slide-in-from-bottom-3 duration-500 ease-out motion-reduce:animate-none ${fieldDelays[index]}`}>
                <label htmlFor={`contact-${id}`} className="mb-1.5 ml-1 block text-sm font-bold opacity-80">{label}</label>
                {id === "inquiry" ? <textarea {...common} className={`${fieldClass} min-h-[120px] resize-none`} /> : <input {...common} type={id === "email" ? "email" : "text"} autoComplete={id === "email" ? "email" : "name"} className={fieldClass} />}
                {errors[id] && <p id={`contact-${id}-error`} className="mt-2 text-sm text-red-700">{errors[id]}</p>}
              </div>
            );
          })}
        </div>
        <div className="mt-2 animate-in fill-mode-backwards fade-in-75 slide-in-from-bottom-3 duration-500 delay-325 ease-out motion-reduce:animate-none">
          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            aria-label={isPending ? "Sending message" : "Send Message"}
            className="grid w-full place-items-center rounded-xl bg-[#ffbc16] px-4 py-4 text-lg font-bold text-[#3c2f21] transition-[opacity,box-shadow] duration-200 ease-out enabled:hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d28a2d] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none"
          >
            <span aria-hidden="true" className={`col-start-1 row-start-1 transition-opacity duration-200 motion-reduce:transition-none ${isPending ? "opacity-0" : "opacity-100"}`}>
              Send Message
            </span>
            <span aria-hidden="true" className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2.5 transition-opacity duration-200 motion-reduce:transition-none ${isPending ? "opacity-100" : "opacity-0"}`}>
              {isPending && <LoaderCircle className="size-5 shrink-0 animate-spin motion-reduce:animate-none" strokeWidth={2} />}
              Sending...
            </span>
          </button>
        </div>
        <p id="contact-delivery-note" className="text-sm leading-relaxed text-[#3c2f21]/70">You can also <a className="underline underline-offset-4 hover:text-[#a45f41]" href="mailto:hello@growwithcredence.com">email us directly</a>.</p>
        <div role="status" aria-atomic="true">{successMessage && <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-relaxed text-green-800">{successMessage}</p>}</div>
        <div role="alert" aria-atomic="true">{deliveryError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800">{deliveryError}</p>}</div>
      </form>
    </div>
  );
}
