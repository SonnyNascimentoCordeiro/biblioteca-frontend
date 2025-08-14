<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <q-card class="login-card">
          <q-card-section class="text-center q-pt-lg">
            <div class="text-h4 text-weight-bold text-primary">
              Sistema Biblioteca
            </div>
            <div class="text-subtitle2 text-grey-7 q-mt-sm">
              Faça login para continuar
            </div>
          </q-card-section>

          <q-card-section class="q-px-lg q-pb-lg">
            <q-form @submit="handleLogin" class="q-gutter-md">
              <q-input
                v-model="formData.username"
                filled
                label="Email ou Usuário"
                type="text"
                lazy-rules
                :rules="[val => !!val || 'Campo obrigatório']"
                :disable="authStore.isLoading"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="formData.senha"
                filled
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                lazy-rules
                :rules="[val => !!val || 'Campo obrigatório']"
                :disable="authStore.isLoading"
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

              <div v-if="authStore.hasError" class="text-negative text-center">
                {{ authStore.error }}
              </div>

              <div class="q-pt-md">
                <q-btn
                  type="submit"
                  label="Entrar"
                  color="primary"
                  size="lg"
                  class="full-width"
                  :loading="authStore.isLoading"
                  :disable="!formData.username || !formData.senha"
                />
              </div>
            </q-form>

            <!-- Link para registro -->
            <div class="text-center q-pt-md">
              <q-separator class="q-my-md" />
              <p class="text-grey-6 q-ma-none q-mb-sm">
                Não tem uma conta?
              </p>
              <q-btn
                label="Criar Conta"
                color="secondary"
                size="md"
                flat
                @click="irParaRegistro"
                :disable="authStore.isLoading"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao';

const router = useRouter();
const authStore = useAutenticacaoStore();

const showPassword = ref(false);
const formData = reactive({
  username: '',
  senha: '',
});

const handleLogin = async () => {
  authStore.clearError();

  const success = await authStore.login({
    username: formData.username,
    senha: formData.senha,
  });

  if (success) {
    Notify.create({
      type: 'positive',
      message: 'Login realizado com sucesso!',
      position: 'top',
    });

    void router.push('/');
  } else {
    Notify.create({
      type: 'negative',
      message: authStore.error || 'Erro ao fazer login',
      position: 'top',
    });
  }
};

const irParaRegistro = () => {
  void router.push('/registro');
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.login-card .q-card__section {
  padding: 24px;
}
</style>
