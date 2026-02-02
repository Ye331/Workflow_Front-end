<template>
  <div class="monitor-detail-page">
    <van-nav-bar
      title="监测任务详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      class="custom-nav-bar"
    />
    
    <div class="content">
       <!-- Task Meta Card -->
       <div class="task-meta-card animate-fade-in" v-if="taskInfo">
          <div class="card-bg-decoration"></div>
          <div class="meta-header">
              <div class="meta-tag blue">全网感知</div>
              <div class="meta-status-btn" @click="handleSwitchTask" :class="{ active: isActive(taskInfo.status) }">
                  <div class="status-dot"></div>
                  <span>{{ isActive(taskInfo.status) ? '监测运行中' : '已暂停' }}</span>
              </div>
          </div>
          <div class="keyword-section">
              <h1 class="keyword-title">{{ taskInfo.keywords ? taskInfo.keywords.join(', ') : '未命名任务' }}</h1>
              <div class="keyword-subtitle">实时舆情监测任务</div>
          </div>
          <div class="meta-stats">
              <div class="stat-item">
                  <span class="label">任务ID</span>
                  <span class="value">{{ taskInfo.taskId || taskInfo.id }}</span>
              </div>
              <div class="divider"></div>
              <div class="stat-item">
                  <span class="label">创建时间</span>
                  <span class="value">{{ formatDate(taskInfo.createTime || taskInfo.created_at) }}</span>
              </div>
          </div>
       </div>

       <div class="section-title">
          <van-icon name="cluster-o" class="mr-2" color="#1989fa" />
          <span>事件链 (Event Chain)</span>
       </div>
       <van-empty v-if="events.length === 0" description="暂无事件数据" />
       
       <div class="timeline-container" v-else>
          <van-steps direction="vertical" :active="activeStep" active-color="#1989fa" inactive-icon="circle">
              <van-step v-for="(event, index) in events" :key="event.id">
                <div class="event-card">
                    <div class="event-header">
                        <h3>{{ event.title }}</h3>
                        <span class="time-tag">{{ formatDateShort(event.date) }}</span>
                    </div>
                    <p class="event-summary">{{ event.summary }}</p>
                    <div class="event-footer">
                        <van-tag class="mr-2" :type="(event.sentiment === 'POSITIVE' || event.sentiment === 'positive') ? 'success' : ((event.sentiment === 'NEGATIVE' || event.sentiment === 'negative') ? 'danger' : 'primary')">
                        {{ (event.sentiment === 'POSITIVE' || event.sentiment === 'positive') ? '正面' : ((event.sentiment === 'NEGATIVE' || event.sentiment === 'negative') ? '负面' : '中性') }}
                        </van-tag>
                        <span class="heat-info">🔥 热度: {{ event.heat }}</span>
                    </div>
                </div>
              </van-step>
          </van-steps>
       </div>
       
       <!-- Spacer for floating panel -->
       <div class="spacer"></div>
    </div>

    <!-- Q&A Floating Panel -->
    <van-floating-panel :anchors="anchors" v-model:height="panelHeight">
      <div class="qa-panel">
        <div class="qa-drag-handle"></div>
        <div class="qa-header-row">
            <div class="qa-title">
                <van-icon name="chat-o" size="18" />
                <span>AI 助手</span>
            </div>
            <div class="qa-status">在线</div>
        </div>
        
        <div class="qa-content" ref="qaContentRef">
          <div v-for="(msg, index) in chatHistory" :key="index" :class="['msg-item', msg.role]">
            <div class="avatar" v-if="msg.role === 'ai'">
                <van-icon name="service-o" size="32" color="#1989fa" />
            </div>
            <div class="bubble-container">
                <div class="bubble markdown-body" v-if="msg.role === 'ai'" v-html="renderMarkdown(msg.content)"></div>
                <div class="bubble" v-else>{{ msg.content }}</div>
                <div class="time" v-if="msg.time">{{ msg.time }}</div>
            </div>
            <div class="avatar user" v-if="msg.role === 'user'">
                <van-icon name="user-circle-o" size="32" color="#ccc" />
            </div>
          </div>
        </div>

        <div class="qa-input-area">
          <van-field
            v-model="question"
            center
            clearable
            placeholder="针对监测事件提问..."
            class="custom-chat-input"
            :border="false"
          >
            <template #button>
              <van-button 
                size="small" 
                type="primary" 
                color="#1989fa" 
                class="send-btn"
                @click="handleAsk" 
                :loading="asking"
                :disabled="!question"
              >
                <van-icon name="guide-o" />
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import middlewareApi from '@/api/middleware'
import { showToast } from 'vant'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const taskId = route.params.taskId
const events = ref([])
const activeStep = ref(-1)
const taskInfo = ref(null)

const formatDate = (isoStr) => {
    if(!isoStr) return '-'
    try {
        const date = new Date(isoStr)
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2,'0')}.${date.getDate().toString().padStart(2,'0')}`
    } catch(e) { return isoStr }
}
const formatDateShort = (isoStr) => {
     if(!isoStr) return ''
     try {
        const date = new Date(isoStr)
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`
     } catch(e) { return isoStr }
}

