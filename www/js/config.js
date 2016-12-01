var configMod = angular.module("starter.config", []);
configMod.constant("ENV", (function () {/*192.168.3.237:8080/   192.168.3.217:8080/  186:8080邓亚鹏 */
  var siteUrlPrefix = 'http://192.168.1.53:7000/',
  imgUrlPrefix = 'http://192.168.1.53:7001/';

  var siteUrl = function (rpath, prefix) {
        return prefix ? prefix + rpath : siteUrlPrefix + rpath;
      },
      imgUrl = function (rpath, prefix) {
        return prefix ? prefix + rpath : imgUrlPrefix + rpath;
      };

  return {
    "debug": false,
    "api": "",
    "token_id": "AIYATOKEN",
    'currentUser': 'AIYACURRENTUSER',
    'siteUrl': siteUrlPrefix,
    'imgUrl': imgUrlPrefix,
    'defaultImg':'./img/productInfo/default.jpg',
    'consumableImg':'./img/productInfo/consumableImg.jpg',        //商品详情耗材类物流图片
    'ycImg':'./img/productInfo/ycImg.png',                        //商品详情义齿物流图片
    'loginUrl': "http://192.168.1.34:8080/member/login",
    'version': '1.0.1',
    'consumableTel': '400-688-8643', //耗材客服电话
    'toothTel': '400-688-8469', //义齿加工客服电话

    index: {
      floorproductlist: "./data/index/floorproductlist.json",
      //首页，商品详情 猜你喜欢
      getrecommendproductc: "./data/index/getrecommendproductc.json",
      adlist: {
        url: siteUrl('index/adlist'),
        method: 'GET'
      }
    },

    //用户接口
    user: {
      login: {
        url: siteUrl('member/login'),
        method: 'POST'
      },
      logout: {
        url: siteUrl('member/logout'),
        method: 'GET'
      },
      resetPwd: {
        url: siteUrl('member/resetpass'),
        method: 'POST'
      },
      modifyPwd: {
        url: siteUrl('member/editpass'),
        method: 'POST'
      },
      register: {
        url: siteUrl('member/register'),
        method: 'POST'
      },
      getInfo: {
        url: siteUrl('member/getcurrent'),
        method: 'POST'
      },
      update: {
        url: siteUrl('member/edit'),
        method: 'POST'
      }
    },
    //首页搜索
    membersearchkey: {
      //热门搜索
      fullsearchkeylist :{
        url: siteUrl('membersearchkey/fullsearchkeylist'),
        method: 'GET'
      },
      //会员搜索
      hostorylist: {
        url: siteUrl('membersearchkey/hostorylist'),
        method: 'GET'
      }
    },
    //验证码接口
    authcode: {
      get: {
        url: siteUrl('member/captchacode'),
        method: 'GET'
      }
    },
    //订单接口
    order: {
      get: {
        url: siteUrl('order/info'),
        method: 'GET'
      },
      getList: {
        url: siteUrl('order/list'),
        method: 'GET'
      },
      create: {
        url: siteUrl('order/create'),
        method: 'POST'
      },
      cancel: {
        url: siteUrl('order/cancel'),
        method: 'POST'
      },
      confirmOrder: {
        url: siteUrl('order/confirm'),
        method: 'POST'
      },
      alipayparam: {
        url: siteUrl('order/alipayparam'),
        method: 'POST'
      },
      //第三方支付接口
      alipay: {
        url: 'https://mapi.alipay.com/gateway.do?_input_charset=utf-8"',
        method: 'POST'
      },
      evaluate: [
        {
          url: siteUrl('review/savebyorderonce'),
          method: 'POST',
          type: 0
        },
        {
          url: siteUrl('review/saveimage'),
          method: 'POST',
          type: 1
        },
      ],
      directInfo: {
        url:siteUrl('order/direct_info'),
        method:'POST'
      },
      couponInfo:{
        url:siteUrl('order/coupon_info'),
        method:'POST'
      },
      directBuyPrecheck:{
        url:siteUrl('order/direct_buy_precheck'),
        method:'POST'
      },
      payInfo:{
        url:siteUrl('order/payInfo'),
        method:'POST'
      },
      info:{
        url:siteUrl('order/info'),
        method:'GET'
      },
      buyAgain:{
        url:siteUrl('order/buyagain'),
        method:'GET'
      }
    },
    //分类信息接口
      //分类信息接口可合并成一个，根据上级分类id查询下级分类列表
    category: {
      firstCategory: {
        url: siteUrl('productcategory/parentlist'),
        method: 'GET'
      },
      secondCategory: {
        url: siteUrl('productcategory/childrenlist'),
        method: 'GET'
      },
      //--
      productCategory: {
        url: siteUrl('productcategory/categorynavilist'),
        method: 'GET'
      },
      //商品大类，全部（热门产品）
      allProductCategory: {
        url: siteUrl('productcategory/hotproductlist'),
        method: 'GET'
      }
    },
    //物流接口
    logistic: {
      get: {
        url:siteUrl('order/logistics'),
        method:'GET'
      },
      all: {
        url: siteUrl('order/mylogistics'),
        method: 'GET'
      }
    },
    //齿研社
    navilist: {
      productlist: "./data/navilist/productlist.json",
      bannerlist: {
        method: 'GET',
        url: siteUrl('index/adlist')
      }
    },
    //询价
    memberYcInquiry: {
      save: {
        method: 'POST',
        url: siteUrl('memberYcInquiry/save')
      }
    },

    //商品接口
    product: {
      getInfo: {
        url:siteUrl('product/info'),
        method:'GET'
      },
      getCategoryFilterList: {
        // list: "./data/product/search/list.json"
        method: 'GET',
        url: siteUrl('product/search/list')
      },
      getList:{
        method :'GET',
        url: siteUrl('product/search/list')
      },
      getRecommendProductc:{
        url:siteUrl('index/getrecommendproductc'),
        method:'GET'
      },
      getPurchaseCount:{
        url:siteUrl('index/cart/cartquantity'),
        method:'GET'
      }
    },
    receiver: {
      list: "./data/receiver/list.json"
    },

    //商品品牌接口
    brand: {
      get: {
        method: 'GET',
        url: ''
      },
      getList: {
        method: 'GET',
        url: siteUrl('brand/list')
      }
    },

    //收藏夹接口
    favorite: {
      getProducts: {
        url: siteUrl('favorite/list'),
        method: 'GET'
      },
      addProduct: {
        url: siteUrl('favorite/add'),
        method: 'POST'
      },
      removeProduct: {
        url:siteUrl('favorite/delete'),
        method: 'POST'
      },
      clear: {
        url: siteUrl('favorite/deleteAll'),
        method: 'GET'
      }
    },
    //商品规格接口
    productSpec: {
      get: {
        url: '/product/specificationValues',
        method: 'GET'
      }
    },
    //商品评论接口
    productComment: {
      get: {
        url: '/product/reviewlist',
        method: 'GET'
      }
    },
    //采购单接口
    purchaseOrder: {
      getProducts: {
        url: siteUrl('purchase/list'),
        method: 'GET'
      },
      addProduct: {
        url: siteUrl('purchase/add'),
        method: 'POST'
      },
      removeProduct: {
        url: siteUrl('purchase/delete'),
        method: 'POST'
      }
    },
    //修改采购单（编辑）
    purchase:{
      choiceproduct: {
        url: siteUrl('purchase/choiceproduct'),
        method: 'POST'
      }
    },

    //收货地址
    /* getConfig = ENV.userAddress.get,
     getListConfig = ENV.userAddress.getList,
     addConfig = ENV.userAddress.add,
     deleteConfig = ENV.userAddress.delete,
     getAreaConfig = ENV.userAddress.getArea;*/
    userAddress: {
      get:{
        url:siteUrl('receiver/list'),
        method:'GET'
      },
      getList:{
        url:siteUrl('receiver/list'),
        method:'POST'
      },
      getDetail:{
        url:siteUrl('receiver/info'),
        method:'GET'
      },
      save:{
        url:siteUrl('receiver/save'),
        method:'POST'
      },
      delete:{
        url:siteUrl('receiver/delete'),
        method:'POST'
      },
      getParent:{
        url:siteUrl('area/getParent'),
        method:'GET'
      },
      getCity:{
        url:siteUrl('area/getByParent'),
        method:'GET'
      },
      setDefault:{
        url:siteUrl('receiver/defaultReceiver'),
        method:'POST'
      }
    },
    //map
    //orderStatusMap 0 未确认
    orderStatusMap: {
      0: '待付款',
      1: '已确认',
      2: '已完成',
      3: '已取消',
      4: '待月结',
      5: '货到付款'
    },
    paymentStatusMap: {
      0:'待付款',
      1:'部分支付',
      2:'已支付',
      3:'部分退款',
      4:'已退款'
    },
    //已发货显示待收货
    //未发货显示待发货
    shippingStatusMap: {
      0:'待发货',
      1:'部分发货',
      2:'待收货',
      3:'部分退货',
      4:'已退货',
      5:'用户收货',
      6:'已收货'
    },
    genderMap: {
      0:'男',
      1:'女'
    },
    stockStatusMap:{
      0:'库存不足',
      1:'库存紧张',
      2:'库存充足'
    }
  }
}()));
