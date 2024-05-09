<script setup lang="ts">
const { user, login, logout } = useAuth();
</script>

<template>
  <div>
    <pre>{{ user }}</pre>
    <button @click="login()">Login</button>
    <button @click="logout()">Logout</button>
    <NuxtLink to="/page">page</NuxtLink>
  </div>
</template>
