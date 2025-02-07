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
                            <div class="message">
                                <!-- 判断是否有思考过程 -->
                                <template v-if="parseMessageContent(chatMessage.displayedMessage).thinkContent">
                                    <Collapse v-if="parseMessageContent(chatMessage.displayedMessage).thinkContent.trim()" class="thinking-collapse" :bordered="false">
                                        <Panel key="1" header="深度思考">
                                            <div class="thinking-process" v-html="renderMarkdown(parseMessageContent(chatMessage.displayedMessage).thinkContent)"></div>
                                        </Panel>
                                    </Collapse>
                                </template>

                                <!-- 渲染 Markdown 和 代码 -->
                                <template v-for="(part, index) in splitContent(parseMessageContent(chatMessage.displayedMessage).mainContent)" :key="index">
                                    <!-- 渲染 Markdown 内容 -->
                                    <template v-if="part.type === 'markdown'">
                                        <div v-html="renderMarkdown(part.content)"></div>
                                    </template>

                                    <!-- 渲染 代码块 -->
                                    <template v-if="part.type === 'code'">
                                        <CodeBlock :code="part.content" :language="detectLanguage(part.content)" />
                                    </template>
                                </template>
                            </div>
                            <time>{{ chatMessage.created_at }}</time>
                        </template>
                        <template #avatar>
                            <a-avatar class="avatar" :style="chatMessage.role === 'user' ? 'backgroundColor: #0C0A09' : 'backgroundColor: #ffffff'">
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

<script setup lang="ts">
import { onUpdated, watch } from 'vue'
import { useChat } from '@/lib/useChat'
import { UserOutlined } from '@ant-design/icons-vue'
import ollamaIcon from '@/assets/ollama.png'
import { Collapse } from 'ant-design-vue'
import CodeBlock from '@/components/CodeBlock.vue'
const { Panel } = Collapse

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

// 解析消息内容，提取思考过程
const parseMessageContent = (content: string) => {
    const thinkStart = content.indexOf('<think>')
    const thinkEnd = content.indexOf('</think>')

    if (thinkStart !== -1 && thinkEnd !== -1) {
        const thinkContent = content.slice(thinkStart + 7, thinkEnd)
        const mainContent = content.slice(thinkEnd + 8)
        return { thinkContent, mainContent }
    }
    return { thinkContent: null, mainContent: content }
}

// 检测代码语言
const detectLanguage = (content: string) => {
    if (content.startsWith('```')) {
        const language = content.split('\n')[0].replace(/```/, '').trim()
        return language || 'javascript'
    }
    return 'javascript'
}

// 分割混合内容为 Markdown 和 Code
const splitContent = (content: string) => {
    const parts = []
    const codeBlockRegex = /```([\s\S]*?)```|~~~([\s\S]*?)~~~/g // 匹配代码块
    let lastIndex = 0

    // 查找所有代码块
    content.replace(codeBlockRegex, (match, p1, p2, offset) => {
        // 添加代码块之前的 Markdown 内容
        if (offset > lastIndex) {
            parts.push({
                type: 'markdown',
                content: content.slice(lastIndex, offset)
            })
        }

        // 添加代码块
        const codeContent = p1 || p2
        parts.push({
            type: 'code',
            content: codeContent
        })

        lastIndex = offset + match.length
        return match
    })

    // 添加剩余的 Markdown 内容
    if (lastIndex < content.length) {
        parts.push({
            type: 'markdown',
            content: content.slice(lastIndex)
        })
    }

    return parts
}
</script>

<style scoped lang="scss">
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
    .thinking-collapse {
        margin-bottom: 10px;
        .thinking-process {
            font-size: 12px;
            color: #666;
        }
    }
}
::v-deep .ant-collapse-content-box {
    padding: 10px !important;
}
</style>
