<template>
  <div class="pesquisa-container q-pa-md">
    <!-- Campo de pesquisa principal -->
    <div class="row q-gutter-sm">
      <div class="col">
        <q-input
          v-model="termoPesquisa"
          :label="label || 'Pesquisar...'"
          :placeholder="placeholder || 'Digite o termo de pesquisa'"
          :loading="loading"
          :readonly="readonly"
          clearable
          dense
          standout="bg-primary text-white"
          @keyup.enter="pesquisou"
          @clear="limpou"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>

          <template #append>
            <q-btn
              flat
              dense
              icon="search"
              color="primary"
              @click="pesquisou"
            >
              <q-tooltip>Pesquisar</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>

      <!-- Botão Limpar -->
      <div class="col-auto">
        <q-btn
          flat
          dense
          icon="clear"
          color="negative"
          @click="limpou"
        >
          <q-tooltip>Limpar</q-tooltip>
        </q-btn>
      </div>

      <!-- Slot para botões adicionais -->
      <div v-if="$slots.actions" class="col-auto">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Filtros avançados (opcionais) -->
    <div v-if="$slots.filtros && mostrarFiltros" class="q-mt-md">
      <q-expansion-item
        v-model="filtrosExpandidos"
        icon="filter_list"
        label="Filtros Avançados"
        header-class="text-primary"
      >
        <q-card class="q-mt-sm">
          <q-card-section>
            <slot name="filtros"></slot>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Limpar Filtros" @click="limparFiltros" />
            <q-btn
              color="primary"
              label="Aplicar Filtros"
              @click="aplicarFiltros"
            />
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </div>

    <!-- Resultados da pesquisa -->
    <div
      v-if="statusPesquisa === 2"
      class="q-pa-xs bks-lista">
      <pesquisa-padrao-vazia />
    </div>

    <div
      v-else
      class="q-pa-xs">
      <q-list
        id="scrollTarget"
        class="scroll bks-lista">
        <q-scroll-observer @scroll="onScroll" />
        <slot name="listagem"></slot>
        <q-infinite-scroll
          v-if="paginacao['totalRegistros'] > 0 && !paginacao['ultima']"
          :offset="150"
          scroll-target="#scrollTarget"
          @load="load">
          <template #loading>
            <div class="text-center q-pa-none">
              <q-spinner-dots
                color="accent"
                size="30px" />
            </div>
          </template>
        </q-infinite-scroll>
        <q-inner-loading :showing="carregando">
          <q-spinner-gears
            class="absolut-center"
            color="accent"
            size="50px" />
        </q-inner-loading>
      </q-list>
    </div>
    <div
      v-if="statusPesquisa === 1"
      class="q-pa-xs">
      <q-bar class="bg-grey-1 caixa text-accent">
        <div class="bks-rodape gt-sm">
          <slot name="legenda"></slot>
        </div>
        <q-space />
        <div class="bks-rodape">
          {{
            t('registrosCarregados', {
              carregados: paginacao['registrosCarregados'],
              total: paginacao['totalRegistros'],
            })
          }}
        </div>
      </q-bar>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !$slots.resultados" class="q-mt-md text-center">
      <q-spinner-dots size="40px" color="primary" />
      <div class="q-mt-sm text-grey-6">Pesquisando...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from "vue-i18n";

import PesquisaPadraoVazia from "src/components/PesquisaPadraoVazia.vue";

// Props
// interface Props {
//   label?: string;
//   placeholder?: string;
//   loading?: boolean;
//   readonly?: boolean;
//   totalResultados?: number;
//   mostrarFiltros?: boolean;
//   valorInicial?: string;
// }
const {t} = useI18n()

const props = defineProps({
  label: { type: String, default: 'Pesquisar' },
  placeholder: { type: String, default: 'Digite o termo de pesquisa...' },
  filtro: { type: String, default: '' },
  pathNovo: { type: String, default: '' },
  statusPesquisa: { type: Number, default: 0 },
  paginacao: { type: Object, required: true },   
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  totalResultados: { type: Number, default: 0 },
  mostrarFiltros: { type: Boolean, default: false },
  valorInicial: { type: String, default: '' },
  carregando: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(['limpou', 'pesquisou', 'load', 'cancelarItem', 'aplicarFiltros', 'limparFiltros'])

// Methods for infinite scroll
function onScroll() {
  // Handle scroll events
}

function load() {
  emit('load');
}

// State
const termoPesquisa = ref(props.valorInicial);
const filtrosExpandidos = ref(false);

// Computed properties can be added here if needed

// Methods
function pesquisou() {
  emit('pesquisou', termoPesquisa.value)
}

function limpou() {
  termoPesquisa.value = ''
  emit('limpou')
}

function aplicarFiltros() {
  emit('aplicarFiltros');
  filtrosExpandidos.value = false;
}

function limparFiltros() {
  emit('limparFiltros');
}

// Exposing methods for parent components
defineExpose({
  limpar: limpou,
  pesquisar: pesquisou,
  setTermo: (termo: string) => {
    termoPesquisa.value = termo;
  }
});
</script>

<style scoped>
.pesquisa-container {
          background: #f5f1eb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .pesquisa-container {
    margin: 0;
    padding: 16px;
  }
}
</style>
