angular.module('starter.services')

  .factory('filterProList', [
    '$resource',
    'ENV',
    'httpRequest',
    '$q',
    function($resource, ENV, httpRequest) {
      var getCategoryFilterConfig = ENV.product.getCategoryFilterList;

      var defaultOpt = {};
      var self = {
        getFilterList: function(opt){
          var _opt = _.assignIn({}, defaultOpt, opt);

          return httpRequest({
            method: getCategoryFilterConfig.method,
            url: getCategoryFilterConfig.url,
            params: {
              'salesDesc': _opt.salesDesc,
              'dateDesc': _opt.dateDesc,
              'priceOrder': _opt.priceOrder,
              'pageNumber': _opt.pageNumber,
              'pageSize': _opt.pageSize,

              'keyword': _opt.keyword,
              'makeType': _opt.makeType,
              'categoryIds': _opt.categoryIds,
              'brandIds':_opt.brandIds
            },
            success: function(data){
              console.log(data);
              return data;
            }
          })
        },

        filterProList: function() {
          return $resource(ENV.siteUrl + 'product/search/list', {
            categoryIds: '@categoryIds',
            keyword: '@keyword',
            salesDesc: '@salesDesc',
            dateDesc: '@dateDesc',
            priceOrder: '@priceOrder',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize'
          });
        }
      };

      return self;
  }]);
