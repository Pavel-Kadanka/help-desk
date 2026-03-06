<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jméno</th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registrován</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-if="pending"><td colspan="5" class="py-8 text-center text-gray-400">Načítám…</td></tr>
        <tr v-else-if="!users?.length"><td colspan="5" class="py-8 text-center text-gray-400">Žádní uživatelé</td></tr>
        <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 text-gray-400">{{ u.id }}</td>
          <td class="px-6 py-4 font-medium text-gray-900">{{ u.name }}</td>
          <td class="px-6 py-4 text-gray-600">{{ u.email }}</td>
          <td class="px-6 py-4">
            <span :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
              class="px-2.5 py-1 rounded-full text-xs font-medium">
              {{ u.role }}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-500">
            {{ new Date(u.createdAt).toLocaleDateString('cs-CZ') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useHead({ title: 'Admin – Uživatelé | Maturitní Helpdesk' })

const { data: users, pending } = await useFetch<any[]>('/api/admin/users')
</script>
