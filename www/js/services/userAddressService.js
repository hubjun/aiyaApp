angular.module('starter.services')
  .factory('userAddressService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function(ENV, httpRequest, $httpParamSerializer) {
      var getListConfig = ENV.userAddress.getList,  //收货地址列表
          getConfig = ENV.userAddress.getDetail,     //收货地址详情
          saveConfig = ENV.userAddress.save,         //保存收货地址
          deleteConfig = ENV.userAddress.delete,     //删除收藏地址
          setDefaultConfig = ENV.userAddress.setDefault,//设为默认地址
          getParentConfig = ENV.userAddress.getParent,//省列表
          getCityConfig = ENV.userAddress.getCity; //市列表
      return {
        /**
         * @param {Number|String} id 收货地址ID
         * @return {Promise}
           */
        get: function(id) {
          return httpRequest({
            method: getConfig.method,
            url: getConfig.url,
            params: {'id': id}
          });
        },

        getList: function() {
          return httpRequest({
            method: getListConfig.method,
            url: getListConfig.url
          });
        },
        /**
         * @param {Number|String} id? 默认返回省份
         * @return {Promise}
           */
        getArea: function (id) {
          return httpRequest({
            method: getAreaConfig.method,
            url: getAreaConfig.url,
            params: {'parentId': id},
            success: function (data) {
              return data.list;
            }
          });
        },

        save: function (address) {
          return httpRequest({
            method: saveConfig.method,
            url: saveConfig.url,
            data: $httpParamSerializer(address)
          })
        },

        delete: function (id) {
          return httpRequest({
            method: deleteConfig.method,
            url: deleteConfig.url,
            data: $httpParamSerializer({'id': id})
          });
        },
        /*获取省列表*/
        getProvinceList:function(){
          return httpRequest({
            method:getParentConfig.method,
            url:getParentConfig.url
          });
        },
        /*获取市列表*/
        getCityList:function(params){
          return httpRequest({
            method:getCityConfig.method,
            url:getCityConfig.url,
            params:params
          });
        },
        /*设为默认地址*/
        setDefault: function(id){
          return httpRequest({
            method:setDefaultConfig.method,
            url:setDefaultConfig.url,
            data: $httpParamSerializer({'id': id})
          });
        }
      }
    }
  ]);
