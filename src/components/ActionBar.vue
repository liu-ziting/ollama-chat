<script setup lang="ts">
import { CodepenOutlined, PictureOutlined, ReadOutlined } from '@ant-design/icons-vue'

import { onMounted } from 'vue'
import { useChat } from '@/lib/useChat'

const { models, model, getChatResponse, getModels } = useChat()
// 获取模型列表
onMounted(getModels)

const modelChange = e => {
    model.value = e
    getChatResponse()
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
        <a-button type="text" title="图片" disabled class="icon-btn"> <PictureOutlined class="icon" /></a-button>
        <a-button type="text" title="知识库" disabled class="icon-btn"> <ReadOutlined class="icon" /></a-button>
    </div>
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
