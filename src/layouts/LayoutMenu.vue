<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    class="menu-drawer"
    :width="280"
  >
    <div class="menu-header q-pa-md">
      <div class="text-h6 text-weight-bold text-white">
        Sistema Biblioteca
      </div>
      <div class="text-caption text-white q-mt-xs">
        Menu Principal
      </div>
    </div>

    <q-separator class="q-mb-md"/>

    <q-list class="menu-list">
      <q-item-label header class="text-brown-7 text-weight-medium">
        Navegação
      </q-item-label>

      <q-item
        clickable
        @click="navigateTo('/')"
        class="menu-item"
        :class="{ 'menu-item--active': $route.path === '/' }"
      >
        <q-item-section avatar>
          <q-icon name="home" color="brown-7"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Início</q-item-label>
          <q-item-label caption class="text-brown-6">Página principal</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="navigateTo('/autores')"
        class="menu-item"
        :class="{ 'menu-item--active': $route.path === '/autores' }"
      >
        <q-item-section avatar>
          <q-icon name="person" color="brown-7"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Autores</q-item-label>
          <q-item-label caption class="text-brown-6">Gerenciar autores</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="navigateTo('/livros')"
        class="menu-item"
        :class="{ 'menu-item--active': $route.path === '/livros' }"
      >
        <q-item-section avatar>
          <q-icon name="book" color="brown-7"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Livros</q-item-label>
          <q-item-label caption class="text-brown-6">Gerenciar livros</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="navigateTo('/generos')"
        class="menu-item"
        :class="{ 'menu-item--active': $route.path === '/generos' }"
      >
        <q-item-section avatar>
          <q-icon name="category" color="brown-7"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Gêneros</q-item-label>
          <q-item-label caption class="text-brown-6">Gerenciar gêneros</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md"/>

      <q-item-label header class="text-brown-7 text-weight-medium">
        Sistema
      </q-item-label>

      <q-item
        clickable
        @click="showUserProfile"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="settings" color="brown-7"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Configurações</q-item-label>
          <q-item-label caption class="text-brown-6">Preferências do usuário</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="handleLogout"
        class="menu-item menu-item--logout"
      >
        <q-item-section avatar>
          <q-icon name="logout" color="red-6"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium text-red-6">Sair</q-item-label>
          <q-item-label caption class="text-red-5">Encerrar sessão</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="menu-footer q-pa-md">
      <div class="text-caption text-brown-6 text-center">
        © 2025 Sistema Biblioteca
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import {Notify} from 'quasar';
import {useAutenticacaoStore} from 'src/stores/autorizacao/autenticacao';

// Props para controlar o drawer
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const router = useRouter();
const authStore = useAutenticacaoStore();


const leftDrawerOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Funções de navegação
function navigateTo(path: string) {
  void router.push(path);
  // Fechar o drawer em dispositivos móveis
  if (window.innerWidth < 1024) {
    leftDrawerOpen.value = false;
  }
}

function showUserProfile() {
  Notify.create({
    type: 'info',
    message: 'Funcionalidade em desenvolvimento',
    position: 'top',
  });
}

function handleLogout() {
  // Confirmar logout
  if (confirm('Tem certeza que deseja sair?')) {
    authStore.logout();
    Notify.create({
      type: 'positive',
      message: 'Logout realizado com sucesso!',
      position: 'top',
    });
    void router.push('/login');
  }
}
</script>

<style scoped>
.menu-drawer {
  background-color: var(--card-background-alt);
  border-right: 2px solid var(--card-border);
}

.menu-header {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  color: white;
  border-radius: 0 0 12px 12px;
  margin: -1px -1px 0 -1px;
}

.menu-list {
  background-color: transparent;
}

.menu-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--hover-color);
    transform: translateX(4px);
  }

    &.menu-item--active {
    background-color: var(--accent-color);
    color: white;
    
    .q-item-label {
      color: white !important;
    }
    
    .q-icon {
      color: white !important;
    }
  }
  
  &.menu-item--logout:hover {
    background-color: rgba(205, 92, 92, 0.1);
  }
}

.menu-footer {
  border-top: 1px solid var(--card-border);
  background-color: var(--background-secondary);
  margin: 0 -1px -1px -1px;
  border-radius: 0 0 0 8px;
}

/* Estilos para dispositivos móveis */
@media (max-width: 1023px) {
  .menu-drawer {
    width: 100% !important;
  }
}
</style>
