<template>
    <div class="guest-form">
        <!-- Search -->
        <a-card style="width: 100%; margin: 0px auto">
            <a-form :model="formState" layout="vertical">
                <a-form-item label="Search by Phone Or Email & status " name="keyword" :rules="[
                    { required: false, message: 'Search by Phone Or Email' },
                ]">
                    <div style="display: flex; gap: 8px">
                        <a-input v-model:value="formState.keyword" placeholder="Search by Phone Or Email" />
                        <a-select v-model:value="formState.status" placeholder="Select Reservation Status"
                            style="width: 100%">
                            <a-select-option :value="null">None</a-select-option>
                            <a-select-option :value="0">Reserved</a-select-option>
                            <a-select-option :value="1">completed</a-select-option>
                            <a-select-option :value="-1">Canceled</a-select-option>
                        </a-select>
                    </div>
                </a-form-item>
            </a-form>
            <!-- Display Search Results -->
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
    <!-- cancel modal -->
    <a-modal :open="isUpdateModalVisible" title="Modify Reservation" :footer="null" :mask-closable="true"
        :closable="true" @cancel="closeModal">
        <a-divider />
        <!--  -->
        <a-card style="width: 100%; margin: 20px auto;">
            <a-form-item label="Arrival Time" name="arrivalTime"
                :rules="[{ required: false, message: 'Please select arrival time' }]">
                <div style="display: flex; gap: 8px">
                    <a-date-picker v-model:value="updateFormState.arrivalTime" format="YYYY-MM-DD"
                        placeholder="Select arrival time" style="width: 100%" />
                </div>
            </a-form-item>
            <!--  -->
            <a-form-item label="Table Size" name="tableSize"
                :rules="[{ required: false, type: 'number', message: 'Please enter a valid number' }]">
                <div style="display: flex; gap: 8px">
                    <a-input-number v-model:value="updateFormState.tableSize"
                        placeholder="Please enter the number of seats" :min="1" style="width: 100%" />
                </div>
            </a-form-item>
            <!--  -->
            <a-form-item label="Reservation Status" name="status"
                :rules="[{ required: false, message: 'Please select reservation status' }]">
                <div style="display: flex; gap: 8px">
                    <a-select v-model:value="updateFormState.status" placeholder="Select Reservation Status"
                        style="width: 100%">
                        <a-select-option :value="0">Reserved</a-select-option>
                        <a-select-option :value="1">completed</a-select-option>
                        <a-select-option :value="-1">Canceled</a-select-option>
                    </a-select>
                </div>
            </a-form-item>
            <!--  -->
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
                <div style="display: flex; justify-content: space-between;">
                    <a-button type="primary" style="width: 100px" @click="updateSubmit">Submit</a-button>
                    <a-button type="primary" style="width: 100px" @click="closeModal">Cancel</a-button>
                </div>
            </a-form-item>
        </a-card>
    </a-modal>
    <!-- Delete Modal -->
    <a-modal v-model:visible="isDelModalVisible" title="Confirm Cancel" @ok="delSubmit()" @cancel="closeModal">
        <p>Are you sure you want to perform this operation?</p>
    </a-modal>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useRouter, useRoute } from 'vue-router';
import service from '../service';

// Parameter Definition
const route = useRoute(); // Use useRoute hook to get current route info

// Get query parameters

const formState = reactive({
    keyword: '',
});

const columns = ref([
    {
        title: 'Name',
        dataIndex: 'guestName',
        key: 'guestName',
        width: '11%',
    },
    {
        title: 'phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '11%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '11%',
    },
    {
        title: 'Arrival Time',
        dataIndex: 'arrivalTime',
        key: 'arrivalTime',
        width: '15%',
    },
    {
        title: 'Table Size',
        dataIndex: 'tableSize',
        key: 'tableSize',
        width: '11%',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '11%',
    },
    {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '15%',
    },
    {
        title: 'Action',
        key: 'action',
        width: '25%',
    },
]);

const dataSource = ref([]);
// Function Definition
// Update Form
const updateFormState = reactive({
    reservationId: null,
    arrivalTime: null,
    tableSize: null,
    status: null
});
const isUpdateModalVisible = ref(false);


// 删除表单
const delFormState = reactive({
    reservationId: null,
});
const isDelModalVisible = ref(false);

// ****************** handler ********************
// Search
const check = async () => {
    try {
        const res = await service.ManagerService.reservationList(formState);
        dataSource.value = res.data;
    } catch (error) {
        message.error('Failed to fetch reservations');
    }
};
// Modify
const handleEdit = (record) => {
    updateFormState.reservationId = record._id;
    updateFormState.arrivalTime = dayjs(record.arrivalTime);
    updateFormState.tableSize = record.tableSize;
    updateFormState.status = record.status;
    isUpdateModalVisible.value = true;
};

const updateSubmit = async () => {
    try {
        await service.ManagerService.updateReservation(updateFormState);
        message.success('Reservation updated successfully');
        check(); // Refresh the list
        isUpdateModalVisible.value = false;
    } catch (error) {
        message.error('Failed to updated reservation');
    }
};
// Cancel
const handleCancel = async (record) => {
    try {
        isDelModalVisible.value = true;
        delFormState.reservationId = record._id;
        delFormState.arrivalTime = dayjs(record.arrivalTime);
        delFormState.tableSize = record.tableSize;
        delFormState.status = -1;
    } catch (error) {
        message.error('Failed to cancel reservation');
    }
};

const delSubmit = async () => {
    try {
        await service.ManagerService.updateReservation(delFormState);
        message.success('Reservation cancel successfully');
        check(); // Refresh the list
        isDelModalVisible.value = false;
    } catch (error) {
        message.error('Failed to cancel reservation');
    }
};

// Close Modal
const closeModal = async () => {
    try {
        isUpdateModalVisible.value = false;
        isDelModalVisible.value = false;
    } catch (error) {
    }
};

// ******************* Lifecycle *******************
// Lifecycle
watch(async () => {
    await check();
});
</script>

<style scoped>
.guest-form {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    background-color: #f0f2f5;
}
</style>