<template>
  <div class="vstack" style="gap:16px;">
    <div class="hstack between">
      <h2 class="title">主页</h2>
    </div>
    <div class="grid cols-2">
      <div class="panel pad">
        <div class="vstack" style="gap:10px;">
          <div class="title" style="font-size:18px;">题库</div>
          <div class="subtitle">按知识点浏览题库索引，系统复习巩固</div>
          <div class="hstack">
            <router-link to="/study" class="btn primary">进入题库</router-link>
          </div>
        </div>
      </div>
      <div class="panel pad">
        <div class="vstack" style="gap:10px;">
          <div class="title" style="font-size:18px;">模拟面试</div>
          <div class="subtitle">定时抽题、作答与评分，导出结果</div>
          <div class="hstack">
            <router-link to="/practice" class="btn primary">进入模拟面试</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>
