<template>
  <q-form
    ref="formPrincipal"
    autocapitalize="off"
    autocomplete="off"
    greedy
    spellcheck="false">
    <div class="q-pa-md">
      <slot />
    </div>
    <q-separator/>
    <q-card-actions
      align="right"
      class="q-pa-sm">
      <q-btn
        :icon="'las la-save'"
        :label="t('salvar')"
        class="bg-accent text-white"
        dense
        @click="salvar()"/>
      <q-btn
        :label="t('cancelar')"
        class="bg-accent text-white"
        dense
        icon="las la-undo"
        @click="cancelar()"/>
    </q-card-actions>
    <q-inner-loading :showing="carregando">
      <q-spinner-gears
        class="absolut-center"
        color="accent"
        size="50px"/>
    </q-inner-loading>
  </q-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'

interface Props {
  carregando?: boolean
  disable?: boolean
}

defineProps<Props>()

const emit = defineEmits(['salvar', 'cancelar'])

const formPrincipal = ref(null as unknown as QForm)
const $q = useQuasar()
const {t} = useI18n()

function salvar() {
  void formPrincipal.value.validate().then((success: boolean) => {
    if (success) {
      emit('salvar')
    } else {
      $q.notify({
        type: 'warning',
        message: t('validacaoCampos'),
      })
    }
  })
}

function cancelar() {
  emit('cancelar')
}
</script>
