aiyaController.controller('orderListPay', [
  '$scope',
  '$state',
  '$stateParams',
  '$q',
  'orderService',
  'CommonUtil',
  'ENV',
  '$ionicHistory',
  'StringUtil',
  function($scope,$state,$stateParams,$q,orderService,CommonUtil,ENV,$ionicHistory,StringUtil){
    //重写back
    $scope.back = function(){
      CommonUtil.confirm('下单后24小时内未支付成功，订单将被取消，请尽快完成支付。',null,'确认离开','继续支付').then(function(res){
        if(res){
            if($ionicHistory.backView()){
              if($ionicHistory.backView().url.indexOf('orderOk') > 0){
                $state.go('orderDetail',{sn:$scope.sn});
              }else{
                //正常原路返回
                $ionicHistory.goBack();
              }
            }else{
              $state.go('orderDetail',{'sn':$scope.sn});
            }
        }
      });
    }
    //console.log('支付页面:'+$stateParams.sn);
    var params={
      sn: $stateParams.sn
    }
    orderService.payInfo(params).then(function(data){
      $scope.sn = data.payInfo.sn;
      $scope.amountPrice = data.payInfo.amountPrice;
      $scope.shippingMethodName = data.payInfo.shippingMethodName;
      $scope.paymentMethodName = data.payInfo.paymentMethodName;
      $scope.endtime = data.payInfo.endTime;
    },function(err){
      CommonUtil.tip(err);
    });

  $scope.$on('$ionicView.enter', function(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      $scope.payShowWx = true;
      $scope.payShowAli = false;
    }else{
      $scope.payShowWx = false
      $scope.payShowAli = true;
    }

    //支付宝支付调起
    $scope.alipay = function(sn){
      //根据订单编号获取订单支付信息
      if(StringUtil.isEmpty(sn)){
        return;
      }
      $.ajax({
        url:ENV.siteUrl+"order/payInfo",
        method:"post",
        data:{sn:sn,token:orderService.getToken},
        success:function(result){
          if(result.code == 1){
            var data = {
              sn:result.data.payInfo.sn,
              name:result.data.payInfo.subject,
              price:result.data.payInfo.amountPrice,
              body:orderService.getToken
            }
            //data.price = "0.01";//测试价格
            $.ajax({
              url:ENV.siteUrl+"order/alipayparam",
              method:"post",
              data:data,
              success:function(result){
                result = JSON.stringify(result.data);
                var results  = result.split(',');
                for(var index in results){
                  var eachStr = results[index];
                  while(eachStr.indexOf("\"") != -1){
                    eachStr = eachStr.replace("\"","");
                  }
                  eachStr = eachStr.replace("{","");
                  eachStr = eachStr.replace("}","");
                  var key = eachStr.substring(0,eachStr.indexOf(':'));
                  var value = eachStr.substring(eachStr.indexOf(':')+1,eachStr.length);
                  $("#alipaysubmit").html( $("#alipaysubmit").html() + "<input type=\"hidden\" name=\"" + key + "\" value=\"" + value + "\"/>");
                }
                document.forms['alipaysubmit'].submit();
          //alert("success");
              },
              error:function(){
                alert("error");
              }
            });
          }
        },
        error:function(){
          alert("error");
        }
      });
    }

    //微信支付调起
    $scope.wxpay = function(sn){
      if(StringUtil.isEmpty(sn)){
        return;
      }
      $.ajax({
        url:ENV.siteUrl+"order/wxcodeparam",
        method:"post",
        success:function(result){
          location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+result.data.appid+"&redirect_uri="+result.data.redirect_uri+"&response_type="+result.data.response_type+"&scope="+result.data.scope+"&state="+sn+"#wechat_redirect";
        },
        error:function(){
          alert("error");
        }
    });
}
  })
}]);
