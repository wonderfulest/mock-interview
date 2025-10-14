<template>
  <div class="container">
    <div class="grid">
      <header class="hstack between">
        <h1 class="title">🧪 模拟面试</h1>
        <div class="hstack">
          <router-link to="/" class="btn">主页</router-link>
          <router-link to="/study" class="btn">题库</router-link>
          <router-link to="/practice" class="btn primary">模拟面试</router-link>
        </div>
      </header>

      <div class="panel pad">
        <router-view />
      </div>

      <footer class="small" style="text-align:center; padding-bottom: 8px;">© Mock Interview · 本地运行 · 不上传数据</footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>
