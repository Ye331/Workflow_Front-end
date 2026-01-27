<template>
  <div class="tiimo-dashboard">
    <!-- Header -->
    <header class="header" :class="{ 'header-scrolled': isScrolled }" v-if="activeTab !== 'mine'">
      <div class="header-left">
        <div class="status-pill" @click="goToUserCenter">
          <van-icon name="user-circle-o" />
          <span>{{ currentUserDisplay }}</span>
        </div>
      </div>
      <div class="header-center">
        <div class="date-display">
          <div class="date-text">
            <div class="weekday">舆情看板</div>
            <div class="full-date">{{ currentDateStr }}</div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <!-- <van-icon name="ellipsis" size="24" @click="goToUserCenter" /> -->
      </div>
    </header>

    <!-- User Profile Section -->
    <UserProfile v-if="activeTab === 'mine'" />

    <!-- Widget Cards (Stats) -->
    <div class="widget-scroll-container animate-fade-in" v-if="activeTab === 'overview'">
      <div class="widget-card purple">
        <div class="widget-icon-circle"><van-icon name="fire-o" size="24" /></div>
        <div class="widget-text">
           <div class="stat-num">{{ monitoringCount }}</div>
           <div class="stat-label">正在监测</div>
        </div>
      </div>
      <div class="widget-card blue">
        <div class="widget-icon-circle"><van-icon name="chart-trending-o" size="24" /></div>
        <div class="widget-text">
            <div class="stat-num">{{ todayReportCount }}</div>
            <div class="stat-label">今日报告</div>
        </div>
      </div>
    </div>

    <!-- Main Content Sections -->
    <div class="task-sections">
      <!-- Tab 1: Monitor (Analysis Flow) -->
      <div v-if="activeTab === 'monitor'" class="animate-fade-in">
          <div class="section-header mb-3">
              <van-icon name="aim" class="mr-2" />
              <span class="section-title">新词监测 (Analysis)</span>
          </div>
          
          <div class="custom-card-content">
             <van-cell-group inset :border="false" style="margin:0; padding:0;">
                <van-field 
                    v-model="keyword" 
                    placeholder="输入关键词 (如: 计算机)" 
                    label="关键词" 
                    left-icon="search"
                    class="custom-field"
                />
                <van-field
                    v-model="timeDisplayName"
                    is-link
                    readonly
                    name="picker"
                    label="时间范围"
                    left-icon="clock-o"
                    placeholder="选择时间范围"
                    @click="showPicker = true"
                    class="custom-field"
                />
             </van-cell-group>
             <van-button 
                type="primary" 
                block 
                color="#000"
                class="mt-3 action-btn" 
                :loading="loading" 
                @click="handleTriggerAnalysis"
             >
                <van-icon name="play-circle-o" class="mr-1" /> 开始感知
             </van-button>
          </div>
      </div>

      <!-- Tab 1 (Overview) & Tab 2 (Reports): Report List -->
      <div v-show="activeTab === 'overview' || activeTab === 'monitor'">
          <div v-if="activeTab !== 'monitor'" class="section-header mb-3 mt-4 animate-fade-in">
              <van-icon name="orders-o" class="mr-2" />
              <span class="section-title">趋势报告 (Reports)</span>
              <span class="count-badge">({{ list.length }})</span>
          </div>
          <div v-if="activeTab === 'monitor'" class="section-header mb-3 mt-4">
               <van-icon name="clock-o" class="mr-2" />
               <span class="section-title">近期记录</span>
          </div>
          
          <div class="report-list-container">
             <van-list
                v-model:loading="listLoading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
             >
                <!-- Custom List Item Style -->
                <div 
                    v-for="item in list"
                    :key="item.id"
                    class="report-item"
                    @click="goToReport(item.id)"
                >
                   <div class="report-icon">
                      <van-icon 
                        :name="item.sentiment === 'negative' ? 'warn-o' : (item.sentiment === 'positive' ? 'smile-o' : 'info-o')" 
                        :color="item.sentiment === 'negative' ? '#ff605e' : (item.sentiment === 'positive' ? '#4caf50' : '#1989fa')" 
                        size="24" 
                      />
                   </div>
                   <div class="report-info">
                      <div class="report-title">{{ item.title }}</div>
                      <div class="report-meta">
                        热度: {{ item.heat }} % | 状态: {{ item.status }}
                      </div>
                   </div>
                   <div class="report-arrow">
                      <van-icon name="arrow" color="#ccc" />
                   </div>
                </div>
            </van-list>
          </div>
      </div>

      <!-- Tab 3: Empty Placeholder -->
      <div v-if="activeTab === 'msg'" class="empty-placeholder">
          <van-empty description="暂无新消息" />
      </div>
    </div>

    <!-- Popups -->
    <van-popup v-model:show="showPicker" position="bottom" round>
        <van-picker
          :columns="timeOptions"
          @confirm="onConfirmTime"
          @cancel="showPicker = false"
        />
    </van-popup>

    <!-- Bottom Tabbar -->
    <van-tabbar 
      v-model="activeTab" 
      active-color="#000" 
      inactive-color="#ccc" 
      :border="false" 
      class="custom-tabbar" 
      fixed
      safe-area-inset-bottom
    >
      <van-tabbar-item icon="apps-o" name="overview" @click="scrollToTop">概览</van-tabbar-item>
      <van-tabbar-item icon="search" name="monitor" @click="scrollToTop">监测</van-tabbar-item>
      <van-tabbar-item icon="comment-o" :badge="unreadCount || null" name="msg">消息</van-tabbar-item>
      <van-tabbar-item icon="user-o" name="mine" @click="goToUserCenter">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import middlewareApi from '@/api/middleware'
