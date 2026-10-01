export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  )
}