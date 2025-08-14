<template>
  <q-select
    option-label="nome"
    :options="autores"
    :label="labelCompl"
    v-model="autor"
    clearable
    standout="bg-primary text-white"
    dense
    input-debounce="1200"
    use-input
    popup-content-class="alturaAutor"
    transition-show="jump-up"
    transition-hide="jump-up"
    options-dense
    :loading="carregando"
    @filter="filterFn"
    lazy-rules
    v-bind="$attrs"
    :rules="[ val => (!!val || !obrigatorio)  || (labelCompl || 'Campo').concat(' é obrigatório')]"
    @input="updateValor()"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps"
              class="q-pa-xs">
        <q-item-section top>
          <q-item-label>{{ scope.opt.id }} - {{ scope.opt.nome }}</q-item-label>
        </q-item-section>
        <q-item-section side
                        class="gt-xs">
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAutorStore } from 'src/stores/autor'
import type { Autor } from 'src/types/autor'

interface Props {
  valor?: { id: number; nome: string } | undefined
  obrigatorio?: boolean
  labelCompl?: string
}

const props = withDefaults(defineProps<Props>(), {
  obrigatorio: false,
  labelCompl: 'Autor'
})

const emit = defineEmits<{
  'update:valor': [autor: { id: number; nome: string } | undefined]
}>()

const autorStore = useAutorStore()

const autor = ref<{ id: number; nome: string } | undefined>(undefined)
const autores = ref<Autor[]>([])
const carregando = ref(false)
const filtro = ref({})

// Watcher para sincronizar com o valor externo
watch(() => props.valor, (newVal) => {
  if (newVal && newVal.id && newVal.nome) {
    autor.value = { ...newVal }
    // console.log('Autor selecionado:', autor.value)
  } else {
    autor.value = undefined
  }
}, { deep: true, immediate: true })

// Função de filtro para busca
async function filterFn(val: string, update: (callback: () => void) => void, abort: () => void) {
  if (val.length < 3) {
    abort()
    return
  }

  carregando.value = true

  try {
    filtro.value = { nome: val }

    await autorStore.pesquisar({
      filtros: { nome: val },
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    })

    autores.value = [...autorStore.registros]
  } catch (error) {
    console.error('Erro ao buscar autores:', error)
    autores.value = []
  } finally {
    update(() => {
      carregando.value = false
    })
  }
}

// Função para atualizar o valor
function updateValor() {
  if (autor.value && autor.value.id) {
    const autorSelecionado = {
      id: autor.value.id,
      nome: autor.value.nome || ''
    }
    emit('update:valor', autorSelecionado)
  } else {
    emit('update:valor', undefined)
  }
}

// Carregar autores iniciais
onMounted(async () => {
  try {
    await autorStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    })
    autores.value = [...autorStore.registros]
  } catch (error) {
    console.error('Erro ao carregar autores iniciais:', error)
  }
})
</script>

<style lang="scss">
.alturaAutor {
  max-height: 250px;
}
</style>
