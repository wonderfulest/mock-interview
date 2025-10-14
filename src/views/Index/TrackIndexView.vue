<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">{{ title }}</h2>
      <div class="hstack">
        <router-link class="btn" to="/practice">开始练习</router-link>
        <router-link class="btn" to="/study">返回背题库</router-link>
      </div>
    </div>

    <div v-if="!rows.length" class="subtitle">暂无该方向题库</div>

    <section v-else class="vstack">
      <div class="subtitle">题目索引表（{{ rows.length }}）</div>
      <div class="panel" style="overflow:auto; border-radius:12px;">
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          <thead>
            <tr style="text-align:left; background:#f8fafc;">
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">编号</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">难度</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">标签</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">题目</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in rows" :key="q.id" style="border-top:1px solid var(--border);">
              <td style="padding:10px 12px; white-space:nowrap;">
                <router-link :to="{ path: '/practice', query: { q: q.id } }" class="kbd">{{ q.id }}</router-link>
              </td>
              <td style="padding:10px 12px;">{{ '★'.repeat(q.difficulty) }}</td>
              <td style="padding:10px 12px;">
                <span v-for="t in q.tags" :key="t" class="badge" style="margin-right:6px;">#{{ t }}</span>
              </td>
              <td style="padding:10px 12px;">{{ q.prompt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="rows.length" class="vstack">
      <div class="subtitle">难度分布统计</div>
      <div class="grid cols-3" style="gap:12px;">
        <div class="card-stat" v-for="s in stats" :key="s.level">
          <div class="subtitle">Level {{ s.level }}（{{ '★'.repeat(s.level) }}）</div>
          <div style="font-size:20px; font-weight:700;">{{ s.count }}</div>
          <div class="small">占比 {{ s.percent }}%</div>
        </div>
      </div>
    </section>

    <section v-if="rows.length" class="vstack">
      <div class="subtitle">高频面试专题分组</div>
      <div class="grid cols-2" style="gap:12px;">
        <div v-for="g in groupsFilled" :key="g.title" class="panel pad">
          <div class="hstack between" style="margin-bottom:6px;">
            <div class="title" style="font-size:16px;">{{ g.title }}</div>
            <div class="small">{{ g.items.length }} 题</div>
          </div>
          <div class="vstack">
            <div v-for="q in g.items" :key="q.id" class="hstack between">
              <div class="hstack" style="gap:8px;">
                <span class="badge">{{ q.id }}</span>
                <span class="small">{{ '★'.repeat(q.difficulty) }}</span>
              </div>
              <div style="flex:1; margin-left:8px; font-size:14px;">{{ q.prompt }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Question } from '../../types'
import { redis } from '../../data/redis'
import { consul } from '../../data/consul'
import { trace } from '../../data/trace'
import { perf } from '../../data/perf'
import { design } from '../../data/design'

const route = useRoute()
const track = computed(()=> String(route.params.track||''))

const datasets: Record<string, { label: string; data: Question[] }> = {
  redis: { label: 'Redis', data: redis },
  consul: { label: 'Consul', data: consul },
  trace: { label: '链路追踪', data: trace },
  perf: { label: '交易调优', data: perf },
  design: { label: '系统设计', data: design },
}

const info = computed(()=> datasets[track.value])
const rows = computed<Question[]>(()=> info.value ? info.value.data : [])
const title = computed(()=> info.value ? `${info.value.label} 题库索引` : '题库索引')

const stats = computed(()=>{
  const total = rows.value.length || 1
  const map = new Map<number, number>()
  for(const q of rows.value){ map.set(q.difficulty, (map.get(q.difficulty)||0)+1) }
  const levels = [1,2,3,4,5]
  return levels.map(l=>({
    level: l,
    count: map.get(l)||0,
    percent: (((map.get(l)||0)/total)*100).toFixed(1)
  }))
})

// Preset manual groups for certain tracks; others fall back to tag-based groups
const groupPresets: Record<string, { title: string; ids: string[] }[]> = {
  redis: [
    { title: '⚙️ 性能与原理', ids: ['redis-1','redis-8','redis-9','redis-14','redis-18','redis-20','redis-29'] },
    { title: '💾 数据结构与存储', ids: ['redis-5','redis-6','redis-13','redis-21','redis-22'] },
    { title: '🧠 分布式与高可用', ids: ['redis-4','redis-7','redis-11','redis-17','redis-19','redis-24','redis-30'] },
    { title: '🧩 一致性与事务', ids: ['redis-3','redis-12','redis-26','redis-27'] },
    { title: '🔒 稳定性与防护', ids: ['redis-2','redis-10','redis-15','redis-16'] },
    { title: '🧰 工程实践', ids: ['redis-23','redis-25','redis-28'] },
  ],
  consul: [
    { title: '🧩 核心能力与架构', ids: ['consul-1','consul-9','consul-12'] },
    { title: '🩺 服务注册与健康检查', ids: ['consul-4','consul-5','consul-10'] },
    { title: '💾 KV / Session / 一致性', ids: ['consul-6','consul-14','consul-17'] },
    { title: '🌐 多数据中心与联邦', ids: ['consul-7'] },
    { title: '🕸 Service Mesh / Connect', ids: ['consul-8','consul-18'] },
    { title: '🔒 安全与 ACL', ids: ['consul-3','consul-11','consul-20'] },
    { title: '🛠 运维与容灾', ids: ['consul-13','consul-15','consul-16','consul-19'] },
    { title: '🚦 发布与流量治理', ids: ['consul-2'] },
  ],
}

const groupsFilled = computed(() => {
  const list = rows.value
  if (!list.length) return [] as { title: string; items: Question[] }[]

  const key = track.value as string
  const preset = groupPresets[key]
  const byId = new Map(list.map(q => [q.id, q] as const))

  if (preset) {
    return preset.map(g => ({
      title: g.title,
      items: g.ids.map(id => byId.get(id)).filter(Boolean) as Question[],
    }))
  }

  // Fallback: group by top tags
  const tagCount = new Map<string, number>()
  for (const q of list) for (const t of q.tags) tagCount.set(t, (tagCount.get(t) || 0) + 1)
  const topTags = [...tagCount.entries()].sort((a,b)=> b[1]-a[1]).slice(0,6).map(([t])=> t)
  return topTags.map(tag => ({
    title: `#${tag}`,
    items: list.filter(q => q.tags.includes(tag))
  }))
})
</script>
