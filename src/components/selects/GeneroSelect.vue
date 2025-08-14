<template>
  <q-select
    option-label="nome"
    :options="generos"
    :label="labelCompl"
    v-model="genero"
    clearable
    standout="bg-primary text-white"
    dense
    input-debounce="1200"
    use-input
    popup-content-class="alturaGenero"
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
import { useGeneroStore } from 'src/stores/genero'
import type { Genero } from 'src/types/genero'

interface Props {
  valor?: { id: number; nome: string } | undefined
  obrigatorio?: boolean
  labelCompl?: string
}

const props = withDefaults(defineProps<Props>(), {
  obrigatorio: false,
  labelCompl: 'Gênero'
})

const emit = defineEmits<{
  'update:valor': [genero: { id: number; nome: string } | undefined]
}>()

const generoStore = useGeneroStore()

const genero = ref<{ id: number; nome: string } | undefined>(undefined)
const generos = ref<Genero[]>([])
const carregando = ref(false)
const filtro = ref({})

// Watcher para sincronizar com o valor externo
watch(() => props.valor, (newVal) => {
  if (newVal && newVal.id && newVal.nome) {
    genero.value = { ...newVal }
    console.log('Gênero selecionado:', genero.value)
  } else {
    genero.value = undefined
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
    
    await generoStore.pesquisar({
      filtros: { nome: val },
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    })
    
    generos.value = [...generoStore.registros]
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error)
    generos.value = []
  } finally {
    update(() => {
      carregando.value = false
    })
  }
}

// Função para atualizar o valor
function updateValor() {
  if (genero.value && genero.value.id) {
    const generoSelecionado = {
      id: genero.value.id,
      nome: genero.value.nome || ''
    }
    emit('update:valor', generoSelecionado)
  } else {
    emit('update:valor', undefined)
  }
}

// Carregar gêneros iniciais
onMounted(async () => {
  try {
    await generoStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    })
    generos.value = [...generoStore.registros]
  } catch (error) {
    console.error('Erro ao carregar gêneros iniciais:', error)
  }
})
</script>

<style lang="scss">
.alturaGenero {
  max-height: 250px;
}
</style>
