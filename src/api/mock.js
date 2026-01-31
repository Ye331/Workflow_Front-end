// 模拟数据
const users = [
    { id: '1', username: 'admin', email: 'admin@example.com', role: 'ADMIN', status: 'active' },
    { id: '2', username: 'user1', email: 'user1@example.com', role: 'USER', status: 'active' }
]

const tasks = [
    { taskId: 'task-001', userId: '1', keywords: ['AI', 'Tech'], time_range: '24h', interval: '1h', status: 'active', created_at: new Date(Date.now() - 86400000 * 3).toLocaleDateString() },
    { taskId: 'task-002', userId: '1', keywords: ['Finance', 'Stock'], time_range: '7d', interval: '6h', status: 'active', created_at: new Date(Date.now() - 86400000 * 5).toLocaleDateString() },
    { taskId: 'task-003', userId: '1', keywords: ['新能源', 'Solar'], time_range: '30d', interval: '12h', status: 'active', created_at: new Date(Date.now() - 86400000 * 10).toLocaleDateString() }
]

const reports = [
    { reportId: 'rep-001', taskId: 'task-001', status: 'success', createTime: new Date().toISOString(), reportName: 'AI行业趋势早报' },
    { reportId: 'rep-002', taskId: 'task-001', status: 'success', createTime: new Date(Date.now() - 86400000).toISOString(), reportName: 'Tech科技动态日报' },
    { reportId: 'rep-003', taskId: 'task-002', status: 'success', createTime: new Date().toISOString(), reportName: '今日金融市场快讯' },
    { reportId: 'rep-004', taskId: 'task-003', status: 'generating', createTime: new Date(Date.now() - 43200000).toISOString(), reportName: '新能源行业深度分析' }
]

