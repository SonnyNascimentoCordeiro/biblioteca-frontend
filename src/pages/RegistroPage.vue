<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <q-card class="registro-card">
          <!-- Header -->
          <q-card-section class="text-center q-pt-lg">
            <q-icon name="person_add" size="4rem" color="primary" />
            <div class="text-h4 text-weight-bold text-primary q-mt-md q-mb-xs">
              Criar Conta
            </div>
            <div class="text-subtitle2 text-grey-7 q-ma-none">
              Preencha os dados para se registrar
            </div>
          </q-card-section>

          <!-- Formulário -->
          <q-card-section class="q-px-lg q-pb-lg">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <!-- Nome -->
              <q-input
                v-model="form.nome"
                label="Nome Completo *"
                outlined
                :rules="[val => !!val || 'Nome é obrigatório']"
                :error="!!errors.nome"
                :error-message="errors.nome"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <!-- Username -->
              <q-input
                v-model="form.username"
                label="Nome de Usuário *"
                outlined
                :rules="[
                  val => !!val || 'Nome de usuário é obrigatório',
                  val => val.length >= 3 || 'Mínimo 3 caracteres',
                  val => /^[a-zA-Z0-9_]+$/.test(val) || 'Apenas letras, números e underscore'
                ]"
                :error="!!errors.username"
                :error-message="errors.username"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>

              <!-- Email -->
              <q-input
                v-model="form.email"
                label="E-mail *"
                type="email"
                outlined
                :rules="[
                  val => !!val || 'E-mail é obrigatório',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
                ]"
                :error="!!errors.email"
                :error-message="errors.email"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <!-- Senha -->
              <q-input
                v-model="form.senha"
                label="Senha *"
                :type="showPassword ? 'text' : 'password'"
                outlined
                :rules="[
                  val => !!val || 'Senha é obrigatória',
                  val => val.length >= 6 || 'Mínimo 6 caracteres',
                  val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val) || 'Deve conter letra maiúscula, minúscula e número'
                ]"
                :error="!!errors.senha"
                :error-message="errors.senha"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Confirmar Senha -->
              <q-input
                v-model="confirmPassword"
                label="Confirmar Senha *"
                :type="showConfirmPassword ? 'text' : 'password'"
                outlined
                :rules="[
                  val => !!val || 'Confirme sua senha',
                  val => val === form.senha || 'Senhas não coincidem'
                ]"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

              <!-- Botões -->
              <div class="q-pt-md">
                <q-btn
                  type="submit"
                  label="Criar Conta"
                  color="primary"
                  size="lg"
                  class="full-width"
                  :loading="isLoading"
                  :disable="isLoading"
                >
                  <template v-slot:loading>
                    <q-spinner-dots />
                  </template>
                </q-btn>
              </div>
            </q-form>

            <!-- Link para voltar ao login -->
            <div class="text-center q-pt-md">
              <q-separator class="q-my-md" />
              <p class="text-grey-6 q-ma-none q-mb-sm">
                Já tem uma conta?
              </p>
              <q-btn
                label="Voltar ao Login"
                color="secondary"
                size="md"
                flat
                @click="voltarLogin"
                :disable="isLoading"
              />
            </div>

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
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao'
import type { UsuarioRegistro, RegistroResponse } from 'src/types/usuario'
import { authService } from 'src/services/auth'

// Composables
const router = useRouter()
const $q = useQuasar()
const authStore = useAutenticacaoStore()

// Estado do formulário
const form = reactive<UsuarioRegistro>({
  id: 0,
  nome: '',
  username: '',
  email: '',
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
  senha: ''
})

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

  return valido
}

// Submeter formulário
const onSubmit = async () => {
  if (!validarFormulario()) {
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    // Preparar dados para envio
    const dadosRegistro: UsuarioRegistro = {
      id: 0,
      nome: form.nome.trim(),
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      senha: form.senha
    }

    console.log('📝 Dados do formulário:', { ...dadosRegistro, senha: '***' })
    console.log('🔗 Tentando registrar usuário...')

    // 1. Registrar usuário
    const response: RegistroResponse = await authService.registrar(dadosRegistro)

    if (response) {
      console.log('✅ Registro bem-sucedido:', response)
      messageType.value = 'success'
      message.value = 'Conta criada com sucesso! Fazendo login automático...'

      $q.notify({
        type: 'positive',
        message: 'Conta criada com sucesso!',
        position: 'top'
      })

      // 2. Fazer login automático com os dados registrados
      try {
        console.log('🔐 Iniciando login automático...')
        const loginResult = await authService.login({
          username: form.username.trim(),
          senha: form.senha
        })

        if (loginResult.token) {
          console.log('✅ Login automático bem-sucedido:', loginResult)

          // 3. Atualizar store de autenticação
          const success = await authStore.login({
            username: form.username.trim(),
            senha: form.senha
          })

          if (success) {
            $q.notify({
              type: 'positive',
              message: 'Login realizado com sucesso!',
              position: 'top'
            })

            // 4. Limpar formulário
            limparFormulario()

            // 5. Redirecionar para página principal após 2 segundos
            setTimeout(() => {
              void router.push('/')
            }, 2000)
          } else {
            throw new Error('Falha no login automático')
          }
        }
      } catch (loginError: unknown) {
        console.error('❌ Erro no login automático:', loginError)

        // Se o login automático falhar, redirecionar para login
        message.value = 'Conta criada! Faça login manualmente.'
        setTimeout(() => {
          void router.push('/login')
        }, 3000)
      }
    }
  } catch (error: unknown) {
    console.error('❌ Erro ao registrar:', error)

    messageType.value = 'error'

    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { status?: number; data?: { message?: string } } }).response

      console.log('📊 Detalhes do erro:', {
        status: response?.status,
        data: response?.data,
        message: response?.data?.message
      })

      if (response?.status === 403) {
        message.value = 'Acesso negado. Verifique se o servidor está rodando e acessível.'
      } else if (response?.status === 409) {
        message.value = 'Usuário ou e-mail já existe'
      } else if (response?.status === 400) {
        message.value = 'Dados inválidos. Verifique as informações.'
      } else if (response?.data?.message) {
        message.value = response.data.message
      } else {
        message.value = 'Erro ao criar conta. Tente novamente.'
      }
    } else if (error instanceof Error) {
      message.value = error.message || 'Erro ao criar conta. Tente novamente.'
    } else {
      message.value = 'Erro ao criar conta. Tente novamente.'
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

// Voltar para login
const voltarLogin = () => {
  void router.push('/login')
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.registro-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.registro-card .q-card__section {
  padding: 24px;
}

.q-input {
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
