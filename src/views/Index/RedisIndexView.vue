<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">📘 Redis 题库索引</h2>
      <router-link class="btn" to="/practice">开始练习</router-link>
    </div>

    <section class="vstack">
      <div class="subtitle">题目索引表（30）</div>
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
            <tr v-for="q in tableRows" :key="q.id" style="border-top:1px solid var(--border);">
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

    <section class="vstack">
      <div class="subtitle">难度分布统计</div>
      <div class="grid cols-3" style="gap:12px;">
        <div class="card-stat" v-for="s in stats" :key="s.level">
          <div class="subtitle">Level {{ s.level }}（{{ '★'.repeat(s.level) }}）</div>
          <div style="font-size:20px; font-weight:700;">{{ s.count }}</div>
          <div class="small">占比 {{ s.percent }}%</div>
        </div>
      </div>
      <div class="small">总体：Level 3 为主，Level 4–5 占比约三分之一，适合资深或架构岗考察。</div>
    </section>

    <section class="vstack">
      <div class="subtitle">高频面试专题分组</div>
      <div class="grid cols-2" style="gap:12px;">
        <div v-for="g in groupsFilled" :key="g.title" class="panel pad">
          <div class="hstack between" style="margin-bottom:6px;">
            <div class="title" style="font-size:16px;">{{ g.title }}</div>
            <div class="small">{{ g.ids.length }} 题</div>
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
      <div class="small">展示建议：可做「专题 Tabs + 星级过滤 + Tag 云」，每题支持一键展开要点与参考答案。</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { redis } from '../../data/redis'
import type { Question } from '../../types'

const tableRows = computed<Question[]>(()=> redis)

const stats = computed(()=>{
  const total = redis.length || 1
  const map = new Map<number, number>()
  for(const q of redis){ map.set(q.difficulty, (map.get(q.difficulty)||0)+1) }
  const levels = [1,2,3,4,5]
  return levels.map(l=>({
    level: l,
    count: map.get(l)||0,
    percent: (((map.get(l)||0)/total)*100).toFixed(1)
  }))
})

const groups = [
  { title: '⚙️ 性能与原理', ids: ['redis-1','redis-8','redis-9','redis-14','redis-18','redis-20','redis-29'] },
  { title: '💾 数据结构与存储', ids: ['redis-5','redis-6','redis-13','redis-21','redis-22'] },
  { title: '🧠 分布式与高可用', ids: ['redis-4','redis-7','redis-11','redis-17','redis-19','redis-24','redis-30'] },
  { title: '🧩 一致性与事务', ids: ['redis-3','redis-12','redis-26','redis-27'] },
  { title: '🔒 稳定性与防护', ids: ['redis-2','redis-10','redis-15','redis-16'] },
  { title: '🧰 工程实践', ids: ['redis-23','redis-25','redis-28'] },
]

const byId = new Map(redis.map(q=>[q.id, q] as const))
const groupsFilled = computed(()=> groups.map(g=> ({
  ...g,
  items: g.ids.map(id=> byId.get(id)).filter(Boolean) as Question[],
})))
</script>
