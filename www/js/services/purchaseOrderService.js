angular.module('starter.services')
  .factory('purchaseOrderService', [
    'ENV',
    'httpRequest',
    '$q',
    '$httpParamSerializer',
    'StringUtil',
    'Util',
    function(ENV, httpRequest, $q, $httpParamSerializer,StringUtil,Util) {
      var getProductsConfig = ENV.purchaseOrder.getProducts,
          addProductConfig = ENV.purchaseOrder.addProduct,
          removeProductConfig = ENV.purchaseOrder.removeProduct,
          editQuantityConfig = ENV.purchase.choiceproduct,
          directInfoConfig = ENV.order.directInfo;

      var state = {
          selected: [],
          sumPrice: 0
        },
        defaultOpt = {};
      var editPageFlag = false;
      var self = {
        /**
         * 获取采购单的商品列表
         * @param  {String} pageNumber 分页页码
         * @param  {String} pageSize 分页大小
         * @param  {String} opt 选项
         *  {
         *    keyword: String?, 关键字
         *    isOutStock: Boolean?, 是否缺货
         *  }
         * @return {Promise}
         */
        getProducts: function (opt) {
          var _opt = _.assignIn({}, defaultOpt, opt);

          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: {
              'keyword': _opt.keyword,
              'isOutStock': _opt.isOutStock,
              'makeType': _opt.makeType,
              'categoryIds': _opt.categoryIds,
              'brandIds':_opt.brandIds
            },
            success: function (data) {
              var products = data.list;
              _.chain(products)
                .each(function (p) {
                  p.price = parseFloat(p.price);
                  p.isSelected = false;
                  if(p.specificationValuesName == ''){
                    p.isHasSpecification = false;
                  }else{
                    p.isHasSpecification = true;
                  }
                  if(StringUtil.isEmpty(p.image)){
                    p.image = ENV.defaultImg;
                  }else {
                    p.image = Util.getFullImg(p.image);
                  }
                  /*判断单个商品是否能够选择，msg*/
                  if(!p.isMarketable || p.availableStock == 0 || p.quantity > p.availableStock || (p.isLimit ? 　p.quantity > p.limitNo : false)){
                    p.hasErr = true;
                    if(!p.isMarketable && !p.isBuyNotPutaway){
                      p.isSelected = false;
                      p.canClick = editPageFlag;
                      p.errMsg = '商品已下架';
                    } else if(p.availableStock == 0){
                      p.isSelected = false;
                      p.canClick = editPageFlag;
                      p.errMsg = '库存不足';
                    } else if(p.quantity > p.availableStock){
                      p.isSelected = false;
                      p.canClick = editPageFlag;
                      p.errMsg = '超过库存数';
                    } else {
                      p.isSelected = false;
                      p.canClick = editPageFlag;
                      p.errMsg = '限购' + p.limitNo + p.unit;
                    }
                  } else {
                    p.canClick = true;
                    p.isSelected = !editPageFlag;
                    p.hasErr = false;
                  }
                })
                .value();
              return products;
            }
          });
        },
        /**
         * 添加多个商品到采购单中
         * @param  {Array<Object>} params
         * {
         *  id: String|Number, 商品编号
         *  quantity: String|Number,  商品购买数量
         * }
         * @return {Promise}
         */
        addProducts: function(params) {
          return httpRequest({
            method: addProductConfig.method,
            url: addProductConfig.url,
            data: $httpParamSerializer({'list': JSON.stringify(params)})
          });
        },

        addProduct: function(param) {
          return httpRequest({
            method: addProductConfig.method,
            url: addProductConfig.url,
            data: $httpParamSerializer(param)
          });
        },

        /**
         *采购单删除单条记录
         * */
        removeSingle: function(id){
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data:$httpParamSerializer({ids: id})
            //success: function(rs){
            //  return rs;
            //}
          })
        },

        /**
         * 从采购单中删除商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return {Promise}
         */
        removeProduct: function(products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data: $httpParamSerializer({'ids': ids.join(',')})
          });
        },

        /**
         * 结算采购单列表商品
         *
        * */
        buyNow: function(products){
          var ids, quantitys;
          if(!angular.isArray(products)){
            ids = [products.id];
          }else {
            ids  = _.map(products, 'id');
            quantitys = _.map(products, 'quantity');
          }
          return httpRequest({
            method: directInfoConfig.method,
            url: directInfoConfig.url,
            data: $httpParamSerializer({'ids': ids.join(','),'quantitys': quantitys.join(',')}),
            success: function(data){}
          });
        },

        /**
         * 选择商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return this
           */
        select: function(products) {
          products = _.isArray(products) ? products : [products];
          _.each(products, function (product) {
            if(_.indexOf(state.selected, product.id) === -1 && product.isSelected) {
              state.sumPrice += product.price * product.quantity;
              state.selected.push(product.id);
            }
          });
          return self;
        },
        /**
         * 取消选择商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return this
           */
        unselect: function(products) {
          if (!products) {
            state.selected = [];
            state.sumPrice = 0;
            return;
          }
          products = _.isArray(products) ? products : [products];
          var ids = _.map(products, 'id');
          _.each(products, function (product) {
            if(_.indexOf(state.selected, product.id) !== -1) {
              state.sumPrice -= product.price * product.quantity;
            }
            if(state.sumPrice < 0) {
              state.sumPrice = 0;
              return false;
            }
          });
          _.pullAll(state.selected, ids);
          return self;
        },
        /**
         * 设置购买商品数量
         * @param product
         * @returns {Promise}
           */
        //setQuantity: function(product) {
        //  return self.addProduct({
        //    id: product.id,
        //    quantity: product.quantity
        //  });
        //},
        setQuantity: function(params) {
          return httpRequest({
            method: editQuantityConfig.method,
            url: editQuantityConfig.url,
            headers: {
              'Content-Type': 'application/json'
            },
            data:params
            //params: {
            //  productId: product.id,
            //  quantity: product.quantity
            //}
          });
        },
        /**
         * 获取当前采购单的状态
         * @returns {{selected: Array, sumPrice: number}}
         *   - **selected** – `{Array}` – 已选择的商品id
         *   - **selected** – `{number}` – 结算总价
         */
        getState: function () {
          return state;
        },

        /*清空state*/
        clearState: function(){
          state.selected = [];
          state.sumPrice = 0;
        },

        changeEditStatus:function(flag){
          if(flag!=null){
            editPageFlag = flag;
            return;
          }
          editPageFlag = !editPageFlag;
        }
      };
      return self;
    }
  ]);
