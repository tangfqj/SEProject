<template>
    <h1>个人信息</h1>
    <button @click="goHome">返回</button>
    <div>
        <h2>ID:{{ userInfo.id }}</h2><br>
        <h2>密码:******</h2><button @click="onChangingPassword = true;">修改密码</button>

        <div v-show="onChangingPassword">
            <h3>输入旧密码</h3>
            <input v-model="oldPassword">
            <h3>输入新密码</h3>
            <input v-model="newPassword">
            <h3>确认新密码</h3>
            <input v-model="newPasswordConfirm">
            <br>
            <button @click="handlePasswordChange">确认修改</button>
            <button @click="onChangingPassword = false;">取消</button>
        </div>

        <h2>姓名:<input v-model="userInfo.name" :disabled="!onChangingInfo"></h2>
        <h2>手机:<input v-model="userInfo.phone" :disabled="!onChangingInfo"></h2>
        <h2>邮箱:<input v-model="userInfo.email" :disabled="!onChangingInfo"></h2>
        <h2>住址:<input v-model="userInfo.address" :disabled="!onChangingInfo"></h2>
        <button @click="onChangingInfo = true;" v-show="!onChangingInfo">修改个人信息</button>

        <button @click="handleInfoChanging" v-show="onChangingInfo">保存</button>
        <button @click="onChangingInfo = false;" v-show="onChangingInfo">取消</button>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { validPassword } from '@/utils/verify';
import { useRouter } from 'vue-router';
import { getWithToken, patchWithToken } from '@/utils/request';
import { errorAlert, successAlert } from '@/utils/alert';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;
const userInfo = ref<UserInfo>({} as UserInfo);

// 进入页面时, 向后端请求用户信息
onMounted(() => {
    const token = user!.token;
    getWithToken('/api/user', token).then((res) => {
        console.log(res);
        if (res.status === 200) {
            userInfo.value = res.data.user;
        } else if (res.status === 401) {
            errorAlert('请先登录');
            router.push('/login');
        } else {
            errorAlert('未知错误');
        }
    });
});

// 修改密码
const onChangingPassword = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');
const handlePasswordChange = () => {
    // 检查密码格式
    if (!validPassword(oldPassword.value)) {
        errorAlert('旧密码格式错误');
        return;
    }
    if (!validPassword(newPassword.value)) {
        errorAlert('新密码格式错误');
        return;
    }

    // 检查新密码是否匹配
    if (newPassword.value !== newPasswordConfirm.value) {
        errorAlert('新密码不匹配');
        return;
    }

    // 发送请求
    const data = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
    };
    const token = user!.token;
    patchWithToken('/api/user/password', data, token).then((res) => {
        console.log(res);
        if (res.status === 200) {
            successAlert('修改成功');
            oldPassword.value = '';
            newPassword.value = '';
            newPasswordConfirm.value = '';
            onChangingPassword.value = false;
        } else if (res.status === 401) {
            errorAlert('请先登录');
            router.push('/login');
        } else {
            errorAlert('未知错误');
        }
    });
};

// 修改个人信息
const onChangingInfo = ref(false);
const handleInfoChanging = () => {
    const data = {
        user: userInfo.value,
    };
    const token = user!.token;
    patchWithToken('/api/user', data, token).then((res) => {
        console.log(res);
        if (res.status === 200) {
            successAlert('修改成功');
            onChangingInfo.value = false;
        } else if (res.status === 401) {
            errorAlert('请先登录');
            router.push('/login');
        } else {
            errorAlert('未知错误');
        }
    });
};



const goHome = () => {
    router.push('/');
};
</script>

<style scoped>
/* TODO */
</style>