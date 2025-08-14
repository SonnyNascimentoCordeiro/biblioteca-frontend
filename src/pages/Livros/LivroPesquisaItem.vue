<template>
  <q-card class="q-mb-md" flat bordered>
    <q-card-section>
      <div class="row items-center q-gutter-md">
        <div class="col-grow">
          <div class="text-h6">{{ itemLocal.titulo }}</div>
          <div class="text-caption text-grey-6">
            <div class="row q-gutter-md">
              <span><strong>Autor:</strong> {{ getAutorNome(itemLocal.idAutor) }}</span>
              <span><strong>Gênero:</strong> {{ getGeneroNome(itemLocal.idGenero) }}</span>
              <span><strong>Linguagem:</strong> {{ itemLocal.linguagem }}</span>
              <span><strong>Unidades:</strong> {{ itemLocal.qtdUnidade }}</span>
            </div>
            <div class="q-mt-xs">
              <strong>Descrição:</strong> {{ itemLocal.descricao || 'Sem descrição' }}
            </div>
            <div class="q-mt-xs text-grey-5">
              Criado em: {{ formatarData(itemLocal.criacao) }}
              <span v-if="itemLocal.edicao" class="q-ml-md">
                | Editado em: {{ formatarData(itemLocal.edicao) }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-auto">
          <div class="row q-gutter-xs">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="visibility"
              @click="visualizarLivro"
              title="Visualizar"
            />
            <!-- Botões de edição e exclusão só para usuários que não são clientes (userType 'C') -->
            <q-btn
              v-if="!authStore.isCliente"
              flat
              round
              dense
              color="secondary"
              icon="edit"
              @click="editarLivro"
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
        Tem certeza que deseja excluir o livro <strong>"{{ itemLocal.titulo }}"</strong>?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          flat
          label="Excluir"
          color="negative"
          @click="excluirLivro"
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
import { useLivroStore } from 'src/stores/livro'
import { useAutorStore } from 'src/stores/autor'
import { useGeneroStore } from 'src/stores/genero'
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao'
import type { Livro } from 'src/types/livro'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps<{
  item: Livro
}>()

const router = useRouter()
const $q = useQuasar()
const livroStore = useLivroStore()
const autorStore = useAutorStore()
const generoStore = useGeneroStore()
const authStore = useAutenticacaoStore()

const itemLocal = computed(() => props.item)
const showDeleteDialog = ref(false)

function formatarData(data: string) {
  if (!data) return '-'
  try {
    return format(new Date(data), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  } catch {
    return data
  }
}

function getAutorNome(idAutor: number): string {
  // Buscar o autor no store ou retornar ID se não encontrado
  const autor = autorStore.registros.find(a => a.id === idAutor)
  return autor ? autor.nome : `ID: ${idAutor}`
}

function getGeneroNome(idGenero: number): string {
  // Buscar o gênero no store ou retornar ID se não encontrado
  const genero = generoStore.registros.find(g => g.id === idGenero)
  return genero ? genero.nome : `ID: ${idGenero}`
}

function visualizarLivro() {
  void router.push(`/livros/${itemLocal.value.id}`)
}

function editarLivro() {
  void router.push(`/livros/${itemLocal.value.id}/editar`)
}

async function excluirLivro() {
  try {
    await livroStore.excluir(itemLocal.value.id)
    $q.notify({
      type: 'positive',
      message: 'Livro excluído com sucesso!',
      position: 'top',
    })

    // Emitir evento para recarregar dados ou remover da listagem
    emit('excluiu', itemLocal.value.id)
  } catch (error) {
    console.error(' Erro na exclusão do livro:', error);

    // Capturar a mensagem de erro apropriada
    let errorMessage = 'Erro ao excluir livro';

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
}>()
</script>
