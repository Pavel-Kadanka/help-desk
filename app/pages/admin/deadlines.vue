<template>
  <div class="space-y-6">
    <!-- List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Název</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Popis</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending"><td colspan="4" class="py-8 text-center text-gray-400">Načítám…</td></tr>
          <tr v-else-if="!deadlines?.length"><td colspan="4" class="py-8 text-center text-gray-400">Žádné termíny</td></tr>
          <tr v-for="d in deadlines" :key="d.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ d.title }}</td>
            <td class="px-6 py-4 text-gray-600 whitespace-nowrap">{{ formatDate(d.dueDate) }}</td>
            <td class="px-6 py-4 text-gray-500 max-w-xs truncate">{{ d.description }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="deleteDeadline(d.id)" class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Smazat</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add form -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Přidat termín</h2>
      <div v-if="formError" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ formError }}</div>
      <form @submit.prevent="addDeadline" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Název *</label>
            <input v-model="form.title" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Datum *</label>
            <input v-model="form.dueDate" type="date" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Popis</label>
          <input v-model="form.description"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" :disabled="saving"
          class="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ saving ? 'Ukládám…' : 'Přidat termín' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin – Termíny | Maturitní Helpdesk' })

const { data: deadlines, pending, refresh } = await useFetch<any[]>('/api/admin/deadlines')

const form = reactive({ title: '', dueDate: '', description: '' })
const saving = ref(false)
const formError = ref('')

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function addDeadline() {
  saving.value = true
  formError.value = ''
  try {
    await $fetch('/api/admin/deadlines', { method: 'POST', body: { ...form } })
    Object.assign(form, { title: '', dueDate: '', description: '' })
    await refresh()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Chyba při ukládání'
  } finally {
    saving.value = false
  }
}

async function deleteDeadline(id: number) {
  if (!confirm('Opravdu smazat tento termín?')) return
  await $fetch(`/api/admin/deadlines/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
