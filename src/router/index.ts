import { createRouter, createWebHashHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const StudyView = () => import('../views/StudyView.vue')
const PracticeView = () => import('../views/PracticeView.vue')
const ExamView = () => import('../views/ExamView.vue')
const QuestionIndexView = () => import('../views/QuestionIndexView.vue')

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/study', name: 'study', component: StudyView },
    { path: '/practice', name: 'practice', component: PracticeView },
    { path: '/exam', name: 'exam', component: ExamView },
    { path: '/index/:track', name: 'index-generic', component: QuestionIndexView },
  ],
})
