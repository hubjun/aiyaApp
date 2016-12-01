angular.module('starter.services')
  .factory('orderService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    '$cookies',
    'StringUtil',
    'Util',
    function(ENV, httpRequest, $httpParamSerializer,$cookies,StringUtil, Util) {
      var orderProList = {};//订单商品清单
      var getListConfig = ENV.order.getList,
          getOneConfig = ENV.order.get,
          createConfig = ENV.order.create,
          cancelConfig = ENV.order.delete,
          cancelOrderConfig = ENV.order.cancel,
          confirmOrderConfig = ENV.order.confirmOrder,
          alipayparamConfig = ENV.order.alipayparam,
          alipayConfig = ENV.order.alipay,
          directInfoConfig = ENV.order.directInfo,
          couponInfoConfig = ENV.order.couponInfo,
          directBuyPrecheckConfig = ENV.order.directBuyPrecheck,
          payInfoConfig = ENV.order.payInfo,
          infoConfig = ENV.order.info,
          token_id = ENV.token_id,
          buyAgainConfig = ENV.order.buyAgain;
      var defaultOpt = {};
      return {

        getToken: function () {
          return $cookies.get(token_id);
        },

        getTokenOne : $cookies.get(token_id),

        get: function(sn) {
          return httpRequest({
            method: getOneConfig.method,
            url: getOneConfig.url,
            params: {'sn': sn},
            success: function (order) {
              order.orderStatusDesc = ENV.orderStatusMap[order.orderStatus];
              order.paymentStatusDesc = ENV.paymentStatusMap[order.paymentStatus];
              return order;
            }
          });
        },

        getList: function(pageNumber, pageSize, opt) {
          var _opt = _.assignIn({}, defaultOpt, opt);
          return httpRequest({
            method: getListConfig.method,
            url: getListConfig.url,
            params: {
              'type': _opt.type || undefined,
              'pageNumber': pageNumber,
              'pageSize': pageSize
            },
            success: function (data) {
              _.each(data.list, function (order) {
                console.log(order);
                order.orderStatusDesc = ENV.orderStatusMap[order.orderStatus];
                order.shippingStatusDesc = ENV.shippingStatusMap[order.shippingStatus];
                order.paymentStatusDesc = ENV.paymentStatusMap[order.paymentStatus];
                order.createDateStr = order.createDate.substr(0,10);
              });
              return data;
            }
          });
        },

        create: function(params) {
          return httpRequest({
            method: createConfig.method,
            url: createConfig.url,
            headers:{'Content-Type':'application/json'},
            data:params
          });
        },

        cancel: function(sn) {
          return httpRequest({
            method: cancelConfig.method,
            url: cancelConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        cancelOrder: function(sn) {
          return httpRequest({
            method: cancelOrderConfig.method,
            url: cancelOrderConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        confirmOrder: function(sn) {
          return httpRequest({
            method: confirmOrderConfig.method,
            url: confirmOrderConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        payparam: function(params, payType) {
          var payparamConfig;
          switch (payType) {
            case 0: payparamConfig = alipayparamConfig;break;
            case 1: payparamConfig = wexinparamConfig;break;
          }
          return httpRequest({
            method: payConfig.method,
            url: payConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        evaluate: function () {

        },
        directInfo: function(){
          return httpRequest({
            method: directInfoConfig.method,
            url: directInfoConfig.url,
            data:$httpParamSerializer(orderProList),
            success:function(data){
              _.chain(data.products)
                .forEach(function (p,index) {
                  p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
                if(p.isSectionPrice !== null && p.isSectionPrice !== '' && p.isSectionPrice){
                  if(p.quantity <= parseInt(p.quantity1)){
                    p.truePrice = p.price;
                  }else if(p.quantity <= parseInt(p.quantity2)){
                    p.truePrice = p.price1;
                  }else{
                    p.truePrice = p.price2
                  }
                }else{
                  p.truePrice = p.price;
                }
            }).value();
              return data;
            }
          });
        },
        couponInfo: function(params){
          return httpRequest({
            method: couponInfoConfig.method,
            url: couponInfoConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        directBuyPrecheck: function(params){
          return httpRequest({
            method:directBuyPrecheckConfig.method,
            url:directBuyPrecheckConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        payInfo:function(params){
          return httpRequest({
            method:payInfoConfig.method,
            url:payInfoConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        /*支付成功回调信息*/
        info:function(params){
          return httpRequest({
            method:infoConfig.method,
            url:infoConfig.url,
            params:params
          });
        },
        /*再次购买*/
        buyAgain:function(params){
          return httpRequest({
            method:buyAgainConfig.method,
            url:buyAgainConfig.url,
            params:params
          });
        },

        //获取订单商品清单
        getOrderProList: function () {
          return orderProList;
        },
        //设置购物车内容----购物车页调用
        setOrderProList: function (tmpCartList) {
          orderProList = tmpCartList;
          return true;
        }
      }
    }
  ]);
