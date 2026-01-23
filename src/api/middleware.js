import { request } from '@/utils/request'
import mockApi from './mock'

// 开关：是否使用模拟数据（在开发阶段未对接后端时开启）
const USE_MOCK = true

/**
 * 中台调度层接口 (Python Middleware)
 * 对应架构中的核心业务流程
 */
export default {
    // ==========================================
    // WF1: 舆情分析流 (Analysis Flow)
    // ==========================================

    /**
     * 触发舆情分析
     * @param {Object} data
     * @param {String} data.keyword 关键词
     * @param {String} data.time_range 时间范围 (e.g., '24h', '7d')
     * @returns {Promise} 返回任务ID或初步切片信息
     */
    triggerAnalysis(data) {
        if (USE_MOCK) return mockApi.triggerAnalysis(data)
        return request('/analysis/trigger', {
            method: 'POST',
            data
        })
    },

    /**
     * 获取数据切片列表 (供 widget 轮询或首页展示)
     */
    getDataSlices() {
        return request('/analysis/slices', {
            method: 'GET'
        })
    },

    // ==========================================
    // WF2: 报告生成流 (Report Generation Flow)
    // ==========================================

    /**
     * 获取完整报告详情
     * @param {String} id 报告ID
     * @returns {Promise} 返回 Report JSON (包含图表配置、Markdown文本)
     */
    getReportDetail(id) {
        return request(`/report/${id}`, {
            method: 'GET'
        })
    },

    /**
     * (可选) 强制重新生成报告
     * 触发 Coze Agent 重新执行 Trend & Summary
     */
    regenerateReport(id) {
        return request(`/report/${id}/regenerate`, {
            method: 'POST'
        })
    },

    // ==========================================
    // WF3: 智能问答流 (Q&A Flow)
    // ==========================================

    /**
     * 提问
     * @param {Object} data
     * @param {String} data.question 问题内容
     * @param {String} data.context_id 当前报告ID (作为 Context 上下文索引)
     */
    askQuestion(data) {
        return request('/qa/ask', {
            method: 'POST',
            data
        })
    },

    // ==========================================
    // WF4: 用户管理 (User Management)
    // ==========================================

    /**
     * 登录
     * @param {Object} data { username, password }
     */
    login(data) {
        if (USE_MOCK) return mockApi.login(data)
        return request('/user/login', {
            method: 'POST',
            data
        })
    },

    /**
     * 获取用户列表
     */
    getUserList(params) {
        if (USE_MOCK) return mockApi.getUserList(params)
        return request('/user/list', {
            method: 'GET',
            data: params
        })
    },

    /**
     * 添加/注册用户
     * @param {Object} data { username, password, role }
     */
    addUser(data) {
        if (USE_MOCK) return mockApi.addUser(data)
        return request('/user/add', {
            method: 'POST',
            data
        })
    },

    /**
     * 更新用户信息
     * @param {String} id 用户ID
     * @param {Object} data 更新内容
     */
    updateUser(id, data) {
        if (USE_MOCK) return mockApi.updateUser(id, data)
        return request(`/user/update`, {
            method: 'POST',
            data: { id, ...data }
        })
    },

    /**
     * 删除用户
     * @param {String} id
     */
    deleteUser(id) {
        if (USE_MOCK) return mockApi.deleteUser(id)
        return request('/user/delete', {
            method: 'POST',
            data: { id }
        })
    }
}
