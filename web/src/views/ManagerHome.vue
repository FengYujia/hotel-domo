<template>
    <a-layout style="min-height: 100vh;">
        <!-- 左侧菜单栏 -->
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo" />
            <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline" @select="onMenuSelect">
                <a-menu-item key="1">
                    <book-outlined />
                    <span>reservation</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <user-outlined />
                    <span>guest</span>
                </a-menu-item>

            </a-menu>
        </a-layout-sider>
        <!-- 右侧内容区域 -->
        <a-layout>
            <a-layout-header class="header">
                <h1 style="color:#fff; font-weight: bold;">Hotel Reservation System</h1>
            </a-layout-header>
            <!-- 内容区域 -->
            <a-layout-content style="margin: 0 16px">
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import {
    UserOutlined,
    BookOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    components: {
        UserOutlined,
        BookOutlined,
    },
    setup() {
        const selectedKeys = ref(['1']);
        const collapsed = ref(false);
        const router = useRouter();

        const onMenuSelect = ({ key }) => {
            if (key === '2') {
                router.push('/dashboard/GuestManager');
            } else if (key === '1') {
                router.push('/dashboard/reservationManager');
            }
        };

        return {
            selectedKeys,
            collapsed,
            onMenuSelect, // 添加 onMenuSelect 到返回对象中
        };
    },
});
</script>

<style>
.logo {
    height: 32px;
    margin: 16px;
}
</style>