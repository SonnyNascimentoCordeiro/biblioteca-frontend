<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h2 text-primary q-mb-lg">
        Sistema Biblioteca
      </div>

      <div class="text-h6 text-grey-7 q-mb-xl">
        Bem-vindo ao sistema de gerenciamento de biblioteca
      </div>

      <div class="row q-gutter-md justify-center">
        <q-card
          class="my-card cursor-pointer"
          clickable
          @click="$router.push('/autores')"
        >
          <q-card-section class="text-center">
            <q-icon name="person" size="4rem" color="primary" />
            <div class="text-h6 q-mt-md">Autores</div>
            <div class="text-caption text-grey-6">
              Gerenciar autores do sistema
            </div>
          </q-card-section>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="text-center">
            <q-icon name="book" size="4rem" color="secondary" />
            <div class="text-h6 q-mt-md">Livros</div>
            <div class="text-caption text-grey-6">
              Em desenvolvimento
            </div>
          </q-card-section>
        </q-card>

        <q-card class="my-card cursor-pointer"
                clickable
                @click="$router.push('/generos')"
        >
          <q-card-section class="text-center">
            <q-icon name="category" size="4rem" color="accent" />
            <div class="text-h6 q-mt-md">Gêneros</div>
            <div class="text-caption text-grey-6">
              Gerenciar generos do sistema
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-mt-xl">
        <q-banner class="bg-info text-white">
          <template #avatar>
            <q-icon name="info" />
          </template>
          Sistema desenvolvido para o desafio técnico Siemens
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
// const router = useRouter();
</script>

<style scoped>
.my-card {
  width: 200px;
  transition: transform 0.2s;
}

.my-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
