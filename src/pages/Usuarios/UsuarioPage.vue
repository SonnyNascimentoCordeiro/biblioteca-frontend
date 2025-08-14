<template>
  <div class="usuario-page">
    <PaginaPadrao
      titulo="Gerenciamento de Usuários"
      subtitulo="Administrar usuários do sistema"
      :loading="false"
    >
      <template #conteudo>
        <div class="text-center q-pa-lg">
          <q-icon name="people" size="4rem" color="primary" />
          <div class="text-h5 text-primary q-mt-md q-mb-sm">
            Gerenciamento de Usuários
          </div>
          <div class="text-body1 text-grey-7">
            Funcionalidade em desenvolvimento para administradores
          </div>
          <div class="text-caption text-grey-6 q-mt-md">
            Apenas usuários com userType 'A' (Administrador) podem acessar esta página
          </div>
        </div>
      </template>
    </PaginaPadrao>
  </div>
</template>

<script setup lang="ts">
import PaginaPadrao from 'src/components/PaginaPadrao.vue'
</script>

<style scoped>
.usuario-page {
  min-height: 100%;
}
</style>
