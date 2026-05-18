import type { ServiceType } from '@/types'
import { SERVICE_CONFIG } from '@/data'
import { getServiceColor } from '@/lib/utils'

interface ServiceHeroProps {
  service: ServiceType
  children?: React.ReactNode
}

export default function ServiceHero({ service, children }: ServiceHeroProps) {
  const config = SERVICE_CONFIG[service]
  const color = getServiceColor(service)
  return (
    <div className="relative rounded-3xl p-8 mb-7 overflow-hidden min-h-[180px] flex flex-col justify-end"
      style={{ background: `linear-gradient(135deg, ${color}1a, ${color}06)` }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 50%, ${color}25 0%, transparent 65%)` }} />
      <div className="relative z-10">
        <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color }}>{config.emoji} {config.label}</p>
        <h1 className="font-syne font-black text-3xl text-text mb-2">{config.label === 'Food Delivery' ? 'Craving something?' : config.label === 'Grocery' ? 'Fresh & Fast Delivery' : config.label === 'Laundry' ? 'Clothes in, fresh out' : 'Dress to impress'}</h1>
        <p className="text-text-2 text-sm max-w-md">{config.description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
