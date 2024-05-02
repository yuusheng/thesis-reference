<script setup lang="ts">
import { computed, reactive } from 'vue'
import abstract from './abstract.json'

const lang = reactive(new Set('en'))
const showEn = computed({
  get: () => lang.has('en'),
  set: (v) => {
    v
      ? lang.add('en')
      : lang.delete('en')
  },
})
const showZh = computed({
  get: () => lang.has('zh'),
  set: (v) => {
    v
      ? lang.add('zh')
      : lang.delete('zh')
  },
})
</script>

<template>
  <main class="py-10">
    <div class="flex items-center mb-4 gap-5">
      <div class="flex items-center">
        <input
          id="chinese-checkbox"
          v-model="showZh"
          type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        >
        <label for="chinese-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">中文摘要</label>
      </div>
      <div class="flex items-center">
        <input
          id="english-checkbox" v-model="showEn" type="checkbox"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        >
        <label for="english-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">英文摘要</label>
      </div>
    </div>
    <div v-for="article of abstract" :key="article.title" class="mx-auto max-w-250">
      <h2>{{ article.title }}</h2>
      <p v-show="showEn">
        {{ article.abstract.en }}
      </p>
      <p v-show="showZh">
        {{ article.abstract.zh }}
      </p>
      <strong v-if="article.reference?.length">References:</strong>
      <div v-for="(subAbstract, index) in article.reference" :key="subAbstract.title" class="pl-10">
        <h3>
          {{ index + 1 }}. {{ subAbstract.title }}
          <a
            v-if="subAbstract.abstract.url"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            :href="subAbstract.abstract.url"
          >
            link
          </a>
        </h3>

        <p v-show="showEn">
          {{ subAbstract.abstract.en }}
        </p>
        <p v-show="showZh">
          {{ subAbstract.abstract.zh }}
        </p>
      </div>
    </div>
  </main>
</template>
