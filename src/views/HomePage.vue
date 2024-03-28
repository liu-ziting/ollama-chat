<script setup lang="ts">
import { ref, watch } from 'vue'
import ChatHistory from '@/components/ChatHistory.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatList from '@/components/ChatList.vue'
import NoData from '@/components/NoData.vue'
import ActionBar from '@/components/ActionBar.vue'
import TopBar from '@/components/TopBar.vue'
import { useChat } from '@/lib/useChat'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
const { currentChatHistory, scrollChatHistoryToBottom } = useChat()
var chatData = ref([])
watch(
    currentChatHistory,
    () => {
        chatData.value = currentChatHistory.value
    },
    { immediate: true }
)
scrollChatHistoryToBottom()
</script>

<template>
    <div class="api-home">
        <splitpanes class="default-theme">
            <pane min-size="0" max-size="50" size="20">
                <ChatList />
            </pane>
            <pane>
                <splitpanes horizontal v-if="chatData.length > 0">
                    <pane>
                        <div class="chat-main">
                            <TopBar />
                            <ChatHistory />
                        </div>
                    </pane>

                    <pane min-size="14" max-size="50" size="25">
                        <ActionBar />
                        <ChatInput />
                    </pane>
                </splitpanes>

                <NoData v-else />
            </pane>
        </splitpanes>
    </div>
</template>

<style lang="scss" scoped>
.api-home {
    height: 100vh;
    background-color: #ffffff;
    overflow: hidden;
    .tree-view {
        padding: 20px 10px;
        box-sizing: border-box;
        height: 100vh;
    }
}
.splitpanes.default-theme .splitpanes__pane {
    background-color: #ffffff;
}
.chat-main {
    height: 100%;
    overflow-y: auto;
    background-color: #fafafa;
}
</style>
