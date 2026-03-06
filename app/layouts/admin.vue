<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30">
      <div class="px-6 py-5 border-b border-gray-200">
        <NuxtLink to="/" class="flex items-center gap-2 text-primary-700 font-bold text-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Maturitní Helpdesk
        </NuxtLink>
        <span class="text-xs text-gray-400 mt-1 block">Administrace</span>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === item.to
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="px-3 py-4 border-t border-gray-200">
        <div class="px-3 py-2 text-xs text-gray-500 mb-1">{{ user?.name }}</div>
        <button
          @click="logout"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Odhlásit se
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
        <NuxtLink to="/" class="text-sm text-primary-600 hover:underline">← Zpět na web</NuxtLink>
      </header>
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

const { user, logout } = useAuth()
const route = useRoute()

const pageTitle = computed(() => {
  const item = navItems.find(n => n.to === route.path)
  return item?.label ?? 'Admin'
})

function IconGrid(props: any) {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
    })
  )
}
function IconBook(props: any) {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    })
  )
}
function IconClock(props: any) {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    })
  )
}
function IconQuestion(props: any) {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  )
}
function IconUsers(props: any) {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    })
  )
}

const navItems = [
  { to: '/admin', label: 'Přehled', icon: IconGrid },
  { to: '/admin/topics', label: 'Okruhy', icon: IconBook },
  { to: '/admin/deadlines', label: 'Termíny', icon: IconClock },
  { to: '/admin/faq', label: 'FAQ', icon: IconQuestion },
  { to: '/admin/users', label: 'Uživatelé', icon: IconUsers },
]
</script>
