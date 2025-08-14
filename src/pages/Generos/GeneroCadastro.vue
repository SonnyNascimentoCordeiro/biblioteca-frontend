<template>
  <CadastroPadrao
    :carregando="store.isLoading"
    @cancelar="cancelar"
    @salvar="salvar">
    <div class="row col-12 no-padding">
      <div class="col-12 col-md-2 q-pa-xs">
        <q-input
          v-model="cadastro.id"
          :label="t('id')"
          bottom-slots
          dense
          readonly
          standout="bg-primary text-white" />
      </div>
      <div class="col-12 col-md-5 q-pa-xs">
        <q-input
          v-model="cadastro.nome"
          :autofocus="true"
          :label="t('nome')"
          :rules="[(val: any) => !!val || t('eObrigatorio', [t('nome')])]"
          dense
          standout="bg-primary text-white" />
      </div>
      <div class="col-12 col-md-5 q-pa-xs">
        <q-input
          v-model="cadastro.descricao"
          :label="t('descricao')"
          dense
          standout="bg-primary text-white" />
      </div>
    </div>
  </CadastroPadrao>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue'
import CadastroPadrao from 'components/CadastroPadrao.vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGeneroStore } from 'stores/genero'
import { useI18n } from 'vue-i18n'
import type { Genero } from 'src/types/genero'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const store = useGeneroStore()
const parametro = ref('')
const { generoSelecionado } = storeToRefs(store)

// Garantir que cadastro nunca seja null
const cadastro = computed<Genero>(() => {
  if (!generoSelecionado.value) {
    return {
      id: 0,
      nome: '',
      descricao: '',
      criacao: ''
    }
  }
  return generoSelecionado.value
})

async function salvar() {
  try {
    if (cadastro.value.id === 0) {
      await store.criar({
        nome: cadastro.value.nome,
        descricao: cadastro.value.descricao
      })
    } else {
      await store.atualizar(cadastro.value.id, {
        nome: cadastro.value.nome,
        descricao: cadastro.value.descricao
      })
    }
    void router.back()
  } catch (error) {
    console.error('Erro ao salvar gênero:', error)
  }
}

async function editar(id: string) {
  try {
    await store.buscarPorId(Number(id))
  } catch (error) {
    console.error('Erro ao buscar gênero:', error)
  }
}

async function iniciar() {
  if (parametro.value === 'nova') {
    store.generoSelecionado = {
      id: 0,
      nome: '',
      descricao: '',
      criacao: ''
    }
  } else {
    // Verificar se o parâmetro é um número válido
    const id = Number(parametro.value)
    if (!isNaN(id) && id > 0) {
      await editar(parametro.value)
    } else {
      // Se não for um ID válido, redirecionar para nova
      void router.push('/generos/novo')
    }
  }
}

function cancelar() {
  void router.back()
}

onBeforeMount(async () => {
  parametro.value = route.params.id?.toString() || 'nova'
  await iniciar()
})
</script>

<style scoped>
.genero-cadastro {
  max-width: 800px;
  margin: 0 auto;
}
</style>
