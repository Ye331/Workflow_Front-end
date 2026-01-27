<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="title">舆情监控系统</h2>
      <div class="subtitle">App Web Framework Demo</div>
      
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-if="isRegister"
            v-model="email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[{ required: false }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 24px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            {{ isRegister ? '注册' : '登录' }}
          </van-button>
        </div>
        <div class="toggle-box">
          <span class="toggle-text" @click="isRegister = !isRegister">
            {{ isRegister ? '已有账号？立即登录' : '没有账号？立即注册' }}
          </span>
        </div>
      </van-form>
      
      <div class="tips" v-if="!isRegister">
        <p>测试账号: admin / 123456</p>
        <p>普通账号: user1 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import middleware from '@/api/middleware';

const router = useRouter();
const username = ref('');
const password = ref('');
const email = ref('');
const loading = ref(false);
const isRegister = ref(false);

const onSubmit = async (values) => {
  loading.value = true;
  try {
    if (isRegister.value) {
      // 注册逻辑
      await middleware.addUser({
        username: values.username,
        password: values.password,
        email: values.email,
        role: 'USER'
      });
      showToast('注册成功，请直接登录');
      isRegister.value = false;
    } else {
      // 登录逻辑
      const res = await middleware.login(values);
      // 登录成功，存储信息
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.id);
      localStorage.setItem('userName', res.username);
      localStorage.setItem('userRole', res.role);
      
      showToast('登录成功');
      router.replace('/dashboard');
    }
  } catch (error) {
    showToast((isRegister.value ? '注册失败: ' : '登录失败: ') + (error.message || '网络错误'));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.toggle-box {
  text-align: center;
  margin-bottom: 15px;
}
.toggle-text {
  color: #1989fa;
  font-size: 14px;
  cursor: pointer;
}
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  /* 添加入场动画：0.8秒内完成，贝塞尔曲线使其更自然 */
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* 定义关键帧动画 */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
}

.tips {
  margin-top: 40px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>
