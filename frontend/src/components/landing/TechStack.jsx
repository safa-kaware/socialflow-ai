import Section from './Section'

const stack = [
  { name: 'React + Vite', role: 'Frontend' },
  { name: 'Tailwind CSS', role: 'Styling' },
  { name: 'n8n', role: 'Automation' },
  { name: 'Groq', role: 'AI generation and review' },
  { name: 'Supabase', role: 'PostgreSQL database' },
  { name: 'REST APIs', role: 'Backend layer' },
  { name: 'Telegram Bot API', role: 'Publishing' },
  { name: 'LinkedIn API', role: 'Publishing' },
  { name: 'Vercel', role: 'Hosting' },
  { name: 'GitHub', role: 'Source control' },
]

export default function TechStack() {
  return (
    <Section id="tech" title="Technology" subtitle="The tools behind the product.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {stack.map((t) => (
          <div key={t.name} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="font-medium text-white">{t.name}</p>
            <p className="text-xs text-slate-400">{t.role}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}