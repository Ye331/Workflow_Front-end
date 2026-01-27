// 模拟数据
const users = [
    { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: '2', username: 'user1', email: 'user1@example.com', role: 'user', status: 'active' },
    { id: '3', username: 'editor', email: 'editor@example.com', role: 'editor', status: 'inactive' }
]

const tasks = [
    { taskId: 'task-001', userId: '1', keywords: ['AI', 'Tech'], time_range: '24h', interval: '1h', status: 'active', created_at: '2023-10-01' },
    { taskId: 'task-002', userId: '1', keywords: ['Finance'], time_range: '7d', interval: '6h', status: 'inactive', created_at: '2023-10-02' }
]

const reports = [
    { reportId: 'rep-001', taskId: 'task-001', status: 'success', createTime: '2023-10-27 10:00:00', reportName: 'AI Trend Report' },
    { reportId: 'rep-002', taskId: 'task-001', status: 'generating', createTime: '2023-10-28 09:00:00', reportName: 'Daily Tech Update' }
]

const slices = [
    { id: 'slice-001', title: 'New AI Model Released', heat: 95, sentiment: 'positive', summary: 'A new AI model has been released...', date: '2023-10-27', status: '已完成' },
    { id: 'slice-002', title: 'Tech Stock Crash', heat: 80, sentiment: 'negative', summary: 'Tech stocks took a dive today...', date: '2023-10-26', status: '进行中' },
    { id: 'm1', title: '深度学习技术在图像识别中的最新进展', heat: 88, sentiment: 'positive', summary: '深度学习技术在图像识别领域取得了突破性进展，准确率大幅提升。', date: '2023-10-27', status: '已完成' },
    { id: 'm2', title: '2024年全球可再生能源市场展望', heat: 75, sentiment: 'positive', summary: '预计2024年全球可再生能源市场将持续增长，太阳能和风能将占据主导地位。', date: '2023-10-26', status: '进行中' },
    { id: 'm3', title: '数字化转型对传统零售业的影响', heat: 62, sentiment: 'neutral', summary: '数字化转型正在重塑传统零售业的商业模式，线上线下融合成为趋势。', date: '2023-10-25', status: '已完成' },
    { id: 'm4', title: 'Web3.0 技术架构与应用场景分析', heat: 91, sentiment: 'positive', summary: '深入分析Web3.0的技术架构，探讨其在金融、社交等领域的应用前景。', date: '2023-10-24', status: '已完成' },
    { id: 'm5', title: '社交媒体对青少年心理健康的影响研究', heat: 85, sentiment: 'negative', summary: '研究表明，过度使用社交媒体可能导致青少年焦虑、抑郁等心理健康问题。', date: '2023-10-23', status: '已完成' },
    { id: 'm6', title: '2023年网络安全威胁态势报告', heat: 93, sentiment: 'negative', summary: '2023年网络攻击事件频发，勒索软件、钓鱼攻击等威胁日益严峻。', date: '2023-10-22', status: '进行中' },
    { id: 'm7', title: '云计算服务在中小企业中的普及率调查', heat: 55, sentiment: 'positive', summary: '调查显示，越来越多的中小企业开始采用云计算服务以降低成本、提高效率。', date: '2023-10-21', status: '已完成' },
    { id: 'm8', title: '元宇宙概念下的虚拟经济发展趋势', heat: 78, sentiment: 'neutral', summary: '元宇宙概念的兴起带动了虚拟房产、数字藏品等虚拟经济的发展。', date: '2023-10-20', status: '进行中' },
    { id: 'm9', title: '5G技术在工业互联网中的应用案例', heat: 82, sentiment: 'positive', summary: '5G技术的高速率、低时延特性为工业互联网的发展提供了强有力的支撑。', date: '2023-10-19', status: '已完成' },
    { id: 'm10', title: '全球气候变化对农业供应链的挑战', heat: 67, sentiment: 'negative', summary: '全球气候变化导致极端天气频发，给农业供应链带来了巨大的挑战。', date: '2023-10-18', status: '已完成' }
]