const isActive = (status) => {
    return status === 1 || status === '1' || status === 'active' || status === 'running'
}

const handleSwitchTask = async () => {
    if (!taskInfo.value) return
    const currentStatus = taskInfo.value.status
    const newState = !isActive(currentStatus)
    
    try {
        await middlewareApi.switchTask(taskId, newState)
        taskInfo.value.status = newState ? 'active' : 'paused'
        showToast(newState ? '任务已恢复' : '任务已暂停')
    } catch (e) {
        showToast('操作失败')
    }
}

// Floating Panel State
const screenHeight = window.innerHeight
const anchors = [120, Math.round(screenHeight * 0.6)]
const panelHeight = ref(anchors[0])
const qaContentRef = ref(null)

const question = ref('')
const asking = ref(false)
const chatHistory = ref([
  { role: 'ai', content: '您好，我是监测助手，您可以询问关于本次监测任务的细节。', time: '刚刚' }
])

const renderMarkdown = (text) => {
    try {
        return marked.parse(text)
    } catch (e) {
        return text
    }
}

const onClickLeft = () => {
  router.back()
}

const loadData = async () => {
    if (!taskId || taskId === 'undefined') {
         showToast('任务ID无效，无法加载数据')
         return
    }
    // Fetch slices/events for this task
    try {
        const userId = localStorage.getItem('userId') || '1'
        
        // Parallel fetch task info to get status
        const taskRes = await middlewareApi.getTaskList({ userId: userId, page: 1, size: 100 })
        if (taskRes && taskRes.list) {
            // Loose comparison for ID to handle string/number differences
            const found = taskRes.list.find(t => String(t.taskId || t.id) === String(taskId))
            if (found) {
                taskInfo.value = found
            } else {
                 // Fallback: create a dummy task info to show the button anyway, assuming active
                 // This ensures the button appears even if list fetch fails or ID mismatch
                 console.warn('Task not found in list, using fallback')
                 taskInfo.value = {
                     taskId: taskId,
                     status: 'active' // Default to active so user can try to pause
                 }
            }
        }

        const res = await middlewareApi.getAnalysisSlices({ userId: userId, taskId: taskId, page: 1, size: 50 })
        if (res && res.list) {
            events.value = res.list
            // Set the latest event as active, or all completed
            activeStep.value = 0 // Top most recent
        }
    } catch (e) {
        console.error("Failed to load events", e)
    }
}

// Auto Scroll logic for Chat
watch(chatHistory.value, () => {
    // Scroll only if panel is likely visible/expanded enough to care, or force it if it's open
    if (panelHeight.value > anchors[0]) {
        scrollToBottom()
    }
})

watch(panelHeight, (newH) => {
    if (newH > anchors[0]) {
        scrollToBottom()
    }
})

const scrollToBottom = async () => {
    await nextTick()
    if (qaContentRef.value) {
        qaContentRef.value.scrollTop = qaContentRef.value.scrollHeight
    }
}

const handleAsk = async () => {
  if (!question.value) return
  
  // Expand panel
  if (panelHeight.value < anchors[1]) {
      panelHeight.value = anchors[1]
  }

  const q = question.value
  chatHistory.value.push({ role: 'user', content: q, time: '刚刚' })
  question.value = ''
  asking.value = true
  
  scrollToBottom()

  try {
    // Determine the context for the question. 
    // Ideally we ask about the currently focused event in the chain.
    let currentEventId = null;
    if (events.value.length > 0 && activeStep.value >= 0 && activeStep.value < events.value.length) {
        currentEventId = events.value[activeStep.value].id;
    } else if (events.value.length > 0) {
        // Default to the first (latest) event if no specific step is active (though activeStep usually is 0)
        currentEventId = events.value[0].id;
    }

    if (!currentEventId) {
         chatHistory.value.push({ role: 'ai', content: '当前没有关联的事件，无法回答具体问题。', time: '刚刚' })
         return
    }

    const res = await middlewareApi.askEvent({ 
      question: q, 
      eventId: currentEventId 
    })
    chatHistory.value.push({ role: 'ai', content: res.answer, time: '刚刚' })
  } catch (err) {
    chatHistory.value.push({ role: 'ai', content: '系统繁忙，请稍后再试。', time: '刚刚' })
  } finally {
    asking.value = false
    scrollToBottom()
  }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.monitor-detail-page {
    background-color: #f7f8fa;
    min-height: 100vh;
    position: relative;
    padding-bottom: 0;
}
.custom-nav-bar {
    background: #fff;
    --van-nav-bar-icon-color: #333;
    --van-nav-bar-title-text-color: #333;
    --van-nav-bar-title-font-weight: 600;
}
.content {
    padding: 20px;
    background: white;
    min-height: 80vh;
}
.section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    padding-left: 12px;
    border-left: 4px solid #1989fa;
    color: #333;
}
.event-time {
    font-size: 12px;
    color: #999;
    margin: 4px 0;
}
.event-summary {
    font-size: 14px;
    color: #666;
    margin: 8px 0;
    line-height: 1.5;
}
.tags {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}
.spacer {
    height: 120px;
}

