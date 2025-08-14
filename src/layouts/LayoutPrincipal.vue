<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-brown-8 text-white">
      <q-toolbar>
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" 
          aria-label="Menu" 
          @click="toggleLeftDrawer" 
        />

        <q-toolbar-title> Sistema Biblioteca </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <div v-if="authStore.currentUser" class="column q-gutter-xs">
            <q-chip color="primary" 
                    text-color="white" 
                    icon="person">
              {{ authStore.currentUser.email }}
            </q-chip>
            <div v-if="authStore.userRoles.length > 0" class="row q-gutter-xs">
              <q-chip v-for="role in authStore.userRoles" 
                      :key="role"
                      size="sm"
                      color="secondary" 
                      text-color="white">
                {{ role }}
              </q-chip>
            </div>
          </div>
          <q-btn flat dense round icon="logout" 
                 aria-label="Logout" 
                 @click="handleLogout">
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Barra lateral movida para LayoutMenu -->
    <LayoutMenu v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import LayoutMenu from './LayoutMenu.vue';
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao';

const router = useRouter();
const authStore = useAutenticacaoStore();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
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
