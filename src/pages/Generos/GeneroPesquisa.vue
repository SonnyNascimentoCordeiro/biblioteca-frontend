<template>
  <div class="genero-pesquisa">
    <PesquisaPadrao
      :paginacao="paginacao"
      :loading="generoStore.isLoading"
      :registros="generoStore.registros"
      @pesquisou="realizarPesquisa($event)"
      @limpou="limparPesquisa"
    >
      <template #actions>
        <q-btn
          color="positive"
          icon="add"
          label="Novo Genero"
          @click="criarGenero"
        />
      </template>

      <template #filtros>
        <div class="row q-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="filtros.nome"
              label="Nome do Gênero"
              dense
              outlined
              clearable
              @keyup.enter="aplicarFiltros"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="filtros.descricao"
              label="Descrição"
              dense
              outlined
              clearable
              @keyup.enter="aplicarFiltros"
            />
          </div>
        </div>
      </template>

      <template #listagem>
        <div v-if="generoStore.registros.length > 0">
          <GeneroPesquisaItem
            v-for="(autor, index) in generoStore.registros"
            :key="autor.id"
            :id="index"
            :item="autor"
            @excluiu="onGeneroExcluido"
          />
        </div>
        <div v-else-if="!generoStore.isLoading" class="text-center q-pa-lg">
          <q-icon name="search" size="4rem" color="grey-4"/>
          <div class="text-h6 text-grey-6 q-mt-md">Nenhum genero encontrado</div>
          <div class="text-caption text-grey-5">Tente ajustar os filtros de pesquisa</div>
        </div>
      </template>
    </PesquisaPadrao>

    <!-- Banner de erro -->
    <q-banner
      v-if="generoStore.error"
      class="text-white bg-negative q-mt-md"
      rounded
    >
      {{ generoStore.error }}
      <template #action>
        <q-btn
          flat
          color="white"
          label="Fechar"
          @click="generoStore.limparErro()"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {useGeneroStore} from 'src/stores/genero'
import PesquisaPadrao from 'components/PesquisaPadrao.vue'
import GeneroPesquisaItem from 'pages/Generos/GeneroPesquisaItem.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const generoStore = useGeneroStore()

// Estado local
const paginaAtual = ref(1)

// Filtros
const filtros = ref({
  nome: '',
  descricao: ''
})

// Computed
const paginacao = computed(() => ({
  paginaAtual: generoStore.paginacao.paginaAtual,
  totalRegistros: generoStore.paginacao.totalRegistros,
  registrosCarregados: generoStore.paginacao.registrosCarregados,
  ultima: generoStore.paginacao.ultima,
  totalPaginas: generoStore.paginacao.totalPaginas
}))

// Métodos
async function realizarPesquisa(termo: string) {
  console.log('🚀 Realizando pesquisa com termo:', termo)
  console.log(filtros.value.nome)
  paginaAtual.value = 1

  try {
    await generoStore.pesquisar({
      filtros: {
        nome: termo
      },
      page: 0,           // ✅ Número da página (começa em 0)
      size: 20,          // ✅ Tamanho da página (padrão 20)
      ordenacao: 'nome', // ✅ Campo de ordenação
      offset: 0          // ✅ Offset para paginação
    })
  } catch (error) {
    console.error('❌ Erro na pesquisa:', error)
    $q.notify({
      type: 'negative',
      message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      position: 'top',
    })
  }
}

function limparPesquisa() {
  // Limpar filtros
  filtros.value.nome = ''
  filtros.value.descricao = ''

  paginaAtual.value = 1
  generoStore.reset()
}

async function aplicarFiltros() {
  paginaAtual.value = 1

  await generoStore.pesquisar({
    filtros: {
      nome: filtros.value.nome,
      descricao: filtros.value.descricao
    },
    page: 0,
    size: 20,
    ordenacao: 'nome',
    offset: 0
  })
}

function criarGenero() {
  void router.push('/generos/novo')
}

function onGeneroExcluido(id: number) {
  // O store já remove o item automaticamente, mas podemos fazer uma verificação adicional
  // ou implementar lógica específica se necessário

  // Atualizar a paginação se necessário
  if (generoStore.registros.length === 0 && generoStore.paginacao.totalRegistros > 0) {
    // Se não há mais registros na página atual, voltar para a página anterior
    const paginaAnterior = Math.max(0, generoStore.paginacao.paginaAtual - 1)
    if (paginaAnterior !== generoStore.paginacao.paginaAtual) {
      void generoStore.pesquisar({
        filtros: {},
        page: paginaAnterior,
        size: 20,
        ordenacao: 'nome',
        offset: paginaAnterior * 20
      })
    }
  }

  console.log(`✅ Gênero com ID ${id} foi excluído da listagem`)
}

// Lifecycle
onMounted(async () => {
  // Carregar dados iniciais
  try {
    await generoStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    })
  } catch (error) {
    console.error('❌ Erro ao carregar dados iniciais:', error)
  }
})
</script>

<style scoped>
.genero-pesquisa {
  width: 100%;
}

@media (max-width: 600px) {
  .q-table {
    font-size: 0.875rem;
  }
}
</style>
