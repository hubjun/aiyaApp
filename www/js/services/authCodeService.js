angular.module('starter.services')
  .factory('authCodeService', [
    'ENV',
    'httpRequest',
    '$q',
    function(ENV, httpRequest, $q) {
      var getConfig = ENV.authcode.get;
      /**
       * 请求服务器向用户手机发送验证码
       * @param {String|Number} mobileNum 手机号码
       * @param {String|Number} usertype 用户类型
       * @return {Promise}
       */
      return {
        get: function (mobileNum, usertype) {
          return httpRequest({
            url: getConfig.url,
            method: getConfig.method,
            params: {
              'mobile': mobileNum,
              'usertype': usertype
            }
          });
        }
      }
    }
  ]);
