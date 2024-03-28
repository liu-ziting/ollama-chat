<script lang="ts" setup>
import { CommentOutlined, ReadOutlined, CodepenOutlined, SettingOutlined } from '@ant-design/icons-vue'
</script>
<template>
    <div class="left-nav">
        <a-avatar :size="45" class="avatar"> AI </a-avatar>
        <ul class="left-menu">
            <li>
                <router-link to="/" active-class="active">
                    <CommentOutlined class="icon" />
                    <p>聊天</p>
                </router-link>
            </li>
            <li>
                <router-link to="/prompt" active-class="active">
                    <ReadOutlined class="icon" />
                    <p>发现</p>
                </router-link>
            </li>
            <li>
                <router-link to="/models" active-class="active">
                    <CodepenOutlined class="icon" />
                    <p>模型</p>
                </router-link>
            </li>
            <li>
                <router-link to="/config" active-class="active">
                    <SettingOutlined class="icon" />
                    <p>设置</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.left-nav {
    width: 100%;
    color: rgba(0, 0, 0, 0.65);
    .avatar {
        display: block;
        margin: 20px auto;
        background-color: #fff;
        color: rgba(0, 0, 0, 0.88);
        border: 1px solid rgb(217, 217, 217);
        border-radius: 15px;
        cursor: pointer;
        font-weight: bold;
    }
    .more {
        position: absolute;
        bottom: 20px;
        left: 50%;
        margin-left: -8px;
        font-size: 16px;
        cursor: pointer;
    }
}
.left-menu {
    width: 100%;
    margin: 30px auto;
    padding: 0 5px;
    box-sizing: border-box;
    font-size: 12px;
    li {
        margin: 14px 0;
        padding: 10px 5px;
        border-radius: 8px;
        margin-bottom: 10px;
        .icon {
            font-size: 20px;
            margin: 0 auto;
            display: block;
            margin-bottom: 10px;
        }
        p {
            width: 100%;
            text-align: center;
        }
    }
    li:hover {
        background-color: rgba(0, 0, 0, 0.04);
        cursor: pointer;
    }
    .active {
        color: #1677ff;
        font-weight: bold;
        p {
            color: #1677ff;
        }
    }
}
</style>
