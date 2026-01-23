
// 模拟数据
const users = [
    { id: '1', username: 'admin', role: 'admin' },
    { id: '2', username: 'user1', role: 'user' },
    { id: '3', username: 'editor', role: 'editor' }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    async login(data) {
        await delay(500)
        const user = users.find(u => u.username === data.username)
        if (user) {
            // 简单密码验证逻辑，这里假设密码是123456或者无密码
            if (data.password === '123456' || !data.password) {
                return { ...user, token: 'mock-token-' + Date.now() }
            }
            throw new Error('密码错误')
        }
        throw new Error('用户不存在')
    },

    async getUserList(params) {
        await delay(500)
        let res = [...users]
        if (params && params.keyword) {
            res = res.filter(u => u.username.includes(params.keyword))
        }
        return res
    },

    async addUser(data) {
        await delay(500)
        const newUser = {
            id: Date.now().toString(),
            username: data.username,
            role: data.role || 'user'
        }
        users.push(newUser)
        return newUser
    },

    async updateUser(id, data) {
        await delay(500)
        const index = users.findIndex(u => u.id === id)
        if (index !== -1) {
            users[index] = { ...users[index], ...data }
            return users[index]
        }
        throw new Error('User not found')
    },

    async deleteUser(id) {
        await delay(500)
        const index = users.findIndex(u => u.id === id)
        if (index !== -1) {
            users.splice(index, 1)
            return true
        }
        throw new Error('User not found')
    },

    // 模拟分析流
    async triggerAnalysis(data) {
        await delay(1000)
        return { taskId: 'task-123', status: 'pending' }
    }
}
