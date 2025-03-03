<template>
    <div>
        <!-- 查询 -->
        <a-card style="width: 100%; margin: 0px auto">
            <a-form :model="formState" layout="vertical">
                <a-form-item label="Search by  Name, Email Or Phone " name="keyword" :rules="[
                    { required: false, message: 'Search by Name, Email Or Phone' },
                ]">
                    <div style="display: flex; gap: 8px">
                        <a-input v-model:value="formState.keyword" placeholder="Search by  Name, Email Or Phone" />
                    </div>
                </a-form-item>
            </a-form>
            <!-- 显示查询结果 -->
            <a-table :columns="columns" :data-source="dataSource" :pagination="true">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <span>{{ record.status === 0 ? 'reserved' : record.status === 1 ? 'completed' : 'canceled'
                        }}</span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-button type="link" @click="handleEdit(record)">modify</a-button>
                        <a-button type="link" danger @click="handleCancel(record)">cancel</a-button>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import service from '../service';

const formState = reactive({
    keyword: '',
});
const columns = reactive([
    {
        title: 'Name',
        dataIndex: 'guestName',
        key: 'guestName',
        width: '25%',
    },
    {
        title: 'phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '25%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '25%',
    },
    {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '25%',
    }
]);

const dataSource = ref([]);

// *******************handler*******************
// 查询
const check = async () => {
    try {
        console.log(formState);

        const res = await service.ManagerService.guestList(formState);
        console.log(res);

        dataSource.value = res.data;
    } catch (error) {
        message.error('Failed to fetch reservations');
    }
};
// *******************生命周期*******************
watch(async () => {
    await check();
});
</script>

<style scoped>
/* You can add custom styles here */
</style>