import UserProfile from './UserProfile.vue'

const router = useRouter()

// UI States
const activeNames = ref(['monitor', 'reports'])
const activeTab = ref('overview')
const monitoringCount = ref(0)
const todayReportCount = ref(0)
const unreadCount = ref(5) // 模拟未读消息数

// 监听 Tab 切换，点击消息页时清空未读数
watch(activeTab, (val) => {
  if (val === 'msg') {
    unreadCount.value = 0
  }
})
const isScrolled = ref(false)

const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (itemObserver) itemObserver.disconnect()
})

// Scroll Reveal Logic
let itemObserver = null

const initObserver = () => {
    itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('report-item-hidden')
            } else {
                entry.target.classList.add('report-item-hidden')
            }
        })
    }, { threshold: 0.1, rootMargin: '0px' })
}


const getFormattedDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekDay}`
}

const currentDateStr = ref(getFormattedDate())
const currentUserDisplay = ref(localStorage.getItem('userName') || localStorage.getItem('userRole') || 'Admin')

// Business States
const keyword = ref('')
const timeRange = ref('24h')
const timeDisplayName = ref('最近24小时')
const showPicker = ref(false)
const loading = ref(false)
const listLoading = ref(false)
const finished = ref(false)
const list = ref([])

watch(list, () => {
    nextTick(() => {
        const items = document.querySelectorAll('.report-item:not(.observed)')
        items.forEach((item) => {
            // Initial hidden state for animation
            item.classList.add('report-item-hidden')
            
            if (itemObserver) {
                itemObserver.observe(item)
                item.classList.add('observed')
            }
        })
    })
}, { deep: true })

const timeOptions = [
  { text: '最近24小时', value: '24h' },
  { text: '最近7天', value: '7d' },
  { text: '最近30天', value: '30d' },
]

// Methods
const onConfirmTime = ({ selectedOptions }) => {
  timeRange.value = selectedOptions[0].value
  timeDisplayName.value = selectedOptions[0].text
  showPicker.value = false
}

const handleTriggerAnalysis = async () => {
  if (!keyword.value) return showToast('请输入关键词')
  
  loading.value = true
  try {
    await middlewareApi.createTask({
      userId: localStorage.getItem('userId') || '1',
      keywords: [keyword.value],
      time_range: timeRange.value,
      interval: '1h'
    })
    showToast({ type: 'success', message: '任务已下发' })
    list.value = []
    finished.value = false
    listLoading.value = true
    onLoad()
  } catch (err) {
    showToast('任务触发失败: ' + (err.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const onLoad = async () => {
  try {
    const res = await middlewareApi.getAnalysisSlices({
        userId: localStorage.getItem('userId') || '1',
        page: 1, 
        size: 20
    })
    if (res && res.list) {
        // Mock data enhancement if needed
        list.value = res.list
    } else {
        list.value = []
    }
  } catch (err) {
    // showToast('数据加载失败')
  } finally {
    listLoading.value = false
    finished.value = true
  }
}

const goToReport = (id) => {
  router.push(`/report/${id}`)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const goToUserCenter = () => {
    activeTab.value = 'mine'
}

const fetchDashboardStats = async () => {
    const userId = localStorage.getItem('userId') || '1'
    
    // 1. Fetch Tasks for "Currently Monitoring"
    try {
        const taskRes = await middlewareApi.getTaskList({ userId, page: 1, size: 100 })
        if (taskRes && taskRes.total !== undefined) {
             monitoringCount.value = taskRes.total
        } else if (taskRes && taskRes.list) {
             monitoringCount.value = taskRes.list.length
        }
    } catch (e) {
        console.error("Failed to fetch task stats", e)
    }

    // 2. Fetch Reports for "Today's Report"
    try {
        const reportRes = await middlewareApi.getReportList({ userId, page: 1, size: 100 })
        if (reportRes && reportRes.list) {
            const today = new Date().toDateString()
            const todayCount = reportRes.list.filter(item => {
                if (!item.createTime) return false
                const itemDate = new Date(item.createTime).toDateString()
                return itemDate === today
            }).length
            todayReportCount.value = todayCount
        }
    } catch (e) {
        console.error("Failed to fetch report stats", e)
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    initObserver()
    fetchDashboardStats()
})
</script>

<style scoped>
.tiimo-dashboard {
  padding: 24px 20px 0 20px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: transparent; /* Initial Solid Background */
  padding: 10px 0; /* Initial Padding */
  transition: all 0.3s ease-in-out;
}

.header.header-scrolled {
  padding: 5px 0; /* Narrower */
  background-color: rgba(255, 255, 255, 0.8); /* Transparent */
  backdrop-filter: blur(10px);
  margin-bottom: 24px; /* Ensure margin stays consistent */
}
.status-pill {
  background-color: #ffffff;
  padding: 6px 8px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateX(0);
}

.status-pill :deep(.van-icon) {
  font-size: 22px;
}

.header.header-scrolled .status-pill {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
}

.header-center { 
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center; 
}
.date-text { display: flex; flex-direction: column; align-items: center; }
.weekday { 
    font-size: 18px; 
    font-weight: bold; 
    color: #000; 
    transition: all 0.3s ease;
    max-height: 30px;
    opacity: 1;
}
.header.header-scrolled .weekday {
    max-height: 0;
    opacity: 0;
    margin: 0;
    transform: translateY(-10px);
}
.full-date { font-size: 12px; color: #666; margin-top: 2px; }
.ml-2 { margin-left: 16px; }

/* Animations */
.animate-fade-in {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Widgets */
.widget-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 24px;
  padding: 4px; /* Added padding to prevent shadow clipping */
  margin-bottom: 24px;
  -ms-overflow-style: none; scrollbar-width: none;
}
.widget-scroll-container::-webkit-scrollbar { display: none; }

.widget-card {
  flex: 1;
  min-width: 45%; 
  height: 140px;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start; /* Left align content */
  text-align: left;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  background-color: #fff; /* Fallback */
  transition: transform 0.2s;
}
.widget-card:active {
  transform: scale(0.98);
}

.widget-card.purple { 
    background: linear-gradient(135deg, #fdfbfd 0%, #f3e5f5 100%);
    border: 1px solid rgba(243, 229, 245, 0.5);
}
.widget-card.purple .widget-icon-circle {
    background-color: #ede7f6;
    color: #7e57c2;
}
.widget-card.purple .stat-num { color: #512da8; }

.widget-card.blue { 
    background: linear-gradient(135deg, #fbfdff 0%, #e3f2fd 100%);
    border: 1px solid rgba(227, 242, 253, 0.5);
}
.widget-card.blue .widget-icon-circle {
    background-color: #e1f5fe;
    color: #039be5;
}
.widget-card.blue .stat-num { color: #0277bd; }

.widget-icon-circle {
  width: 44px; height: 44px;
  border-radius: 14px; /* Rounded square shapes */
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 0px; 
}

.widget-text {
    width: 100%;
}

.stat-num { font-size: 32px; font-weight: 800; line-height: 1.1; margin-bottom: 2px; }
.text-risk { color: #d32f2f; }
.stat-label { font-size: 14px; color: #666; font-weight: 500;}

/* Sections */
.task-sections { margin-top: 24px; padding-bottom: 90px;}
.section-header {
  display: flex; align-items: center;
  font-size: 18px; font-weight: 600; color: #333; width: 100%;
  margin-bottom: 16px;
}
.section-title { margin-right: 4px; }
.count-badge { color: #999; font-weight: normal; font-size: 14px; }
.mr-2 { margin-right: 8px; }

/* Custom Vant Overrides */
:deep(.van-cell) { padding-left: 0; padding-right: 0; background: transparent; }
:deep(.van-collapse-item__content) { padding: 0 0 16px 0; background: transparent; }

/* Custom Card inside Collapse */
.custom-card-content {
    background: #fff;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.03);
}
.custom-field {
    background: #f7f8fa;
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 16px 20px;
}
.action-btn {
    border-radius: 16px;
    font-weight: 600;
    height: 52px;
    font-size: 16px;
    background: linear-gradient(to right, #242424, #1a1a1a);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border: none;
    transition: transform 0.2s;
}
.action-btn:active {
    transform: scale(0.98);
}

/* List Items */
.report-item {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    
    /* Reveal Animation Base State */
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s, box-shadow 0.2s;
}

/* Hidden state added by JS */
.report-item-hidden {
    opacity: 0;
    transform: translateY(40px);
}

.report-item:active { background: #f5f5f5; }
.report-icon {
    width: 48px; height: 48px;
    background: #f7f8fa;
    border-radius: 16px;
    display: flex; justify-content: center; align-items: center;
    margin-right: 16px;
}
.report-info { flex: 1; }
.report-title { font-weight: 600; font-size: 16px; margin-bottom: 6px; color: #333; }
.report-meta { font-size: 13px; color: #999; }
.report-arrow { margin-left: 8px;}

/* Tabbar */
:deep(.custom-tabbar) {
    margin: 0 24px 24px;
    width: auto !important;
    left: 0;
    right: 0;
    border-radius: 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    height: 64px;
    /* Glassmorphism / Frosted glass effect */
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
}

:deep(.van-tabbar-item) {
    background: transparent;
    transition: all 0.3s;
    border-radius: 24px;
    margin: 6px;
}

:deep(.van-tabbar-item--active) {
    background-color: #f0f0f0;
    font-weight: 600;
}
</style>
