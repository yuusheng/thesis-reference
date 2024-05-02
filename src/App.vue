<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import abstract from './abstract.json'

const $toast = useToast()
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

const total = abstract
  .map(v => [v.title, ...v.reference.map(r => r.title)])
  .flat(Number.POSITIVE_INFINITY)
  .filter(a => !(a as string).startsWith('['))
  .length

function copyToClickBoard(content: string) {
  navigator.clipboard.writeText(content)
  $toast.success('复制到剪贴板', {
    position: 'top',
  })
}

const showFlat = ref(false)
const abstractData = computed(() => {
  return showFlat.value
    ? abstract.map(v => [{ title: v.title, abstract: v.abstract }, ...v.reference])
      .flat(Number.POSITIVE_INFINITY)
      .filter(a => !((a as any).title).startsWith('[')) as typeof abstract
    : abstract
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

      <label class="inline-flex items-center cursor-pointer">
        <input v-model="showFlat" type="checkbox" class="sr-only peer">
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ showFlat ? '扁平' : '树状' }}</span>
      </label>
      除当前已引用合计： {{ total }}
    </div>
    <div v-for="(article, index) of abstractData" :key="article.title" class="mx-auto max-w-230">
      <h2 :class="{ 'text-base': showFlat, 'font-bold color-red': article.title.startsWith('*') }">
        {{ `${index + 1}. ` }}{{ article.title }}
        <button
          v-if="article.abstract.quote"
          type="button"
          class="text-white bg-gradient-to-r border-none outline-none from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-1 text-center"
          @click="copyToClickBoard(article.abstract.quote)"
        >
          引用
        </button>
      </h2>
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
            target="_blank"
          >
            原文
          </a>
          <button
            v-if="subAbstract.abstract.quote"
            type="button"
            class="text-white bg-gradient-to-r border-none outline-none from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-4 py-1 text-center"
            @click="copyToClickBoard(subAbstract.abstract.quote)"
          >
            引用
          </button>
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
