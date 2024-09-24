<script setup>
import { ref } from 'vue';
import {
    Edit,
    Delete
} from '@element-plus/icons-vue';
import {
    articleCategoryListService,
    articleListService,
    articleAddService,
    articleDeleteService,
    articleUpdateService
} from '@/api/article.js';
import router from '@/router';

// 文章分类数据模型
const categorys = ref([]);

// 用户搜索时选中的分类id
const categoryId = ref('');

// 用户搜索时选中的发布状态
const state = ref('');

// 文章列表数据模型
const articles = ref([]);

// 分页条数据模型
const pageNum = ref(1); // 当前页
const total = ref(20); // 总条数
const pageSize = ref(5); // 每页条数

// 当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    articleList();
};

// 当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    articleList();
};

// 回显文章分类
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;
};

// 获取文章列表数据
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    };
    let result = await articleListService(params);

    // 渲染视图
    total.value = result.data.total;
    articles.value = result.data.items;

    // 处理数据，给数据模型扩展一个属性categoryName，分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
};

articleCategoryList();
articleList();

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Plus } from '@element-plus/icons-vue';

// 控制抽屉是否显示
const visibleDrawer = ref(false);
const lookDrawer = ref(false);
const drawerTitle = ref('');

// 添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
});

// 导入token
import { useTokenStore } from '@/stores/token.js';
const TokenStore = useTokenStore();

// 表单校验规则
const rules = ref({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' }
    ],
    coverImg:[
        { required: true, message: '请上传封面', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'blur' }
    ],
});

// 上传成功的回调函数
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    console.log(result.data);
};

const addArticleButtonClick = () => {
    visibleDrawer.value = true;
    drawerTitle.value = '添加文章';
    articleModel.value = {
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    };
};

// 添加文章
import { ElMessage } from 'element-plus';
const addArticle = async (clickState) => {
    try {
        await articleFormRef.value.validate();  // 表单校验
        articleModel.value.state = clickState;  // 把发布状态赋值给数据模型

        await articleAddService(articleModel.value);  // 调用接口

        ElMessage.success('添加成功');

        visibleDrawer.value = false;  // 让抽屉消失
        articleList();  // 刷新当前列表
    } catch (error) {
        console.error(error);
    }
    articleList();  // 刷新当前列表
};

// 显示编辑页面
const showEditDialog = (row, title) => {
    visibleDrawer.value = true;
    drawerTitle.value = title;
    articleModel.value = {
        ...row
    };
};

// 修改文章
const updateArticle = async (clickState) => {
    try {
        await articleFormRef.value.validate();  // 表单校验
        articleModel.value.state = clickState;
        await articleUpdateService(articleModel.value);
        ElMessage.success("修改成功");
        visibleDrawer.value = false;
        articleList();  // 刷新列表
    } catch (error) {
        console.error(error);
    }
};

// 删除文章
import { ElMessageBox } from 'element-plus';
const deleteArticle = (row) => {
    ElMessageBox.confirm(
        '你确认要删除该新闻信息吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async () => {
        await articleDeleteService(row.id);  // 调用接口
        ElMessage.success('删除成功');
        articleList();  // 刷新列表
    })
    .catch(() => {
        ElMessage.info('取消删除');
    });
};

// 引用表单
const articleFormRef = ref(null);
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="warning" @click="addArticleButtonClick">添加文章</el-button>
                </div>
            </div>
        </template>
        
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 200px">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 200px">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="warning" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="warning" @click="showEditDialog(row, '修改文章')"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
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

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form ref="articleFormRef" :model="articleModel" :rules="rules" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="categoryId">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面" prop="coverImg">
                    <el-upload
                        class="avatar-uploader"
                        :auto-upload="true"
                        :show-file-list="false"
                        action="/api/upload"
                        name="file"
                        :headers="{ 'Authorization': TokenStore.token }"
                        :on-success="uploadSuccess"
                    >
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="drawerTitle === '添加文章' ? addArticle('已发布') : updateArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="drawerTitle === '添加文章' ? addArticle('草稿') : updateArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
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

.avatar-uploader {
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
