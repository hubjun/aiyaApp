angular.module('starter.services')
  .factory('logisticService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var getOneConfig = ENV.logistic.get,
          getAllConfig = ENV.logistic.all;
      return {
        getAll: function(){
          return httpRequest({
            url: getAllConfig.url,
            method: getAllConfig.method
          });
        },
        get: function(sn) {
          return httpRequest({
            method: getOneConfig.method,
            url: getOneConfig.url,
            params: {'sn': sn}
          });
        }
      }
    }
  ]);
