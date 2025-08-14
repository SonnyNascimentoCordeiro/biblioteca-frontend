<template>
  <div class="usuario-cadastro">

    <CadastroPadrao
      :carregando="isLoading"
      @cancelar="cancelar"
      @salvar="onSubmit"
    >
      <div class="row col-12 no-padding">
        <!-- ID (só para edição) -->
        <div v-if="isEditando" class="col-12 col-md-2 q-pa-xs">
          <q-input
            v-model="form.id"
            label="ID"
            bottom-slots
            dense
            readonly
            standout="bg-primary text-white"
          />
        </div>

        <!-- Nome -->
        <div :class="isEditando ? 'col-12 col-md-10' : 'col-12'">
          <q-input
            v-model="form.nome"
            label="Nome Completo *"
            :rules="[val => !!val || 'Nome é obrigatório']"
            :error="!!errors.nome"
            :error-message="errors.nome"
            dense
            standout="bg-primary text-white"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="person"/>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row col-12 no-padding">
        <!-- Username -->
        <div class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model="form.username"
            label="Nome de Usuário *"
            :rules="[
                  val => !!val || 'Nome de usuário é obrigatório',
                  val => val.length >= 3 || 'Mínimo 3 caracteres',
                  val => /^[a-zA-Z0-9_]+$/.test(val) || 'Apenas letras, números e underscore'
                ]"
            :error="!!errors.username"
            :error-message="errors.username"
            dense
            standout="bg-primary text-white"
          >
            <template v-slot:prepend>
              <q-icon name="account_circle"/>
            </template>
          </q-input>
        </div>

        <!-- Email -->
        <div class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model="form.email"
            label="E-mail *"
            type="email"
            :rules="[
                  val => !!val || 'E-mail é obrigatório',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
                ]"
            :error="!!errors.email"
            :error-message="errors.email"
            dense
            standout="bg-primary text-white"
          >
            <template v-slot:prepend>
              <q-icon name="email"/>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row col-12 no-padding">
        <!-- Cargo -->
        <div class="col-12 col-md-6 q-pa-xs">
          <q-select
            v-model="form.cargo"
            :options="opcoesCargo"
            label="Cargo *"
            :rules="[val => !!val || 'Cargo é obrigatório']"
            :error="!!errors.cargo"
            :error-message="errors.cargo"
            dense
            standout="bg-primary text-white"
            emit-value
            map-options
            option-value="codigo"
            option-label="descricao"
          >
            <template v-slot:prepend>
              <q-icon name="work"/>
            </template>
          </q-select>
        </div>

        <!-- Senha (só para novos usuários) -->
        <div v-if="!isEditando" class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model="form.senha"
            label="Senha *"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
                  val => !!val || 'Senha é obrigatória',
                  val => val.length >= 6 || 'Mínimo 6 caracteres',
                  val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val) || 'Deve conter letra maiúscula, minúscula e número'
                ]"
            :error="!!errors.senha"
            :error-message="errors.senha"
            dense
            standout="bg-primary text-white"
          >
            <template v-slot:prepend>
              <q-icon name="lock"/>
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Confirmar Senha (só para novos usuários) -->
      <div v-if="!isEditando" class="row col-12 no-padding">
        <div class="col-12 col-md-6 q-pa-xs">
          <q-input
            v-model="confirmPassword"
            label="Confirmar Senha *"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[
                  val => !!val || 'Confirme sua senha',
                  val => val === form.senha || 'Senhas não coincidem'
                ]"
            dense
            standout="bg-primary text-white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline"/>
            </template>
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </div>
      </div>
    </CadastroPadrao>

    <!-- Mensagens de erro/sucesso -->
    <q-banner
      v-if="message"
      :class="messageType === 'success' ? 'bg-positive text-white' : 'bg-negative text-white'"
      class="q-mt-md"
    >
      {{ message }}
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Fechar"
          @click="message = ''"
        />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import CadastroPadrao from 'src/components/CadastroPadrao.vue'
import {useUsuarioStore} from 'src/stores/usuario'
import {CARGOS_DISPONIVEIS} from 'src/types/usuario'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const usuarioStore = useUsuarioStore()

// Verificar se está editando ou criando
const isEditando = computed(() => route.name === 'usuario-editar')
const isCriando = computed(() => route.name === 'usuario-novo')
const usuarioId = computed(() => route.params.id ? Number(route.params.id) : null)

// Estado do formulário
const form = reactive({
  id: 0,
  nome: '',
  username: '',
  email: '',
  cargo: '',
  senha: ''
})

// Estados da UI
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const confirmPassword = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Validação de erros
const errors = reactive({
  nome: '',
  username: '',
  email: '',
  cargo: '',
  senha: ''
})

// Opções de cargo
const opcoesCargo = CARGOS_DISPONIVEIS

