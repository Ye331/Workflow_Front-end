import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ReportDetail from '../views/ReportDetail.vue'
import UserManagement from '../views/UserManagement.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/report/:id',
        name: 'ReportDetail',
        component: ReportDetail
    },
    {
        path: '/user-management',
        name: 'UserManagement',
        component: UserManagement
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
