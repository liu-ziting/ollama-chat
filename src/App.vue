<script setup lang="ts">
import LeftNav from './components/LeftNav.vue'
</script>

<template>
    <div class="api-main">
        <a-row :wrap="false">
            <a-col class="left" flex="80px">
                <left-nav />
            </a-col>
            <a-col class="right" flex="auto">
                <router-view></router-view>
            </a-col>
        </a-row>
    </div>
</template>

<style lang="scss" scoped>
.api-main {
    background-color: #ffffff;
    height: 100vh;

    .left {
        border-right: 1px solid rgb(240, 240, 240);
    }

    .right {
        overflow: hidden;
    }

    // 媒体查询，屏幕宽度小于 768px 时隐藏左侧导航
    @media (max-width: 768px) {
        .left {
            display: none;
        }

        .right {
            width: 100%; // 让右侧区域填满剩余空间
        }
    }
}
</style>
