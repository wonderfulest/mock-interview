<template>
  <div>
    <div v-if="!rows.length" class="subtitle">暂无该方向题库</div>
    <QuestionIndex v-else :title="title" :rows="rows" :preset="preset" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Question } from '../types'
import QuestionIndex from '../components/Index/QuestionIndex.vue'
import { indexDatasets } from '../data/index-datasets'
import { indexPresets as presets } from '../data/index-presets'

const props = defineProps<{ track?: string }>()
const route = useRoute()
const trackKey = computed(()=> String(props.track || route.params.track || ''))

const info = computed(()=> indexDatasets[trackKey.value])
const rows = computed<Question[]>(()=> info.value ? info.value.data : [])
const title = computed(()=> info.value ? `${info.value.label} 题库索引` : '题库索引')
const preset = computed(()=> presets[trackKey.value] || undefined)
</script>
<!-- Styles are provided by the shared QuestionIndex component -->
