<template>
  <q-page class="q-pa-md">
    <q-card
      ref="formulario"
      class="cardExterno bg-grey-3">
      <q-item
        dense
        class="bg-grey-5 text-black">
        <q-item-section>
          <div class="text-subtitle1">{{ titulo }}</div>
        </q-item-section>
        <q-item-section
          side
          class="text-black">
          <q-btn
            flat
            dense
            icon="las la-camera"
            @click="printar">
            <q-tooltip>{{ t('capturar') }}</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section
          v-if="temEventoAtualizou"
          side
          class="text-black">
          <q-btn
            flat
            dense
            icon="las la-redo-alt"
            @click="emit('atualizou')">
            <q-tooltip> {{ t('recarregar') }}</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section
          v-if="botaoLimparChat"
          side
          class="text-black">
          <q-btn
            flat
            dense
            icon="las la-broom"
            @click="limparChat">
            <q-tooltip>{{ t('limparChat') }}</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-card-section class="cardInterno q-py-sm q-px-none animado">
        <router-view v-slot="{Component}">
          <transition
            leave-active-class="animated fadeOut"
            enter-active-class="animated fadeIn"
            mode="out-in"
            :duration="300">
            <component :is="Component"/>
          </transition>
        </router-view>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {computed, onMounted, ref, useAttrs} from 'vue'
import {QCard} from 'quasar'

defineProps({
  titulo: {type: String, default: ''},
  botaoLimparChat: {type: Boolean, default: false}
})
const emit = defineEmits(['atualizou', 'limparChat'])
const {t} = useI18n()
const formulario = ref<QCard | null>(null)
const attrs = useAttrs()

const temEventoAtualizou = computed(() => 'onAtualizou' in attrs)

function limparChat() {
  emit('limparChat')
}

function printar() {
  if (formulario.value) {
    try {
      window.print()
    } catch (error) {
      console.error('Erro ao imprimir:', error)
    }
  }
}

onMounted(() => {
  if (formulario.value && !formulario.value.$el) {
    console.error('divToCapture não está disponível')
  }
})
</script>
