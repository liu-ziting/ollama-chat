<script setup lang="ts">
import { useChat } from '@/lib/useChat'

const { model, clearChat } = useChat()
</script>

<template>
    <div class="chat-header">
        <p>
            当前模型：<a-tag>{{ model }}</a-tag>
        </p>
        <div class="chat-clear-btn">
            <a-button title="清空对话" @click="clearChat" type="text">清空对话 </a-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-header {
    width: 100%;
    height: 32px;
    border-bottom: 1px solid #e8e8e8;
    position: fixed;
    top: 0;
    z-index: 999;
    background-color: #fff;
    padding: 10px;
    p {
        line-height: 32px;
    }
    .chat-clear-btn {
        position: fixed;
        right: 0px;
        top: 10px;
    }
}
</style>
