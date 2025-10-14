<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">📑 模拟考试</h2>
      <router-link class="btn" to="/practice">切换到练习</router-link>
    </div>

    <div v-if="!running" class="vstack">
      <div class="grid cols-2">
        <div>
          <div class="subtitle" style="margin-bottom:8px">选择方向</div>
          <div class="hstack wrap">
            <button v-for="t in TRACKS" :key="t.key" class="btn" :class="{ primary: selectedTracks.includes(t.key) }" @click="toggleTrack(t.key)">{{ t.label }}</button>
          </div>
        </div>
        <div class="vstack">
          <div>
            <div class="subtitle" style="margin-bottom:8px">题目数量：{{ questionCount }}</div>
            <input class="input" type="range" min="5" max="20" step="1" v-model.number="questionCount" />
          </div>
          <div class="hstack between">
            <div class="subtitle">严格计时（固定开启）</div>
            <div class="hstack">
              <span class="subtitle">每题秒数</span>
              <input class="number" type="number" min="60" step="30" v-model.number="secondsPerQuestion" style="width: 90px" />
            </div>
          </div>
        </div>
      </div>
      <div class="hstack">
        <button class="btn primary" @click="start">开始考试</button>
      </div>
      <div class="small">说明：考试模式不显示参考答案与评分，结束后提供总结。</div>
    </div>

    <div v-else class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
      <div class="panel pad">
        <div class="hstack between">
          <div class="subtitle">进度 {{ currentIdx }}/{{ questions.length }}</div>
          <div class="subtitle">总用时 {{ fmt(usedSeconds) }}｜本题 {{ fmt(qSeconds) }} / {{ fmt(secondsPerQuestion) }}</div>
        </div>
        <div class="progress" style="margin: 8px 0 16px">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <template v-if="current">
          <div class="vstack">
            <div class="small">方向：{{ current.track }} · 难度：{{ '★'.repeat(current.difficulty) }}</div>
            <h2 style="font-size: 18px; font-weight: 600; line-height: 1.4;">{{ current.prompt }}</h2>
            <textarea class="textarea" placeholder="请作答…（Shift+Enter换行）" v-model="answer" @keydown.enter.exact.prevent="handleNext" />
            <div class="hstack">
              <button class="btn primary" @click="handleNext">下一题</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="subtitle">题目加载中…</div>
        </template>
      </div>

      <div class="panel pad">
        <div class="title" style="font-size:16px;">考试信息</div>
        <div class="grid cols-2" style="margin-top: 8px; gap:12px;">
          <div class="card-stat">
            <div class="subtitle">已用时</div>
            <div style="font-size: 20px; font-weight:700;">{{ fmt(usedSeconds) }}</div>
          </div>
          <div class="card-stat">
            <div class="subtitle">完成题目</div>
            <div style="font-size: 20px; font-weight:700;">{{ Object.keys(answers).length }}/{{ questions.length }}</div>
          </div>
        </div>
        <div class="small" style="margin-top: 8px;">考试模式不可查看参考与打分，请专注作答。</div>
      </div>
    </div>

    <div v-if="!running && Object.keys(answers).length > 0" class="panel pad">
      <div class="hstack between">
        <div class="title" style="font-size:16px;">🎯 考试总结</div>
        <button class="btn primary" @click="exportResult">导出 JSON</button>
      </div>
      <div class="grid cols-3" style="margin-top: 8px; gap:12px;">
        <div class="card-stat">
          <div class="subtitle">总用时</div>
          <div style="font-size: 22px; font-weight:700;">{{ fmt(usedSeconds) }}</div>
        </div>
        <div class="card-stat">
          <div class="subtitle">完成题目</div>
          <div style="font-size: 22px; font-weight:700;">{{ Object.keys(answers).length }}</div>
        </div>
        <div class="card-stat">
          <div class="subtitle">方向覆盖</div>
          <div style="font-size: 22px; font-weight:700;">{{ coveredTracks.size }}</div>
        </div>
      </div>
      <div class="small">建议：复盘薄弱知识点，整理答题框架；下次可切换到练习模式查看参考答案与要点。</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import type { Question, Track } from '../types'
import { redis } from '../data/redis'
import { consul } from '../data/consul'
import { trace } from '../data/trace'
import { perf } from '../data/perf'
import { design } from '../data/design'

const QUESTION_BANK: Question[] = [ ...redis, ...consul, ...trace, ...perf, ...design ]
const TRACKS: Track[] = [
  { key: 'Redis', label: 'Redis' },
  { key: 'Consul', label: 'Consul' },
  { key: '链路追踪', label: '链路追踪' },
  { key: '交易调优', label: '交易调优' },
  { key: '系统设计', label: '系统设计' },
]

const selectedTracks = ref<string[]>(TRACKS.map(t => t.key))
const questionCount = ref<number>(10)
const secondsPerQuestion = ref<number>(150)
const running = ref<boolean>(false)
const currentIdx = ref<number>(0)
const answer = ref<string>('')
const answers = reactive<Record<string, string>>({})
const usedSeconds = ref<number>(0)
const qSeconds = ref<number>(0)
let timer: number | undefined

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
  return arr.slice(0, questionCount.value)
})
const current = computed<Question|undefined>(()=> questions.value[currentIdx.value])

onMounted(()=>{
  const onKey = (e: KeyboardEvent)=>{
    if(!running.value) return
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); handleNext() }
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(()=> window.removeEventListener('keydown', onKey))
})

watch(running, (val: boolean)=>{
  if(val){
    if (timer !== undefined) clearInterval(timer)
    timer = window.setInterval(()=>{ usedSeconds.value++; qSeconds.value++ }, 1000)
  } else {
    if (timer !== undefined) clearInterval(timer)
  }
})

watch([qSeconds, secondsPerQuestion], ([qs, spq]: [number, number])=>{
  if(qs >= spq){ handleNext() }
})

function start(){
  running.value = true
  currentIdx.value = 0
  usedSeconds.value = 0
  qSeconds.value = 0
  Object.keys(answers).forEach(k=> delete answers[k])
  answer.value = ''
}
function handleNext(){
  const cur = current.value
  if(!cur) return
  const nextIdx = currentIdx.value + 1
  answers[cur.id] = answer.value
  answer.value = ''
  qSeconds.value = 0
  if(nextIdx < questions.value.length){ currentIdx.value = nextIdx } else { running.value = false }
}

const progress = computed<number>(()=> questions.value.length ? Math.round((currentIdx.value / questions.value.length) * 100) : 0)
const coveredTracks = computed(()=> new Set(questions.value.map(q=> q.track)))

function exportResult(){
  const payload = {
    startedAt: new Date().toISOString(),
    mode: 'exam',
    secondsPerQuestion: secondsPerQuestion.value,
    totalUsedSeconds: usedSeconds.value,
    questions: questions.value.map(q=> ({ id:q.id, track:q.track, prompt:q.prompt, answer: answers[q.id]||'', tags: q.tags }))
  }
  download(`mock-exam-${Date.now()}.json`, JSON.stringify(payload, null, 2))
}

function toggleTrack(key: string){
  const set = new Set(selectedTracks.value)
  if (set.has(key)) set.delete(key); else set.add(key)
  selectedTracks.value = Array.from(set)
}
</script>
