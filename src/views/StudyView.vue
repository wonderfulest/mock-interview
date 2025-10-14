<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">题库 · 按知识点索引</h2>
      <router-link class="btn" to="/">返回主页</router-link>
    </div>
    <div class="grid cols-2">
      <div v-for="t in tracks" :key="t.key" class="panel pad">
        <div class="vstack" style="gap:8px;">
          <div class="title" style="font-size:18px;">{{ t.label }}</div>
          <div class="subtitle">按方向浏览题库索引与专题</div>
          <div class="hstack">
            <router-link :to="t.path" class="btn primary">进入 {{ t.label }} 索引</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const tracks = [
  { key: 'mysql', label: 'MySQL', path: '/index/mysql' },
  { key: 'redis', label: 'Redis', path: '/index/redis' },
  { key: 'consul', label: 'Consul', path: '/index/consul' },
  { key: 'trace', label: '链路追踪', path: '/index/trace' },
  { key: 'perf', label: '交易调优', path: '/index/perf' },
  { key: 'design', label: '系统设计', path: '/index/design' },
]
</script>
