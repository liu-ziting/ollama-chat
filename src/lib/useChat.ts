import { ref, watch, reactive, computed } from 'vue'
import { Ollama } from 'ollama/browser'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'

const title = ref('ollamaChat')

const chatValue = ref('')
const model = ref('')
const ollamaHost = ref(localStorage.getItem('ollamaHost') || 'http://localhost:11434')
const chatHistory = ref(localStorage.getItem('chatHistory') ? JSON.parse(localStorage.getItem('chatHistory')) : [])
const models = ref([])
let ollama = new Ollama({ host: ollamaHost.value })

// 添加保存配置到本地存储的方法
const saveConfig = () => {
    localStorage.setItem('title', title.value)
    localStorage.setItem('ollamaHost', ollamaHost.value)
}

const loadConfig = () => {
    const savedTitle = localStorage.getItem('title')
    const savedHost = localStorage.getItem('ollamaHost')

    if (savedTitle) title.value = savedTitle
    if (savedHost) ollamaHost.value = savedHost
}

// 更新 Ollama 实例的方法
const setOllamaHost = (newHost: string) => {
    ollamaHost.value = newHost
    ollama = new Ollama({ host: ollamaHost.value }) // 重新创建 ollama 实例
    saveConfig()
}
// 调用加载配置方法，以从本地存储加载设置
loadConfig()

// 获取模型列表
const getModels = async () => {
    try {
        const res = await ollama.list()
        models.value = res.models
    } catch (error) {
        models.value = []
    }
}

