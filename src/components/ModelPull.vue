<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form } from 'ant-design-vue'

import { message } from 'ant-design-vue'
import { useChat } from '@/lib/useChat'
const { pullModel } = useChat()
const open = ref(false)

const spinning = ref(false)

const emit = defineEmits(['formReturn'])
// 初始化表单方法与状态
const useForm = Form.useForm
const modelRef = reactive({
    model: ''
})
const rulesRef = reactive({
    model: [{ required: true, message: '请输入名称' }]
})

// 表单验证与操作方法
const { validate, validateInfos, resetFields } = useForm(modelRef, rulesRef)

// 表单提交处理方法
const onSubmit = async () => {
    try {
        await validate()
        spinning.value = true
        await pullModel(modelRef.model).then(res => {
            if (res.success) {
                message.success('拉取模型成功！')
                spinning.value = false
                open.value = false
                resetFields()
                emit('formReturn')
            } else {
                spinning.value = false
                open.value = false
                resetFields()
                message.error('拉取模型失败！请确保模型存在')
            }
        })
    } catch (err) {
        console.log('表单验证失败', err)
    }
}

// 取消处理方法，关闭模态框
const handleCancel = () => {
    open.value = false
}

// 暴露open控制给组件父级
defineExpose({
    open
})
</script>

<template>
    <a-modal v-model:open="open" title="拉取模型">
        <template #footer>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button key="submit" type="primary" @click.prevent="onSubmit" :loading="spinning">拉取</a-button>
        </template>

        <a-spin tip="正在拉取模型，拉取模式时间较久，请稍后..." :spinning="spinning">
            <a-form layout="vertical">
                <a-form-item label="Model" v-bind="validateInfos.model">
                    <a-input v-model:value="modelRef.model" placeholder="请输入模型名称" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<style lang="scss" scoped></style>
