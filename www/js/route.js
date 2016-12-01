angular.module('starter.route', ['ionic'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      //默认路由
      $urlRouterProvider.otherwise('/home');

      $stateProvider
        //首页
        .state('home', {
          url: '/home',
          templateUrl: 'templates/home/home.html',
          controller: 'HomeCtrl'
        })

        //品牌索引
        .state('brand', {
          url: '/brand',
          templateUrl: 'templates/brand/brand.html',
          controller: 'brandController',
          resolve: {
            return: function() {

            }
          }
        })

        //齿研社
        .state('toothOp', {
          url: '/toothOp/:categoryId',
          templateUrl: 'templates/toothOp/index.html',
          controller: 'toothOpCtrl'
        })

        //齿研社-立即询价
        .state('toothOpEnquiry', {
          url: 'toothEnquiry',
          templateUrl: "templates/toothOp/enquiry.html",
          controller: 'toothOpCtrl'
        })

        //找货助手
        .state('findAssistant', {
          url: '/findAssistant',
          templateUrl: 'templates/findAssistant/index.html',
          controller: 'findAssistant'
        })

        //我的爱牙库
        .state('user', {
          url: "/user",
          templateUrl: "templates/user/user.html",
          controller: 'userController'
        })
        //本月推荐更多
        .state('moreMR', {
          url: "/moreMR",
          templateUrl: "templates/categoryList/moreMR.html",
          controller: 'moreMRCtrl'
        })

        //首页热门搜索
        .state('homeSearch', {
          url: '/hotSearch',
          templateUrl: 'templates/home/homeSearch.html',
          controller: 'HomeSearchCtrl'
        })

        //产品分类
        .state('mainCategory', {
          url: "/mainCategory",
          templateUrl: "templates/categoryList/productCategory.html",
          controller: 'productCategoryController'
        })

        //产品筛选,高级搜索列表
        .state('filterList', {
          url: '/productList/:fristCategoryId/:childrenlistId/:keyword/:brandId',
          templateUrl: 'templates/categoryList/filterProductList.html',
          controller: 'filterListCtrl'
        })
        //
        .state('assistantConfirm', {
          url: '/assistant/confirm',
          templateUrl: 'templates/findAssistant/confirm.html',
          controller: 'assistantConfirm'
        })

        .state('productInfo', {
          url: '/product/info/:id',
          templateUrl: 'templates/categoryList/productInfo.html',
          controller: 'productInfoCtrl'
        })

        //支付成功
        .state('paySuccess', {
          url: '/paySuccess/:sn',
          params:{sn:null},
          templateUrl: 'templates/order/paySuccess.html',
          controller: 'paySuccessController'
        })

        .state('favorite', {
          url: '/favorite',
          templateUrl: 'templates/favorite/index.html',
          controller: 'favoriteController'
        })

        .state('setting', {
          url: '/setting',
          templateUrl: 'templates/user/setting.html',
          controller: 'userInfoController'
        })

        //我的采购单
        .state('purchaseOrderList', {
          url: '/purchaseOrderList',
          templateUrl: 'templates/purchaseOrder/purchaseOrderList.html',
          controller: 'purchaseOrderController'
        })

        .state('purchaseOrderEdit', {
          url: '/purchaseOrderEdit',
          templateUrl: 'templates/purchaseOrder/purchaseOrderEdit.html',
          controller: 'purchaseOrderController'
        })

        //我的订单
        .state('myOrders', {
          url: '/myOrders',
          controller: 'myOrdersController',
          templateUrl: 'templates/user/myOrders.html',
          params: {
            tab: 0
          }
        })

        //订单详情
        .state('orderDetail', {
          //paymentStatus:shippingStatus:orderStatus:
          url: '/orderDetail/:sn:isExpire',
          templateUrl: 'templates/order/orderDetail.html',
          controller: 'orderDetailController'
        })

        //订单确认
        .state('orderOk', {
          url: '/orderOk',
          templateUrl: 'templates/order/orderOk.html',
          controller: 'orderListOk'
        })

        //订单结算
        .state('orderPay', {
          url: '/orderPay/:sn',
          cache: false,
          templateUrl: 'templates/order/orderPay.html',
          controller: 'orderListPay'
        })



        //我的物流
        .state('mylog', {
          url: '/mylog/:sn',
          templateUrl: 'templates/logistics/mylog.html',
          controller: 'mylogController'
        })

        //快速采购
        .state('rapidList', {
          url: '/rapidList',
          templateUrl: 'templates/purchaseOrder/rapidList.html',
          controller: 'rapidListController'
        })

        .state('address', {
          url: '/address/:addrId/:myaddress',
          templateUrl: 'templates/adress/address.html',
          controller: 'addressController'
        })

        //个人信息
        .state('userInfo', {
          url: '/userInfo',
          templateUrl: 'templates/user/userInfo.html',
          controller: 'userInfoController'
        })

        //修改Email地址
        .state('email', {
          url: '/email',
          templateUrl: 'templates/user/email.html',
          controller: 'userInfoController'
        })

        //修改电话
        .state('phone', {
          url: '/phone',
          templateUrl: 'templates/user/phone.html',
          controller: 'userInfoController'
        })

        //修改手机
        .state('modifyPhone', {
          url: '/modifyPhone',
          templateUrl: 'templates/user/modifyPhone.html',
          controller: 'userInfoController'
        })
        //牙科名称
        .state('editDentistryName', {
          url: '/editDentistryName',
          templateUrl: 'templates/user/editDentistryName.html',
          controller: 'userInfoController'
        })

        //设置-收货地址
        .state('addressDetail', {
          url: '/addressDetail/:addressId/:isSelect',
          templateUrl: 'templates/adress/addressDetail.html',
          controller: 'addressDetailController'
        })

        //关于我们
        .state('aboutOur', {
          url: '/aboutOur',
          templateUrl: 'templates/user/about.html',
          controller: ''
        })
        //联系我们
        .state('linkUs', {
          url: '/linkUs',
          templateUrl: 'templates/user/linkUs.html',
          controller: ''
        })
        //修改密码
        .state('modifyPwd', {
          url: '/modifyPwd',
          templateUrl: 'templates/user/modifyPwd.html',
          controller: 'modifyPwdController'
        })

        //登录
        .state('login', {
          url: '/login',
          templateUrl: 'templates/user/login.html',
          controller: 'loginController'
        })

        //注册
        .state('register', {
          url: '/register',
          templateUrl: 'templates/user/register.html',
          controller: 'registerController'
        })
        //用户协议
        .state('userAgree', {
          url: '/userAgree',
          templateUrl: 'templates/user/userAgree.html',
          controller: ''
        })
        //找回密码
        .state('resetPwd', {
          url: '/resetPwd',
          templateUrl: 'templates/user/resetPwd.html',
          controller: 'resetPwdController'
        })

        //404
        .state('network', {
          url: '/network',
          templateUrl: 'templates/error/network.html',
          controller: 'networkCtrl'
        })
        //订单评价
        .state('evaluation',{
          url:'/evaluation',
          templateUrl: 'templates/user/evaluation.html',
          controller: ''
        });


    }
  ]);
