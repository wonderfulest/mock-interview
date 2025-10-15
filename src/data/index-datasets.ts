import type { Question } from '../types'
import { mysql } from './mysql'
import { redis } from './redis'
import { consul } from './consul'
import { trace } from './trace'
import { perf } from './perf'
import { design } from './design'
import { distributed } from './distributed'

export const indexDatasets: Record<string, { label: string; data: Question[] }> = {
  mysql: { label: 'MySQL', data: mysql },
  redis: { label: 'Redis', data: redis },
  consul: { label: 'Consul', data: consul },
  trace: { label: '链路追踪', data: trace },
  perf: { label: '交易调优', data: perf },
  design: { label: '系统设计', data: design },
  distributed: { label: '分布式系统', data: distributed },
}
