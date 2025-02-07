<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import Clipboard from 'clipboard'
import { message } from 'ant-design-vue'
const props = defineProps({
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    showCopyButton: {
        type: Boolean,
        default: true
    }
})

const codeRef = ref<HTMLElement | null>(null)

// 动态绑定语言类
const languageClass = computed(() => `language-${props.language}`)

const formattedCode = computed(() => props.code)

// 高亮代码
const highlightCode = () => {
    if (codeRef.value) {
        // hljs.highlightElement 用于高亮
        hljs.highlightElement(codeRef.value)
    }
}

// 复制代码
const copyCode = () => {
    const clipboard = new Clipboard('.copy-icon', {
        text: () => props.code
    })

    clipboard.on('success', () => {
        // 轻提示
        message.success('代码已复制！')
        clipboard.destroy()
    })

    clipboard.on('error', () => {
        message.error('复制失败，请手动复制。')
        clipboard.destroy()
    })
}

onMounted(() => {
    highlightCode() // 在组件挂载时进行一次代码高亮
})

// 监听代码变化并重新高亮
watch(
    () => props.code,
    () => {
        highlightCode() // 每次代码更新时重新高亮
    }
)
</script>
<template>
    <div class="code-block">
        <!-- 代码块 -->
        <pre><code ref="code" :class="languageClass">{{ formattedCode }}</code></pre>
        <!-- 复制按钮 -->
        <svg v-if="showCopyButton" @click="copyCode" xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    </div>
</template>

<style scoped>
.code-block {
    position: relative;
    background: #282c34;
    border-radius: 6px;
    padding: 10px;
    margin: 6px 0;
}

pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

code {
    display: block;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
}

pre code.hljs {
    padding: 0 !important;
}

.copy-button {
    cursor: pointer;
    position: absolute;
    line-height: 100%;
    top: -8px;
    right: -8px;
    padding: 4px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s ease;
}

.copy-button:hover {
    background-color: #f3f4f6;
}

.copy-icon {
    position: absolute;
    top: 3px;
    right: 3px;
    height: 20px;
    width: 20px;
    color: #6b7280;
    cursor: pointer;
}
</style>
