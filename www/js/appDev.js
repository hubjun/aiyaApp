angular.module('aiyakuAppDev', ['aiyakuApp', 'ngMockE2E'])
  .run(['$httpBackend', function($httpBackend) {
    var whiteList = ['/member/', '/productcategory/','/brand/','/purchase/', '/favorite', '/index/', '/navilist/', '/membersearchkey/', '/product/', '/order/', 'memberYcInquiry'];

    $httpBackend.whenGET(/.*\.html$/).passThrough();

    $httpBackend.whenGET(new RegExp('.*' + whiteList.join('|') + '.*')).passThrough();
    $httpBackend.whenPOST(new RegExp('.*' + whiteList.join('|') + '.*')).passThrough();

    //unique id
    var _uniqueId = 0;
    var getUniqueId = function() {
      return ++_uniqueId;
    };

    function bundle(origin, number, primaryKey, uniqueIdFn) {
      var ret = [], init = primaryKey ? parseInt(origin[primaryKey]) : 0;
      uniqueIdFn = uniqueIdFn ? uniqueIdFn : function () { return ++init };
      primaryKey = primaryKey ? primaryKey : 'id';
      for (var i = 0; i < number; i++) {
        var copy = _.cloneDeep(origin);
        copy[primaryKey] = uniqueIdFn();
        copy.name += ' ['+ primaryKey +': ' + copy[primaryKey] + '] ';
        ret.push(copy);
      }
      return ret;
    }

    function responseWrapper(data) {
      return ['200', data, {}, ''];
    }

    function log(method, url, params) {
      console.log('http' + method + ': --' + url + '; --params: ' + JSON.stringify(params));
    }

    var responseModel = {
      "code": 1,
      "msg": "成功",
      "data": {
        "list": [],
        "page": {
          "pageNumber": '',
          "pageSize": '',
          "totalCount": '',
          "offset": '',
          "lastPage": '',
          "prePage": '',
          "firstPage": '',
          "hasPrePage": '',
          "hasNextPage": '',
          "slider": [],
          "startRow": '',
          "endRow": '',
          "totalPages": '',
          "nextPage": ''
        }
      }
    };

    //我的采购单
    (function() {
      var myPurchaseOrderList;
      var product = {
        "id": 1, //商品编号
        "name": "HAGER咬合垫/咬颌块1111", //商品名称
        "fullName": "", //商品全称
        "specificationName": "规格型号", //规格名称
        "specificationValue": "#11", //规格名称值
        "price": "39.00", //价格
        "unit": "盒", //单位
        "quantity": 8, //采购数量
        "isLimit": true, //是否限购
        "continueDay": 8, //限购天数
        "limitNo": 8, //限购个数
        "stock": 8, //库存
        "allocatedStock": 5, //已分配库存
        "image": "/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
      };

      myPurchaseOrderList = bundle(product, 30);
      //查询采购商品
      $httpBackend.whenGET(/.*\/purchase\/list.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var keyword = params.keyword,
          pageNumber = parseInt(params.pageNumber) || 0,
          pageSize = parseInt(params.pageSize) || myPurchaseOrderList.length;
        var response = _.cloneDeep(responseModel);
        response.data.list = myPurchaseOrderList.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        response.data.page.pageNumber = pageNumber;
        response.data.page.pageSize = pageSize;
        return responseWrapper(response);
      });

      //增加采购商品
      $httpBackend.whenPOST(/.*\/purchase\/choiceproduct.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        productList = JSON.parse(params.productList);
        if (!_.isArray(productList)) {
          var a = [];
          a.push(productList);
          productList = a;
        }
        _.each(productList, function(p) {
          _.find(myPurchaseOrderList, {
            id: p.productId
          }).quantity = p.quantity;
        });
        return responseWrapper(response);
      });

      //删除采购商品
      $httpBackend.whenPOST(/.*\/purchase\/delete.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        var ids = params.ids.split(',');
        _.pullAllWith(myPurchaseOrderList, ids, function(p, n) {
          return p.id == n;
        });
        return responseWrapper(response);
      });
    }());

    //订单
    (function() {
      var myOrders;
      var order = {
          "id": 1, //编号
          "sn": "2016022410", //订单号
          "createDate": "2016-02-24", //订单创建时间
          "orderStatus": "等待买家付款", // 订单状态
          "productNumber": 10, //购买商品数量
          "totalPrice": "1000.00", //实付
          "freight": "12.00", //运费
          "productList": [{
            "id": 1,
            "sn": "2016022410", //编号
            "name": "测试商品", //商品名称
            "fullName": "柳苑吸潮纸尖1[0.02/15#]", //商品全称
            "isSectionPrice": true, //是否设置区间价格
            "price": "19.00", //销售价
            "price1": "15.00", //区间价格一
            "quantity1": 50, //区间价格一数量
            "price2": "10.00", //区间价格二
            "quantity2": 100, //区间价格二数量
            "marketPrice": "50.00", //市场价
            "image": "/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
          }]
        },
        orderDetail = {
          "id":1,//编号
          "sn":"2016022410",//订单号
          "createDate":"2016-02-24",//订单创建时间
          "orderStatus":"等待买家付款",// 订单状态
          "productNumber":10,//购买商品数量
          "totalPrice":"1000.00",//实付
          "freight":"12.00",//运费
          "consignee":"张三",//收货人
          "address":"广东省深圳市南山区深圳市南山区深圳市南山区深圳市南山区深圳市南山区2003",//收货人地址
          "phone":"13660490329",//收货人电话
          "paymentMethodName":"网上支付",//支付方式
          "shippingMethodName":"顺丰快递",//配送方式
          "memo":"",//附言
          "expire":"2016-04-28 11:25:30",//订单到期时间
          "productList":[
            {
              "id":1,
              "sn":"201504013232",//编号
              "name":"测试商品",//商品名称
              "fullName":"柳苑吸潮纸尖1[0.02/15#]",//商品全称
              "isSectionPrice":true,//是否设置区间价格
              "price":"19.00",//销售价
              "price1":"15.00",//区间价格一
              "quantity1":50, //区间价格一数量
              "price2":"10.00",//区间价格二
              "quantity2":100, //区间价格二数量
              "marketPrice":"50.00", //市场价
              "image":"/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
            }
          ]
        };
      order.productList = bundle(order.productList[0], 5, 'id');
      myOrders = bundle(order, 10, 'sn');
      //获取订单列表
      $httpBackend.whenGET(/.*\/order\/list.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var type = params.type,
          pageNumber = parseInt(params.pageNumber) || 0,
          pageSize = parseInt(params.pageSize) || myPurchaseOrderList.length;

        var response = _.cloneDeep(responseModel);
        response.data.list = myOrders.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        response.data.page.pageNumber = pageNumber;
        response.data.page.pageSize = pageSize;
        return responseWrapper(response);
      });

      //获取订单详情
      $httpBackend.whenGET(/.*\/order\/info.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(orderDetail);
        response.data.id = params.id;
        return responseWrapper(response);
      });

      //删除订单
      $httpBackend.whenGET(/.*\/order\/cancel.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var sn = params.sn,
            response = _.cloneDeep(responseModel);

        _.remove(myOrders, {'sn': sn});
        response.data = {};
        return responseWrapper(response);
      });

      //支付订单
      $httpBackend.whenGET(/.*\/order\/payment.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var sn = params.sn,
          response = _.cloneDeep(responseModel);

        _.find(myOrders, {'sn': sn}).orderStatus = '买家已付款，等待商家发货';
        response.data = {};
        return responseWrapper(response);
      });

      //订单评价
    }());

    //物流
    (function () {
      var logistic = {
        "shippingStatus": 0 ,// 物流状态 0-- 部分发货 1- -已发货 2-- 部分退货 3-- 已退货 4--用户收货 5-- 已收货(已签收)
        "shippingMethodName": "顺丰快递" ,//配送方式
        "sn":"2016022410",//订单号
        "expresssn":"A565645545",//快递单号
        "logisticsList":[
          {
            "desc": "深圳南光站 派件已经签收",//
            "createDate":"2016-02-24 10:11:00"//操作时间
          }
        ]
      };
      //获取订单物流信息
      $httpBackend.whenGET(/.*\/order\/mylogistics.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(logistic);
        response.data.sn = params.sn;
        return responseWrapper(response);
      });
    }());

    //用户
    (function () {
      var user = {
        "member": {
          "id":1,
          "username":"测试用户",//用户名
          "email":"aa@183.com",//邮箱
          "point":1000,//积分
          "balance":"500.00",//余额
          "isAuthoriz":false,//是否可查看义齿价格
          "isVip":false,//是否为VIP用户
          "isMonthly":false,//是否为月结用户
          "photo":"",//头像
          "name":"",//牙科名
          "address":"",//地址
          "gender":0,//0--男  1--女
          "mobile":"13660490329",//手机
          "phone":"556569999",//电话
          "birth":"1981-01-14"//出生日期
        }
      };

      //获取用户信息
      $httpBackend.whenGET(/.*\/profile\/info.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(user);
        return responseWrapper(response);
      });

      //验证码服务
        //获取验证码
      $httpBackend.whenGET(/.*\/member\/captchacode.*/).respond(function (method, url, data, headers, params) {
        log(method, url, params);
        var AuthCodeGenerator = function () {
          var num = '';
          num += Math.floor(Math.random()*10);
          return parseInt(num);
        };
        var response = _.cloneDeep(responseModel);
        response.data = {};
        return responseWrapper(response);
      });
    }());

    //分类信息
    (function () {
      var categoryModel = {id: 0, name: '义齿类'},
          firstCategory = bundle(categoryModel, 8, 'id', getUniqueId),
          secondCategory = {};
      _.each(firstCategory, function (c) {
        secondCategory[c.id + ''] = bundle(categoryModel, 10, 'id', getUniqueId);
      });
      //一级分类
      $httpBackend.whenGET(/.*\/productcategory\/parentlist.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = { 'list': firstCategory };
        return responseWrapper(response);
      });
      //二级分类
      $httpBackend.whenGET(/.*\/productcategory\/childrenlist.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var firstCategoryId = params.id,
            response = _.cloneDeep(responseModel);
        response.data = {'list': secondCategory[firstCategoryId]};
        return responseWrapper(response);
      });
    }())
  }]);
