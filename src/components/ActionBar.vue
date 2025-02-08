<script setup lang="ts">
import { CodepenOutlined, PictureOutlined, ReadOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import { useChat } from '@/lib/useChat'
import { message } from 'ant-design-vue'

const { models, model, getChatResponse, getModels, setPrompt } = useChat()

// 获取模型列表
onMounted(getModels)

const modelChange = e => {
    model.value = e
    getChatResponse()
    // 提示用户切换模型
    message.success('已成功切换到模型：' + e)
}

// 控制弹出层的显示
const isPromptModalVisible = ref(false)
// 提示词输入框的值

const promptValue = ref('')

onMounted(() => {
    promptValue.value = localStorage.getItem('prompt') || ''
})

// 打开弹出层
const openPromptModal = () => {
    isPromptModalVisible.value = true
}

// 保存提示词
const savePrompt = () => {
    setPrompt(promptValue.value)
    message.success('提示词保存成功！')
    isPromptModalVisible.value = false
}
</script>

<template>
    <div class="action-bar">
        <a-dropdown placement="top">
            <a-button type="text" title="模型" class="icon-btn"> <CodepenOutlined class="icon" /></a-button>
            <template #overlay>
                <a-menu v-if="models.length > 0">
                    <a-menu-item v-for="item in models" :key="item.name" @click="modelChange(item.model)">
                        <a href="javascript:;"> {{ item.model }}</a>
                    </a-menu-item>
                </a-menu>
                <a-menu v-else>
                    <a-menu-item>
                        <a href="javascript:;"> 暂无本地模型 </a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-button type="text" title="知识库" class="icon-btn" @click="openPromptModal">
            <ReadOutlined class="icon" />
        </a-button>
    </div>

    <!-- 提示词配置弹出层 -->
    <a-modal v-model:visible="isPromptModalVisible" title="配置提示词" @ok="savePrompt">
        <a-textarea v-model:value="promptValue" placeholder="请输入提示词" :auto-size="{ minRows: 5, maxRows: 30 }" />
    </a-modal>
</template>

<style lang="scss" scoped>
.action-bar {
    padding: 10px 10px 5px 10px;
    .icon-btn {
        padding: 5px;
        margin-right: 5px;
    }
    .icon {
        font-size: 20px;
    }
}
</style>
