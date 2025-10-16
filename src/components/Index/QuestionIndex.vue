<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">{{ title }}</h2>
      <div class="hstack">
        <slot name="header-actions">
          <router-link class="btn" to="/practice">开始练习</router-link>
          <router-link v-if="showStudy" class="btn" to="/study">返回题库</router-link>
        </slot>
      </div>
    </div>

    <section v-if="rows.length" class="vstack">
      <div class="subtitle">题目索引表（{{ rows.length }}）</div>
      <div class="panel" style="overflow:auto; border-radius:12px;">
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          <thead>
            <tr style="text-align:left; background:#f8fafc;">
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">编号</th>
              <th class="col-difficulty" style="padding:10px 12px; border-bottom:1px solid var(--border);">难度</th>
              <th class="col-tags" style="padding:10px 12px; border-bottom:1px solid var(--border);">标签</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--border);">题目</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in rows" :key="q.id" style="border-top:1px solid var(--border);">
              <td style="padding:10px 12px; white-space:nowrap;">
                <router-link :to="{ path: '/practice', query: { q: q.id } }" class="kbd">{{ q.id }}</router-link>
              </td>
              <td class="col-difficulty" style="padding:10px 12px;">{{ '★'.repeat(q.difficulty) }}</td>
              <td class="col-tags" style="padding:10px 12px;">
                <span v-for="t in q.tags" :key="t" class="badge" style="margin-right:6px;">#{{ t }}</span>
              </td>
              <td style="padding:10px 12px;">
                <div class="vstack" style="gap:6px;">
                  <div class="hstack between mobile-line">
                    <div class="prompt" style="font-size:14px;">{{ q.prompt }}</div>
                    <button class="btn" @click="toggle(q.id)">{{ isShown(q.id) ? '隐藏参考' : '显示参考' }}</button>
                  </div>
                  <div v-if="isShown(q.id)" class="small answer" style="color:#334155;">
                    <div v-for="(line, idx) in splitAnswer(q.answer)" :key="idx">{{ idx + 1 }}. {{ line }}</div>
                    <div v-if="q.analysis" style="margin-top:6px;">
                      <div v-for="(line, idx) in splitAnswer(q.analysis)" :key="'a-'+idx">{{ idx + 1 }}. {{ line }}</div>
                    </div>
                  </div>
                </div>
              </td>
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
            <div v-for="q in g.items" :key="q.id" class="vstack" style="gap:6px; padding:6px 0;">
              <div class="hstack between mobile-line">
                <div class="hstack" style="gap:8px;">
                  <router-link :to="{ path: '/practice', query: { q: q.id } }" class="kbd">{{ q.id }}</router-link>
                  <span class="small">{{ '★'.repeat(q.difficulty) }}</span>
                </div>
                <div class="prompt" style="flex:1; margin-left:8px; font-size:14px;">{{ q.prompt }}</div>
                <button class="btn" @click="toggle(q.id)">{{ isShown(q.id) ? '隐藏参考' : '显示参考' }}</button>
              </div>
              <div v-if="isShown(q.id)" class="small answer" style="color:#334155; margin-left:40px;">
                <div v-for="(line, idx) in splitAnswer(q.answer)" :key="idx">{{ idx + 1 }}. {{ line }}</div>
                <div v-if="q.analysis" style="margin-top:6px;">
                  <div v-for="(line, idx) in splitAnswer(q.analysis)" :key="'a-'+idx">{{ idx + 1 }}. {{ line }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Question } from '../../types'

interface GroupPreset { title: string; ids: string[] }

const props = defineProps<{
  title: string
  rows: Question[]
  preset?: GroupPreset[]
  showStudy?: boolean
}>()

const showStudy = computed(()=> props.showStudy !== false)

const stats = computed(() => {
  const total = props.rows.length || 1
  const map = new Map<number, number>()
  for (const q of props.rows) map.set(q.difficulty, (map.get(q.difficulty) || 0) + 1)
  const levels = [1, 2, 3, 4, 5]
  return levels.map((l) => ({
    level: l,
    count: map.get(l) || 0,
    percent: (((map.get(l) || 0) / total) * 100).toFixed(1),
  }))
})

const groupsFilled = computed(() => {
  const list = props.rows
  if (!list.length) return [] as { title: string; items: Question[] }[]

  const byId = new Map(list.map(q => [q.id, q] as const))

  if (props.preset && props.preset.length) {
    return props.preset.map(g => ({
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

const splitAnswer = (text: string): string[] => {
  if (!text) return []
  const byLine = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (byLine.length > 1) return byLine
  const byPunct = text.split(/[；;。]/).map(s => s.trim()).filter(Boolean)
  return byPunct.length ? byPunct : [text]
}

const shown = ref(new Set<string>())
const toggle = (id: string) => {
  const s = shown.value
  if (s.has(id)) s.delete(id)
  else s.add(id)
}
const isShown = (id: string) => shown.value.has(id)
</script>

<style scoped>
@media (max-width: 640px) {
  .grid.cols-3,
  .grid.cols-2 { grid-template-columns: 1fr !important; }

  table { font-size: 12px; }
  th, td { padding: 8px 10px !important; }

  .col-difficulty,
  .col-tags { display: none; }

  .btn { padding: 4px 8px; font-size: 12px; }

  .mobile-line { flex-wrap: wrap; gap: 6px; }
  .mobile-line .prompt { flex-basis: 100%; margin-left: 0 !important; }
  .answer { margin-left: 0 !important; }
}
</style>
