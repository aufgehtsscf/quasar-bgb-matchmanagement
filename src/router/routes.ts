import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/ListParticipant.vue') },
      { path: '/match', component: () => import('src/pages/ListMatch.vue') },
      { path: '/whereismycard', component: () => import('src/pages/ListWhereIsMyCard.vue') },
      { path: '/member', component: () => import('src/pages/ListMember.vue') },
      { path: '/order', component: () => import('src/pages/ListOrder.vue') },
      { path: '/properties', component: () => import('src/pages/ListProperties.vue') },
      { path: '/entercode', component: () => import('src/pages/EnterCode.vue') },
      { path: '/updateproperties', component: () => import('src/pages/UpdateProperties.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
