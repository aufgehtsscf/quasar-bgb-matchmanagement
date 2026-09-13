import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Home.vue') },
      { path: '/participant', component: () => import('src/pages/ListParticipant.vue') },
      { path: '/match', component: () => import('src/pages/ListMatch.vue') },
      { path: '/member', component: () => import('src/pages/ListMember.vue') },
      { path: '/team', component: () => import('src/pages/ListTeam.vue') },
      { path: '/avatar', component: () => import('src/pages/ListAvatar.vue') },
      { path: '/order', component: () => import('src/pages/ListOrder.vue') },
      { path: '/setting', component: () => import('src/pages/ListSetting.vue') },
      { path: '/link', component: () => import('src/pages/ListLink.vue') },
      { path: '/download', component: () => import('src/pages/ListDownload.vue') }
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
