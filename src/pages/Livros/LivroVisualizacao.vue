<template>
  <div class="livro-visualizacao">
    <div v-if="livroStore.isLoading" class="text-center q-pa-lg">
      <q-spinner size="3rem" color="primary" />
      <div class="q-mt-md">Carregando livro...</div>
    </div>

    <div v-else-if="livroStore.livro" class="livro-detalhes">
      <q-card class="q-pa-lg">
        <q-card-section>
          <div class="row items-center q-mb-lg">
            <div class="col">
              <div class="text-h4">{{ livroStore.livro.titulo }}</div>
              <div class="text-subtitle1 text-grey-6">
                ID: {{ livroStore.livro.id }}
              </div>
            </div>

            <div class="col-auto">
              <div class="row q-gutter-xs">
                <q-btn
                  color="secondary"
                  icon="edit"
                  label="Editar"
                  @click="editarLivro"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  label="Excluir"
                  @click="showDeleteDialog = true"
                />
              </div>
            </div>
          </div>

          <q-separator class="q-mb-lg" />

          <div class="row q-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Informações Básicas</div>

              <div class="q-gutter-y-md">
                <div>
                  <strong>Título:</strong>
                  <div class="q-ml-md">{{ livroStore.livro.titulo }}</div>
                </div>

                <div>
                  <strong>Descrição:</strong>
                  <div class="q-ml-md">{{ livroStore.livro.descricao || 'Sem descrição' }}</div>
                </div>

                <div>
                  <strong>Linguagem:</strong>
                  <div class="q-ml-md">{{ livroStore.livro.linguagem }}</div>
                </div>

                <div>
                  <strong>Quantidade de Unidades:</strong>
                  <div class="q-ml-md">{{ livroStore.livro.qtdUnidade }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Relacionamentos</div>

              <div class="q-gutter-y-md">
                <div>
                  <strong>Autor:</strong>
                  <div class="q-ml-md">{{ getAutorNome(livroStore.livro.idAutor) }}</div>
                </div>

                <div>
                  <strong>Gênero:</strong>
                  <div class="q-ml-md">{{ getGeneroNome(livroStore.livro.idGenero) }}</div>
                </div>
              </div>

              <div class="text-h6 q-mt-lg q-mb-md">Datas</div>

              <div class="q-gutter-y-md">
                <div>
                  <strong>Criado em:</strong>
                  <div class="q-ml-md">{{ formatarData(livroStore.livro.criacao) }}</div>
                </div>

                <div v-if="livroStore.livro.edicao">
                  <strong>Editado em:</strong>
                  <div class="q-ml-md">{{ formatarData(livroStore.livro.edicao) }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="text-center q-pa-lg">
      <q-icon name="error" size="4rem" color="negative" />
      <div class="text-h6 q-mt-md">Livro não encontrado</div>
      <div class="q-mt-md">
        <q-btn
          color="primary"
          label="Voltar para Lista"
          @click="voltarParaLista"
        />
      </div>
    </div>

    <!-- Dialog de confirmação de exclusão -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmar Exclusão</span>
        </q-card-section>

        <q-card-section>
          Tem certeza que deseja excluir o livro <strong>"{{ livroStore.livro?.titulo }}"</strong>?
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
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLivroStore } from 'src/stores/livro'
import { useAutorStore } from 'src/stores/autor'
import { useGeneroStore } from 'src/stores/genero'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const livroStore = useLivroStore()
const autorStore = useAutorStore()
const generoStore = useGeneroStore()

const showDeleteDialog = ref(false)

// Lifecycle
onMounted(async () => {
  await carregarLivro()
})

// Métodos
async function carregarLivro() {
  try {
    const id = Number(route.params.id)
    await livroStore.buscarPorId(id)
  } catch (error) {
    console.error(' Erro ao carregar livro:', error)
  }
}

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

function editarLivro() {
  if (livroStore.livro) {
    void router.push(`/livros/${livroStore.livro.id}/editar`)
  }
}

async function excluirLivro() {
  if (!livroStore.livro) return

  try {
    await livroStore.excluir(livroStore.livro.id)
    $q.notify({
      type: 'positive',
      message: 'Livro excluído com sucesso!',
      position: 'top',
    })

    // Redirecionar para a listagem
    void router.push('/livros')
  } catch (error) {
    console.error(' Erro ao excluir livro:', error)

    // A notificação de erro será exibida pelo banner
    // que está conectado ao store
  }
}

function voltarParaLista() {
  void router.push('/livros')
}
</script>

<style scoped>
.livro-visualizacao {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.livro-detalhes {
  width: 100%;
}
</style>
