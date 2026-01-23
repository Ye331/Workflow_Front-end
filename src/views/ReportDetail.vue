<template>
  <div class="report-page">
    <van-nav-bar
      title="舆情报告详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <!-- 加载中 -->
    <div v-if="loading" class="loading-box">
      <van-loading type="spinner" vertical>AI 正在生成报告 (WF2)...</van-loading>
    </div>

    <div v-else>
      <!-- WF2: 趋势图表区 (Charts) -->
      <div class="section">
        <h3 class="section-title">热度趋势 (Trend)</h3>
        <div class="chart-placeholder">
          <!-- 这里集成 ECharts -->
          <p class="chart-text">[图表组件] 7日热度曲线图</p>
          <p class="chart-sub">x: {{ reportData.trend?.xAxis || '[]' }}</p>
        </div>
      </div>

      <!-- WF2: 综合研判 (Markdown) -->
      <div class="section">
        <h3 class="section-title">智能综述 (Summary)</h3>
        <div class="markdown-body" v-html="renderedMarkdown"></div>
      </div>
    </div>

    <!-- WF3: 智能问答 (Q&A) -->
    <van-floating-panel v-if="!loading" :anchors="[100, Math.round(screenHeight * 0.6)]">
      <div class="qa-panel">
        <div class="qa-header">AI 助手 (RAG)</div>
        <div class="qa-content">
          <div v-for="(msg, index) in chatHistory" :key="index" :class="['msg-item', msg.role]">
            <div class="bubble">{{ msg.content }}</div>
          </div>
        </div>
        <div class="qa-input">
          <van-field
            v-model="question"
            center
            clearable
            placeholder="针对本报告提问..."
          >
            <template #button>
              <van-button size="small" type="primary" @click="handleAsk" :loading="asking">发送</van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
// 需要安装 marked: npm install marked
// import { marked } from 'marked' 
import middlewareApi from '@/api/middleware'

const route = useRoute()
const router = useRouter()
const screenHeight = window.innerHeight

const loading = ref(true)
const reportData = ref({})
const question = ref('')
const asking = ref(false)
const chatHistory = ref([
  { role: 'ai', content: '您好，我是基于本报告的AI助手，有什么想了解的细节吗？' }
])

const renderedMarkdown = computed(() => {
  // 临时模拟 Markdown 解析，实际需引入 marked 库
  return reportData.value.summary 
    ? `<p>${reportData.value.summary}</p>` 
    : '<p>暂无内容</p>'
})

onMounted(async () => {
  const id = route.params.id
  await fetchReport(id)
})

const onClickLeft = () => router.back()

// WF2: 获取报告
const fetchReport = async (id) => {
  loading.value = true
  try {
    // 模拟 API 延迟
    // const res = await middlewareApi.getReportDetail(id)
    setTimeout(() => {
      reportData.value = {
        title: '测试报告',
        trend: { xAxis: ['Mon', 'Tue', 'Wed'] },
        summary: '## 事件综述\n\n本次事件**热度极高**，主要集中在...'
      }
      loading.value = false
    }, 1500)
  } catch (err) {
    showToast('获取报告失败')
    loading.value = false
  }
}

// WF3: 提问
const handleAsk = async () => {
  if (!question.value) return
  
  const q = question.value
  chatHistory.value.push({ role: 'user', content: q })
  question.value = ''
  asking.value = true

  try {
    // const res = await middlewareApi.askQuestion({ 
    //   question: q, 
    //   context_id: route.params.id 
    // })
    setTimeout(() => {
      chatHistory.value.push({ role: 'ai', content: `(模拟回复) 根据报告分析，关于"${q}"的情况是...` })
      asking.value = false
    }, 1000)
  } catch (err) {
    chatHistory.value.push({ role: 'ai', content: '系统繁忙，请稍后再试。' })
    asking.value = false
  }
}
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 120px; /* 留出底部面板空间 */
}
.loading-box {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}
.section {
  padding: 16px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  border-left: 4px solid #1989fa;
  padding-left: 8px;
}
.chart-placeholder {
  height: 200px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 8px;
}
.markdown-body {
  line-height: 1.6;
  color: #333;
}

/* QA 面板样式 */
.qa-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.qa-header {
  text-align: center;
  padding: 10px;
  font-weight: bold;
  color: #999;
  border-bottom: 1px solid #eee;
}
.qa-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f7f8fa;
}
.msg-item {
  margin-bottom: 10px;
  display: flex;
}
.msg-item.user { justify-content: flex-end; }
.bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}
.msg-item.ai .bubble { background: #fff; border: 1px solid #eee; }
.msg-item.user .bubble { background: #1989fa; color: #fff; }
.qa-input {
  padding: 5px;
  background: #fff;
  border-top: 1px solid #eee;
}
</style>
