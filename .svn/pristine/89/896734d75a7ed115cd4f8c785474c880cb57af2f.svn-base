angular.module('starter.services')
  .factory('homeSearch', [
    '$resource',
    'ENV',
    '$httpParamSerializer',
    'httpRequest',
    function($resource, ENV, $httpParamSerializer, httpRequest) {
      var getfullsearchkeyConfig = ENV.membersearchkey.fullsearchkeylist,
          getHostorylistConfig = ENV.membersearchkey.hostorylist;

      return {
        homeHotKeyworld: function() {
          return $resource(ENV.siteUrl + '/membersearchkey/fullsearchkeylist');
        },

        keyList: function() {
          return $resource(ENV.siteUrl + '/product/search', {
            keyword: '@keyword',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize'
          });
        },

        //热门搜索列表
        fullsearchkeylist: function(params){
          return httpRequest({
            method: getfullsearchkeyConfig.method,
            url: getfullsearchkeyConfig.url,
            cancellable: true,
            // data: $httpParamSerializer(params)
            params: params,
            success: function(data){
              return data;
            }
          });
        },

        //会员搜索记录列表
        // hostorylist: function(params){
        //   return httpRequest({
        //     method: getHostorylistConfig.method,
        //     url: getHostorylistConfig.url,
        //     cancellable: true,
        //     // data: $httpParamSerializer(params)
        //     params: params,
        //     success: function(data){
        //       return data;
        //     }
        //   });
        // }

      }
    }
  ]);
