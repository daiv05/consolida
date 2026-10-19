<script setup lang="ts">
useHead({
  titleTemplate: title => (title && title !== 'Consolida' ? `${title} · Consolida` : 'Consolida'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
