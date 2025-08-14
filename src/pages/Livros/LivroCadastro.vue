<template>
  <div class="livro-cadastro">
    <CadastroPadrao
      :carregando="livroStore.isLoading"
      @cancelar="cancelar"
      @salvar="salvarLivro">

      <!-- Primeira linha: ID e Título -->
      <div class="row col-12 no-padding">
        <div class="col-12 col-md-2 q-pa-xs">
          <q-input
            v-model="form.id"
            :label="t('id')"
            bottom-slots
            dense
            readonly
            standout="bg-primary text-white" />
        </div>
        <div class="col-12 col-md-10 q-pa-xs">
          <q-input
            v-model="form.titulo"
            :autofocus="true"
            :label="t('titulo')"
            :rules="[(val: any) => !!val || t('eObrigatorio', [t('titulo')])]"
            dense
            standout="bg-primary text-white" />
        </div>
      </div>

      <!-- Segunda linha: Linguagem e Quantidade -->
      <div class="row col-12 no-padding">
        <div class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model="form.linguagem"
            :label="t('linguagem')"
            :rules="[(val: any) => !!val || t('eObrigatorio', [t('linguagem')])]"
            dense
            standout="bg-primary text-white" />
        </div>
        <div class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model.number="form.qtdUnidade"
            :label="t('quantidade')"
            type="number"
            :rules="[
              (val: any) => !!val || t('eObrigatorio', [t('quantidade')]),
              (val: any) => val > 0 || t('deveSerMaiorQueZero', [t('quantidade')])
            ]"
            dense
            standout="bg-primary text-white" />
        </div>
      </div>

      <!-- Terceira linha: Autor e Gênero -->
      <div class="row col-12 no-padding">
        <div class="col-12 col-md-6 q-pa-xs">
          <AutorSelect
            v-model="autorSelecionado"
            :obrigatorio="true"
            label-compl="Autor" />
        </div>
        <div class="col-12 col-md-6 q-pa-xs">
          <GeneroSelect
            v-model="generoSelecionado"
            :obrigatorio="true"
            label-compl="Gênero" />
        </div>
      </div>

      <!-- Quarta linha: Descrição (largura total) -->
      <div class="row col-12 no-padding">
        <div class="col-12 q-pa-xs">
          <q-input
            v-model="form.descricao"
            :label="t('descricao')"
            type="textarea"
            rows="4"
            dense
            standout="bg-primary text-white" />
        </div>
      </div>

    </CadastroPadrao>

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
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLivroStore } from 'src/stores/livro'
import AutorSelect from 'src/components/selects/AutorSelect.vue'
import GeneroSelect from 'src/components/selects/GeneroSelect.vue'
import CadastroPadrao from 'src/components/CadastroPadrao.vue'
import type { LivroRequest } from 'src/types/livro'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const livroStore = useLivroStore()
const { t } = useI18n()

// Estado local
const form = ref<LivroRequest & { id: number }>({
  id: 0,
  titulo: '',
  descricao: '',
  linguagem: '',
  qtdUnidade: 1,
  idAutor: 0,
  idGenero: 0
})

const autorSelecionado = ref<{ id: number; nome: string } | undefined>(undefined)
const generoSelecionado = ref<{ id: number; nome: string } | undefined>(undefined)

// Computed para garantir que o cadastro nunca seja null
const cadastro = computed(() => {
  return {
    id: form.value.id,
    titulo: form.value.titulo,
    descricao: form.value.descricao,
    linguagem: form.value.linguagem,
    qtdUnidade: form.value.qtdUnidade,
    idAutor: form.value.idAutor,
    idGenero: form.value.idGenero
  }
})

// Computed
const isEditing = computed(() => !!route.params.id)

// Lifecycle
onMounted(async () => {
  if (isEditing.value) {
    await carregarLivro()
  }
})

// Watchers para monitorar mudanças nos selects
watch(autorSelecionado, (newVal) => {
  if (newVal && newVal.id) {
    form.value.idAutor = newVal.id
  }
}, { deep: true })

watch(generoSelecionado, (newVal) => {
  if (newVal && newVal.id) {
    form.value.idGenero = newVal.id
  }
}, { deep: true })

// Métodos
async function carregarLivro() {
  try {
    const id = Number(route.params.id)
    const livro = await livroStore.buscarPorId(id)

    // Preencher o formulário com os dados do livro
    form.value = {
      id: livro.id,
      titulo: livro.titulo,
      descricao: livro.descricao || '',
      linguagem: livro.linguagem,
      qtdUnidade: livro.qtdUnidade,
      idAutor: livro.idAutor,
      idGenero: livro.idGenero
    }

    // Preencher os selects com objetos válidos
    if (livro.idAutor) {
      autorSelecionado.value = { id: livro.idAutor, nome: '' }
    }
    if (livro.idGenero) {
      generoSelecionado.value = { id: livro.idGenero, nome: '' }
    }
  } catch (error) {
    console.error('Erro ao carregar livro:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do livro',
      position: 'top',
    })
  }
}

async function salvarLivro() {
  try {
    // Verificar se os campos obrigatórios foram preenchidos
    if (!cadastro.value.titulo || !cadastro.value.linguagem || !cadastro.value.idAutor || !cadastro.value.idGenero) {
      $q.notify({
        type: 'warning',
        message: 'Todos os campos obrigatórios devem ser preenchidos',
        position: 'top',
      })
      return
    }

    if (isEditing.value) {
      const id = Number(route.params.id)
      await livroStore.atualizar(id, cadastro.value)

      $q.notify({
        type: 'positive',
        message: 'Livro atualizado com sucesso!',
        position: 'top',
      })
    } else {
      await livroStore.criar(cadastro.value)

      $q.notify({
        type: 'positive',
        message: 'Livro criado com sucesso!',
        position: 'top',
      })
    }

    // Redirecionar para a listagem
    void router.push('/livros')
  } catch (error) {
    console.error('Erro ao salvar livro:', error)
    
    // A notificação de erro será exibida pelo banner
    // que está conectado ao store
  }
}

function cancelar() {
  void router.push('/livros')
}
</script>

<style scoped>
.livro-cadastro {
  width: 100%;
  margin: 0 auto;
}
</style>
