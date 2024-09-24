<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleDetail, addFavoriteService, removeFavoriteService, checkFavoriteService } from '@/api/article';
import { ElMessage } from 'element-plus';
import {
    Star,
    StarFilled,
  
} from '@element-plus/icons-vue'
// 获取路由对象
const route = useRoute();
const article = ref(null);
const isFavorite = ref(false);

// 获取文章详情
const fetchArticleDetail = async () => {
  const id = route.query.id; // 使用 query 参数
  if (!id) {
    console.error("ID 参数未定义");
    return;
  }
  const response = await getArticleDetail(id);
  article.value = response.data;
  console.log(article.value);
  checkIfFavorite(id); // 检查是否已收藏
};

// 检查是否已收藏
const checkIfFavorite = async (articleId) => {
  try {
    const response = await checkFavoriteService(articleId);
    isFavorite.value = response.data;
  } catch (error) {
    console.error("检查收藏状态失败", error);
  }
};

// 添加收藏
const addFavorite = async () => {
  try {
    await addFavoriteService(article.value.id);
    isFavorite.value = true;
    ElMessage.success('收藏成功');
  } catch (error) {
    ElMessage.error('收藏失败');
  }
};

// 取消收藏
const removeFavorite = async () => {
  try {
    await removeFavoriteService(article.value.id);
    isFavorite.value = false;
    ElMessage.success('取消收藏成功');
  } catch (error) {
    ElMessage.error('取消收藏失败');
  }
};

onMounted(fetchArticleDetail);
</script>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix header-container">
      <span>文章详情</span>
      <div class="button-container">
        <el-button
          v-if="isFavorite"
          type="danger"
          
          @click="removeFavorite"
          class="center-button"
        >
        <el-icon><StarFilled /></el-icon>
          取消收藏
        </el-button>
        <el-button
          v-else
          type="warning"
         
          @click="addFavorite"
          class="center-button"
        >
        <el-icon><Star/></el-icon>
          收藏
        </el-button>
      </div>
    </div>
    <div v-if="article">
      <h1>{{ article.title }}</h1>
      <div class="meta">
        <span>作者：{{ article.nickname }}</span>
      </div>
      <div class="meta">
        <span>发布时间：{{ article.createTime }}</span>
      </div>
      <el-divider></el-divider>
      <div style="display: flex; justify-content: center;">
        <el-image
          style="width: 100%; height: 40%;"
          :src="article.coverImg"
          fit="contain"
        ></el-image>
      </div>
      <el-divider></el-divider>
      <p class="article-content" v-html="article.content" style="margin: 24px;"></p>
    </div>
    <div v-else>
      <el-empty description="文章内容加载中..."></el-empty>
    </div>
  </el-card>
</template>



<style scoped>
.box-card {
  width: 80%;
  margin: 20px auto;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button-container {
  display: flex;
  align-items: center;
}

.center-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24px;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.article-content {
  margin: 24px;
  white-space: pre-wrap; /* 保留换行符并自动换行 */
  word-wrap: break-word; /* 自动换行 */
  line-height: 1.6; /* 调整行间距 */
  font-size: 16px; /* 调整字体大小 */
  color: #333; /* 设置文字颜色 */
}
</style>
