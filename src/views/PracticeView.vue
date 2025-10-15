<template>
  <div class="container">
    <div class="grid">
      <header class="hstack between">
        <h1 class="title">🧪 模拟面试工作台</h1>
        <div class="hstack">
          <button class="btn secondary" @click="exportResult">导出结果</button>
          <template v-if="!running">
            <button class="btn primary" @click="start">开始</button>
          </template>
          <template v-else>
            <div class="hstack">
              <button class="btn secondary" @click="pause">暂停</button>
              <button class="btn ghost" @click="reset">重置</button>
            </div>
          </template>
        </div>
      </header>

      <div v-if="!running" class="panel pad">
        <div class="grid cols-2">
          <div>
            <div class="subtitle" style="margin-bottom:8px">选择方向</div>
            <div class="hstack wrap">
              <button
                v-for="t in TRACKS" :key="t.key"
                class="btn"
                :class="{ primary: selectedTracks.includes(t.key) }"
                @click="toggleTrack(t.key)"
              >{{ t.label }}</button>
            </div>
          </div>
          <div class="vstack">
            <div>
              <div class="subtitle" style="margin-bottom:8px">题目数量：{{ questionCount }}</div>
              <input class="input" type="range" min="3" max="15" step="1" v-model.number="questionCount" />
            </div>
            <div class="hstack between">
              <div class="hstack">
                <div class="switch" :data-on="strictTiming" @click="strictTiming = !strictTiming">
                  <div class="knob"></div>
                </div>
                <span class="subtitle">严格计时</span>
              </div>
              <div class="hstack">
                <span class="subtitle">每题秒数</span>
                <input class="number" type="number" min="30" step="30" v-model.number="secondsPerQuestion" style="width: 90px" />
              </div>
            </div>
          </div>
        </div>
        <div class="small" style="margin-top:8px">小贴士：空格键 显示/隐藏参考答案，Enter 提交切换下一题（Shift+Enter 换行）。</div>
      </div>

      <div v-if="running" class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
        <div class="panel pad">
          <div class="hstack between">
            <div class="subtitle">进度 {{ currentIdx }}/{{ questions.length }}</div>
            <div class="subtitle">总用时 {{ fmt(usedSeconds) }}｜本题 {{ fmt(qSeconds) }}<span v-if="strictTiming"> / {{ fmt(secondsPerQuestion) }}</span></div>
          </div>
          <div class="progress" style="margin: 8px 0 16px">
            <span :style="{ width: progress + '%' }"></span>
          </div>

          <template v-if="current">
            <div class="vstack">
              <div class="small">方向：{{ current.track }} · 难度：{{ '★'.repeat(current.difficulty) }}</div>
              <h2 style="font-size: 18px; font-weight: 600; line-height: 1.4;">{{ current.prompt }}</h2>
              <div class="hstack wrap">
                <span class="badge" v-for="t in current.tags" :key="t">#{{ t }}</span>
              </div>
              <textarea
                class="textarea"
                placeholder="作答要点、结构化分点、结合项目经历…"
                v-model="answer"
                @keydown.enter.exact.prevent="handleNext"
              />

              <div class="hstack wrap">
                <div class="hstack">
                  <button v-for="n in 5" :key="n" class="btn" :class="{ primary: (scores[current.id]||0)===n }" @click="handleScore(current.id, n)">⭐ {{ n }}</button>
                </div>
                <button class="btn secondary" @click="showRef = !showRef">{{ showRef ? '隐藏参考' : '显示参考' }}</button>
                <button class="btn primary" @click="handleNext">下一题</button>
              </div>

              <div v-if="showRef" class="panel pad" style="background:#f8fafc;">
                <div class="subtitle" style="font-weight:600; color:#0f172a;">评分要点：</div>
                <ul style="margin:8px 0 0 18px; line-height:1.7;">
                  <li v-for="(p,i) in current.points" :key="i">{{ p }}</li>
                </ul>
                <div class="subtitle" style="margin-top:10px; font-weight:600; color:#0f172a;">参考答案（示例）：</div>
                <div style="white-space: pre-wrap; font-size:14px;">{{ current.answer }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="subtitle">题目加载中…</div>
          </template>
        </div>

        <div class="panel pad">
          <div class="title" style="font-size:16px;">我的数据面板</div>
          <div class="grid cols-2" style="margin-top: 8px; gap:12px;">
            <div class="card-stat">
              <div class="subtitle">平均得分</div>
              <div style="font-size: 20px; font-weight:700;">{{ avgScore }}</div>
            </div>
            <div class="card-stat">
              <div class="subtitle">已用时</div>
              <div style="font-size: 20px; font-weight:700;">{{ fmt(usedSeconds) }}</div>
            </div>
            <div class="card-stat">
              <div class="subtitle">完成题目</div>
              <div style="font-size: 20px; font-weight:700;">{{ Object.keys(answers).length }}/{{ questions.length }}</div>
            </div>
            <div class="card-stat">
              <div class="subtitle">剩余题目</div>
              <div style="font-size: 20px; font-weight:700;">{{ Math.max(questions.length - 1 - currentIdx, 0) }}</div>
            </div>
          </div>
          <div class="subtitle" style="margin-top: 8px;">知识覆盖（出现次数）</div>
          <div class="hstack wrap" style="margin-top: 6px;">
            <template v-if="coverage.length === 0">
              <span class="small">暂无数据</span>
            </template>
            <span v-else class="badge" v-for="(item, idx) in coverage" :key="idx">{{ item[0] }} × {{ item[1] }}</span>
          </div>
          <div class="small" style="margin-top: 8px; line-height:1.6;">
            面试小建议：STAR 法则表述；优先给出 3~5 个要点；量化你的影响（QPS↑、P99↓、成本↓）。
          </div>
        </div>
      </div>

      <div v-if="!running && Object.keys(answers).length > 0" class="panel pad">
        <div class="hstack between">
          <div class="title" style="font-size:16px;">🎯 练习总结</div>
          <button class="btn primary" @click="exportResult">导出 JSON</button>
        </div>
        <div class="grid cols-3" style="margin-top: 8px; gap:12px;">
          <div class="card-stat">
            <div class="subtitle">平均得分</div>
            <div style="font-size: 22px; font-weight:700;">{{ avgScore }}</div>
          </div>
          <div class="card-stat">
            <div class="subtitle">总用时</div>
            <div style="font-size: 22px; font-weight:700;">{{ fmt(usedSeconds) }}</div>
          </div>
          <div class="card-stat">
            <div class="subtitle">完成题目</div>
            <div style="font-size: 22px; font-weight:700;">{{ Object.keys(answers).length }}</div>
          </div>
        </div>
        <div class="subtitle" style="margin-top: 8px;">已保存 {{ Object.keys(answers).length }} 道题的答案与评分，可用于年终述职量化：如“每周 ×2 次模拟面试，近 4 周平均分 {{ avgScore }}，覆盖 5 大方向、20+ 核心知识点”。</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Question, Track } from '../types'
