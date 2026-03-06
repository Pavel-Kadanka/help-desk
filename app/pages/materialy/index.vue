<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Maturitní okruhy</h1>
      <p class="text-gray-500 mt-2">Studijní materiály pro přípravu na maturitní zkoušku z IVT</p>
    </div>

    <!-- Category filter -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        @click="activeCategory = null"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeCategory === null ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        Vše
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="activeCategory = cat.slug"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeCategory === cat.slug ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ cat.name }}
        <span class="ml-1 opacity-60">({{ cat._count?.topics ?? 0 }})</span>
      </button>
    </div>

    <!-- Topics list -->
    <div v-if="pending" class="text-gray-400">Načítám...</div>
    <div v-else-if="!filteredTopics.length" class="text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Zatím žádné materiály
    </div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink
        v-for="topic in filteredTopics"
        :key="topic.id"
        :to="`/materialy/${topic.slug}`"
        class="group bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-400 hover:shadow-md transition-all flex flex-col gap-3"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {{ topic.category?.name }}
          </span>
          <span class="text-xs text-gray-400">#{{ topic.sortOrder }}</span>
        </div>
        <h3 class="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug">
          {{ topic.title }}
        </h3>
        <p v-if="topic.summary" class="text-gray-500 text-sm line-clamp-3 flex-1">{{ topic.summary }}</p>
        <div class="flex items-center text-primary-600 text-sm font-medium mt-auto">
          Číst materiál
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Materiály | Maturitní Helpdesk' })

const activeCategory = ref<string | null>(null)

const { data: categories } = await useFetch('/api/categories')
const { data: topics, pending } = await useFetch('/api/topics')

const filteredTopics = computed(() => {
  if (!topics.value) return []
  if (!activeCategory.value) return topics.value
  return topics.value.filter((t: any) => t.category?.slug === activeCategory.value)
})
</script>
