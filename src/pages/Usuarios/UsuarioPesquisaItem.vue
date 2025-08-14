<template>
  <q-card class="q-mb-md" flat bordered>
    <q-card-section>
      <div class="row items-center q-gutter-md">
        <div class="col-grow">
          <div class="text-h6">{{ itemLocal.nome }}</div>
          <div class="text-subtitle2 text-grey-6">
            <q-icon name="person" size="sm" class="q-mr-xs" />
            {{ itemLocal.username }}
          </div>
          <div class="text-caption text-grey-6">
            <q-icon name="email" size="sm" class="q-mr-xs" />
            {{ itemLocal.email }}
          </div>
          <div class="text-caption text-grey-6">
            <q-icon name="work" size="sm" class="q-mr-xs" />
            Cargo: {{ getCargoLabel(itemLocal.cargo) }}
          </div>
          <div class="text-caption text-grey-6">
            <q-icon name="schedule" size="sm" class="q-mr-xs" />
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
              @click="editarUsuario"
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
        Tem certeza que deseja excluir o usuário <strong>"{{ itemLocal.nome }}"</strong>?
        <br>
        <small class="text-grey-6">Esta ação não pode ser desfeita.</small>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          flat
          label="Excluir"
          color="negative"
          @click="excluirUsuario"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUsuarioStore } from 'src/stores/usuario';
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao';
import type { UsuarioResponse } from 'src/types/usuario';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const props = defineProps<{
  item: UsuarioResponse;
  id: number;
}>();

const router = useRouter();
const $q = useQuasar();
const usuarioStore = useUsuarioStore();
const authStore = useAutenticacaoStore();

const itemLocal = computed(() => {
  console.log('🔍 UsuarioPesquisaItem - Props recebidos:', props)
  console.log('🔍 UsuarioPesquisaItem - Item:', props.item)
  return props.item
});
const showDeleteDialog = ref(false);

function formatarData(data: string) {
  if (!data) return '-';
  try {
    return format(new Date(data), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch {
    return data;
  }
}

function getCargoLabel(cargo: string): string {
  switch (cargo) {
    case 'A':
      return 'Administrador';
    case 'C':
      return 'Cliente';
    case 'F':
      return 'Funcionário';
    default:
      return cargo;
  }
}

function editarUsuario() {
  void router.push(`/usuarios/${itemLocal.value.id}/editar`);
}

async function excluirUsuario() {
  try {
    await usuarioStore.excluir(itemLocal.value.id);
    $q.notify({
      type: 'positive',
      message: 'Usuário excluído com sucesso!',
      position: 'top',
    });

    // Emitir evento para recarregar dados ou remover da listagem
    emit('excluiu', itemLocal.value.id);
  } catch (error) {
    console.error('❌ Erro na exclusão do usuário:', error);

    let errorMessage = 'Erro ao excluir usuário';

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
      timeout: 5000,
    });
  }
}

const emit = defineEmits<{
  excluiu: [id: number];
}>();
</script>

<style scoped>
.q-card {
  transition: all 0.3s ease;
}

.q-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
