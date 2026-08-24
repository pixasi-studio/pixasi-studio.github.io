import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { BRAND } from "../brand";
import { useInView } from "../hooks/useInView";

const S = BRAND.signal;

export default function Signal() {
  const { ref, seen } = useInView<HTMLElement>();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no clipboard permission - the address is written out beside the
         button, so there is nothing to recover from */
    }
  };

  /* Nothing is posted anywhere. The action composes a draft in whatever
     mail app the visitor already uses, which is the only honest thing a
     static page can do with a contact form.

     It is a real <a href="mailto:..."> kept in sync with the fields
     rather than a click handler that builds a URL and navigates: the
     address is then middle-clickable, copyable from the context menu,
     announced as a link, and visible in the status bar before anyone
     commits to it. The form still submits on Enter. */
  const [form, setForm] = useState({
    name: "",
    kind: S.form.kind.options[0] as string,
    when: "",
    msg: "",
  });
  const set =
    (k: keyof typeof form) =>
    (event: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: event.target.value }));

  const mailto = useMemo(() => {
    const lines: string[] = [];
    if (form.name) lines.push(`From: ${form.name}`);
    if (form.kind) lines.push(`Kind: ${form.kind}`);
    if (form.when) lines.push(`Timeline: ${form.when}`);
    if (lines.length) lines.push("");
    lines.push(form.msg);
    const subject = form.kind ? `${form.kind} — a rough idea` : "A rough idea";
    return `mailto:${BRAND.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  }, [form]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = mailto;
  };

  const field =
    "w-full border border-white/25 bg-black/25 px-4 py-3 font-inter text-sm text-white " +
    "placeholder:text-white/45 outline-none transition-colors focus:border-white";
  const label = "mb-2 block font-inter text-[10px] uppercase tracking-[0.25em] text-white/80";

  return (
    <section
      id="signal"
      ref={ref}
      className="relative z-10 overflow-hidden px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32"
      style={{ background: "linear-gradient(140deg, #a50f28 0%, #8a0c20 55%, #6d0918 100%)" }}
    >
      <div className="reveal mx-auto max-w-6xl" data-in={seen}>
        <p className="mb-10 flex items-center gap-4 font-inter text-[10px] uppercase tracking-[0.3em] text-white/80 sm:mb-14">
          <span className="font-bold text-white">{S.index}</span>
          <span>{S.eyebrow}</span>
          <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
        </p>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-podium text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold uppercase leading-[0.94] tracking-tight text-white">
              {S.heading[0]}
              <br />
              {S.heading[1]}
            </h2>
            <p className="mt-7 max-w-md font-inter text-sm leading-relaxed text-white sm:text-base">
              {S.say}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${BRAND.email}`}
                className="group inline-flex items-center gap-2 bg-black px-5 py-4 font-podium text-lg font-extrabold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-neutral-900 sm:text-xl"
              >
                {BRAND.email}
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 border border-white/40 px-4 py-4 font-inter text-[10px] uppercase tracking-widest text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span aria-live="polite">{copied ? S.copied : S.copy}</span>
              </button>
            </div>

            <ul className="mt-10 border-t border-white/25">
              {S.socials.map((s) => (
                <li key={s.h} className="border-b border-white/25">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="w-24 shrink-0 font-inter text-[10px] uppercase tracking-[0.25em] text-white/80">
                      {s.h}
                    </span>
                    <span className="flex-1 font-inter text-sm text-white">{s.v}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-white/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="bg-black/20 p-6 sm:p-8">
            <div>
              <label className={label} htmlFor="f-name">
                {S.form.name.label}
              </label>
              <input id="f-name" name="name" type="text" autoComplete="name"
                     value={form.name} onChange={set("name")}
                     placeholder={S.form.name.placeholder} className={field} />
            </div>

            <div className="mt-5">
              <label className={label} htmlFor="f-kind">
                {S.form.kind.label}
              </label>
              <select id="f-kind" name="kind" className={field}
                      value={form.kind} onChange={set("kind")}>
                {S.form.kind.options.map((o) => (
                  <option key={o} value={o} className="bg-ink text-white">
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className={label} htmlFor="f-when">
                {S.form.when.label}
              </label>
              <input id="f-when" name="when" type="text"
                     value={form.when} onChange={set("when")}
                     placeholder={S.form.when.placeholder} className={field} />
            </div>

            <div className="mt-5">
              <label className={label} htmlFor="f-msg">
                {S.form.msg.label}
              </label>
              <textarea id="f-msg" name="msg" rows={5}
                        value={form.msg} onChange={set("msg")}
                        placeholder={S.form.msg.placeholder} className={`${field} resize-y`} />
            </div>

            <a
              href={mailto}
              id="compose"
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 bg-white px-6 py-4 font-inter text-[11px] uppercase tracking-widest text-black transition-colors duration-300 hover:bg-white/90"
            >
              {S.form.submit}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            {/* keeps Enter-to-send working inside the fields */}
            <button type="submit" className="sr-only">
              {S.form.submit}
            </button>
            <p className="mt-4 font-inter text-xs leading-relaxed text-white/80">{S.form.note}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
