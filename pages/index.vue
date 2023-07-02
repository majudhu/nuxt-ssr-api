<script setup>
const { data } = await useFetch('/api/login');

async function submit(e) {
  try {
    const body = Object.fromEntries(new FormData(e.target));

    if (e.submitter.textContent == 'Change') {
      await $fetch('/api/login', { method: 'PUT', body });
    } else {
      const { user } = await $fetch('/api/login', { method: 'POST', body });
      if (user) {
        data.value = { user };
        e.target.reset();
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function logout() {
  await $fetch('/api/login', { method: 'DELETE' });
  data.value = null;
}
</script>

<template>
  <div>
    <h1>Welcome to the homepage</h1>

    <form @submit.prevent="submit">
      <p v-if="data?.user">You are logged in as {{ data.user }}</p>

      <template v-else>
        <label for="username">Username</label>
        <input id="username" name="username" />
      </template>

      <label for="password">Password</label>
      <input id="password" name="password" type="password" />

      <template v-if="data?.user">
        <label for="newpassword">New Password</label>
        <input id="newpassword" name="newpassword" type="password" />

        <button type="submit">Change</button>

        <button type="button" @click="logout">Logout</button>
      </template>
      <button v-else type="submit">Login</button>
    </form>
  </div>
</template>
