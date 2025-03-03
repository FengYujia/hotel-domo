<template>
    <div style="height: 100vh;background-color:#91caff;color:chocolate">
        <a-row type="flex" justify="center" align="middle" style="height: 100vh;">
            <a-col :span="8">
                <a-card title="Hotel Manager Login" :bordered="false" style="background-color:#e6f4ff">
                    <a-form :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
                        autocomplete="off">
                        <a-form-item label="Username" name="managerNo"
                            :rules="[{ required: true, message: 'Please input username!(root)' }]">
                            <a-input v-model:value="formState.managerNo" />
                        </a-form-item>
                        <a-form-item label="Password" name="password"
                            :rules="[{ required: true, message: 'Please input password!(123456)' }]">
                            <a-input-password v-model:value="formState.password" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
                            <a-button type="primary" html-type="submit" @click="login">Login</a-button>
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import service from '../service';

export default defineComponent({
    setup() {
        const router = useRouter();
        const formState = reactive({
            managerNo: '',
            password: ''
        });

        const login = async () => {
            try {
                const res = await service.ManagerService.login(formState);
                if (res.code === 200) {
                    message.success('Login successful');
                    localStorage.setItem('user', JSON.stringify(res.data));
                    router.push('/dashboard/reservationManager');
                } else {
                    message.error(res.msg);
                }
            } catch (error) {
                message.error('login error');
            }
        };

        return {
            formState,
            login
        };
    }
});
</script>

<style scoped>
/* You can add custom styles here */
</style>