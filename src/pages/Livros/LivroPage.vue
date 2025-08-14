<template>
  <PaginaPadrao :titulo="tituloPagina">
    <!-- Navegação entre pesquisa e cadastro -->
    <div class="row q-mb-md">
      <div class="col-12">
        <q-tabs
          v-model="tabAtiva"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            name="pesquisa"
            :label="t('pesquisa')"
            icon="search"
            @click="navegarParaPesquisa"
          />
          <q-tab
            name="cadastro"
            :label="t('cadastro')"
            icon="add"
            @click="navegarParaCadastro"
          />
        </q-tabs>
      </div>
    </div>

    <!-- Conteúdo das rotas children -->
    <router-view />
  </PaginaPadrao>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginaPadrao from 'components/PaginaPadrao.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Determinar qual tab está ativa baseado na rota
const tabAtiva = computed(() => {
  if (route.name === 'livros') return 'pesquisa'
  return 'cadastro'
})

// Título da página baseado na rota
const tituloPagina = computed(() => {
  if (route.name === 'livros') return t('pesquisa', 'livro')
  if (route.name === 'livro-novo') return t('novo', 'livro')
  if (route.name === 'livro-editar') return t('editar', 'livro')
  return t('livro')
})

// Navegação
function navegarParaPesquisa() {
  if (route.name !== 'livros') {
    void router.push({ name: 'livros' })
  }
}

function navegarParaCadastro() {
  if (route.name === 'livros') {
    void router.push({ name: 'livro-novo' })
  }
}

// Observar mudanças na rota para atualizar a tab ativa
watch(() => route.name, (novoNome) => {
  if (novoNome === 'livros') {
    // Não fazer nada, já está na pesquisa
  } else if (novoNome === 'livro-novo' || novoNome === 'livro-editar') {
    // Não fazer nada, já está no cadastro
  }
})
</script>

<style scoped>
.q-tabs {
  background-color: var(--card-background-alt);
  border-radius: 8px;
  border: 1px solid var(--card-border);
}
</style>
