angular.module('starter.services')
  .factory('moreMR', ['$resource', 'ENV', function($resource, ENV) {
    return {
      recommendMoreList: function() {
        return $resource(ENV.siteUrl + 'index/recommedproductlist').get();
      }
    }
  }]);