import { redis } from '../data/redis'
import { consul } from '../data/consul'
import { trace } from '../data/trace'
import { perf } from '../data/perf'
import { design } from '../data/design'
import { mysql } from '../data/mysql'
import { distributed } from '../data/distributed'

const route = useRoute()
const initialId = ref<string | null>((route.query.q as string) || null)

const QUESTION_BANK: Question[] = [
  ...redis,
  ...consul,
  ...trace,
  ...perf,
  ...design,
  ...mysql,
  ...distributed,
]

const TRACKS: Track[] = [
  { key: 'Redis', label: 'Redis' },
  { key: 'Consul', label: 'Consul' },
  { key: 'MySQL', label: 'MySQL' },
  { key: '链路追踪', label: '链路追踪' },
  { key: '交易调优', label: '交易调优' },
  { key: '系统设计', label: '系统设计' },
  { key: '分布式系统', label: '分布式系统' },
]

const selectedTracks = ref<string[]>(TRACKS.map(t => t.key))
const questionCount = ref<number>(8)
const strictTiming = ref<boolean>(true)
const secondsPerQuestion = ref<number>(180)
const running = ref<boolean>(false)
const currentIdx = ref<number>(0)
const answer = ref<string>('')
const showRef = ref<boolean>(false)
const scores = reactive<Record<string, number>>({})
const answers = reactive<Record<string, string>>({})
const usedSeconds = ref<number>(0)
const qSeconds = ref<number>(0)
let timer: number | undefined = undefined

function fmt(s: number): string { const m = Math.floor(s/60); const sec = s%60; return `${m}:${String(sec).padStart(2,'0')}` }
function download(filename: string, text: string){
  const el = document.createElement('a')
  el.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(text))
  el.setAttribute('download', filename)
  el.style.display='none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

