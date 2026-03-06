<template>
  <div class="space-y-6">
    <!-- List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Otázka</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Odpověď</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stav</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending"><td colspan="5" class="py-8 text-center text-gray-400">Načítám…</td></tr>
          <tr v-else-if="!faqs?.length"><td colspan="5" class="py-8 text-center text-gray-400">Žádné FAQ</td></tr>
          <tr v-for="faq in faqs" :key="faq.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-gray-400 w-10">{{ faq.sortOrder }}</td>
            <td class="px-6 py-4 font-medium text-gray-900 max-w-xs">{{ faq.question }}</td>
            <td class="px-6 py-4 text-gray-500 max-w-sm truncate">{{ faq.answer }}</td>
            <td class="px-6 py-4">
              <span :class="faq.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="px-2.5 py-1 rounded-full text-xs font-medium">
                {{ faq.published ? 'Aktivní' : 'Skryto' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="deleteFaq(faq.id)" class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Smazat</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add form -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Přidat FAQ položku</h2>
      <div v-if="formError" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ formError }}</div>
      <form @submit.prevent="addFaq" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Otázka *</label>
          <input v-model="form.question" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Odpověď *</label>
          <textarea v-model="form.answer" rows="3" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div class="flex items-center gap-2">
          <input id="published" v-model="form.published" type="checkbox" class="rounded" />
          <label for="published" class="text-sm text-gray-700">Publikováno</label>
        </div>
        <button type="submit" :disabled="saving"
          class="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ saving ? 'Ukládám…' : 'Přidat FAQ' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin – FAQ | Maturitní Helpdesk' })

const { data: faqs, pending, refresh } = await useFetch<any[]>('/api/admin/faq')

const form = reactive({ question: '', answer: '', published: true, sortOrder: 0 })
const saving = ref(false)
const formError = ref('')

async function addFaq() {
  saving.value = true
  formError.value = ''
  try {
    await $fetch('/api/admin/faq', { method: 'POST', body: { ...form } })
    Object.assign(form, { question: '', answer: '', published: true, sortOrder: 0 })
    await refresh()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Chyba při ukládání'
  } finally {
    saving.value = false
  }
}

async function deleteFaq(id: number) {
  if (!confirm('Opravdu smazat tuto položku?')) return
  await $fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
