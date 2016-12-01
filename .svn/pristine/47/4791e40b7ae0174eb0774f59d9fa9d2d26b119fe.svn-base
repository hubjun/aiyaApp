angular.module('starter.services')
  .factory('categoryService', [
    'ENV',
    'httpRequest',
    '$resource',
    function(ENV, httpRequest,$resource) {
      var firstCategoryConfig = ENV.category.firstCategory,
          secondCategoryConfig = ENV.category.secondCategory,
          productCategoryConfig = ENV.category.productCategory,
          allProductCategoryConfig =ENV.category.allProductCategory;
      return {
        getFirstCategory: function() {
          return httpRequest({
            method: firstCategoryConfig.method,
            url: firstCategoryConfig.url,
            success: function (data) {
              return data.list;
            }
          });
        },
        getSecondCategory: function (id) {
          return httpRequest({
            method: secondCategoryConfig.method,
            url: secondCategoryConfig.url,
            params: {'id': id}
          });
        },
        getAllHotCategory: function(params){
          return httpRequest({
            method: allProductCategoryConfig.method,
            url: allProductCategoryConfig.url,
            params: params,
            success: function (data) {
              return data.list;
            }
          })
        },
        //主要用在`productCategoryFilter`指令中
        getProductCategory: function (params) {
          return httpRequest({
            method: productCategoryConfig.method,
            url: productCategoryConfig .url,
            params: params
          });
        },

        //一级大类
        navCategory: function() {
          return $resource(ENV.siteUrl + 'productcategory/parentlist');
        },
        //二级图片类
        imgSecondCategory: function() {
          return $resource(ENV.siteUrl + 'productcategory/navi/productlist');
        },
        //二级分类名称
        secondCategoryName: function() {
          return $resource(ENV.siteUrl + 'productcategory/childrenlist');
        },
        //三级商品列表
        thirdCategoryList: function() {
          return $resource(ENV.siteUrl + 'productcategory/productlist');
        }

      }
    }
  ]);
