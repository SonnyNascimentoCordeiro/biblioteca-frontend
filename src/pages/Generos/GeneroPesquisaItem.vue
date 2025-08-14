<template>
  <q-card class="q-mb-md" flat bordered>
    <q-card-section>
      <div class="row items-center q-gutter-md">
        <div class="col-grow">
          <div class="text-h6">{{ itemLocal.nome }}</div>
          <div class="text-caption text-grey-6">
            {{ itemLocal.descricao || 'Sem descrição' }}
          </div>
          <div class="text-caption text-grey-6">
            Criado em: {{ formatarData(itemLocal.criacao) }}
          </div>
        </div>

        <div class="col-auto">
          <div class="row q-gutter-xs">

            <!-- Botões de edição e exclusão só para usuários que não são clientes (userType 'C') -->
            <q-btn
              v-if="!authStore.isCliente"
              flat
              round
              dense
              color="secondary"
              icon="edit"
              @click="editarGenero"
              title="Editar"
            />
            <q-btn
              v-if="!authStore.isCliente"
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="showDeleteDialog = true"
              title="Excluir"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- Dialog de confirmação de exclusão -->
  <q-dialog v-model="showDeleteDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm text-h6">Confirmar Exclusão</span>
      </q-card-section>

      <q-card-section>
        Tem certeza que deseja excluir o gênero <strong>"{{ itemLocal.nome }}"</strong>?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          flat
          label="Excluir"
          color="negative"
          @click="excluirGenero"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useGeneroStore } from 'src/stores/genero'
import type { Genero } from 'src/types/genero'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao'

const props = defineProps<{
  item: Genero
}>()

const router = useRouter()
const $q = useQuasar()
const generoStore = useGeneroStore()
const authStore = useAutenticacaoStore()

const itemLocal = computed(() => props.item)
const showDeleteDialog = ref(false)

function formatarData(data: string) {
  if (!data) return '-'
  try {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return data
  }
}

function editarGenero() {
  void router.push(`/generos/${itemLocal.value.id}`)
}

async function excluirGenero() {
  try {
    await generoStore.excluir(itemLocal.value.id)
    $q.notify({
      type: 'positive',
      message: 'Gênero excluído com sucesso!',
      position: 'top',
    })

    // Emitir evento para recarregar dados ou remover da listagem
    emit('excluiu', itemLocal.value.id)
  } catch (error) {
    console.error(' Erro na exclusão do gênero:', error);

    // Capturar a mensagem de erro apropriada
    let errorMessage = 'Erro ao excluir gênero';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000, // Mostrar por 5 segundos para mensagens longas
    })
  }
}

const emit = defineEmits<{
  excluiu: [id: number]
  editar: [genero: Genero]
}>()
</script>
