angular.module('starter.services')
  .factory('userService', [
    'ENV',
    'httpRequest',
    '$q',
    '$httpParamSerializer',
    '$cookies',
    'StringUtil',
    function(ENV, httpRequest, $q, $httpParamSerializer, $cookies,StringUtil) {
      var user, token_id = ENV.token_id, currentUser = ENV.currentUser;
      var getInfoConfig = ENV.user.getInfo,
          updateConfig = ENV.user.update,
          loginConfig = ENV.user.login,
          logoutConfig = ENV.user.logout,
          resetPwdConfig = ENV.user.resetPwd,
          modifyPwdConfig = ENV.user.modifyPwd,
          registerConfig = ENV.user.register;

      var self = {
        getToken: function () {
          return $cookies.get(token_id);
        },

        isLogin: function () {
          return !!$cookies.get(token_id);
        },

        login: function (params) {
          return httpRequest({
            method: loginConfig.method,
            url: loginConfig.url,
            data: $httpParamSerializer(params),
            cancellable: true,
            success: function (data) {
              $cookies.put(token_id, data.token ,{
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              $cookies.put(currentUser, JSON.stringify(data.member) ,{
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return user = data.member;
            }
          });
        },

        logout: function () {
          return httpRequest({
            method: logoutConfig.method,
            url: logoutConfig.url,
            params: {token_id: self.getToken()},
            success: function () {
              $cookies.remove(token_id);
              $cookies.remove(currentUser);
            }
          });
        },

        register: function (params) {
          return httpRequest({
            method: registerConfig.method,
            url: registerConfig.url,
            data: $httpParamSerializer(params),
            success: function (data) {
              $cookies.put(token_id, data.token, {
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return user = data.member;
            }
          });
        },

        resetPwd: function (params) {
          return httpRequest({
            method: resetPwdConfig.method,
            url: resetPwdConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        modifyPwd: function(params){
          return httpRequest({
            method: modifyPwdConfig.method,
            url: modifyPwdConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        getInfo: function() {
          console.log(user);
          if(user) return $q.resolve(user);
          return httpRequest({
            method: getInfoConfig.method,
            url: getInfoConfig.url,
            cancellable: true,
            success: function (data) {
              console.log( ENV.genderMap[data.member.gender]);
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return data.member;
            },
            error: function (err) {
              if(err.code) {
                $cookies.remove(token_id);
              }
              return $q.reject(err.msg);
            }
          });
        },

        update: function (params) {
          return httpRequest({
            method: updateConfig.method,
            url: updateConfig.url,
            data: $httpParamSerializer(params),
            success: function (data) {
              return user = data.member;
            }
          })
        }
      };
      return self;
    }
  ]);
