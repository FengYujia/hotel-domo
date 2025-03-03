<template>
    <div class="guest-form">
        <a-card title="Guest Reservation" style="width: 500px; margin: 20px auto;">
            <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="Name" name="guestName"
                    :rules="[{ required: true, message: 'Please enter your name' }]">
                    <a-input v-model:value="formState.guestName" placeholder="Please enter your name" />
                </a-form-item>

                <a-form-item label="Phone" name="phone"
                    :rules="[{ required: true, message: 'Please enter your phone number' }]">
                    <a-input v-model:value="formState.phone" placeholder="Please enter your phone number" />
                </a-form-item>

                <a-form-item label="Email" name="email"
                    :rules="[{ required: true, type: 'email', message: 'Please enter a valid email address' }]">
                    <a-input v-model:value="formState.email" placeholder="Please enter your email address" />
                </a-form-item>

                <a-form-item label="Arrival Time" name="arrivalTime"
                    :rules="[{ required: true, message: 'Please select arrival time' }]">
                    <a-date-picker v-model:value="formState.arrivalTime" format="YYYY-MM-DD"
                        placeholder="Select arrival time" style="width: 100%" />
                </a-form-item>

                <a-form-item label="Table Size" name="tableSize"
                    :rules="[{ required: true, type: 'number', message: 'Please enter a valid number' }]">
                    <a-input-number v-model:value="formState.tableSize" placeholder="Please enter the number of seats"
                        :min="1" style="width: 100%" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 1, span: 20 }">
                    <!-- <a-form-item :wrapper-col="{ offset: 6, span: 18 }"> -->
                    <div style="display: flex; justify-content: space-between;">
                        <a-button type="primary" style="width: 130px" @click="handleSubmit">Submit</a-button>
                        <a-button type="primary" style="width: 130px" @click="checkReservation">My
                            Reservations</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import service from '../service';

const router = useRouter();

const formState = reactive({
    guestName: '',
    phone: '',
    email: '',
    arrivalTime: null,
    tableSize: ''
});

const handleSubmit = async () => {
    try {
        // 转换日期格式为字符串
        const submitData = {
            ...formState,
            arrivalTime: formState.arrivalTime ? formState.arrivalTime.format('YYYY-MM-DD HH:mm:ss') : null
        };

        const res = await service.ReservationService.create(submitData);
        if (res.code === 200) {
            message.success('Reservation information submitted successfully!');
            router.push({ path: '/guestReservationList', query: { email: formState.email, phone: formState.phone } });
        } else {
            message.error(res.msg);
        }
    } catch (error) {
        message.error('Submission failed, please try again');
    }
};


const checkReservation = async () => {
    router.push('/guestReservationList');
};

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