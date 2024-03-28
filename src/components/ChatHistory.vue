<script setup lang="ts">
import { onUpdated, watch } from 'vue'
import { useChat } from '@/lib/useChat'
import { UserOutlined } from '@ant-design/icons-vue'
import ollamaIcon from '@/assets/ollama.png'
// 用于渲染Markdown
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

// 使用useChat提供的currentChatHistory计算属性，以显示当前会话中的内容
const { currentChatHistory, scrollChatHistoryToBottom } = useChat()

onUpdated(() => {
    scrollChatHistoryToBottom()
})

// 如果currentChatHistory发生变化，保持聊天滚动到最新消息
watch(
    currentChatHistory,
    () => {
        scrollChatHistoryToBottom()
    },
    { immediate: true }
)

// 将Markdown内容转换为HTML
const renderMarkdown = markdown => {
    return md.render(markdown)
}
</script>

<template>
    <div class="chat-history">
        <a-list item-layout="horizontal" :data-source="currentChatHistory">
            <template #loadMore>
                <!-- 加载更多对话按钮 -->
            </template>
            <template #renderItem="{ item: chatMessage }">
                <a-list-item :class="chatMessage.role">
                    <a-list-item-meta>
                        <template #title>
                            <strong>
                                {{ chatMessage.role === 'user' ? 'User' : chatMessage.model || 'Ollama' }}
                            </strong>
                        </template>
                        <template #description>
                            <div class="message" v-html="renderMarkdown(chatMessage.displayedMessage)"></div>
                            <time>{{ chatMessage.created_at }}</time>
                        </template>
                        <template #avatar>
                            <a-avatar
                                class="avatar"
                                :style="
                                    chatMessage.role === 'user'
                                        ? 'backgroundColor: #0C0A09'
                                        : 'backgroundColor: #ffffff'
                                "
                            >
                                <template #icon>
                                    <UserOutlined v-if="chatMessage.role === 'user'" />
                                    <img :src="ollamaIcon" v-else />
                                </template>
                            </a-avatar>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<style lang="scss" scoped>
.chat-history {
    padding-top: 55px;
    .message {
        background-color: #fff;
        padding: 8px 12px;
        border-radius: 5px;
        color: #000000;
        margin-top: 5px;
        display: inline-block;
    }
    time {
        font-size: 12px;
        color: #cccccc;
        display: block;
        margin-top: 5px;
    }
    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        background-color: #fff;
    }
}
</style>
