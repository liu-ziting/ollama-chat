<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ControlOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'
import { useChat } from '@/lib/useChat'
const tableIndex = ref(0)
const { title, ollamaHost, setOllamaHost } = useChat()
import { message } from 'ant-design-vue'

// 初始化表单方法与状态
const useForm = Form.useForm
const modelRef = reactive({
    title: '',
    ollamaHost: '',
    modelType: 'ollama'
})
const rulesRef = reactive({
    title: [{ required: true, message: '请输入标题' }],
    ollamaHost: [{ required: true, message: '请输入服务地址' }],
    modelType: [{ required: true, message: '请选择模型类型' }]
})

// 表单验证与操作方法
const { validate, validateInfos } = useForm(modelRef, rulesRef)

// 表单提交处理方法，添加了保存到本地存储的逻辑
const onSubmit = async () => {
    try {
        await validate()
        title.value = modelRef.title
        setOllamaHost(modelRef.ollamaHost)
        message.success('保存成功！')
    } catch (err) {
        console.log('表单验证失败', err)
    }
}

// 初始化表单数据
modelRef.title = title.value
modelRef.ollamaHost = ollamaHost.value
</script>

<template>
    <div class="config-home">
        <a-page-header class="models-header" title="设置" sub-title="在本地启动并运行大型语言模型"> </a-page-header>
        <a-row :gutter="16">
            <a-col :span="6">
                <a-card>
                    <div class="config-card">
                        <p @click="tableIndex = 0" :class="{ active: tableIndex === 0 }">
                            <ControlOutlined class="icon" />基础配置
                        </p>
                        <p @click="tableIndex = 1" :class="{ active: tableIndex === 1 }">
                            <InfoCircleOutlined class="icon" />关于
                        </p>
                    </div>
                </a-card>
            </a-col>
            <a-col :span="18">
                <a-card>
                    <div v-if="tableIndex === 0" class="config-form">
                        <a-form layout="vertical">
                            <a-form-item label="标题" v-bind="validateInfos.title">
                                <a-input v-model:value="modelRef.title" placeholder="请输入标题配置" />
                            </a-form-item>
                            <a-form-item label="语言模型" v-bind="validateInfos.modelType">
                                <a-select v-model:value="modelRef.modelType">
                                    <option value="ollama">ollama</option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="服务地址" v-bind="validateInfos.ollamaHost">
                                <a-input v-model:value="modelRef.ollamaHost" placeholder="请输入服务地址" />
                            </a-form-item>
                        </a-form>
                        <a-button class="config-button" @click="onSubmit" type="primary">保存配置</a-button>
                    </div>
                    <div v-if="tableIndex === 1" class="config-info">
                        <img src="../assets/ollama.png" />
                        <h1>基于Ollama 构建的本地大模型对话助手！</h1>
                        <a target="_blank" href="https://github.com/ollama/ollama-js">By：Ollam.js</a>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<style lang="scss" scoped>
.config-home {
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fafafa;
    .models-header {
        border: 1px solid #e8e8e8;
        background-color: #fff;
        margin-bottom: 20px;
        border-radius: 8px;
    }
    .config-form {
        width: 40%;
        padding: 10px;
    }
    .config-button {
        width: 100%;
        margin-top: 20px;
        margin-bottom: 50px;
    }
    .config-card {
        p {
            cursor: pointer;
            color: #999999;
            background-color: #fafafa;
            position: relative;
            padding: 16px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .active {
            color: #080808;
            background-color: #f0f0f0;
        }
        .icon {
            font-size: 18px;
            margin-right: 10px;
            margin-top: 2px;
            display: block;
            float: left;
        }
    }
    .config-info {
        min-height: 50vh;
        text-align: center;
        h1 {
            font-size: 20px;
            margin: 20px;
        }
        img {
            width: 100px;
            display: block;
            margin: 30px auto;
        }
        a {
            color: #1677ff;
        }
    }
}
</style>
