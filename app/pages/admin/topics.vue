<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ topics?.length ?? 0 }} okruhů celkem</p>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Název</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stav</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending" class="text-center"><td colspan="5" class="py-8 text-gray-400">Načítám…</td></tr>
          <tr v-else-if="!topics?.length" class="text-center"><td colspan="5" class="py-8 text-gray-400">Žádné okruhy</td></tr>
          <tr v-for="topic in topics" :key="topic.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-gray-400 w-12">{{ topic.sortOrder }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ topic.title }}</td>
            <td class="px-6 py-4 text-gray-400 font-mono text-xs">{{ topic.slug }}</td>
            <td class="px-6 py-4">
              <button @click="togglePublished(topic)"
                :class="topic.published
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                class="px-2.5 py-1 rounded-full text-xs font-medium transition-colors">
                {{ topic.published ? 'Publikováno' : 'Skryto' }}
              </button>
            </td>
            <td class="px-6 py-4 text-right space-x-3">
              <button @click="openEdit(topic)"
                class="text-primary-600 hover:text-primary-800 text-xs font-medium transition-colors">
                Upravit
              </button>
              <button @click="deleteTopic(topic.id)"
                class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                Smazat
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add form -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Přidat nový okruh</h2>
      <div v-if="formError" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ formError }}</div>
      <form @submit.prevent="addTopic" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Název *</label>
            <input v-model="form.title" @input="autoSlug" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Slug *</label>
            <input v-model="form.slug" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Pořadí (sort order)</label>
            <input v-model.number="form.sortOrder" type="number"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kategorie ID</label>
            <input v-model.number="form.categoryId" type="number"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Shrnutí</label>
          <input v-model="form.summary"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Obsah (HTML) *</label>
          <textarea v-model="form.content" rows="6" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" :disabled="saving"
          class="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {{ saving ? 'Ukládám…' : 'Přidat okruh' }}
        </button>
      </form>
    </div>

    <!-- Edit modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editModal" class="fixed inset-0 z-50 flex">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40" @click="closeEdit" />

          <!-- Side panel -->
          <div class="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 class="text-base font-semibold text-gray-900">Upravit okruh</h2>
              <button @click="closeEdit" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="saveEdit" class="flex flex-col flex-1 overflow-hidden">
              <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div v-if="editError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ editError }}</div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Název *</label>
                    <input v-model="editForm.title" required
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Slug *</label>
                    <input v-model="editForm.slug" required
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Pořadí</label>
                    <input v-model.number="editForm.sortOrder" type="number"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div class="flex items-end pb-0.5">
                    <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input v-model="editForm.published" type="checkbox" class="rounded w-4 h-4" />
                      Publikováno
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Shrnutí</label>
                  <input v-model="editForm.summary"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-gray-700">Obsah (HTML) *</label>
                    <span class="text-xs text-gray-400">{{ editForm.content.length }} znaků</span>
                  </div>
                  <textarea v-model="editForm.content" rows="20" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                <button type="button" @click="closeEdit"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Zrušit
                </button>
                <button type="submit" :disabled="editSaving"
                  class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  {{ editSaving ? 'Ukládám…' : 'Uložit změny' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin – Okruhy | Maturitní Helpdesk' })

const { data: topics, pending, refresh } = await useFetch<any[]>('/api/admin/topics')

// ── Add form ──────────────────────────────────────────────
const form = reactive({ title: '', slug: '', summary: '', content: '', sortOrder: 0, categoryId: 1 })
const saving = ref(false)
const formError = ref('')

function autoSlug() {
  form.slug = form.title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function addTopic() {
  saving.value = true
  formError.value = ''
  try {
    await $fetch('/api/admin/topics', { method: 'POST', body: { ...form } })
    Object.assign(form, { title: '', slug: '', summary: '', content: '', sortOrder: 0, categoryId: 1 })
    await refresh()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Chyba při ukládání'
  } finally {
    saving.value = false
  }
}

// ── Toggle / Delete ───────────────────────────────────────
async function togglePublished(topic: any) {
  await $fetch(`/api/admin/topics/${topic.id}`, {
    method: 'PUT',
    body: { published: !topic.published },
  })
  await refresh()
}

async function deleteTopic(id: number) {
  if (!confirm('Opravdu smazat tento okruh?')) return
  await $fetch(`/api/admin/topics/${id}`, { method: 'DELETE' })
  await refresh()
}

// ── Edit modal ────────────────────────────────────────────
const editModal = ref(false)
const editingId = ref<number | null>(null)
const editForm = reactive({ title: '', slug: '', summary: '', content: '', sortOrder: 0, published: true })
const editSaving = ref(false)
const editError = ref('')

function openEdit(topic: any) {
  editingId.value = topic.id
  Object.assign(editForm, {
    title: topic.title,
    slug: topic.slug,
    summary: topic.summary ?? '',
    content: topic.content ?? '',
    sortOrder: topic.sortOrder,
    published: topic.published,
  })
  editError.value = ''
  editModal.value = true
}

function closeEdit() {
  editModal.value = false
  editingId.value = null
}

async function saveEdit() {
  if (!editingId.value) return
  editSaving.value = true
  editError.value = ''
  try {
    await $fetch(`/api/admin/topics/${editingId.value}`, {
      method: 'PUT',
      body: { ...editForm },
    })
    await refresh()
    closeEdit()
  } catch (e: any) {
    editError.value = e?.data?.message || 'Chyba při ukládání'
  } finally {
    editSaving.value = false
  }
}

// Close on Escape
onMounted(() => {
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEdit() })
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: translateX(100%);
}
.modal-leave-to .relative {
  transform: translateX(100%);
}
</style>
