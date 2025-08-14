<template>
  <div class="usuario-pesquisa">
    <PesquisaPadrao
      ref="pesquisaRef"
      label="Buscar usuários"
      placeholder="Digite o nome, username ou email..."
      :loading="usuarioStore.isLoading"
      :total-resultados="usuarioStore.registros.length"
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
          label="Novo Usuário"
          @click="criarUsuario"
        />
      </template>

      <!-- Filtros avançados -->
      <template #filtros>
        <div class="row q-gutter-md">
          <div class="col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.nome"
              label="Nome"
              clearable
              dense
            />
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.username"
              label="Username"
              clearable
              dense
            />
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model="filtros.email"
              label="E-mail"
              clearable
              dense
            />
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <q-select
              v-model="filtros.cargo"
              :options="opcoesCargo"
              label="Cargo"
              clearable
              dense
              emit-value
              map-options
            />
          </div>
        </div>
      </template>

      <template #listagem>
        <!-- Debug: Mostrar informações dos dados -->
        <div class="q-mb-md q-pa-sm bg-grey-2 rounded">
          <div class="text-caption text-grey-7">
            Debug: Total de registros: {{ usuarioStore.registros.length }} | 
            Loading: {{ usuarioStore.isLoading }} | 
            Error: {{ usuarioStore.hasError }}
          </div>
          <div v-if="usuarioStore.registros.length > 0" class="text-caption text-grey-7">
            Primeiro usuário: {{ usuarioStore.registros[0]?.nome }} (ID: {{ usuarioStore.registros[0]?.id }})
          </div>
        </div>

        <div v-if="usuarioStore.registros.length > 0">
          <UsuarioPesquisaItem
            v-for="(usuario, index) in usuarioStore.registros"
            :key="usuario.id"
            :id="index"
            :item="usuario"
            @excluiu="onUsuarioExcluido"
          />
        </div>
        <div v-else-if="!usuarioStore.isLoading" class="text-center q-pa-lg">
          <q-icon name="people" size="4rem" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">Nenhum usuário encontrado</div>
          <div class="text-caption text-grey-5">Tente ajustar os filtros de pesquisa</div>
          <div class="text-caption text-grey-5 q-mt-sm">
            <q-icon name="info" size="sm" />
            Apenas usuários com cargo diferente de 'A' (Administrador) são exibidos
          </div>
        </div>
      </template>
    </PesquisaPadrao>

    <!-- Mensagem de erro -->
    <q-banner
      v-if="usuarioStore.hasError"
      class="bg-negative text-white q-mt-md"
      rounded
    >
      <template #avatar>
        <q-icon name="error"/>
      </template>
      {{ usuarioStore.error }}
      <template #action>
        <q-btn
          flat
          color="white"
          label="Fechar"
          @click="usuarioStore.limparErro()"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import PesquisaPadrao from 'src/components/PesquisaPadrao.vue';
import UsuarioPesquisaItem from 'src/pages/Usuarios/UsuarioPesquisaItem.vue';
import { useUsuarioStore } from 'src/stores/usuario';
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao';
import type { UsuarioFiltros } from 'src/types/usuario';

const router = useRouter();
const $q = useQuasar();
const usuarioStore = useUsuarioStore();
const authStore = useAutenticacaoStore();

// State
const pesquisaRef = ref();
const paginaAtual = ref(1);

const filtros = reactive<UsuarioFiltros>({
  nome: '',
  username: '',
  email: '',
  cargo: ''
});

const opcoesCargo = [
  { label: 'Cliente', value: 'C' },
  { label: 'Funcionário', value: 'F' }
];

const paginacao = computed(() => ({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: usuarioStore.registros.length,
}));

// Methods
async function realizarPesquisa(termo: string) {
  console.log('🚀 Realizando pesquisa de usuários com termo:', termo);

  try {
    await usuarioStore.pesquisar({
      filtros: {
        nome: termo,
        username: termo,
        email: termo
      },
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    });
  } catch (error) {
    console.error('❌ Erro na pesquisa de usuários:', error);
    $q.notify({
      type: 'negative',
      message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      position: 'top',
    });
  }
}

function limparPesquisa() {
  filtros.nome = '';
  filtros.username = '';
  filtros.email = '';
  filtros.cargo = '';

  paginaAtual.value = 1;
  usuarioStore.reset();
}

async function aplicarFiltros() {
  paginaAtual.value = 1;

  await usuarioStore.pesquisar({
    filtros: {
      nome: filtros.nome,
      username: filtros.username,
      email: filtros.email,
      cargo: filtros.cargo
    },
    page: 0,
    size: 20,
    ordenacao: 'nome',
    offset: 0
  });
}

function limparFiltros() {
  filtros.nome = '';
  filtros.username = '';
  filtros.email = '';
  filtros.cargo = '';
}

function criarUsuario() {
  void router.push('/usuarios/novo');
}

function onUsuarioExcluido(id: number) {
  // O store já remove o item automaticamente, mas podemos fazer uma verificação adicional
  if (usuarioStore.registros.length === 0 && usuarioStore.paginacao.totalRegistros > 0) {
    const paginaAnterior = Math.max(0, usuarioStore.paginacao.paginaAtual - 1);
    if (paginaAnterior !== usuarioStore.paginacao.paginaAtual) {
      void usuarioStore.pesquisar({
        filtros: {},
        page: paginaAnterior,
        size: 20,
        ordenacao: 'nome',
        offset: paginaAnterior * 20
      });
    }
  }

  console.log(`✅ Usuário com ID ${id} foi excluído da listagem`);
}

// Lifecycle
onMounted(async () => {
  // Carregar dados iniciais
  try {
    await usuarioStore.pesquisar({
      filtros: {},
      page: 0,
      size: 20,
      ordenacao: 'nome',
      offset: 0
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dados iniciais de usuários:', error);
  }
});
</script>

<style scoped>
.usuario-pesquisa {
  min-height: 100%;
}
</style>
