<template>
  <div class="space-y-8">
    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="text-3xl font-bold text-primary-700 tabular-nums">
          {{ stat.value ?? '…' }}
        </div>
        <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Quick links -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Rychlé akce</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/admin/topics"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Přidat okruh
        </NuxtLink>
        <NuxtLink to="/admin/deadlines"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          + Přidat termín
        </NuxtLink>
        <NuxtLink to="/admin/faq"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          + Přidat FAQ
        </NuxtLink>
        <NuxtLink to="/" target="_blank"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Zobrazit web ↗
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin – Přehled | Maturitní Helpdesk' })

const { data: topics } = await useFetch('/api/admin/topics')
const { data: deadlines } = await useFetch('/api/admin/deadlines')
const { data: faqs } = await useFetch('/api/admin/faq')
const { data: users } = await useFetch('/api/admin/users')

const stats = computed(() => [
  { label: 'Okruhů', value: (topics.value as any[])?.length },
  { label: 'Termínů', value: (deadlines.value as any[])?.length },
  { label: 'FAQ položek', value: (faqs.value as any[])?.length },
  { label: 'Uživatelů', value: (users.value as any[])?.length },
])
</script>
