<template>
  <div class="autor-pesquisa">
    <PesquisaPadrao
      ref="pesquisaRef"
      label="Buscar autores"
      placeholder="Digite o nome do autor..."
      :loading="autorStore.isLoading"
      :total-resultados="autorStore.registros.length"
      :mostrar-filtros="true"
      @pesquisou="realizarPesquisa($event)"
      @limpou="limparPesquisa"
      @aplicar-filtros="aplicarFiltros"
      @limpar-filtros="limparFiltros"
      :paginacao="paginacao">

      <template #actions>
        <!-- Botões de ação só para usuários que não são clientes (userType 'C') -->
        <q-btn
          v-if="!authStore.isCliente"
          color="positive"
          icon="add"
          label="Novo Autor"
          @click="criarAutor"
        />
      </template>

      <!-- Filtros avançados -->
<!--      <template #filtros>-->
<!--        <div class="row q-gutter-md">-->
<!--          <div class="col-md-6 col-sm-6 col-xs-12">-->
<!--            <q-input-->
<!--              v-model="filtros.nome"-->
<!--              label="Nome"-->
<!--              clearable-->
<!--              dense-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->

      <template #listagem>
        <div v-if="autorStore.registros.length > 0">
          <AutorPesquisaItem
            v-for="(autor, index) in autorStore.registros"
            :key="autor.id"
            :id="index"
            :item="autor"
            @excluiu="onAutorExcluido"
          />
        </div>
        <div v-else-if="!autorStore.isLoading" class="text-center q-pa-lg">
          <q-icon name="search" size="4rem" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">Nenhum autor encontrado</div>
          <div class="text-caption text-grey-5">Tente ajustar os filtros de pesquisa</div>
        </div>
      </template>
    </PesquisaPadrao>

    <!-- Mensagem de erro -->
    <q-banner
      v-if="autorStore.hasError"
      class="bg-negative text-white q-mt-md"
      rounded
    >
      <template #avatar>
        <q-icon name="error"/>
      </template>
      {{ autorStore.error }}
      <template #action>
        <q-btn
          flat
          color="white"
          label="Fechar"
          @click="autorStore.limparErro()"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useQuasar} from 'quasar';
// import { useI18n } from 'vue-i18n';
import PesquisaPadrao from 'src/components/PesquisaPadrao.vue';
import AutorPesquisaItem from 'src/pages/Autores/AutorPesquisaItem.vue';
import {useAutorStore} from 'src/stores/autor';
import {useAutenticacaoStore} from 'src/stores/autorizacao/autenticacao';
// import { autorService } from 'src/services/autor';


const router = useRouter();
const $q = useQuasar();
// const { t } = useI18n();
const autorStore = useAutorStore();
const authStore = useAutenticacaoStore();

// State
const pesquisaRef = ref();
const paginaAtual = ref(1);

const filtros = reactive({
  termo: '',
  nome: '',
});

const paginacao = computed(() => ({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: autorStore.registros.length,
}));

// Methods
async function realizarPesquisa(termo: string) {
  console.log('🚀 Realizando pesquisa com termo:', termo);

  try {
    // Enviar filtro na estrutura que o backend espera
    await autorStore.pesquisar({
      filtros: {
        nome: termo
      },
      page: 0,           // ✅ Número da página (começa em 0)
      size: 20,          // ✅ Tamanho da página (padrão 20)
      ordenacao: 'nome', // ✅ Campo de ordenação
      offset: 0          // ✅ Offset para paginação
    });
  } catch (error) {
    console.error(' Erro na pesquisa:', error);
    $q.notify({
      type: 'negative',
      message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      position: 'top',
    });
  }
}

function limparPesquisa() {
  // Limpar filtros
  filtros.termo = '';
  filtros.nome = '';

  paginaAtual.value = 1;
  autorStore.reset();
}

async function aplicarFiltros() {
  paginaAtual.value = 1;

  await autorStore.pesquisar({
    filtros: {
      nome: filtros.nome
    },
    page: 0,
    size: 20,
    ordenacao: 'nome',
    offset: 0
  });
}

function limparFiltros() {
  filtros.termo = '';
  filtros.nome = '';
}

function criarAutor() {
  void router.push('/autores/novo');
}

function onAutorExcluido(id: number) {
  // O store já remove o item automaticamente, mas podemos fazer uma verificação adicional
  // ou implementar lógica específica se necessário

  // Atualizar a paginação se necessário
  if (autorStore.registros.length === 0 && autorStore.paginacao.totalRegistros > 0) {
    // Se não há mais registros na página atual, voltar para a página anterior
    const paginaAnterior = Math.max(0, autorStore.paginacao.paginaAtual - 1);
    if (paginaAnterior !== autorStore.paginacao.paginaAtual) {
      void autorStore.pesquisar({
        filtros: {},
        page: paginaAnterior,
        size: 20,
        ordenacao: 'nome',
        offset: paginaAnterior * 20
      });
    }
  }

  console.log(`✅ Autor com ID ${id} foi excluído da listagem`);
}

// Lifecycle
onMounted(async () => {
  // Carregar dados iniciais
  try {
    await autorStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    });
  } catch (error) {
    console.error(' Erro ao carregar dados iniciais:', error);
  }
});
</script>

<style scoped>

@media (max-width: 600px) {
  .q-table {
    font-size: 0.875rem;
  }
}
</style>
