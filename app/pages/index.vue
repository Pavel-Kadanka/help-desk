<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-primary-700 to-primary-500 text-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">Maturitní Helpdesk</h1>
        <p class="text-primary-100 text-lg mb-8">Studijní materiály a příprava na maturitu z IVT</p>

        <!-- Countdown -->
        <div class="inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-2xl px-8 py-5">
          <template v-for="part in countdown" :key="part.label">
            <div class="text-center">
              <div class="text-4xl font-bold tabular-nums">{{ String(part.value).padStart(2, '0') }}</div>
              <div class="text-primary-200 text-xs mt-1 uppercase tracking-wide">{{ part.label }}</div>
            </div>
            <div v-if="part.label !== 'Sekund'" class="text-primary-300 text-2xl font-light">:</div>
          </template>
        </div>
        <p class="text-primary-200 text-sm mt-3">do ústních zkoušek ({{ maturitaDate }})</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <!-- Deadlines -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Nadcházející termíny</h2>
        <div v-if="deadlinesPending" class="text-gray-400">Načítám...</div>
        <div v-else-if="!deadlines?.length" class="text-gray-400">Žádné termíny</div>
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="d in upcomingDeadlines"
            :key="d.id"
            class="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 items-start"
          >
            <div class="flex-shrink-0 text-center bg-primary-50 rounded-lg px-3 py-2 min-w-14">
              <div class="text-xl font-bold text-primary-700">{{ formatDay(d.dueDate) }}</div>
              <div class="text-xs text-primary-500 uppercase">{{ formatMonth(d.dueDate) }}</div>
            </div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">{{ d.title }}</div>
              <div v-if="d.description" class="text-gray-500 text-xs mt-1 line-clamp-2">{{ d.description }}</div>
              <div :class="['text-xs mt-2 font-medium', daysLeft(d.dueDate) <= 7 ? 'text-red-600' : daysLeft(d.dueDate) <= 30 ? 'text-amber-600' : 'text-gray-400']">
                {{ daysLeft(d.dueDate) > 0 ? `Za ${daysLeft(d.dueDate)} dní` : 'Dnes!' }}
              </div>
            </div>
          </div>
        </div>
        <NuxtLink v-if="(deadlines?.length ?? 0) > 3" to="/" class="text-sm text-primary-600 hover:underline mt-3 inline-block">
          Zobrazit vše
        </NuxtLink>
      </section>

      <!-- Topics quick links -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Maturitní okruhy</h2>
          <NuxtLink to="/materialy" class="text-sm text-primary-600 hover:underline">Zobrazit vše →</NuxtLink>
        </div>
        <div v-if="topicsPending" class="text-gray-400">Načítám...</div>
        <div v-else-if="!topics?.length" class="text-gray-400">Zatím žádné materiály</div>
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="topic in topics?.slice(0, 6)"
            :key="topic.id"
            :to="`/materialy/${topic.slug}`"
            class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-400 hover:shadow-sm transition-all group"
          >
            <div class="text-xs text-primary-600 font-medium mb-1">{{ topic.category?.name }}</div>
            <div class="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{{ topic.title }}</div>
            <div v-if="topic.summary" class="text-gray-500 text-sm mt-2 line-clamp-2">{{ topic.summary }}</div>
          </NuxtLink>
        </div>
      </section>

      <!-- FAQ -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Časté dotazy</h2>
        <div v-if="faqPending" class="text-gray-400">Načítám...</div>
        <div v-else-if="!faqs?.length" class="text-gray-400">Žádné FAQ</div>
        <div v-else class="space-y-3">
          <details
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden group"
          >
            <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between list-none">
              {{ faq.question }}
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const maturitaDate = config.public.maturitaDate as string

const { data: deadlines, pending: deadlinesPending } = await useFetch('/api/deadlines')
const { data: topics, pending: topicsPending } = await useFetch('/api/topics')
const { data: faqs, pending: faqPending } = await useFetch('/api/faq')

const upcomingDeadlines = computed(() => {
  if (!deadlines.value) return []
  const now = new Date()
  return deadlines.value.filter((d: any) => new Date(d.dueDate) >= now).slice(0, 6)
})

function formatDay(date: string) {
  return new Date(date).getDate()
}
function formatMonth(date: string) {
  return new Date(date).toLocaleString('cs-CZ', { month: 'short' })
}
function daysLeft(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Countdown
const countdown = ref([
  { label: 'Dní', value: 0 },
  { label: 'Hodin', value: 0 },
  { label: 'Minut', value: 0 },
  { label: 'Sekund', value: 0 },
])

function updateCountdown() {
  const target = new Date(maturitaDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  countdown.value = [
    { label: 'Dní', value: Math.floor(diff / 86400000) },
    { label: 'Hodin', value: Math.floor((diff % 86400000) / 3600000) },
    { label: 'Minut', value: Math.floor((diff % 3600000) / 60000) },
    { label: 'Sekund', value: Math.floor((diff % 60000) / 1000) },
  ]
}

let timer: ReturnType<typeof setInterval>
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
