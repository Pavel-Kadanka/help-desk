<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-700">
          Maturitní Helpdesk
        </NuxtLink>

        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
            Domů
          </NuxtLink>
          <NuxtLink to="/materialy" class="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
            Materiály
          </NuxtLink>

          <template v-if="isLoggedIn">
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
            >
              Admin
            </NuxtLink>
            <div class="relative">
              <button
                @click="menuOpen = !menuOpen"
                class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                  {{ user?.name?.charAt(0).toUpperCase() }}
                </div>
                <span class="hidden sm:block">{{ user?.name }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-if="menuOpen"
                class="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              >
                <div class="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">{{ user?.email }}</div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Odhlásit se
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Přihlásit se
            </NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        © {{ new Date().getFullYear() }} Maturitní Helpdesk &mdash; Hodně štěstí u maturity!
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, isAdmin, logout } = useAuth()
const menuOpen = ref(false)

async function handleLogout() {
  menuOpen.value = false
  await logout()
}
</script>
