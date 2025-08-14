<template>
  <div class="row caixa items-center q-px-sm q-py-xs">
    <div class="col-sm col-xs-12 q-pa-xs">
      <slot></slot>
    </div>
    <div
      v-if="props.acaoPrincipal"
      class="col-sm-auto col-xs q-pa-sm">
      <q-btn
        class="bg-grey-2 full-width"
        text-color="accent"
        flat
        :icon="props.acaoPrincipal.icon"
        no-caps
        :disable="props.acaoPrincipal.disable"
        :label="acaoPrincipal.label"
        @click="props.acaoPrincipal.click()" />
    </div>
    <div
      v-if="props.acoesSecundarias"
      class="col-sm-auto q-pa-xs">
      <q-btn-dropdown
        text-color="accent"
        class="bg-grey-2"
        flat
        dense
        rounded
        dropdown-icon="las la-ellipsis-h">
        <q-list
          v-close-popup
          class="text-accent">
          <template
            v-for="(acao, index) in props.acoesSecundarias"
            :key="index">
            <q-item
              clickable
              dense
              :disable="acao.disable"
              class="q-ma-xs"
              style="border-radius: 4px"
              @click="acao.click()">
              <q-item-section
                v-if="acao.icon"
                side>
                <q-icon
                  color="accent"
                  :name="acao.icon" />
              </q-item-section>
              <q-item-section>{{ acao.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { watchEffect } from 'vue'
import type { ActionButton } from 'src/model/ActionButton'

const props = defineProps({
  acaoPrincipal: {type: Object as PropType<ActionButton>, default: null},
  acoesSecundarias: {type: Array as PropType<ActionButton[]>, default: null},
  posicao: {type: Number, default: null},
})

watchEffect(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pri = props.acaoPrincipal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sec = props.acoesSecundarias
})
</script>