/* Chat Panel Styles */
.qa-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
    overflow: hidden;
}
.qa-drag-handle {
    width: 36px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    margin: 8px auto;
}
.qa-header-row {
    padding: 0 20px 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
}
.qa-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
}
.qa-status {
    font-size: 12px;
    color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
}
.qa-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9f9f9;
}
.msg-item {
    display: flex;
    margin-bottom: 16px;
    gap: 10px;
    align-items: flex-start;
}
.msg-item.user {
    flex-direction: row-reverse;
}
.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.avatar.user { border: none; background: transparent; }

.bubble-container {
    max-width: 70%;
    display: flex;
    flex-direction: column;
}
.msg-item.user .bubble-container {
    align-items: flex-end;
}

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  word-wrap: break-word;
}
/* AI Bubble */
.msg-item.ai .bubble { 
    background: #fff; 
    color: #333;
    border-top-left-radius: 2px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03); 
    max-width: 100%; /* Ensure content doesn't overflow container */
}

/* Markdown Styles for AI Bubble */
.markdown-body :deep(p) {
    margin: 0 0 8px 0;
}
.markdown-body :deep(h1), 
.markdown-body :deep(h2), 
.markdown-body :deep(h3), 
.markdown-body :deep(h4) {
    margin: 10px 0 6px 0;
    font-weight: 600;
    line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 16px; }
.markdown-body :deep(h2) { font-size: 15px; }
.markdown-body :deep(h3) { font-size: 14px; }
.markdown-body :deep(ul), .markdown-body :deep(ol) {
    margin: 0 0 8px 0;
    padding-left: 20px;
}
.markdown-body :deep(li) {
    margin-bottom: 4px;
}
.markdown-body :deep(strong) {
    font-weight: 600;
    color: #000;
}
.markdown-body :deep(blockquote) {
    margin: 0 0 8px 0;
    padding: 0 10px;
    color: #666;
    border-left: 3px solid #ddd;
    background-color: #f9f9f9;
}
.markdown-body :deep(code) {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
}

/* User Bubble */
.msg-item.user .bubble {  
    background: #1989fa; 
    color: #fff; 
    border-top-right-radius: 2px;
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
}

.time {
    font-size: 10px;
    color: #bbb;
    margin-top: 4px;
}

.qa-input-area {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.status-switch {
    display: flex;
    align-items: center;
}
.status-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: #f0f9eb; /* Light green */
    color: #07c160;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
}
.status-btn .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #07c160;
    animation: blink 2s infinite;
}
.status-btn.paused {
    background-color: #fff4e6; /* Light orange */
    color: #ff976a;
}
.status-btn.paused .status-dot {
    background-color: #ff976a;
    animation: none;
}
@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}

.custom-chat-input {
    background: #f5f6f8;
    border-radius: 24px;
    padding: 6px 16px; 
}
.send-btn {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 0;
    min-width: 32px; 
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Task Meta Card Styles */
.task-meta-card {
    background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
    border-radius: 20px;
    padding: 24px 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(25, 137, 250, 0.08);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(25, 137, 250, 0.1);
}
.card-bg-decoration {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(25,137,250,0.1) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    z-index: 0;
}
.meta-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
}
.meta-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 600;
}
.meta-tag.blue { background: #e3f2fd; color: #1989fa; }
.meta-status-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background-color: #fff4e6;
    color: #ff976a;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
}
.meta-status-btn .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff976a;
}
.meta-status-btn.active {
    background-color: #e8f5e9;
    color: #07c160;
}
.meta-status-btn.active .status-dot {
    background-color: #07c160;
    animation: blink 2s infinite;
}

.keyword-section {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
}
.keyword-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    line-height: 1.3;
}
.keyword-subtitle {
    font-size: 13px;
    color: #888;
}

.meta-stats {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.6);
    padding: 12px;
    border-radius: 12px;
    backdrop-filter: blur(4px);
}
.stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}
.stat-item .label { font-size: 11px; color: #999; }
.stat-item .value { font-size: 14px; color: #333; font-weight: 600; font-family: monospace; }
.divider { width: 1px; height: 24px; background: #eee; margin: 0 16px; }

/* Enhanced Event Card Styles */
.section-title {
    display: flex;
    align-items: center;
}
.event-card {
    background: #f8f9fc;
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 4px;
    border: 1px solid #f0f0f0;
}
.event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
}
.event-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    max-width: 70%;
}
.time-tag {
    font-size: 11px;
    color: #999;
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
}
.event-summary {
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.event-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.heat-info {
    font-size: 12px;
    color: #ff976a;
    font-weight: 500;
}
:deep(.van-step__line) {
    background-color: #e0e0e0;
}
:deep(.van-step--vertical:not(:last-child)::after) {
    border-bottom: none;
}
</style>
