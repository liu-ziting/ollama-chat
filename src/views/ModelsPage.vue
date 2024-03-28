<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EllipsisOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { useChat } from '@/lib/useChat'
import { Modal } from 'ant-design-vue'
import MoadelPull from '@/components/ModelPull.vue'
import NoData from '@/components/NoData.vue'
const { models, formatIsoTimeString, getModels, deleteModel } = useChat()
const spinning = ref(false)
// 获取模型列表
onMounted(() => {
    spinning.value = true
    getModels()
        .then(() => {
            spinning.value = false
        })
        .catch(() => {
            spinning.value = false
        })
})
const ollamaUrl = 'https://ollama.com/library/'

// 定义返回增加组件的引用
const returnAddRef = ref()
// 定义打开添加返回配置模态框的方法
const openAdd = () => {
    if (returnAddRef.value) {
        returnAddRef.value.open = true
    }
}

const getFormReturn = getModels

// 删除模型
const deleteModels = (name: string) => {
    Modal.confirm({
        title: '温馨提示',
        content: '是否要删除本地模型：' + name + ' ?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            deleteModel(name).then(res => {
                if (res.success) {
                    message.success('删除模型成功！')
                    getModels()
                } else {
                    message.console.error('删除模型失败！')
                }
            })
        },
        onCancel() {
            console.log('Cancel')
        }
    })
}

// 刷新列表
const refreshModels = () => {
    spinning.value = true
    getModels()
        .then(() => {
            spinning.value = false
        })
        .catch(() => {
            spinning.value = false
        })
}
</script>

<template>
    <div class="models-home">
        <a-page-header class="models-header" title="Ollama" sub-title="在本地启动并运行大型语言模型">
            <template #extra>
                <a-button key="2" href="https://ollama.com/library" target="_blank">获取模型</a-button>
                <a-button @click="openAdd" key="1" type="primary">拉取模型</a-button>
                <a-button type="text" @click="refreshModels">
                    <RedoOutlined />
                </a-button>
            </template>
        </a-page-header>
        <a-spin tip="获取本地Ollama模型列表..." :spinning="spinning">
            <a-row v-if="models.length > 0" :gutter="16">
                <a-col v-for="item in models" :key="item.digest" :span="6">
                    <a-card :title="item.name" :bordered="false">
                        <template #extra>
                            <a-dropdown>
                                <EllipsisOutlined class="more-icon" />
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item @click="deleteModels(item.name)">
                                            <a href="javascript:;">删除</a>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                        <a :href="ollamaUrl + item.name" target="_blank">{{ item.model }}</a>
                        <time>{{ formatIsoTimeString(item.modified_at) }}</time>
                    </a-card>
                </a-col>
            </a-row>
            <NoData v-else title="暂无本地模型" />
        </a-spin>
        <MoadelPull ref="returnAddRef" @formReturn="getFormReturn" />
    </div>
</template>

<style lang="scss" scoped>
.models-home {
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
    .more-icon {
        font-size: 20px;
        cursor: pointer;
        margin-top: 4px;
    }
    time {
        font-size: 14px;
        color: #666666;
        display: block;
        float: left;
        width: 100%;
        margin-top: 10px;
    }
}
</style>