const slices = [
    { id: 'slice-001', taskId: 'task-001', title: 'OpenAI 发布最新 GPT-5 预览版', heat: 98, sentiment: 'positive', summary: 'OpenAI 突然发布了 GPT-5 的开发者预览版，性能相比 GPT-4 提升显著，引发全网热议。', date: new Date().toLocaleDateString(), status: '已完成' },
    { id: 'slice-002', taskId: 'task-001', title: '某科技巨头宣布裁员10%', heat: 85, sentiment: 'negative', summary: '因市场环境变化，某知名科技公司宣布将在未来一个月内裁员10%，涉及多个核心部门。', date: new Date().toLocaleDateString(), status: '进行中' },
    { id: 'm1', taskId: 'task-001', title: '深度学习在医疗影像诊断中的新突破', heat: 88, sentiment: 'positive', summary: '最新研究表明，基于深度学习的算法在早期肺癌筛查中的准确率已超过资深放射科医生。', date: new Date(Date.now() - 86400000).toLocaleDateString(), status: '已完成' },
    { id: 'm2', taskId: 'task-003', title: '2025年全球光伏装机量预测', heat: 75, sentiment: 'positive', summary: '国际能源署预测，2025年全球光伏新增装机量将创新高，中国市场仍将保持领先地位。', date: new Date(Date.now() - 86400000).toLocaleDateString(), status: '进行中' },
    { id: 'm3', taskId: 'task-002', title: '美联储暗示年内可能降息', heat: 92, sentiment: 'neutral', summary: '美联储主席在最新的讲话中暗示，如果通胀数据由于持续回落，年内可能考虑降息。', date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(), status: '已完成' },
    { id: 'm4', taskId: 'task-002', title: '加密货币市场全线反弹', heat: 81, sentiment: 'positive', summary: '受比特币现货ETF获批消息刺激，今日加密货币市场全线反弹，比特币突破4.5万美元。', date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(), status: '已完成' },
    { id: 'm5', taskId: 'task-001', title: '社交媒体对青少年心理健康影响报告', heat: 85, sentiment: 'negative', summary: '最新调查显示，过度使用社交媒体与青少年焦虑、抑郁情绪呈正相关，呼吁家长关注。', date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(), status: '已完成' },
    { id: 'm6', taskId: 'task-001', title: '网络安全威胁态势报告发布', heat: 93, sentiment: 'negative', summary: '报告指出，勒索软件攻击已成为企业面临的最大网络安全威胁，攻击手法日益复杂。', date: new Date(Date.now() - 86400000 * 4).toLocaleDateString(), status: '进行中' },
    { id: 'm7', taskId: 'task-002', title: '中小企业融资难问题亟待解决', heat: 65, sentiment: 'neutral', summary: '尽管政策频出，但中小企业融资难、融资贵问题依然存在，需要金融机构创新服务模式。', date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(), status: '已完成' },
    { id: 'm8', taskId: 'task-003', title: '虚拟电厂：能源互联网的新风口', heat: 78, sentiment: 'positive', summary: '虚拟电厂作为协调分布式能源的重要手段，正成为能源互联网领域的新投资风口。', date: new Date(Date.now() - 86400000 * 6).toLocaleDateString(), status: '进行中' },
    { id: 'm9', taskId: 'task-001', title: '5G+工业互联网赋能制造业数字化转型', heat: 82, sentiment: 'positive', summary: '多个5G+工业互联网标杆工厂落地，显著提升了生产效率和质量控制水平。', date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(), status: '已完成' },
    { id: 'm10', taskId: 'task-003', title: '极端天气对能源供应的挑战', heat: 67, sentiment: 'negative', summary: '极端寒潮天气导致多地电力负荷激增，对能源保供提出了严峻挑战。', date: new Date(Date.now() - 86400000 * 8).toLocaleDateString(), status: '已完成' }
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
            role: data.role || 'USER',
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

        // Demo Trigger: If keyword is '大数据', inject pre-prepared Big Data data
        const isDemo = data.keywords.includes('大数据');
        const demoKeywords = ['大数据', '数据要素', '数字经济'];

        const newTask = {
            taskId: 'task-' + Date.now(),
            userId: data.userId,
            keywords: isDemo ? demoKeywords : (data.keywords || []),
            time_range: data.time_range,
            interval: data.interval,
            status: 'active',
            created_at: new Date().toISOString()
        }
        tasks.unshift(newTask)

        let initialSlices = []
        if (isDemo) {
            // Pre-prepared Big Data Event Chain
            initialSlices = [
                { id: 'slice-' + Date.now() + '-1', taskId: newTask.taskId, title: '国家数据局发布“数据要素×”三年行动计划', heat: 99, sentiment: 'positive', summary: '国家数据局等部门联合印发《“数据要素×”三年行动计划（2024—2026年）》，旨在充分发挥数据要素乘数效应，赋能经济社会发展。', date: new Date().toLocaleDateString(), status: '已完成' },
                { id: 'slice-' + Date.now() + '-2', taskId: newTask.taskId, title: '2024年大数据产业规模有望突破2万亿元', heat: 94, sentiment: 'positive', summary: '最新行业研报显示，随着各行业数字化转型加速，我国大数据产业核心产值保持高速增长，全年规模预计突破2万亿元。', date: new Date().toLocaleDateString(), status: '已完成' },
                { id: 'slice-' + Date.now() + '-3', taskId: newTask.taskId, title: '某互联网巨头因数据安全违规被重罚', heat: 96, sentiment: 'negative', summary: '监管部门通报，某知名互联网平台因违规收集与使用用户个人信息，且未落实数据安全保护义务，被处以高额罚款。', date: new Date(Date.now() - 86400000).toLocaleDateString(), status: '进行中' },
                { id: 'slice-' + Date.now() + '-4', taskId: newTask.taskId, title: '隐私计算技术在金融风控领域规模化落地', heat: 87, sentiment: 'positive', summary: '隐私计算技术通过“数据可用不可见”的特性，解决了金融机构间的数据孤岛问题，在信贷风控等场景实现大规模应用。', date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(), status: '已完成' },
                { id: 'slice-' + Date.now() + '-5', taskId: newTask.taskId, title: '跨境数据流动新规出台，减轻企业合规负担', heat: 85, sentiment: 'neutral', summary: '网信办发布促进和规范数据跨境流动规定，豁免了部分场景的数据出境申报评估机制，大幅降低了企业的合规成本。', date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(), status: '已完成' }
            ]

            // Allow immediate generation of a report for demo
            reports.unshift({
                reportId: 'rep-demo-' + Date.now(),
                taskId: newTask.taskId,
                status: 'success',
                createTime: new Date().toISOString(),
                reportName: '大数据行业舆情深度洞察报告' // Pre-generated report
            })

        } else {
            // Normal Mock Logic
            const keywordsStr = newTask.keywords.join('、')
            initialSlices = [
                { id: 'slice-' + Date.now() + '-1', taskId: newTask.taskId, title: `关于 ${keywordsStr} 的最新行业动态分析`, heat: 88, sentiment: 'positive', summary: `${keywordsStr} 行业近期迎来重大利好，多家头部企业发布新品。`, date: new Date().toLocaleDateString(), status: '已完成' },
                { id: 'slice-' + Date.now() + '-2', taskId: newTask.taskId, title: `${keywordsStr} 领域发生一起安全事件引发关注`, heat: 92, sentiment: 'negative', summary: `据报道，某公司在 ${keywordsStr} 相关的产品中发现安全漏洞，引发公众担忧。`, date: new Date().toLocaleDateString(), status: '进行中' },
                { id: 'slice-' + Date.now() + '-3', taskId: newTask.taskId, title: `专家热议 ${keywordsStr} 未来发展趋势`, heat: 75, sentiment: 'neutral', summary: `在近日举行的行业论坛上，多位专家就 ${keywordsStr} 的未来发展方向进行了深入探讨。`, date: new Date(Date.now() - 86400000).toLocaleDateString(), status: '已完成' }
            ]
        }
        slices.unshift(...initialSlices)

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
        let list = slices
        if (params.taskId) {
            list = list.filter(s => s.taskId === params.taskId)
        }
        return {
            list: list,
            total: list.length
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
        // Find slice and ensure it has a taskId before fallback
        const slice = slices.find(s => s.id === id)

        const target = report || slice

        if (target) {
            const title = report ? report.reportName : (slice ? slice.title : '舆情报告')
            const createTime = report ? report.createTime : new Date().toISOString()
            // Try to find taskId from report or slice. If generic slice has no taskId (should have), fallback.
            const taskId = (report && report.taskId) || (slice && slice.taskId) || 'task-001'

            // Find task to get keywords for context
            const task = tasks.find(t => t.taskId === taskId)
            const keywordsRaw = task ? task.keywords : ['通用']
            const keywords = keywordsRaw.join('、')

            // Simple domain detection
            let domain = 'tech'
            const kws = keywords.toLowerCase()
            if (kws.includes('finance') || kws.includes('stock') || kws.includes('金融')) domain = 'finance'
            else if (kws.includes('solar') || kws.includes('energy') || kws.includes('新能源') || kws.includes('光伏')) domain = 'energy'
            else if (kws.includes('大数据') || kws.includes('data') || kws.includes('数据')) domain = 'bigdata'

            // Generate content based on domain
            let analysisContent = ''

            if (domain === 'finance') {
                analysisContent = `
### 总体舆情概括

当前 **${keywords}** 相关领域舆情呈现高度活跃态势。美联储利率政策预期主导了近期市场情绪，加密货币市场的剧烈波动也吸引了大量关注。中小企业融资难问题持续引发政策层面的讨论。

### 关键发现

1. **宏观政策影响显著**：市场对降息预期反应强烈，带动股市和债市波动。
2. **新兴资产受到追捧**：比特币ETF的获批成为里程碑事件，资金流入明显。
3. **实体经济挑战犹在**：尽管金融市场火热，但实体层面特别是中小企业的融资环境仍需改善。
`
            } else if (domain === 'energy') {
                analysisContent = `
### 总体舆情概括

当前 **${keywords}** 相关领域舆情稳中有升。全球能源转型的紧迫性日益凸显，光伏、风电等可再生能源的装机量预测不断上调。极端天气对能源保供的挑战成为舆论焦点。

### 关键发现

1. **装机量持续高增**：2025年全球光伏市场预期乐观，中国企业保持全产业链优势。
2. **新技术应用加速**：虚拟电厂等调节性资源建设提速，以应对新能源波动性。
3. **气候适应性受关注**：电网在极端天气下的韧性建设成为各国基建重点。
`
            } else if (domain === 'bigdata') {
                analysisContent = `
### 总体舆情概括

当前 **${keywords}** 领域舆情热度持续高涨。随着“数据要素×”三年行动计划的发布，数据资产入表、公共数据授权运营等话题成为市场焦点。同时，数据安全合规也成为企业关注的红线。

### 关键发现

1. **政策红利持续释放**：国家层面密集出台利好政策，明确了数据要素的市场化配置方向，产业发展迎来黄金期。
2. **应用场景纵深发展**：大数据技术正加速向工业、金融、医疗等垂直行业渗透，从“辅助支撑”向“核心驱动”转变。
3. **流通交易探索加速**：各地数据交易所交易额创新高，数据资产化进程加快，但确权难、定价难问题仍待破解。
`
            } else {
                // Default Tech/AI or Generic
                analysisContent = `
### 总体舆情概括

当前 **${keywords}** 相关技术舆情呈现多领域分化态势：模型技术的迭代速度超出预期，在医疗、工业等垂直领域的落地应用频传捷报。同时，数据安全和伦理问题也引发了公众的持续担忧。

### 关键发现

1. **技术突破**：在 **${keywords}** 核心领域，近期发布的多项研究成果推高了行业天花板。
2. **应用场景落地**：该技术在实际场景中的价值被广泛认可，商业化进程加速。
3. **风险意识增强**：相关的数据安全、隐私保护话题热度不减，成为监管关注重点。
`
            }

            const mockMarkdown = `# ${title}

**生成时间**：${new Date(createTime).toLocaleString()}

**监测对象/关键词**：${keywords}

## 一、总体分析

${analysisContent}

### 渠道占比

本次监测周期内，信息主要来源于新闻媒体(35%)、社交平台(30%)和行业论坛(25%)，传播渠道分布相对均衡。

\`\`\`mermaid
pie
    title 渠道占比
    "专业媒体" : 35
    "社交平台" : 30
    "行业论坛" : 25
    "其他" : 10
\`\`\`

### 热度趋势

监测期间，**${keywords}** 的相关话题热度波动明显，呈现出"事件驱动"的特征。

\`\`\`mermaid
xychart-beta
    title "热度趋势"
    x-axis ["T-3", "T-2", "T-1", "Today"]
    y-axis "热度指数" 60 --> 100
    line [78, 85, 92, 88]
\`\`\`

### 情感分布

整体情感分布以客观中立和正面为主，但特定负面事件（如安全事故、市场下跌）引发了阶段性的情绪波动。

\`\`\`mermaid
pie
    title 情感分布
    "正面" : 45
    "负面" : 20
    "中性" : 35
\`\`\`

## 二、重点事件回顾

(此处展示监测周期内的高热度事件摘要，详情请查看监测任务的事件链)`;

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
        // Find task keywords for context
        let context = ''
        let isBigData = false
        const task = tasks.find(t => t.taskId === data.eventId) // eventId is treated as taskId here
        if (task) {
            const kws = task.keywords.join(',')
            context = `关于监测对象 "${kws}" 的`
            if (kws.includes('大数据') || kws.includes('数据要素')) {
                isBigData = true
            }
        }

        let answers = []
        if (isBigData) {
            answers = [
                `根据${context}监测，目前核心议题集中在“数据资产入表”和“公共数据授权运营”。市场普遍认为这是释放数据要素价值的关键一步。`,
                `从事件链分析，国家数据局近期的政策信号明确，旨在降低数据流通门槛。建议关注隐私计算技术在跨境数据流动中的应用机会。`,
                `舆情数据显示，关于“数据安全”的讨论热度不减。企业在探索数据变现的同时，对合规风险的担忧依然是主要的制约因素。`,
                `最新动态显示，各地数据交易所的交易量正如期增长，尤其是金融和医疗领域的数据产品交易最为活跃。`
            ]
        } else {
            answers = [
                `根据${context}最新监测结果，目前舆情整体呈现平稳态势。主要讨论集中在技术创新和市场应用两个方面。`,
                `您关注的${context}事件中，负面情绪主要来源于近期的一起安全事故，建议加强相关风险排查。`,
                `从事件链来看，${context}的热度正在持续上升，预计未来三天内将达到峰值，建议持续关注官方通报。`,
                `数据分析显示，${context}在社交媒体上的讨论量激增，主要观点倾向于正面，用户反馈良好。`
            ]
        }

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)]

        return { answer: randomAnswer }
    }
}
