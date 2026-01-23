/**
 * 通用工具函数（适配App WebView）
 */
// 日期格式化
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    const d = new Date(date)
    const map = {
        YYYY: d.getFullYear(),
        MM: String(d.getMonth() + 1).padStart(2, '0'),
        DD: String(d.getDate()).padStart(2, '0'),
        HH: String(d.getHours()).padStart(2, '0'),
        mm: String(d.getMinutes()).padStart(2, '0'),
        ss: String(d.getSeconds()).padStart(2, '0')
    }
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, k => map[k])
}

// 本地存储（适配App WebView，加异常处理）
export const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (err) {
            uni.showToast({ title: '存储失败', icon: 'none' })
        }
    },
    get(key) {
        try {
            const val = localStorage.getItem(key)
            return val ? JSON.parse(val) : null
        } catch (err) {
            return null
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key)
        } catch (err) { }
    }
}

// 表单校验（App Web前端常用）
export const validator = {
    isPhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone)
    },
    isEmpty(val) {
        return val === '' || val === null || val === undefined
    }
}

// 导出所有工具
export default { formatDate, storage, validator }