const pool = computed<Question[]>(()=> QUESTION_BANK.filter(q => selectedTracks.value.includes(q.track)))
const questions = computed<Question[]>(()=> {
  const arr = [...pool.value]
  arr.sort(()=> Math.random() - 0.5)
  if (initialId.value) {
    const idx = arr.findIndex(q => q.id === initialId.value)
    if (idx >= 0) {
      const [hit] = arr.splice(idx, 1)
      arr.unshift(hit)
    }
  }
  return arr.slice(0, questionCount.value)
})
const current = computed<Question|undefined>(()=> questions.value[currentIdx.value])

onMounted(()=>{
  const onKey = (e: KeyboardEvent)=>{
    if(!running.value) return
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); handleNext() }
    else if(e.code === 'Space'){ e.preventDefault(); showRef.value = !showRef.value }
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(()=> window.removeEventListener('keydown', onKey))

  if (initialId.value) {
    if (!running.value) start()
  }
})

watch(() => route.query.q, (q) => {
  const id = (q as string) || null
  if (id && id !== initialId.value) {
    initialId.value = id
    if (!running.value) start()
    else {
      // If already running, jump to that question if present; otherwise next re-shuffle will place it first
      const idx = questions.value.findIndex(q => q.id === id)
      if (idx >= 0) currentIdx.value = idx
    }
  }
})

watch(running, (val: boolean)=>{
  if(val){
    if (timer !== undefined) clearInterval(timer)
    timer = window.setInterval(()=>{ usedSeconds.value++; qSeconds.value++ }, 1000)
  } else {
    if (timer !== undefined) clearInterval(timer)
  }
})

watch([qSeconds, strictTiming, secondsPerQuestion], ([qs, st, spq]: [number, boolean, number])=>{
  if(st && qs >= spq){ handleNext() }
})

function start(){
  running.value = true
  currentIdx.value = 0
  usedSeconds.value = 0
  qSeconds.value = 0
  Object.keys(answers).forEach(k=> delete answers[k])
  Object.keys(scores).forEach(k=> delete scores[k])
  showRef.value = false
  answer.value = ''
}
function pause(){ running.value = false }
function reset(){
  running.value = false
  currentIdx.value = 0
  usedSeconds.value = 0
  qSeconds.value = 0
  Object.keys(answers).forEach(k=> delete answers[k])
  Object.keys(scores).forEach(k=> delete scores[k])
  showRef.value = false
  answer.value = ''
}
function handleNext(){
  const cur = current.value
  if(!cur) return
  const nextIdx = currentIdx.value + 1
  answers[cur.id] = answer.value
  answer.value = ''
  showRef.value = false
  qSeconds.value = 0
  if(nextIdx < questions.value.length){ currentIdx.value = nextIdx } else { running.value = false }
}
function handleScore(id: string, val: number){ scores[id] = val }

const progress = computed<number>(()=> questions.value.length ? Math.round((currentIdx.value / questions.value.length) * 100) : 0)
const avgScore = computed<string|number>(()=>{
  const vals = Object.values(scores)
  if(!vals.length) return 0
  return (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)
})
const coverage = computed<[string, number][]>(()=>{
  const tagCount = new Map()
  const answeredIds = new Set(Object.keys(answers))
  questions.value.filter(q=> answeredIds.has(q.id)).forEach(q=> q.tags.forEach(t=> tagCount.set(t, (tagCount.get(t)||0)+1)))
  return [...tagCount.entries()].sort((a,b)=> b[1]-a[1]).slice(0,10)
})

function exportResult(){
  const payload = {
    startedAt: new Date().toISOString(),
    strictTiming: strictTiming.value,
    secondsPerQuestion: secondsPerQuestion.value,
    totalUsedSeconds: usedSeconds.value,
    avgScore: avgScore.value,
    questions: questions.value.map(q=> ({ id:q.id, track:q.track, prompt:q.prompt, answer: answers[q.id]||'', score: scores[q.id]||0, tags: q.tags }))
  }
  download(`mock-interview-${Date.now()}.json`, JSON.stringify(payload, null, 2))
}

function toggleTrack(key: string){
  const set = new Set(selectedTracks.value)
  if (set.has(key)) {
    set.delete(key)
  } else {
    set.add(key)
  }
  selectedTracks.value = Array.from(set)
}
</script>
