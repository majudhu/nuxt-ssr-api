interface User {
  user: string;
}

export function useAuth() {
  const data = useState('user', () => useApiFetch<User>('/api/login').data);

  async function login() {
    data.value = await apiFetch('/api/login', {
      method: 'POST',
      body: { username: 'admin', password: 'admin' },
    });
  }

  async function logout() {
    await apiFetch('/api/login', { method: 'DELETE' });
    data.value = null;
  }

  const user = readonly(data);

  const isLoggedIn = computed(() => !!user.value);

  return { user, login, logout, isLoggedIn };
}
