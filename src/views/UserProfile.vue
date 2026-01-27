<template>
  <div class="user-profile">
    <!-- User Info Card -->
    <div class="user-card">
      <div class="avatar-container">
        <van-icon name="user-circle-o" size="80" color="#ccc" />
        <div class="role-badge" v-if="userRole">{{ userRole }}</div>
      </div>
      <h2 class="username">{{ userName }}</h2>
      <p class="user-id">ID: {{ userId }}</p>
    </div>

    <!-- Menu List -->
    <div class="menu-section">
      <van-cell-group inset>
        <van-cell 
          v-if="isAdmin" 
          title="用户管理" 
          icon="friends-o" 
          is-link 
          to="/user-management" 
        />
        <van-cell title="修改密码" icon="lock" is-link />
        <van-cell title="系统设置" icon="setting-o" is-link />
        <van-cell title="关于我们" icon="info-o" is-link value="v1.0.0" />
      </van-cell-group>
      
      <div class="logout-btn-container">
        <van-button block color="#ee0a24" @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showDialog } from 'vant';

const router = useRouter();

const userName = ref('');
const userId = ref('');
const userRole = ref('');

const isAdmin = computed(() => {
  return userRole.value === 'Admin' || userRole.value === 'admin';
});

onMounted(() => {
  // Load user info from localStorage
  userName.value = localStorage.getItem('userName') || 'Guest';
  userId.value = localStorage.getItem('userId') || '-';
  // Check both keys due to potential inconsistency
  userRole.value = localStorage.getItem('userRole') || localStorage.getItem('role') || 'User';
});

const handleLogout = () => {
  showDialog({
    title: '提示',
    message: '确认要退出登录吗？',
    showCancelButton: true,
  }).then((action) => {
    if (action === 'confirm') {
      localStorage.clear();
      router.replace('/login');
    }
  });
};
</script>

<style scoped>
.user-profile {
  padding-bottom: 20px;
  background-color: #f7f8fa; /* Light gray background for contrast */
  min-height: 100%; 
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 30px;
  background-color: #fff;
  margin-bottom: 12px;
}

.avatar-container {
  position: relative;
  margin-bottom: 12px;
}

.role-badge {
  position: absolute;
  bottom: 0;
  right: -10px;
  background-color: #1989fa;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 2px solid #fff;
}

.username {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #323233;
}

.user-id {
  margin: 4px 0 0;
  font-size: 12px;
  color: #969799;
}

.menu-section {
  padding-top: 10px;
}

.logout-btn-container {
  margin: 24px 16px 0;
}
</style>