watch(
    models,
    () => {
        if (models.value.length > 0 && models.value[0].model) {
            model.value = models.value[0].model
        } else {
            model.value = '暂无模型'
        }
    },
    { immediate: true }
)
// 拉取模型
const pullModel = async (modelName, insecure = false, stream = false) => {
    const request = {
        model: modelName,
        insecure: insecure,
        stream: stream
    }
    try {
        const progressResponse = await ollama.pull(request)
        return { success: true, data: progressResponse }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

//删除模型
const deleteModel = async modelName => {
    const res = await ollama.delete({ model: modelName })
    if (res.success) {
        // 重新获取模型列表
        await getModels()
        return { success: true }
    } else {
        return { success: false, error: res.error }
    }
}

// 消息类型定义
interface ChatMessage {
    role: string
    message?: string
    displayedMessage: string
    created_at: string
}

// 会话类型定义
interface ChatSession {
    id: string
    messages: ChatMessage[]
}

// 聊天会话对象，每个会话ID对应一个聊天消息数组
const chatSessions = reactive<{ [key: string]: ChatSession }>({})

// 当前激活的会话ID
const currentSessionId = ref<string | null>(null)

// 计算当前会话的消息
const currentChatHistory = computed(() => {
    return currentSessionId.value ? chatSessions[currentSessionId.value].messages : []
})

// 创建新会话并切换到该会话
const createNewSession = () => {
    const sessionId = uuidv4()
    chatSessions[sessionId] = {
        id: sessionId,
        messages: [
            {
                role: 'ollama',
                displayedMessage: '让我们开始对话吧！',
                created_at: formatIsoTimeString(new Date().toISOString())
            }
        ]
    }
    currentSessionId.value = sessionId // 激活当前会话ID
    // 更新到聊天历史到最新一条
    scrollChatHistoryToBottom()
}

// 切换当前会话
const switchSession = (sessionId: string) => {
    currentSessionId.value = sessionId
}

// 将会话数据序列化并进行本地存储
const saveChatSessions = () => {
    const serializedData = JSON.stringify(Object.values(chatSessions))
    localStorage.setItem('chatSessions', serializedData)
}

// 将会话从本地存储加载
const loadChatSessions = () => {
    const serializedData = localStorage.getItem('chatSessions')
    const sessions: ChatSession[] = serializedData ? JSON.parse(serializedData) : []

    sessions.forEach(session => {
        chatSessions[session.id] = session
        if (!currentSessionId.value) {
            currentSessionId.value = session.id // 默认加载第一个会话
        }
    })
}

// 初始化加载会话
loadChatSessions()

// 监控聊天记录的变化并保存到本地存储
watch(
    () => chatSessions,
    newChatSessions => {
        saveChatSessions()
    },
    { deep: true }
)

// 将聊天历史滚动到最底部
const scrollChatHistoryToBottom = () => {
    setTimeout(() => {
        const chatHistoryElement = document.querySelector('.chat-main')
        if (chatHistoryElement) {
            chatHistoryElement.scrollTo({ top: chatHistoryElement.scrollHeight, behavior: 'smooth' })
        }
    }, 100)
}

// 从 Ollama 获取聊天回复
const getChatResponse = async () => {
    if (!chatValue.value.trim() || !currentSessionId.value) {
        return
    }

    // 确保请求被发送到当前活动的会话
    const activeSessionId = currentSessionId.value

    const newMessage: ChatMessage = {
        role: 'user',
        message: chatValue.value,
        displayedMessage: chatValue.value,
        created_at: formatIsoTimeString(new Date().toISOString())
    }

    // 将用户消息添加到当前活动的会话
    chatSessions[activeSessionId].messages.push(newMessage)
    scrollChatHistoryToBottom()

    // 清空输入框
    const chat = chatValue.value
    chatValue.value = ''

    // 添加临时的“思考中…”消息到当前活动的会话
    const tempResponseMessage: ChatMessage = {
        role: 'ollama',
        model: model.value,
        message: '',
        displayedMessage: '模型思考中…',
        created_at: formatIsoTimeString(new Date().toISOString())
    }
    chatSessions[activeSessionId].messages.push(tempResponseMessage)

    try {
        const response = await ollama.chat({
            model: model.value,
            messages: [{ role: 'user', content: chat }]
        })

        // 移除临时的“思考中…”消息
        const sessionMessages = chatSessions[activeSessionId].messages
        sessionMessages.splice(sessionMessages.length - 1, 1)

        // 添加新的 Ollama 回复消息到初始的活动会话
        const responseMessage: ChatMessage = {
            role: 'ollama',
            message: response.message.content,
            displayedMessage: response.message.content,
            model: response.model,
            created_at: formatIsoTimeString(response.created_at)
        }
        sessionMessages.push(responseMessage)

        // 调用模拟打字效果函数
        await simulateTyping(response.message.content, sessionMessages[sessionMessages.length - 1])
    } catch (error) {
        // 处理错误情况（例如，从Ollama API 获取响应失败）
        console.error('Failed to get chat response:', error)
        // 移除思考中…消息
        const sessionMessages = chatSessions[activeSessionId].messages
        sessionMessages.splice(sessionMessages.length - 1, 1)
        // 可以选择添加错误消息到会话
        sessionMessages.push({
            role: 'error',
            displayedMessage: '无法获取回复，请稍后重试。',
            created_at: formatIsoTimeString(new Date().toISOString())
        })
    } finally {
        // 无论请求成功还是失败，都应确保滚动到最新的消息
        scrollChatHistoryToBottom()
    }
}

// 模拟打字效果辅助函数
// message为完整消息，displayingMessage为当前会话Ollama消息对象的displayedMessage属性
const simulateTyping = async (message, displayingMessage) => {
    for (let i = 0; i <= message.length; i++) {
        displayingMessage.displayedMessage = message.substring(0, i)
        await new Promise(resolve => setTimeout(resolve, 100)) // 调整速度
        // 强制更新UI的方法（根据使用的框架不同可能会有所差异）
    }
    scrollChatHistoryToBottom() // 确保聊天历史滚动到底部
}

// 清空聊天历史
const clearChat = () => {
    if (currentSessionId.value) {
        chatSessions[currentSessionId.value].messages = [
            {
                role: 'ollama',
                displayedMessage: '让我们开始对话吧！',
                created_at: formatIsoTimeString(new Date().toISOString())
            }
        ]

        message.info('清空对话成功！')
    }
}

// 删除指定的会话
const deleteSession = (sessionId: string) => {
    // 检查会话是否存在
    if (chatSessions[sessionId]) {
        // 删除会话
        delete chatSessions[sessionId]
        // 如果删除的是当前激活的会话，则激活另一个会话（如果有的话）
        if (currentSessionId.value === sessionId) {
            const remainingSessionIds = Object.keys(chatSessions)
            currentSessionId.value = remainingSessionIds.length > 0 ? remainingSessionIds[0] : null
        }

        message.info('删除对话成功！')

        // 更新本地存储
        saveChatSessions()
    }
}

// 创建特定会话的副本
const duplicateSession = (sessionId: string) => {
    // 确保会话存在
    if (chatSessions[sessionId]) {
        // 使用 uuid 生成新会话 ID
        const newSessionId = uuidv4()
        // 创建新会话，复制旧会话的 messages 数组
        chatSessions[newSessionId] = {
            id: newSessionId,
            // 这里用 map 返回一个新数组确保不改变旧会话的 messages
            messages: chatSessions[sessionId].messages.map(message => ({ ...message }))
        }
        // 更新本地存储
        saveChatSessions()
    }
}

function formatIsoTimeString(isoTimeString) {
    const date = new Date(isoTimeString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function useChat() {
    return {
        title,
        getModels,
        pullModel,
        deleteModel,
        model,
        chatSessions,
        currentSessionId,
        currentChatHistory,
        createNewSession,
        switchSession,
        saveChatSessions,
        loadChatSessions,
        chatValue,
        models,
        ollamaHost,
        chatHistory,
        ollama,
        scrollChatHistoryToBottom,
        getChatResponse,
        clearChat,
        deleteSession,
        duplicateSession,
        formatIsoTimeString,
        saveConfig,
        loadConfig,
        setOllamaHost
    }
}
