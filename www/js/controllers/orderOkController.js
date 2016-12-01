aiyaController.controller('orderListOk', [
  '$scope',
  '$rootScope',
  '$ionicScrollDelegate',
  'userAddressService',
  '$stateParams',
  'orderService',
  '$ionicLoading',
  '$state',
  'CommonUtil',
  '$ionicModal',
  function($scope,$rootScope,$ionicScrollDelegate,userAddressService,$stateParams,orderService,$ionicLoading,$state,CommonUtil,$ionicModal){

    $scope.orderInfo = {
      hasCoupon:false,        /*是否有优惠*/
      coupon : '',            /*优惠码*/
      isInvoice : false,     /*是否开具发票*/
      invoiceTitle : '',      /*发票抬头*/
      memo : ''              /*备注*/
    }
    $scope.defaultShippingMethod; //配送方式


    /*判断是否需要刷新*/
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.orderOkCache = v.direction != 'forward';
    });
    $scope.$on('$ionicView.enter',function(){
      if(!$scope.orderOkCache){
        $scope.init();
        //界面方法绑定
        initPageFn();
      }
    });
    $scope.init = init;

    $scope.pushBill = {
        checked: false
    }

  $scope.toggleBillChange = function(){
    $scope.orderInfo.isInvoice = $scope.pushBill.checked;
  }

  $scope.scrollBottom = function(){
    $ionicScrollDelegate.scrollBottom();
  }

    function init(){
      orderService.directInfo().then(function(data){
        //参数初始化
        $scope.orderInfo = {
          hasCoupon:false,        /*是否有优惠*/
          coupon : '',            /*优惠码*/
          isInvoice : false,     /*是否开具发票*/
          invoiceTitle : '',      /*发票抬头*/
          memo : ''              /*备注*/
        }
        $scope.receiverInfo = data.receiverInfo;
        $scope.products = data.products;
        $scope.totalPrice = data.totalPrice;//应付总额
        $scope.totalQuantity = data.totalQuantity;
        //活动
        $scope.couponPrice = 0;
        $scope.promotionList = data.promotionList;
        //配送方式
        $scope.shippingMethodList = data.shippingMethodList;
        if($scope.shippingMethodList != null && $scope.shippingMethodList.length > 0){
          $scope.defaultShippingMethod = $scope.shippingMethodList[0];
          $scope.defaultShippingMethod.first_price = _.gt(parseFloat($scope.totalPrice),199) ? 0 : $scope.defaultShippingMethod.first_price;
        }
        //活动优惠金额
        $scope.promotionPrice = data.promotionPrice;

        $scope.allPrice = getAllPrice();
      },function(err){
        console.log(err);
      });
    }
    //优惠码确认
    $scope.couponSure = function(){
      if($scope.orderInfo.coupon == null || $scope.orderInfo.coupon == ''){
        return;
      }
      if($scope.promotionList.length > 0){
        CommonUtil.tip('有促销的商品不能使用优惠券');
        return;
      }
      var product = orderService.getOrderProList();
      var params = {
        code:$scope.orderInfo.coupon,
        directBuyIds:product.ids,
        directQuantitys:product.quantitys
      }
      orderService.couponInfo(params).then(function(data){
        $scope.orderInfo.hasCoupon = true;
        $scope.couponPrice = data.couponPrice;
        $scope.finalPrice = data.finalPrice;
        /*应付金额*/
        $scope.allPrice = getAllPrice();
      },function(err){
        CommonUtil.tip(err);
        console.log(err);
      });
    }

    /*优惠码取消*/
    $scope.couponCancel = function(){
      $scope.couponPrice = 0;
      $scope.allPrice = getAllPrice();
      $scope.orderInfo.hasCoupon = false;
    }

    /*订单提交*/
    $scope.createOrder = function(){
      if(hasYCProduct()){
        $scope.showYC();
        return;
      }
      confirmInfo();
    }
    //切换收货地址
    $rootScope.$on('SELECT_ADDRESS', function (event, data) {
        $scope.receiverInfo = data;
    });

    //选中的收货地址被删除
    $rootScope.$on('SELECT_ADDRESS_DELETED', function (event,data) {
      $scope.receiverInfo = data;

    });
    //选中的收货地址被修改
    $rootScope.$on('SELECT_ADDRESS_CHANGED', function (event, data) {
      $scope.receiverInfo = data;

    });

    function initPageFn(){
      //显示快递配送方式
      $ionicModal.fromTemplateUrl('modal-shipping.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.shippingModal = modal;
        });

      //显示详细活动
      $ionicModal.fromTemplateUrl('modal-promotion.html',{
          scope:$scope
        }).then(function(modal){
          $scope.promotionModal = modal;
        });

      //显示义齿加工详细信息
      $ionicModal.fromTemplateUrl('modal-YC.html',{
        scope:$scope
      }).then(function(modal){
        $scope.YCModal = modal;
      });
      }
    //
    $scope.showShippingMethod = function(){
      $scope.shippingModal.show();
    }

    $scope.shippingMethodConfirm = function(){
      $scope.shippingModal.hide();
    }

    $scope.selectShippingMethod = function(shippingMethod){
      $scope.defaultShippingMethod = shippingMethod;
      $scope.defaultShippingMethod.first_price = _.gt(parseFloat($scope.totalPrice),199) ? 0 : $scope.defaultShippingMethod.first_price;
      $scope.allPrice = getAllPrice();
    }

    $scope.showPromotion = function(){
      $scope.promotionModal.show();
    }

    $scope.closePromotion = function(){
      $scope.promotionModal.hide();
    }

    $scope.showYC = function(){
      $scope.YCModal.show();
    }

    $scope.YCConfirm = function(){
      $scope.YCModal.hide().then(function(){
        confirmInfo();
      });
    }

    $scope.$on('$destroy',function(){
      /*当模型消除时候，清除*/
      $scope.shippingModal.remove();
      $scope.promotionModal.remove();
      $scope.YCModal.remove();
    });

    //订单中是否有义齿加工类商品
    function hasYCProduct(){
      return _.filter($scope.products,{isYcInquiry:true}).length > 0 ? true : false
    }

    //具体提交订单确认信息
    function confirmInfo(){
      var productList = new Array();
      var product = orderService.getOrderProList();
      if( product!= null && product !=''){
        var ids = (product.ids+"").split(',');
        var quantitys = product.quantitys.toString().split(',');
        for(var i = 0; i < ids.length; i++){
          var tempProduct = {
            productId:'',
            quantity:''
          }
          tempProduct.productId = ids[i];
          tempProduct.quantity = quantitys[i];
          productList.push(tempProduct);
        }
      }
      var params = {
        receiverId : $scope.receiverInfo.id,
        memo: $scope.orderInfo.memo,
        isInvoice: $scope.orderInfo.isInvoice,
        couponCode: $scope.orderInfo.hasCoupon ? $scope.orderInfo.coupon : '',
        invoiceTitle: $scope.orderInfo.invoiceTitle,
        shippingMethod: $scope.defaultShippingMethod.id,
        productList:productList
      }
      orderService.create(params).then(function(data){
        if(data.isMonthly){
          $state.go('paySuccess',{sn:data.sn});
        }else{
          $state.go('orderPay',{sn:data.sn});
        }
      },function(err){
        CommonUtil.tip(err);
      });
    }

    //计算商品总价
    function getAllPrice(){
      return _.gt(parseFloat($scope.totalPrice),199) ? $scope.totalPrice - parseFloat($scope.promotionPrice) - parseFloat($scope.couponPrice) : _.add($scope.totalPrice,$scope.defaultShippingMethod.first_price) - parseFloat($scope.promotionPrice) - parseFloat($scope.couponPrice);
    }
}]);