// Limpar erros
const limparErros = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Limpar formulário
const limparFormulario = () => {
  form.nome = ''
  form.username = ''
  form.email = ''
  form.cargo = ''
  form.senha = ''
  confirmPassword.value = ''
  limparErros()
}

// Validar formulário
const validarFormulario = (): boolean => {
  limparErros()
  let valido = true

  if (!form.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
    valido = false
  }

  if (!form.username.trim()) {
    errors.username = 'Nome de usuário é obrigatório'
    valido = false
  } else if (form.username.length < 3) {
    errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres'
    valido = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Nome de usuário deve conter apenas letras, números e underscore'
    valido = false
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido'
    valido = false
  }

  if (!form.cargo) {
    errors.cargo = 'Cargo é obrigatório'
    valido = false
  }

  if (isCriando.value) {
    if (!form.senha) {
      errors.senha = 'Senha é obrigatória'
      valido = false
    } else if (form.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres'
      valido = false
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.senha)) {
      errors.senha = 'Senha deve conter letra maiúscula, minúscula e número'
      valido = false
    }

    if (form.senha !== confirmPassword.value) {
      $q.notify({
        type: 'negative',
        message: 'Senhas não coincidem',
        position: 'top'
      })
      valido = false
    }
  }

  return valido
}

// Carregar dados do usuário para edição
const carregarUsuario = async () => {
  if (!usuarioId.value) return

  try {
    isLoading.value = true
    const usuario = await usuarioStore.buscarPorId(usuarioId.value)

    form.id = usuario.id
    form.nome = usuario.nome
    form.username = usuario.username
    form.email = usuario.email
    form.cargo = usuario.cargo
    form.senha = '' // Não carregar senha

    console.log('✅ Usuário carregado para edição:', usuario)
  } catch (error) {
    console.error('❌ Erro ao carregar usuário:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do usuário',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

// Função para cancelar (voltar para lista)
const cancelar = () => {
  void router.push('/usuarios')
}

// Submeter formulário
const onSubmit = async () => {
  if (!validarFormulario()) {
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    if (isEditando.value) {
      // Atualizar usuário existente
      const dadosAtualizacao = {
        nome: form.nome.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        cargo: form.cargo
      }

      await usuarioStore.atualizar(usuarioId.value!, dadosAtualizacao)

      messageType.value = 'success'
      message.value = 'Usuário atualizado com sucesso!'

      $q.notify({
        type: 'positive',
        message: 'Usuário atualizado com sucesso!',
        position: 'top'
      })
    } else if (isCriando.value) {
      // Criar novo usuário
      const dadosNovoUsuario = {
        nome: form.nome.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        cargo: form.cargo,
        senha: form.senha
      }

      console.log('🔍 Dados do formulário antes de enviar:', {
        nome: dadosNovoUsuario.nome,
        username: dadosNovoUsuario.username,
        email: dadosNovoUsuario.email,
        cargo: dadosNovoUsuario.cargo,
        senha: dadosNovoUsuario.senha ? '***' : 'undefined'
      });

      await usuarioStore.criar(dadosNovoUsuario)

      messageType.value = 'success'
      message.value = 'Usuário criado com sucesso!'

      $q.notify({
        type: 'positive',
        message: 'Usuário criado com sucesso!',
        position: 'top'
      })

      // Limpar formulário após criação
      limparFormulario()
    }

    // Redirecionar para lista após 2 segundos
    setTimeout(() => {
      void router.push('/usuarios')
    }, 2000)
  } catch (error: unknown) {
    console.error('❌ Erro ao salvar usuário:', error)

    messageType.value = 'error'

    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { status?: number; data?: { message?: string } } }).response

      if (response?.status === 409) {
        message.value = 'Username ou e-mail já existe'
      } else if (response?.status === 400) {
        message.value = 'Dados inválidos. Verifique as informações.'
      } else if (response?.data?.message) {
        message.value = response.data.message
      } else {
        message.value = 'Erro ao salvar usuário. Tente novamente.'
      }
    } else if (error instanceof Error) {
      message.value = error.message || 'Erro ao salvar usuário. Tente novamente.'
    } else {
      message.value = 'Erro ao salvar usuário. Tente novamente.'
    }

    $q.notify({
      type: 'negative',
      message: message.value,
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (isEditando.value) {
    await carregarUsuario()
  } else if (isCriando.value) {
    // Limpar formulário para criação
    limparFormulario()
  }
})
</script>

<style scoped>
.usuario-cadastro {
  min-height: 100%;
}

.q-input, .q-select {
  margin-bottom: 16px;
}

.q-btn {
  border-radius: 8px;
  font-weight: 600;
}

.q-banner {
  border-radius: 8px;
}
</style>
