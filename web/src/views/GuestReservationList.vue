<template>
  <div class="guest-form">
    <!-- 查询 -->
    <a-card title="Guest Reservation" style="width: 500px; margin: 20px auto">
      <a-form :model="formState" layout="vertical">
        <a-form-item label="Input Your Phone Or Email" name="keyword" :rules="[
          { required: true, message: 'Please enter your phone number or email' },
        ]">
          <div style="display: flex; gap: 8px">
            <a-input v-model:value="formState.keyword" placeholder="Please enter your phone number or email" />
            <!-- <a-button type="primary" style="width: 150px" @click="check">check</a-button> -->
          </div>
        </a-form-item>
      </a-form>
      <!-- 显示查询结果 -->
      <a-table :columns="columns" :data-source="dataSource" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="handleEdit(record)">modify</a-button>
            <a-button type="link" danger @click="handleCancel(record)">cancel</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <!-- cancel modal -->
  <a-modal :open="isUpdateModalVisible" title="Modify Reservation" :footer="null" :mask-closable="true" :closable="true"
    @cancel="closeModal">
    <a-divider />
    <!--  -->
    <a-card style="width: 100%; margin: 20px auto;">
      <a-form-item label="Arrival Time" name="arrivalTime"
        :rules="[{ required: true, message: 'Please select arrival time' }]">
        <div style="display: flex; gap: 8px">
          <a-date-picker v-model:value="updateFormState.arrivalTime" format="YYYY-MM-DD"
            placeholder="Select arrival time" style="width: 100%" />
        </div>
      </a-form-item>
      <!--  -->
      <a-form-item label="Table Size" name="tableSize"
        :rules="[{ required: true, type: 'number', message: 'Please enter a valid number' }]">
        <div style="display: flex; gap: 8px">
          <a-input-number v-model:value="updateFormState.tableSize" placeholder="Please enter the number of seats"
            :min="1" style="width: 100%" />
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
  <!-- 删除弹窗 -->
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

// 参数定义
const router = useRouter();
const route = useRoute(); // 使用 useRoute 钩子获取当前路由信息

// 获取 query 参数
const query = route.query;

const formState = reactive({
  keyword: query.email || query.phone || '',
});

const columns = ref([
  {
    title: 'Name',
    dataIndex: 'guestName',
    key: 'guestName',
    width: '15%',
  },
  {
    title: 'Arrival Time',
    dataIndex: 'arrivalTime',
    key: 'arrivalTime',
    width: '35%',
  },
  {
    title: 'Table Size',
    dataIndex: 'tableSize',
    key: 'tableSize',
    width: '10%',
  },
  {
    title: 'Action',
    key: 'action',
    width: '25%',
  },
]);

const dataSource = ref([]);
// 函数定义
// 修改表单
const updateFormState = reactive({
  reservationId: null,
  arrivalTime: null,
  tableSize: null
});
const isUpdateModalVisible = ref(false);


// 删除表单
const delFormState = reactive({
  reservationId: null,
});
const isDelModalVisible = ref(false);

// **************************************
// 查询
const check = async () => {
  try {
    const res = await service.ReservationService.list(formState);
    dataSource.value = res.data;
  } catch (error) {
    message.error('Failed to fetch reservations');
  }
};
// 修改
const handleEdit = (record) => {
  updateFormState.reservationId = record._id;
  updateFormState.arrivalTime = dayjs(record.arrivalTime);
  updateFormState.tableSize = record.tableSize;
  isUpdateModalVisible.value = true;
};

const updateSubmit = async () => {
  try {
    await service.ReservationService.update(updateFormState);
    message.success('Reservation updated successfully');
    check(); // Refresh the list
    isUpdateModalVisible.value = false;
  } catch (error) {
    message.error('Failed to updated reservation');
  }
};
// 取消
const handleCancel = async (record) => {
  try {
    isDelModalVisible.value = true;
    delFormState.reservationId = record._id;
  } catch (error) {
    message.error('Failed to cancel reservation');
  }
};

const delSubmit = async () => {
  try {
    await service.ReservationService.cancel(delFormState);
    message.success('Reservation cancel successfully');
    check(); // Refresh the list
    isDelModalVisible.value = false;
  } catch (error) {
    message.error('Failed to cancel reservation');
  }
};

// 关闭窗口
const closeModal = async () => {
  try {
    isUpdateModalVisible.value = false;
    isDelModalVisible.value = false;
  } catch (error) {
  }
};

// 生命周期
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
