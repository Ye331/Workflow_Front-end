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
       <div class="section-title">事件链 (Event Chain)</div>
       <van-empty v-if="events.length === 0" description="暂无事件数据" />
       <van-steps direction="vertical" :active="activeStep" active-color="#1989fa" v-else>
          <van-step v-for="(event, index) in events" :key="event.id">
             <h3>{{ event.title }}</h3>
             <p class="event-time">{{ event.date }}</p>
             <p class="event-summary">{{ event.summary }}</p>
             <div class="tags">
                <van-tag class="mr-2" :type="event.sentiment === 'positive' ? 'success' : (event.sentiment === 'negative' ? 'danger' : 'primary')">
                   {{ event.sentiment === 'positive' ? '正面' : (event.sentiment === 'negative' ? '负面' : '中性') }}
                </van-tag>
                <van-tag plain type="primary">热度: {{ event.heat }}</van-tag>
             </div>
          </van-step>
       </van-steps>
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
                <div class="bubble">{{ msg.content }}</div>
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

const route = useRoute()
const router = useRouter()
const taskId = route.params.taskId
const events = ref([])
const activeStep = ref(-1)

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

const onClickLeft = () => {
  router.back()
}

const loadData = async () => {
    // Fetch slices/events for this task
    try {
        const userId = localStorage.getItem('userId') || '1'
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
    // Use askEvent API, assuming it can handle taskId/event context
    // Here we pass taskId as eventId context for simplicity or update API if needed
    const res = await middlewareApi.askEvent({ 
      question: q, 
      eventId: taskId // Using taskId as context
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
</style>
