<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div v-if="pending" class="text-gray-400">Načítám...</div>
    <div v-else-if="error" class="text-center py-20">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Okruh nenalezen</h1>
      <NuxtLink to="/materialy" class="text-primary-600 hover:underline text-sm">← Zpět na materiály</NuxtLink>
    </div>
    <div v-else-if="topic">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-primary-600">Domů</NuxtLink>
        <span>/</span>
        <NuxtLink to="/materialy" class="hover:text-primary-600">Materiály</NuxtLink>
        <span>/</span>
        <span class="text-gray-900">{{ topic.title }}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main content -->
        <article class="flex-1 min-w-0">
          <div class="mb-6">
            <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              {{ topic.category?.name }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ topic.title }}</h1>
          <p v-if="topic.summary" class="text-gray-500 text-lg leading-relaxed mb-8 border-l-4 border-primary-200 pl-4">
            {{ topic.summary }}
          </p>
          <div class="topic-content prose max-w-none" v-html="topic.content" />
        </article>

        <!-- TOC sidebar -->
        <aside v-if="headings.length" class="lg:w-64 flex-shrink-0">
          <div class="sticky top-24 bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Obsah</div>
            <ul class="space-y-1.5">
              <li v-for="h in headings" :key="h.id">
                <a
                  :href="`#${h.id}`"
                  class="block text-sm text-gray-600 hover:text-primary-600 transition-colors leading-snug"
                  :class="{ 'pl-3 text-xs': h.level === 3 }"
                >
                  {{ h.text }}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div class="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
        <NuxtLink to="/materialy" class="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na materiály
        </NuxtLink>
        <span class="text-xs text-gray-400">
          Aktualizováno: {{ formatDate(topic.updatedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: topic, pending, error } = await useFetch(`/api/topics/${slug}`)

useHead(() => ({
  title: topic.value ? `${topic.value.title} | Maturitní Helpdesk` : 'Maturitní Helpdesk',
}))

interface Heading { id: string; text: string; level: number }

const headings = computed<Heading[]>(() => {
  if (!topic.value?.content) return []
  const matches = [...topic.value.content.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h\d>/g)]
  return matches.map(m => ({ level: Number(m[1]), id: m[2], text: m[3] }))
})

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('cs-CZ')
}
</script>
