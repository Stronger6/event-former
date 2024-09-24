<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFavoritesService, removeFavoriteService,getArticleDetail  } from '@/api/article';
import { ElMessage } from 'element-plus';

// 收藏列表数据模型
const favorites = ref([]);
const pageNum = ref(1); // 当前页
const total = ref(20); // 总条数
const pageSize = ref(3); // 每页条数

// 获取收藏列表数据
const fetchFavorites = async () => {
  const params = {
    page: pageNum.value,
    pageSize: pageSize.value,
  };
  const result = await getFavoritesService(params);
  total.value = result.data.total;
  favorites.value = result.data.items;
  
  console.log(favorites.value,"-----------");

  // 获取每篇文章的详细信息
  for (const favorite of favorites.value) {
    const articleDetail = await getArticleDetail(favorite.articleId);
    favorite.title = articleDetail.data.title;
    favorite.createUser = articleDetail.data.createUser;
  }
};

// 当每页条数发生了变化时调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  fetchFavorites();
};

// 当前页码发生变化时调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  fetchFavorites();
};

// 跳转到文章详情页
const router = useRouter();
const goDetail = (id) => {
  router.push('/article/detail?id=' + id);
};

// 取消收藏
const removeFavorite = async (articleId) => {
  try {
    await removeFavoriteService(articleId);
    ElMessage.success('取消收藏成功');
    fetchFavorites(); // 刷新收藏列表
  } catch (error) {
    ElMessage.error('取消收藏失败');
  }
};

// 初始化收藏列表
onMounted(fetchFavorites);
</script>

<template>
  <div class="page-container">
    <el-table :data="favorites" style="width: 100%" @row-click="(row) => goDetail(row.articleId)">
      <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
      <el-table-column label="作者" prop="nickname"></el-table-column>
      <el-table-column label="收藏时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click.stop="removeFavorite(scope.row.articleId)">取消收藏</el-button>
        </template>
      </el-table-column>
      
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}
</style>
