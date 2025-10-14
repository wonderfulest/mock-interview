import { createRouter, createWebHashHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const StudyView = () => import('../views/StudyView.vue')
const PracticeView = () => import('../views/PracticeView.vue')
const ExamView = () => import('../views/ExamView.vue')
const ConsulIndexView = () => import('../views/Index/ConsulIndexView.vue')
const MySQLIndexView = () => import('../views/Index/MySQLIndexView.vue')
const TrackIndexView = () => import('../views/Index/TrackIndexView.vue')

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/study', name: 'study', component: StudyView },
    { path: '/practice', name: 'practice', component: PracticeView },
    { path: '/exam', name: 'exam', component: ExamView },
    { path: '/index/consul', name: 'index-consul', component: ConsulIndexView },
    { path: '/index/mysql', name: 'index-mysql', component: MySQLIndexView },
    { path: '/index/:track', name: 'index-generic', component: TrackIndexView },
  ],
})
