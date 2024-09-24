import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
//文章分类列表查询
export const articleCategoryListService = ()=>{
    // const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据，都不需要.value
    //return request.get('/category',{headers:{'Authorization':tokenStore.token}})
    return request.get('/category')
}

//文章分类添加
export const ArticleCategoryAddService = (categoryData)=>{
   return request.post('/category',categoryData)
}

//文章分类修改
export const articleCategoryUpdateService = (categoryData)=>{
    return request.put('/category',categoryData)
}

//文章分类删除
export const articleCategoryDeleteService = (id)=>{
    return request.delete('/category?id='+id)
}

//文章列表查询
export const articleListService = (params)=>{
    return request.get('/article',{params:params})
}

//文章列表
export const articleShareList = (params)=>{
    return request.get('/article/shareList',{params:params})
}

//文章添加
export const articleAddService = (articleData) =>{
    request.post('/article',articleData);
}



//文章修改
export const articleUpdateService = (articleData) =>{
    request.put('/article',articleData);
}


//文章删除
export const articleDeleteService = (id) =>{
    console.log(id);
    return request.delete('/article?id='+id)
}

// 文章详情
export const getArticleDetail = (id) => {
    return request.get('/article/detail?id='+id);
};

// 收藏文章
export const addFavoriteService = (articleId) => {
    return request.post('/favorites/add', null, { params: { articleId } });
  };
  
  // 取消收藏文章
  export const removeFavoriteService = (articleId) => {
    return request.delete('/favorites/remove', { params: { articleId } });
  };
  
  // 获取收藏列表
export const getFavoritesService = (params) => {
    return request.get('/favorites/list', { params });
  };
  

  // 检查文章是否已收藏
export const checkFavoriteService = (articleId) => {
    return request.get('/favorites/isFavorite', { params: { articleId } });
  };
  

// 文章搜索
// export const searchArticles = (params) => {
//     return request.get('/article/search', { params: params });
// };

