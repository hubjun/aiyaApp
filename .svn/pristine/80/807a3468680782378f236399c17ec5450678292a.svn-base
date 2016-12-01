angular.module('starter.services')
  .factory('index', [
    '$resource',
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function($resource, ENV, httpRequest, $httpParamSerializer) {
      var getAdlistConfig = ENV.index.adlist;

      return {
        recommedproductlist: function() {
          return $resource(ENV.siteUrl + 'index/recommedproductlist');
        },
        floorproductlist: function() {
          return $resource(ENV.siteUrl + 'index/floorproductlist');
          //return $resource(ENV.index.floorproductlist);
        },

        purchaseCount: function() {
          return $resource(ENV.siteUrl + '/index/cart/cartquantity');
        },
        //首页猜你喜欢列表
        getrecommendproductc: function() {
          //return $resource(ENV.siteUrl + '/index/getrecommendproductc');
          return $resource(ENV.index.getrecommendproductc);
        },

        //轮播广告图
        getAdlist: function(params){
          return httpRequest({
            method: getAdlistConfig.method,
            url: getAdlistConfig.url,
            cancellable: true,
            params: params,
            success: function(ads){
              return ads;
            }
          })
        }
      }
    }
  ]);