const news = [
    { id: 'news-001', title: 'AI is the future', url: 'https://example.com/ai', content: '...', publishTime: '2023-10-27', source: 'TechDaily' },
    { id: 'news-002', title: 'Why AI matters', url: 'https://example.com/why-ai', content: '...', publishTime: '2023-10-27', source: 'ScienceNet' }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    // --- 2.1 User Management ---
    async login(data) {
        await delay(500)
        const user = users.find(u => u.username === data.username)
        if (user) {
            // 简单密码验证逻辑
            if (data.password === '123456' || !data.password) {
                return {
                    token: 'mock-token-' + Date.now(),
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
            throw new Error('密码错误')
        }
        throw new Error('用户不存在')
    },

    async getUserList(params) {
        await delay(500)
        let list = [...users]
        // Mock pagination
        const page = parseInt(params.page || 1)
        const size = parseInt(params.size || 10)
        const start = (page - 1) * size
        const pagedList = list.slice(start, start + size)

        return {
            list: pagedList,
            total: list.length
        }
    },

    async addUser(data) {
        await delay(500)
        const newUser = {
            id: Date.now().toString(),
            username: data.username,
            email: data.email || '',
            role: data.role || 'user',
            status: 'active'
        }
        users.push(newUser)
        return { id: newUser.id }
    },

    async updateUser(id, data) {
        await delay(500)
        const index = users.findIndex(u => u.id === id)
        if (index !== -1) {
            users[index] = { ...users[index], ...data }
            return true
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

    // --- 2.2 Task Management ---
    async createTask(data) {
        await delay(500)
        const newTask = {
            taskId: 'task-' + Date.now(),
            userId: data.userId,
            keywords: data.keywords || [],
            time_range: data.time_range,
            interval: data.interval,
            status: 'active',
            created_at: new Date().toISOString()
        }
        tasks.push(newTask)
        return { taskId: newTask.taskId }
    },

    async getTaskList(params) {
        await delay(500)
        let list = tasks.filter(t => !params.userId || t.userId === params.userId)

        const page = parseInt(params.page || 1)
        const size = parseInt(params.size || 10)
        const start = (page - 1) * size
        const pagedList = list.slice(start, start + size)

        return {
            list: pagedList,
            total: list.length
        }
    },

    async updateTask(taskId, data) {
        await delay(500)
        const index = tasks.findIndex(t => t.taskId === taskId)
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...data }
            return true
        }
        throw new Error('Task not found')
    },

    async switchTask(taskId, enable) {
        await delay(500)
        const index = tasks.findIndex(t => t.taskId === taskId)
        if (index !== -1) {
            tasks[index].status = enable ? 'active' : 'inactive'
            return { status: tasks[index].status }
        }
        throw new Error('Task not found')
    },

    async deleteTask(taskId) {
        await delay(500)
        const index = tasks.findIndex(t => t.taskId === taskId)
        if (index !== -1) {
            tasks.splice(index, 1)
            return true
        }
        throw new Error('Task not found')
    },

    async getAnalysisSlices(params) {
        await delay(500)
        // Mock filtering by taskId if needed
        return {
            list: slices,
            total: slices.length
        }
    },

    // --- 2.3 News Data ---
    async getNewsList(params) {
        await delay(500)
        return {
            list: news,
            total: news.length
        }
    },

    // --- 2.4 Report Management ---
    async getReportList(params) {
        await delay(500)
        let list = reports
        if (params.taskId) {
            list = list.filter(r => r.taskId === params.taskId)
        }
        // ... pagination logic ...
        return {
            list: list,
            total: list.length
        }
    },

    async getReportDetail(id) {
        await delay(800)
        // 支持查找 Report 或 Slice (为了演示方便，点击切片也能看到模拟报告)
        const report = reports.find(r => r.reportId === id)
        const slice = slices.find(s => s.id === id)

        const target = report || slice

        if (target) {
            const title = report ? report.reportName : slice.title
            const createTime = report ? report.createTime : new Date().toISOString()
            const taskId = report ? report.taskId : 'mock-task-id'

            const mockMarkdown = `# 资讯舆情分析报告

**生成时间**：${createTime}

**关键词组**：人工智能、机器学习、深度学习

## 一、总体分析

### 总体舆情概括

当前人工智能相关技术舆情呈现多领域分化态势：深度学习在癌症早期筛查中准确率超资深医生，未来三年有望普及至基层医院，获正面关注；机器学习已在金融信贷风险评估、反欺诈检测中落地，降低坏账率、提升审批效率，同样获正面评价。

### 渠道占比

本次信息传播渠道分布完全均衡，科技日报、财经网、车云网、IT之家的占比均为25.0%，无主导传播渠道。

\`\`\`mermaid
pie
    title 渠道占比
    "科技日报" : 25.0
    "财经网" : 25.0
    "车云网" : 25.0
    "IT之家" : 25.0
\`\`\`

### 热度趋势

2024年1月15日至18日，热度整体处于较高区间，1月17日达到峰值92.1，其余日期热度在78.2-88.9间波动。

\`\`\`mermaid
xychart-beta
    title "热度趋势"
    x-axis ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18"]
    y-axis "热度" 78.2 --> 92.1
    line [85.5, 78.2, 92.1, 88.9]
\`\`\`

### 情感分布

本次信息的情感分布以正面为主，占比50.0%。

\`\`\`mermaid
pie
    title 情感分布
    "正面" : 50.0
    "负面" : 25.0
    "中性" : 25.0
\`\`\`

## 二、关键词详情
(示例数据已省略)`;

            return {
                summary: mockMarkdown,
                taskId: taskId,
                createTime: createTime,
                reportName: title
            }
        }
        throw new Error('Report not found')
    },

    async deleteReport(id) {
        await delay(500)
        const index = reports.findIndex(r => r.reportId === id)
        if (index !== -1) {
            reports.splice(index, 1)
            return true
        }
        throw new Error('Report not found')
    },

    // --- 2.5 AI Q&A ---
    async askReport(data) {
        await delay(1500)
        return { answer: `[Mock Answer] Based on report ${data.reportId}, here is the answer to: "${data.question}"` }
    },

    async askEvent(data) {
        await delay(1500)
        return { answer: `[Mock Answer] Analyzing event ${data.eventId}, regarding "${data.question}"...` }
    }
}
