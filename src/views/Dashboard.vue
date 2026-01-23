<template>
  <div class="dashboard-page">
    <van-nav-bar title="舆情监控看板">
      <template #right>
        <van-icon name="user-o" size="18" @click="goToUserCenter" />
      </template>
    </van-nav-bar>

    <van-action-sheet
      v-model:show="showUserAction"
      :actions="userActions"
      cancel-text="取消"
      close-on-click-action
      @select="onUserActionSelect"
    />

    <!-- WF1: 舆情分析流触发 -->
    <div class="card search-card">
      <h3 class="card-title">新词监测 (Analysis Flow)</h3>
      <van-field v-model="keyword" placeholder="输入关键词 (如: 计算机)" label="关键词" />
      <van-field
        v-model="timeRange"
        is-link
        readonly
        name="picker"
        label="时间范围"
        placeholder="选择时间范围"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-picker
          :columns="timeOptions"
          @confirm="onConfirmTime"
          @cancel="showPicker = false"
        />
      </van-popup>
      <van-button type="primary" block class="mt-2" :loading="loading" @click="handleTriggerAnalysis">
        开始感知
      </van-button>
    </div>

    <!-- 报告列表 (模拟从中台获取的Data Slices) -->
    <div class="card list-card">
      <h3 class="card-title"> 趋势报告 (Data Slices)</h3>
      <van-list
        v-model:loading="listLoading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item.id"
          :title="item.title"
          :label="`热度: ${item.heat} | 情感: ${item.sentiment}`"
          is-link
          @click="goToReport(item.id)"
        >
          <template #value>
            <span :class="{'text-red': item.sentiment < 5, 'text-green': item.sentiment >= 5}">
              {{ item.sentiment < 5 ? '风险' : '积极' }}
            </span>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import middlewareApi from '@/api/middleware'

const router = useRouter()

// 状态
const keyword = ref('')
const timeRange = ref('24h')
const showPicker = ref(false)
const loading = ref(false)
const listLoading = ref(false)
const finished = ref(false)
const list = ref([])
const showUserAction = ref(false)

const userActions = [
  { name: '用户管理', key: 'manage' },
  { name: '退出登录', key: 'logout', color: '#ee0a24' }
]

const goToUserCenter = () => {
    showUserAction.value = true
}

const onUserActionSelect = (item) => {
    if (item.key === 'manage') {
        router.push('/user-management')
    } else if (item.key === 'logout') {
        localStorage.clear()
        router.replace('/login')
    }
}

// 选项
const timeOptions = [
  { text: '最近24小时', value: '24h' },
  { text: '最近7天', value: '7d' },
  { text: '最近30天', value: '30d' },
]

const onConfirmTime = ({ selectedOptions }) => {
  timeRange.value = selectedOptions[0].value
  showPicker.value = false
}

// 触发 WF1
const handleTriggerAnalysis = async () => {
  if (!keyword.value) return showToast('请输入关键词')
  
  loading.value = true
  try {
    // 调用中台 API
    await middlewareApi.triggerAnalysis({
      keyword: keyword.value,
      time_range: timeRange.value
    })
    showToast({ type: 'success', message: '任务已下发' })
    // 模拟刷新列表
    onLoad()
  } catch (err) {
    showToast('任务触发失败')
  } finally {
    loading.value = false
  }
}

// 获取列表 (模拟)
const onLoad = async () => {
  // 模拟数据加载
  setTimeout(() => {
    if (list.value.length === 0) {
      list.value = [
        { id: 1, title: '极氪001 电池续航测评', heat: 8500, sentiment: 8.2 },
        { id: 2, title: '某品牌刹车失灵事件', heat: 12000, sentiment: 2.1 },
        { id: 3, title: '2026年新能源补贴政策', heat: 5000, sentiment: 6.5 },
      ]
    }
    listLoading.value = false
    finished.value = true
  }, 1000)
}

const goToReport = (id) => {
  router.push(`/report/${id}`)
}

const goToUserManagement = () => {
  router.push('/user-management')
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}
.card {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  border-left: 4px solid #1989fa;
  padding-left: 8px;
}
.mt-2 {
  margin-top: 16px;
}
.text-red { color: #ee0a24; }
.text-green { color: #07c160; }
</style>
