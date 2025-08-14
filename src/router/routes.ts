import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Rota de Login (sem autenticação)
  {
    path: '/login',
    component: () => import('layouts/LoginPage.vue'),
    meta: { requiresAuth: false, hideForAuthenticated: true },
  },

  // Rota de Registro (sem autenticação)
  {
    path: '/registro',
    component: () => import('pages/RegistroPage.vue'),
    meta: { requiresAuth: false, hideForAuthenticated: true },
  },

  // Rotas protegidas (requerem autenticação)
  {
    path: '/',
    component: () => import('layouts/LayoutPrincipal.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      // Rotas de Autores
      {
        path: 'autores',
        component: () => import('pages/Autores/AutorPage.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'autores',
            meta: { requiresAuth: true },
            component: () => import('pages/Autores/AutorPesquisa.vue'),
          },
          {
            path: 'novo',
            name: 'autor-novo',
            meta: { requiresAuth: true },
            component: () => import('pages/Autores/AutorCadastro.vue'),
          },
          {
            path: ':id',
            name: 'autor-editar',
            meta: { requiresAuth: true },
            component: () => import('pages/Autores/AutorCadastro.vue'),
          },
        ],
      },
      // Rotas de Gêneros
      {
        path: 'generos',
        component: () => import('pages/Generos/GeneroPage.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'generos',
            meta: { requiresAuth: true },
            component: () => import('pages/Generos/GeneroPesquisa.vue'),
          },
          {
            path: 'novo',
            name: 'genero-novo',
            meta: { requiresAuth: true },
            component: () => import('pages/Generos/GeneroCadastro.vue'),
          },
          {
            path: ':id',
            name: 'genero-editar',
            meta: { requiresAuth: true },
            component: () => import('pages/Generos/GeneroCadastro.vue'),
          },
        ],
      },
      // Rotas de Livros
      {
        path: 'livros',
        component: () => import('pages/Livros/LivroPage.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'livros',
            meta: { requiresAuth: true },
            component: () => import('pages/Livros/LivroPesquisa.vue'),
          },
          {
            path: 'novo',
            name: 'livro-novo',
            meta: { requiresAuth: true },
            component: () => import('pages/Livros/LivroCadastro.vue'),
          },
          {
            path: ':id',
            name: 'livro-visualizar',
            meta: { requiresAuth: true },
            component: () => import('pages/Livros/LivroVisualizacao.vue'),
          },
          {
            path: ':id/editar',
            name: 'livro-editar',
            meta: { requiresAuth: true },
            component: () => import('pages/Livros/LivroCadastro.vue'),
          },
        ],
      },
      // Rotas de Usuários (só para Administradores)
      {
        path: 'usuarios',
        component: () => import('pages/Usuarios/UsuarioPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
