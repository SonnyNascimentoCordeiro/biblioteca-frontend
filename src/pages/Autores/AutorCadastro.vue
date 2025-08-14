<template>
  <CadastroPadrao
    :carregando="loading"
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
      <div class="col-12 col-md-10 q-pa-xs">
        <q-input
          v-model="cadastro.nome"
          :autofocus="true"
          :label="t('nome')"
          :rules="[(val: any) => !!val || t('eObrigatorio', [t('nome')])]"
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
import { useAutorStore } from 'stores/autor'
import { useI18n } from 'vue-i18n'
import type { Autor } from 'src/types/autor'

const { t } = useI18n()
const store = useAutorStore()
const router = useRouter()
const route = useRoute()
const parametro = ref('')
const loading = ref(true)
const { autorSelecionado } = storeToRefs(store)

// Garantir que cadastro nunca seja null
const cadastro = computed<Autor>(() => {
  if (!autorSelecionado.value) {
    return {
      id: 0,
      nome: '',
      criacao: '',
      edicao: ''
    }
  }
  return autorSelecionado.value
})

async function salvar() {
  loading.value = true
  try {
    await store.salvar(cadastro.value)
    loading.value = false
    void router.back()
  } catch {
    loading.value = false
  }
}

async function editar(id: string) {
  loading.value = true
  try {
    await store.buscarPorId(Number(id))
    // Preencher campo edicao com data atual no formato dd/MM/yyyy HH:mm:ss
    const hoje = new Date()
    const dia = String(hoje.getDate()).padStart(2, '0')
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const ano = hoje.getFullYear()
    const hora = String(hoje.getHours()).padStart(2, '0')
    const minuto = String(hoje.getMinutes()).padStart(2, '0')
    const segundo = String(hoje.getSeconds()).padStart(2, '0')

    if (store.autorSelecionado) {
      store.autorSelecionado.edicao = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`
    }
  } finally {
    loading.value = false
  }
}

async function iniciar() {
  if (parametro.value === 'nova') {
    store.autorSelecionado = {
      id: 0,
      nome: '',
      criacao: '',
      edicao: ''
    }
    loading.value = false
  } else {
    // Verificar se o parâmetro é um número válido
    const id = Number(parametro.value)
    if (!isNaN(id) && id > 0) {
      await editar(parametro.value)
    } else {
      // Se não for um ID válido, redirecionar para nova
      void router.push('/autores/novo')
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
.autor-cadastro {
  max-width: 800px;
  margin: 0 auto;
}
</style>
