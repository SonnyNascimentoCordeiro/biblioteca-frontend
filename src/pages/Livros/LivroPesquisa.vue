<template>
  <div class="livro-pesquisa">
    <PesquisaPadrao
      :paginacao="paginacao"
      :loading="livroStore.isLoading"
      :registros="livroStore.registros"
      @pesquisou="realizarPesquisa($event)"
      @limpou="limparPesquisa"
    >
      <template #actions>
        <!-- Botões de ação só para usuários que não são clientes (userType 'C') -->
        <q-btn
          v-if="!authStore.isCliente"
          color="positive"
          icon="add"
          label="Novo Livro"
          @click="criarLivro"
        />
      </template>

      <template #filtros>
        <div class="row q-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.titulo"
              label="Título do Livro"
              dense
              outlined
              clearable
              @keyup.enter="aplicarFiltros"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.descricao"
              label="Descrição"
              dense
              outlined
              clearable
              @keyup.enter="aplicarFiltros"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.linguagem"
              label="Linguagem"
              dense
              outlined
              clearable
              @keyup.enter="aplicarFiltros"
            />
          </div>
        </div>
      </template>

      <template #listagem>
        <div v-if="livroStore.registros.length > 0">
          <LivroPesquisaItem
            v-for="(livro, index) in livroStore.registros"
            :key="livro.id"
            :id="index"
            :item="livro"
            @excluiu="onLivroExcluido"
          />
        </div>
        <div v-else-if="!livroStore.isLoading" class="text-center q-pa-lg">
          <q-icon name="search" size="4rem" color="grey-4"/>
          <div class="text-h6 text-grey-6 q-mt-md">Nenhum livro encontrado</div>
          <div class="text-caption text-grey-5">Tente ajustar os filtros de pesquisa</div>
        </div>
      </template>
    </PesquisaPadrao>

    <!-- Banner de erro -->
    <q-banner
      v-if="livroStore.error"
      class="text-white bg-negative q-mt-md"
      rounded
    >
      {{ livroStore.error }}
      <template #action>
        <q-btn
          flat
          color="white"
          label="Fechar"
          @click="livroStore.limparErro()"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {useLivroStore} from 'src/stores/livro'
import {useAutenticacaoStore} from 'src/stores/autorizacao/autenticacao'
import PesquisaPadrao from 'components/PesquisaPadrao.vue'
import LivroPesquisaItem from 'pages/Livros/LivroPesquisaItem.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const livroStore = useLivroStore()
const authStore = useAutenticacaoStore()

// Estado local
const paginaAtual = ref(1)

// Filtros
const filtros = ref({
  titulo: '',
  descricao: '',
  linguagem: ''
})

// Computed
const paginacao = computed(() => ({
  paginaAtual: livroStore.paginacao.paginaAtual,
  totalRegistros: livroStore.paginacao.totalRegistros,
  registrosCarregados: livroStore.paginacao.registrosCarregados,
  ultima: livroStore.paginacao.ultima,
  totalPaginas: livroStore.paginacao.totalPaginas
}))

// Métodos
async function realizarPesquisa(termo: string) {
  console.log('🚀 Realizando pesquisa com termo:', termo)
  paginaAtual.value = 1

  try {
    await livroStore.pesquisar({
      filtros: {
        titulo: termo
      },
      page: 0,           // ✅ Número da página (começa em 0)
      size: 20,          // ✅ Tamanho da página (padrão 20)
      ordenacao: 'titulo', // ✅ Campo de ordenação
      offset: 0          // ✅ Offset para paginação
    })
  } catch (error) {
    console.error(' Erro na pesquisa:', error)
    $q.notify({
      type: 'negative',
      message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      position: 'top',
    })
  }
}

function limparPesquisa() {
  // Limpar filtros
  filtros.value.titulo = ''
  filtros.value.descricao = ''
  filtros.value.linguagem = ''

  paginaAtual.value = 1
  livroStore.reset()
}

async function aplicarFiltros() {
  paginaAtual.value = 1

  await livroStore.pesquisar({
    filtros: {
      titulo: filtros.value.titulo,
      descricao: filtros.value.descricao,
      linguagem: filtros.value.linguagem
    },
    page: 0,
    size: 20,
    ordenacao: 'titulo',
    offset: 0
  })
}

function criarLivro() {
  void router.push('/livros/novo')
}

function onLivroExcluido(id: number) {
  // O store já remove o item automaticamente, mas podemos fazer uma verificação adicional
  // ou implementar lógica específica se necessário

  // Atualizar a paginação se necessário
  if (livroStore.registros.length === 0 && livroStore.paginacao.totalRegistros > 0) {
    // Se não há mais registros na página atual, voltar para a página anterior
    const paginaAnterior = Math.max(0, livroStore.paginacao.paginaAtual - 1)
    if (paginaAnterior !== livroStore.paginacao.paginaAtual) {
      void livroStore.pesquisar({
        filtros: {},
        page: paginaAnterior,
        size: 20,
        ordenacao: 'titulo',
        offset: paginaAnterior * 20
      })
    }
  }

  console.log(`✅ Livro com ID ${id} foi excluído da listagem`)
}

// Lifecycle
onMounted(async () => {
  // Carregar dados iniciais
  try {
    await livroStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'titulo',
      offset: 0
    })
  } catch (error) {
    console.error(' Erro ao carregar dados iniciais:', error)
  }
})
</script>

<style scoped>
.livro-pesquisa {
  width: 100%;
}

@media (max-width: 600px) {
  .q-table {
    font-size: 0.875rem;
  }
}
</style>
