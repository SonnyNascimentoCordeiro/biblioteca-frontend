<template>
   <q-banner class="bg-grey-1 text-accent caixa">
      <template #avatar>
         <q-icon
            name="info"
            color="accent" />
      </template>
      {{ t('pesquisaVazia') }}
   </q-banner>
</template>

<script setup lang="ts">
   import {useI18n} from 'vue-i18n'

   const {t} = useI18n()
</script>
