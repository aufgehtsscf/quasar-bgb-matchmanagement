import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Home.vue') },
      { path: '/participant', component: () => import('src/pages/ListParticipant.vue') },
      { path: '/match', component: () => import('src/pages/ListMatch.vue') },
      { path: '/whereismycard', component: () => import('src/pages/ListWhereIsMyCard.vue') },
      { path: '/member', component: () => import('src/pages/ListMember.vue') },
      { path: '/order', component: () => import('src/pages/ListOrder.vue') },
      { path: '/settings', component: () => import('src/pages/ListSetting.vue') },
      { path: '/entercode', component: () => import('src/pages/EnterCode.vue') },
      { path: '/updatesettings', component: () => import('src/pages/UpdateSettings.vue') }
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
