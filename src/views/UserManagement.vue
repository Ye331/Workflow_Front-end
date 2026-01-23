<template>
  <div class="user-management-page">
    <van-nav-bar
      title="用户管理"
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
      right-text="添加用户"
      @click-right="showAddDialog = true"
    />

    <van-search v-model="searchText" placeholder="搜索用户名" @search="onSearch" />

    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-swipe-cell v-for="item in list" :key="item.id">
        <van-cell :title="item.username" :label="`角色: ${item.role} | ID: ${item.id}`" />
        <template #right>
          <van-button square text="编辑" type="primary" class="action-btn" @click="onEdit(item)" />
          <van-button square text="删除" type="danger" class="action-btn" @click="onDelete(item)" />
        </template>
      </van-swipe-cell>
    </van-list>

    <!-- 添加/编辑用户弹窗 -->
    <van-dialog v-model:show="showAddDialog" :title="isEdit ? '编辑用户' : '添加用户'" show-cancel-button @confirm="onConfirmUser">
        <van-form ref="userForm">
            <van-cell-group inset>
                <van-field
                    v-model="currentUser.username"
                    name="用户名"
                    label="用户名"
                    placeholder="请输入用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-if="!isEdit"
                    v-model="currentUser.password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
                <van-field
                    v-model="currentUser.role"
                    name="角色"
                    label="角色"
                    placeholder="请填写角色 (如 admin, user)"
                />
            </van-cell-group>
        </van-form>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import middleware from '@/api/middleware';

const router = useRouter();
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const searchText = ref('');
const showAddDialog = ref(false);
const isEdit = ref(false);

const currentUser = reactive({
    id: '',
    username: '',
    password: '',
    role: 'user'
});

const onClickLeft = () => {
  router.back();
};

const onLoad = async () => {
    // 模拟分页或一次性加载
    loading.value = true;
    try {
        const res = await middleware.getUserList({ keyword: searchText.value });
        // 假设res是数组
        if (Array.isArray(res)) {
            // 如果是第一页，覆盖
             if (list.value.length === 0 || searchText.value) {
                 list.value = res;
             } else {
                 list.value.push(...res);
             }
        }
        finished.value = true; // 简单处理，假设一次加载完
    } catch (error) {
        console.error(error);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

const onSearch = () => {
    list.value = [];
    finished.value = false;
    onLoad();
};

const onEdit = (item) => {
    isEdit.value = true;
    currentUser.id = item.id;
    currentUser.username = item.username;
    currentUser.role = item.role;
    currentUser.password = ''; // 编辑时不回显密码
    showAddDialog.value = true;
};

const onDelete = (item) => {
    showConfirmDialog({
        title: '确认删除',
        message: `确认删除用户 ${item.username} 吗？`
    }).then(async () => {
        try {
            await middleware.deleteUser(item.id);
            showToast('删除成功');
            onSearch(); // 刷新
        } catch (e) {
            // error handled in request.js
        }
    }).catch(() => {
        // cancel
    });
};

const onConfirmUser = async () => {
    try {
        if (isEdit.value) {
            await middleware.updateUser(currentUser.id, {
                username: currentUser.username,
                role: currentUser.role
            });
            showToast('更新成功');
        } else {
            await middleware.addUser({
                username: currentUser.username,
                password: currentUser.password,
                role: currentUser.role
            });
            showToast('添加成功');
        }
        showAddDialog.value = false;
        // 重置表单
        currentUser.id = '';
        currentUser.username = '';
        currentUser.password = '';
        currentUser.role = 'user';
        isEdit.value = false;
        
        onSearch(); // 刷新列表
    } catch (e) {
        console.error(e);
    }
};

</script>

<style scoped>
.user-management-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}
.action-btn {
    height: 100%;
}
</style>
