<template>
  <card :sub-title="$t('general.ad')">
    <client-only>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3611207014341558"
        crossorigin="anonymous"
      ></script>
      <!-- Themeparkplanner Default Block -->
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-3611207014341558"
        data-ad-slot="9200028200"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      </script>
    </client-only>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'
export default {
  name: 'AdCard',
  components: { Card },
}
</script>
