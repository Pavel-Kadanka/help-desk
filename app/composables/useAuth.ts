interface AuthUser {
  id: number
  email: string
  name: string
  role: string
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth:user', () => null)

  const fetchUser = async () => {
    try {
      const data = await $fetch<AuthUser | null>('/api/auth/me')
      user.value = data
    } catch {
      user.value = null
    }
  }

  const login = async (email: string, password: string) => {
    const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    return data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isLoggedIn = computed(() => !!user.value)

  return { user, fetchUser, login, logout, isAdmin, isLoggedIn }
}
