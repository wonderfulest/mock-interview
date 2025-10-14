<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">📘 MySQL 题库索引</h2>
      <div class="hstack">
        <router-link class="btn" to="/practice">开始练习</router-link>
        <router-link class="btn" to="/study">返回题库</router-link>
      </div>
    </div>

    <section class="vstack">
      <div class="subtitle">题目索引表（{{ tableRows.length }}）</div>
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
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { mysql } from '../../data/mysql'
import type { Question } from '../../types'

const tableRows = computed<Question[]>(() => mysql)

const stats = computed(() => {
  const total = mysql.length || 1
  const map = new Map<number, number>()
  for (const q of mysql) map.set(q.difficulty, (map.get(q.difficulty) || 0) + 1)
  const levels = [1, 2, 3, 4, 5]
  return levels.map((l) => ({
    level: l,
    count: map.get(l) || 0,
    percent: (((map.get(l) || 0) / total) * 100).toFixed(1),
  }))
})

const groups = [
  { title: '🔎 索引与执行计划', ids: ['mysql-1','mysql-4','mysql-9','mysql-10','mysql-11','mysql-20'] },
  { title: '🔒 事务与锁/MVCC', ids: ['mysql-3','mysql-6','mysql-7'] },
  { title: '🧱 存储引擎与日志', ids: ['mysql-8','mysql-13','mysql-14'] },
  { title: '⚡ 性能优化与慢查询', ids: ['mysql-15','mysql-16','mysql-18','mysql-19'] },
  { title: '🔁 复制与高可用', ids: ['mysql-17','mysql-5'] },
  { title: '🧰 工程实践/其他', ids: ['mysql-2','mysql-12'] },
]

const byId = new Map(mysql.map(q => [q.id, q] as const))
const groupsFilled = computed(() => groups.map(g => ({
  ...g,
  items: g.ids.map(id => byId.get(id)).filter(Boolean) as Question[],
})))
</script>
