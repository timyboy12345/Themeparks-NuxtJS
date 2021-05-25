<template>
  <card :title="$t('general.loadingTitle')" :content="$t('general.loadingContent')"></card>
</template>

<script>
import Card from '@/components/cards/Card'
export default {
  name: 'LoadingCard',
  components: { Card },
}
</script>

<style scoped></style>
