<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useChat } from '@/lib/useChat'
import { MoreOutlined } from '@ant-design/icons-vue'

const {
    title,
    createNewSession,
    switchSession,
    chatSessions,
    currentSessionId,
    deleteSession,
    duplicateSession,
    saveChatSessions
} = useChat()

onBeforeUnmount(() => {
    saveChatSessions()
})
</script>

<template>
    <div class="chat-list-container">
        <h1>{{ title }}</h1>
        <a-button class="chat-add" @click="createNewSession">新建对话</a-button>
        <div class="chat-list">
            <div
                v-for="(session, sessionId) in chatSessions"
                :key="sessionId"
                @click="switchSession(sessionId)"
                :class="{ active: currentSessionId === sessionId }"
            >
                <h2>{{ session.messages.slice(-1)[0].displayedMessage }}</h2>
                <p>
                    {{ session.messages[0].created_at }}
                </p>
                <!-- <p>{{ `${sessionId}` }}</p> -->
                <a-tag v-if="currentSessionId === sessionId">{{
                    currentSessionId === sessionId ? '当前会话' : ''
                }}</a-tag>
                <a-dropdown>
                    <MoreOutlined class="more-icon" />
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="duplicateSession(sessionId)">
                                <a href="javascript:;">创建副本</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">导出数据</a>
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item @click="deleteSession(sessionId)">
                                <a href="javascript:;">删除</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-list-container {
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    h1 {
        text-align: left;
        font-weight: bold;
        margin-bottom: 20px;
        font-size: 20px;
    }
    .chat-add {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .chat-list {
        margin-top: 20px;
        > div {
            position: relative;
            border-radius: 5px;
            padding: 20px 10px;
            cursor: pointer;
            h2 {
                font-size: 14px;
                margin-bottom: 10px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                line-height: 20px;
                width: 80%;
            }
            p {
                margin: 5px 0;
                color: #666666;
                font-size: 12px;
                span {
                    float: right;
                    margin-top: 2px;
                }
            }
            margin-bottom: 10px;
        }
        .active {
            background-color: #fafafa;
        }
        > div:hover {
            background-color: #f0f0f0;
            .more-icon {
                display: block;
            }
        }
        .more-icon {
            position: absolute;
            top: 50%;
            font-weight: bold;
            margin-top: -10px;
            font-size: 20px;
            right: 10px;
            display: none;
        }
    }
}
</style>
