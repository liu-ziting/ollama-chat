<script setup lang="ts">
import { useChat } from '@/lib/useChat'

const { chatValue, getChatResponse } = useChat()

const sendMessage = async () => {
    await getChatResponse()
}
// 监听回车按钮执行
document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault()
        getChatResponse()
    }
})
</script>

<template>
    <a-textarea class="chat-input" v-model:value="chatValue" placeholder="请输入问题开始对话吧" auto-size />
    <a-button class="chat-submit" type="primary" @click="sendMessage">发送</a-button>
</template>

<style lang="scss" scoped>
.chat-input {
    background-color: #fff;
    border: none;
    height: 100% !important;
    border-radius: 0;
}
.chat-input:focus {
    box-shadow: none;
    border-bottom: none;
}
.chat-submit {
    position: absolute;
    right: 20px;
    bottom: 10px;
}
</style>
