<template>
  <div class="usuario-page">
    <PaginaPadrao
      titulo="Gerenciamento de Usuários"
      subtitulo="Administrar usuários do sistema (exceto administradores)"
      :loading="false"
    >
      <template #conteudo>
        <UsuarioPesquisa />
      </template>
    </PaginaPadrao>
  </div>
</template>

<script setup lang="ts">
import PaginaPadrao from 'src/components/PaginaPadrao.vue'
import UsuarioPesquisa from 'src/pages/Usuarios/UsuarioPesquisa.vue'
</script>

<style scoped>
.usuario-page {
  min-height: 100%;
}
</style>
