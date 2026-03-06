<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-primary-700 font-bold text-2xl">
          Maturitní Helpdesk
        </NuxtLink>
        <p class="text-gray-500 mt-2 text-sm">Přihlaste se ke svému účtu</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="vas@email.cz"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Heslo</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {{ loading ? 'Přihlašuji...' : 'Přihlásit se' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: false })

useHead({ title: 'Přihlášení | Maturitní Helpdesk' })

const { login } = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Přihlášení se nezdařilo'
  } finally {
    loading.value = false
  }
}
</script>
