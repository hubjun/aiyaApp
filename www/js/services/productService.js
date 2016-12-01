angular.module('starter.services')
  .factory('productService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function(ENV, httpRequest,$httpParamSerializer) {
      var getListConfig = ENV.product.getList,  //获取
          getInfoConfig = ENV.product.getInfo, //获取商品详情
          getRecommendProductcConfig = ENV.product.getRecommendProductc;//猜您喜欢
          getPurchaseCountConfig = ENV.product.getPurchaseCount;
      return {
        getList: function(params) {
          return httpRequest({
            method:getListConfig.method,
            url: getListConfig.url,
            params:params
          });
        },

        getRecommendProductc: function(params){
          return httpRequest({
            method:getRecommendProductcConfig.method,
            url:getRecommendProductcConfig.url,
            params:params
          });
        },
        getListByRecommend: function () {

        },

        getListByFloor: function () {

        },

        getListByGuess: function () {

        },

        getListByCategory: function () {

        },

        getListByHot: function () {

        },

        getSpec: function() {

        },
        getInfo: function(id){
          return httpRequest({
            method:getInfoConfig.method,
            url: getInfoConfig.url,
            params:{id:id}
          });
        },
        //...
        purchaseCount: function() {
          return httpRequest({
            method:getPurchaseCountConfig.method,
            url:getPurchaseCountConfig.url
          })
        }
      }
    }
  ]);
