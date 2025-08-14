import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useAutenticacaoStore } from 'src/stores/autorizacao/autenticacao';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Guard de autenticação
  Router.beforeEach((to, from, next) => {
    const authStore = useAutenticacaoStore();
    
    // Inicializar autenticação se necessário
    if (!authStore.isAuthenticated) {
      authStore.initAuth();
    }

    // Verificar se a rota requer autenticação
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // Verificar se a rota requer admin (role 'A')
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    
    // Verificar se deve esconder para usuários autenticados (como página de login)
    const hideForAuthenticated = to.matched.some(record => record.meta.hideForAuthenticated);

    if (requiresAuth && !authStore.isAuthenticated) {
      // Rota protegida e usuário não autenticado -> redirecionar para login
      next('/login');
    } else if (requiresAdmin && !authStore.isAdmin) {
      // Rota requer admin mas usuário não tem userType 'A' -> redirecionar para home
      next('/');
    } else if (hideForAuthenticated && authStore.isAuthenticated) {
      // Página de login e usuário já autenticado -> redirecionar para home
      next('/');
    } else {
      // Permitir navegação
      next();
    }
  });

  return Router;
});
