<script setup>
import { ref } from 'vue';
import { articleShareList } from '@/api/article';
import useUserInfoStore from '@/stores/userInfo.js';
import router from '@/router';


// 文章列表数据模型
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info});
const articles = ref([]);
const searchQuery = ref(''); // 搜索关键字
const pageNum = ref(1); // 当前页
const total = ref(20); // 总条数
const pageSize = ref(10); // 每页条数
const state = ref('已发布'); // 状态

// 获取文章列表数据
const articleList = async (query = '') => {
  console.log("Fetching articles with query:", query); // 调试信息
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    state: state.value ? state.value : null,
    // title: query // 传递搜索关键字
  };
  let result = await articleShareList(params);
  
  console.log("API response:", result.data.items); // 调试信息
  
  // 渲染视图
  total.value = result.data.total;
  articles.value = result.data.items;
  console.log(articles.value);
};

// 当每页条数发生了变化时调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  articleList(searchQuery.value);
};

// 当前页码发生变化时调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  articleList(searchQuery.value);
};

// 跳转到文章详情页
const goDetail = (id) => {
  router.push('/article/detail?id=' + id);
};

// 处理搜索
// const handleSearch = () => {
//   console.log("Search button clicked with query:", searchQuery.value); // 调试信息
//   articleList(searchQuery.value);
// };

// 初始化文章列表
articleList();
</script>



<template>
    <div class="page-container">
      <!-- <div class="header" style="display: flex; justify-content: center; margin-bottom: 24px;">
        <el-input
          v-model="searchQuery"
          placeholder="输入标题..."
          style="width: 300px;"
          clearable
        ></el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div> -->
  
      <!-- 文章列表 -->
      <el-table :data="articles" style="width: 100%" @row-click="(row) => goDetail(row.id)">
        <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
        <el-table-column label="作者" prop="nickname"></el-table-column>
        <el-table-column label="发表时间" prop="createTime"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        
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
  
  
  

  <style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}

::v-deep {
  .el-pagination {
    width: 100%;
    
    .el-pagination__jump {
      color: #E7A23D;
    }
    .btn-next {
      color: #E7A23D;
    }
    .el-pager {
      color: #E7A23D;
    }
    .btn-prev {
      color: #E7A23D;
    }
  }
}
</style>

  