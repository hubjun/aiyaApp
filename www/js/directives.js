'use strict';
angular.module('starter.directives', [])

  //返回顶部
  .directive('aiyaScrollTop', function() {
    return {
      restrict: "E",
      controller: function($scope) {
        $scope.kg = false;
      },
      link: function($scope, element, attr) {
        $(element).on("click", function() {
          console.log($(element).scrollTop())
          $("body").animate({
            scrollTop: 0
          }, 1000, function() {
            $scope.$apply($scope.kg = false)
          })
          $scope.$apply($scope.kg = true)
        })
      }
    }
  })

  /*页面预加载动画*/
  .directive('aiyaLoading', function() {
    return {
      restrict: 'AE',
      /*E:元素 A:属性  C:样式类 M:注释*/
      template: '<div class="aiya-loading"><ion-spinner icon="ios"></ion-spinner></div></div>',
      replace: true
    }
  })

  /*星星评分*/
  .directive("mystarselect", function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        level: '='
      },
      template: '<div id="mystarselect"></div>',
      link: function(scope) {
        function star5(starid) {
          var src = "img/";
          this.star_on_left = src + "star.png";
          this.star_off_left = src + "starBack.png";
          this.star_on_right = src + "star.png";
          this.star_off_right = src + "starBack.png";
          this.id = starid;
          this.point = 0;

          this.initial = starInitial;
          this.redraw = starRedraw;
          this.attach = starAttach;
          this.deattach = starDeAttach;
          this.doall = starDoall;
        }

        function starDoall(point) {
          this.initial();
          this.attach();
          this.redraw(point);
        }

        function starInitial() {
          var html = "<div style='float:left'>" +
            "<img id='star" + this.id + "_1' point='1' src='" + this.star_off_right + "'>&nbsp;";
          html += "<img id='star" + this.id + "_2' point='2' src='" + this.star_off_right + "'>&nbsp;";
          html += "<img id='star" + this.id + "_3' point='3' src='" + this.star_off_right + "'>&nbsp;";
          html += "<img id='star" + this.id + "_4' point='4' src='" + this.star_off_right + "'>&nbsp;";
          html += "<img id='star" + this.id + "_5' point='5' src='" + this.star_off_right + "'>" + "</div>";
          document.getElementById("mystarselect").innerHTML = html;
        }

        function starAttach() {
          for (var i = 1; i < 6; i++) {
            document.getElementById("star" + this.id + "_" + i).style.cursor = "pointer";
            document.getElementById("star" + this.id + "_" + i).onmouseover = moveStarPoint;
            document.getElementById("star" + this.id + "_" + i).onmouseout = outStarPoint;
            document.getElementById("star" + this.id + "_" + i).starid = this.id;
            document.getElementById("star" + this.id + "_" + i).onclick = setStarPoint;
          }
        }

        function starDeAttach() {
          for (var i = 1; i < 6; i++) {
            document.getElementById("star" + this.id + "_" + i).style.cursor = "default";
            document.getElementById("star" + this.id + "_" + i).onmouseover = null;
            document.getElementById("star" + this.id + "_" + i).onmouseout = null;
            document.getElementById("star" + this.id + "_" + i).onclick = null;
          }
        }

        function starRedraw(point) {
          for (var i = 1; i < 6; i++) {
            if (i <= point)
              if (parseInt(i / 2) * 2 == i)
                document.getElementById("star" + this.id + "_" + i).src = this.star_on_right;
              else
                document.getElementById("star" + this.id + "_" + i).src = this.star_on_left;
            else if (parseInt(i / 2) * 2 == i)
              document.getElementById("star" + this.id + "_" + i).src = this.star_off_right;
            else
              document.getElementById("star" + this.id + "_" + i).src = this.star_off_left;
          }
        }

        function moveStarPoint(evt) {
          var pstar = evt ? evt.target : event.toElement;
          var point = pstar.getAttribute("point");
          var starobj = new star5(pstar.starid);
          starobj.redraw(point);
        }

        function outStarPoint(evt) {
          var pstar = evt ? evt.target : event.srcElement;
          var starobj = new star5(pstar.starid);
          starobj.redraw(0);
        }

        function setStarPoint(evt) {
          var pstar = evt ? evt.target : event.srcElement;
          var starobj = new star5(pstar.starid);
          starobj.deattach();
          var n = pstar.getAttribute("point");
          console.log("选择的等级:" + n);
          scope.level = n;
          starobj.doall(n);
        }

        var star = new star5("point");
        star.doall(5);
      }
    };
  })

  //表单数字控件
  .directive("number", function(CommonUtil,purchaseOrderService) {
    return {
      restrict: 'E',
      require: '?ngModel',
      scope: {
        min: '=',
        max: '=',
        item: '=',
        onChange: '&'
      },
      template: '<div class="errMsg">{{item.errMsg}}</div>'+
        '<div class="ctr-number">' +
        '  <span class="button minus">－</span><span class="count"></span><span class="button plus">＋</span>' +
        '</div>',
      link: function(scope, element, attr, ngModel) {
        var countEle = $(element).find('.count'),
          minusEle = $(element).find('.minus'),
          plusEle = $(element).find('.plus'),
          min = parseInt(attr.min) || 1,
          max = scope.item.availableStock,
          errMsg = $(element).find('.errMsg');
        var item = scope.item;
        if(scope.item.isLimit && scope.item.limitNo<scope.item.availableStock){
          max = scope.item.limitNo;
        }
        console.log(scope.item.availableStock);
        var count = parseInt(countEle.text());
        if (isNaN(count)) {
          count = 1;
          countEle.html(count);
        }
        var minus = function() {
          if (count - 1 < min) return;
          --count;
        }
        var plus = function() {
          if(max && count + 1 > max){
            countEle.html(scope.item.quantity);
            plusEle.addClass("disabled");
            return;
          }
          ++count;
        };
        if (!ngModel) return;
        var onChange = function(){
          var product = {'productList':[{'productId': item.id,'quantity':item.quantity }]};
          purchaseOrderService.setQuantity(product).then(function(data){
            if(data.errMsg!=null && data.errMsg!=""){
              count = data.cartItem.quantity;
              countEle.html(count);
              errMsg.html(data.errMsg);
            }else{
              errMsg.html('');
            }
          });
        }

        var plusViewValue = function () {
          ++count;
          ngModel.$setViewValue(count);
          countEle.html(count);
          onChange();
        };
        var minusViewValue = function () {
          if (count - 1 < min) return;
          --count;
          ngModel.$setViewValue(count);
          countEle.html(count);
          onChange();
        };
        ngModel.$render = function() {
          count = ngModel.$viewValue;
          countEle.html(count);
        };
        minusEle.on('click', minusViewValue);
        plusEle.on('click', plusViewValue);
      }
    }
  })

  //form表单验证
  .directive('errorMsg', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$errorMsg = scope.$eval(attrs.errorMsg);
      }
    };
  })
  .directive('formValidate', [
    '$ionicLoading',
    function ($ionicLoading) {
      return {
        restrict: 'A',
        require: '^form',
        compile: function (element, attrs) {
          var submitHandle = attrs.ngSubmit;
          var validateForm = function (form) {
            var pass = true;
            _.each(form.$error, function (modelCtrs, condition) {
              _.each(modelCtrs, function (modelCtr) {
                pass = false;
                var errorMsg = modelCtr.$errorMsg ? modelCtr.$errorMsg[condition] : '';
                if(errorMsg) {
                  $ionicLoading.show({
                    template: errorMsg,
                    noBackdrop: true,
                    duration: 2000
                  });
                }
              });
              return pass;
            });
            return pass;
          };

          attrs.ngSubmit = function (scope) {
            if(validateForm(scope.$form)) {
              submitHandle && scope.$eval(submitHandle);
            }
          };

          return function (scope, ele, attr, form) {
            scope.$form = form;
          }
        }
      }
    }
  ])
  //密码一致性校验
  .directive('passwordConsistency', function () {
    return {
      restrict: 'A',
      require: ['ngModel', '^?form'],
      link: function (scope, element, attrs, ctrls) {
        var modelCtrl = ctrls[0], formCtrl = ctrls[1] || modelCtrl.$$parentForm;
        scope.$passwordConsistency || (scope.$passwordConsistency = []);
        scope.$passwordConsistency.push(attrs.ngModel);
        scope.$watch(attrs.ngModel, function () {
          var initialValue, error;

          var $errorMsg;
          _.each(scope.$passwordConsistency, function (model) {
            initialValue = initialValue ? initialValue : scope.$eval(model);
            error = initialValue !== scope.$eval(model);
            return !error;
          });
          if(error) {
            if(!formCtrl.$error.passwordConsistency) {
              formCtrl.$error.passwordConsistency = [{}];
            }
            $errorMsg = formCtrl.$error.passwordConsistency[0].$errorMsg;
            if(!$errorMsg) {
              formCtrl.$error.passwordConsistency[0].$errorMsg = {'passwordConsistency': modelCtrl.$errorMsg.passwordConsistency};
            }
          } else {
            delete formCtrl.$error.passwordConsistency;
          }
        })
      }
    }
  })

  .directive('navButton', [
    '$ionicPopover',
    function ($ionicPopover) {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope, element) {
          var template = '  <ion-popover-view class="nav-menu">'+
            '    <div class="nav-menu-nav" ng-click="navpop.hide()">'+
            '      <ul class="list">'+
            '        <li class="item ion-aiya" ui-sref="home">'+
            '          <i class="icon icon-left">&#xe608;</i>'+
            '          <span>首页</span>'+
            '        </li>'+
            '        <li class="item ion-aiya" ui-sref="purchaseOrderList">'+
            '          <i>&#xe60b;</i>'+
            '          <span>采购单</span>'+
            '        </li>'+
            '        <li class="item ion-aiya" ui-sref="user">'+
            '          <i>&#xe629;</i>'+
            '          <span>我</span>'+
            '        </li>'+
            '      </ul>'+
            '    </div>'+
            '  </ion-popover-view>';
          scope.navpop = $ionicPopover.fromTemplate(template, {'scope': scope});
          element.on('click', function () {
            document.body.classList.remove('platform-ios');
            document.body.classList.remove('platform-android');
            //使用ios的样式
            document.body.classList.add('platform-ios');
            scope.navpop.show(element);
          });
        }
      }
    }
  ])
  //商品品牌筛选
  .directive('brandCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    function ($ionicPopover, categoryService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          classifyName:'&'
        },
        controller: [
          '$scope',
          'brandService',
          function (scope) {
            var template = '  <ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content>'+
              '      <p ng-click="select()">全部分类 &gt;</p>'+
              '      <ion-list class="brandTypes">'+
              '        <ion-item class="brandType" ng-class="{active: bcf.currentValue() === item.id}" ng-click="select(item.id)" ng-repeat="item in firstCategory" >{{item.name}}</ion-item>'+
              '      </ion-list>'+
              '    </ion-content>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});
            this.currentValue = function () {
              return this.ngModel.$modelValue;
            };
            this.select = function (c) {
              this.ngModel.$setViewValue(c);
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel) {
          scope.bcf.ngModel = ngModel;
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
          //init
          categoryService.getFirstCategory().then(function (firstCategory) {
            scope.firstCategory = firstCategory;
          });
          //
          scope.select = function(id){
            scope.bcf.select(id);
            scope.exit();
          }
          element.on('click', function () {
            scope.bcf.filterpop.show(element);
          });
        }
      }
    }
  ])
  .directive('productCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    'StringUtil',
    function ($ionicPopover, categoryService, StringUtil) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          filter:'='
        },
        controller: [
          '$scope',
          '$ionicScrollDelegate',
          function (scope,$ionicScrollDelegate) {
            // ng-if="bcf.category.first === undefined || bcf.category.first === item.id"
            var template = '  <ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content delegate-handle="purchaseOrderScreenHandle">'+

              /* '      <div ng-if="selectedArray.length" class="brandTypesWrapper">'+
              '        <span>您已选择: </span>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType active" ng-repeat="item in selectedArray">{{item.name}} ' +
              '           <i ng-click="unselect(item)" class="ion-ios-close-empty unselect"></i>' +
              '          </ion-item>'+
              '        </ion-list>'+
              '      </div>'+*/
              '      <div class="brandTypesWrapper">'+
              '        <p>分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.first === item.id}" ng-repeat="item in firstCategory" ng-click="selectFirst(item)" ng-show="!(isNotEmpty(bcf.category.first) &&  bcf.category.first !== item.id)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div ng-if="isNotEmpty(bcf.category.first)"  class="brandTypesWrapper">'+
              '        <p>二级分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.second === item.id}" ng-repeat="item in secondCategory" ng-click="selectSecond(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div class="brandTypesWrapper" ng-hide="bcf.category.hidden.area">'+
              '        <p>产地</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.area === item.value}" ng-repeat="item in areas" ng-click="selectArea(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div class="brandTypesWrapper" ng-hide="bcf.category.hidden.brands">'+
              '        <p>品牌<button class="float-right button button-dark button-clear brandMore" ng-click="displayMoreBrands()" ng-bind="brandButtonTxt">更多</button></p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: contains(bcf.category.brands, item.id)}" ng-repeat="item in brands | limitTo:number" ng-click="selectBrand(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+

              '    </ion-content>'+
              '    <ion-footer-bar class="brandFooter">'+
              '      <div class="row pad-0">'+
              '        <button class="col-25 col-offset-75 button button-positive complete-button" ng-click="exit()">完成</button>'+
              '      </div>'+
              '    </ion-footer-bar>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});

            //查看更多按钮
            scope.brandButtonTxt = "更多";
            scope.number = 6;
            scope.displayMoreBrands = function () {
              if(scope.brandButtonTxt=="更多"){
                scope.brandButtonTxt = "收起";
                scope.number = ''
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              }else{
                scope.number = 6;
                scope.brandButtonTxt = "更多";
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              };
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel,$ionicScrollDelegate) {
          //init
          categoryService.getProductCategory({isShowAllBrand: true}).then(function (data) {
            scope.firstCategory = data.categoryList;
            scope.areas = data.makeTypes;
            scope.brands = data.brandList;
            //临时全部商品
            scope.tempBrands = data.brandList;
          });
          element.on('click', function () {
            scope.bcf.category = scope.filter;
            scope.bcf.category.brands = _.isArray(scope.bcf.category.brands) ? scope.bcf.category.brands : [scope.bcf.category.brands];
            if(StringUtil.isNotEmpty(scope.bcf.category.first)){
              categoryService.getSecondCategory(scope.bcf.category.first).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
            scope.bcf.filterpop.show(element);
          });

          var select = function (item) {
            var idx;
            if(item.multi) {
              scope.selectedArray.push(item);
            } else {
              idx = _.findIndex(scope.selectedArray, {type: item.type});
              idx === -1 ? scope.selectedArray.push(item) : scope.selectedArray.splice(idx, 1, item);
            }
          };
          var unselect = scope.unselect = function (item) {
            _.pull(scope.selectedArray, item);
            var selection = scope.bcf.category[item.type];
            _.isArray(selection) ? _.pull(selection, item) : scope.bcf.category[item.type] = null;
          };
          scope.selectedArray = [];
          scope.selectFirst = function (item) {
            scope.bcf.category.brands = [];
            if(_.isEqual(scope.bcf.category.first, item.id)){
              scope.bcf.category.first = null;
              scope.bcf.category.second = null;
              scope.brands = scope.tempBrands;
            }else{
              scope.bcf.category.first = item.id;
              categoryService.getSecondCategory(item.id).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
          };
          scope.selectSecond = function (item) {
            if(_.isEqual(scope.bcf.category.second,item.id)){
              scope.bcf.category.second = null;
            } else {
              scope.bcf.category.second = item.id;
            }
          };
          scope.selectArea = function (item) {
            if(_.isEqual(scope.bcf.category.area,item.value)){
              scope.bcf.category.area = null
            } else {
              scope.bcf.category.area = item.value;
            }
          };
          scope.selectBrand = function (item) {
            var brands = scope.bcf.category.brands ? scope.bcf.category.brands : scope.bcf.category.brands = [];
            if(scope.contains(brands, item.id)) {
              _.pull(brands,item.id);
            } else {
              brands.push(item.id);
            }
          };
          scope.contains = function (list, value) {
            list = list || [];
            return _.indexOf(list, value) !== -1;
          };

          scope.isNotEmpty = function(o){
            return StringUtil.isNotEmpty(o);
          };
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
        }
      }
    }
  ])

  //齿研社商品筛选
  .directive('toothCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    function ($ionicPopover, categoryService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          classifyName:'&'
        },
        controller: [
          '$scope',
          'brandService',
          function (scope) {
            var template = '<ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content>'+
              '      <p ng-click="select(147)">全部分类 &gt;</p>'+
              '      <ion-list class="brandTypes">'+
              '        <ion-item class="brandType" ng-class="{active:bcf.currentValue() === item.id}" ng-click="select(item.id)" ng-repeat="item in toothCategory" >{{item.name}}</ion-item>'+
              '      </ion-list>'+
              '    </ion-content>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});
            this.currentValue = function () {
              return parseInt(this.ngModel.$modelValue);
            };
            this.select = function (c) {
              this.ngModel.$setViewValue(c);
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel) {
          scope.bcf.ngModel = ngModel;
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
          //init
          var toothCategoryId = 147;
          categoryService.getSecondCategory(toothCategoryId).then(function (rs) {
            scope.toothCategory = rs.list;
          });
          //
          scope.select = function(id){
            scope.bcf.select(id);
            scope.exit();
          }
          element.on('click', function () {
            scope.bcf.filterpop.show(element);
          });
        }
      }
    }
  ])

  /*加入购物车and立即购买*/
  .directive('productSpecificationFilter',[
    '$rootScope',
    '$ionicModal',
    '$state',
    'index',
    'purchaseOrderService',
    '$ionicLoading',
    'productService',
    'orderService',
    'userService',
    'CommonUtil',
    'StringUtil',
    'Util',
    'ENV',
    function($rootScope,$ionicModal,$state,index,purchaseOrderService,$ionicLoading,productService,orderService,userService,CommonUtil,StringUtil,Util,ENV){
    return{
      restrict:'A',
      controller: [
        '$scope',
        function (scope) {
          $ionicModal.fromTemplateUrl('templates/categoryList/specificationModal.html', {
               scope: scope,
               animation: 'slide-in-up'
             }).then(function(modal) {
            scope.modal = modal;
          });
        }
      ],
      scope:{optionType:"@optionType",productId:"@productId"},/*子controller跟父controller通信*/
      controllerAs: 'psf',
      link: function (scope, element, attrs) {
        scope.imgUrl = ENV.imgUrl;
        scope.product = {
          id:scope.productId,
          quantity:1,
          specification:'',
          tempSpecification:''
        };
        element.on('click', function ($event) {
          $event.stopPropagation();//防止冒泡事件
          /*加载商品详情*/
          productService.getInfo(scope.product.id).then(function(data){
            scope.productInfo = data.product.productInfo;//商品详情
            _.assignIn(scope.productInfo,{stockTip:Util.getStockTip(scope.productInfo.availableStock)});
            scope.specification = data.product.specification;//商品规格详细信息
            scope.product.specification = scope.specification.spvId;
            scope.product.tempSpecification = scope.specification.spvId;
            scope.memberPrice = data.product.memberPrice;
            scope.productInfo.image = StringUtil.isEmpty(scope.productInfo.image) ? ENV.defaultImg : Util.getFullImg(scope.productInfo.image);
          },function(err){
            console.log(err);
          });
          scope.modal.show();
        });

        scope.addQuantity = function(){
          if((scope.productInfo.isLimit && scope.product.quantity >= scope.productInfo.limitNo) || scope.product.quantity >= scope.productInfo.availableStock){
            CommonUtil.tip('数量超过范围');
            return
          }
          scope.product.quantity ++;
        }

        scope.cutQuantity = function(){
          scope.product.quantity --;
          if(scope.product.quantity < 1 ){
            scope.product.quantity = 1;
            return;
          }
        }

        scope.changeStock = function(){
          var availableStock = scope.productInfo.availableStock;
          var quantity = scope.product.quantity;
          scope.product.quantity = parseInt(quantity);
          if(!quantity && availableStock == 0){
            scope.product.quantity = 0;
            return;
          }

          //当前限购数
          var restrictionNumber = scope.productInfo.limitNo;
          var _min = restrictionNumber>0 && restrictionNumber< availableStock ? restrictionNumber : availableStock;

          if (quantity > _min) {
            scope.product.quantity = _min;
            if(restrictionNumber>0){
              CommonUtil.tip('限购'+restrictionNumber+'件');
            }
          }
        }
        scope.judgeStock = function(number){
          if (isNaN(number) || (number < 1 && scope.productInfo.availableStock > 0)) {
            scope.product.quantity = 1;
          }
        };
        /*立即购买*/
        scope.buyNow = function(){
          if(!isLogin() || !hasSpec()){
            return;
          } else {
            var pending = true;
            if(pending){
              if(scope.productInfo.availableStock <= 0){
                CommonUtil.tip('您选购的商品库存不足');
                return;
              }
              scope.judgeStock(scope.product.quantity);
              pending = false;
              directBuyPrecheck().then(function(data){
                var product = {
                  ids:scope.product.id,
                  quantitys:scope.product.quantity
                }
                scope.closeSpecificationModal();
                orderService.setOrderProList(product);
                $state.go('orderOk');
              },function(err){
                scope.closeSpecificationModal();
                CommonUtil.tip(err);
              }).finally(function(){
                pending = true;
              });
            }
          }

        }
        /*加入采购单*/
        scope.joinCart = function() {
          if (!isLogin() || !hasSpec()) {
            return;
          } else {
            //防止重复添加
            var pending = true;
            if (pending) {
              if (scope.productInfo.availableStock <= 0) {
                CommonUtil.tip('您选购的商品库存不足');
                return;
              }
              scope.judgeStock(scope.product.quantity);
              pending = false;
              var params = {
                id: scope.product.id,
                quantity: scope.product.quantity
              }
              purchaseOrderService.addProduct(params).then(function () {
                //广播 更新购物车数量
                productService.purchaseCount().then(function(data){
                  scope.$emit('purchaseCounts',data != null ? data.cartquantity : '');
                  scope.closeSpecificationModal();
                  CommonUtil.tip('<h4>成功添加到采购清单</h4><h5>采购单共有'+ $rootScope.purchaseCounts+'件商品</h5>');
                });
              }, function (err) {
                scope.closeSpecificationModal();
                CommonUtil.tip(err);
              }).finally(function () {
                pending = true;
              });
            }
          }
        }
        /*确定按钮*/
        scope.goOrderProcess = function(){
          if('buyNow'== scope.optionType){
              scope.buyNow();
          }else{
              scope.joinCart();
           }
        }
        //点击规格
        scope.handleSpec = function(specItem){
          if(specItem.id == scope.product.tempSpecification){
            scope.product.specification  = '';
            scope.product.tempSpecification = '';
          }else{
            scope.product.id = specItem.productId;
            scope.product.tempSpecification= specItem.id;
            scope.productInfo = specItem;
            _.assignIn(scope.productInfo,{stockTip:Util.getStockTip(scope.productInfo.availableStock)});
            scope.productInfo.image =  StringUtil.isEmpty(scope.productInfo.productImage) ? ENV.defaultImg : Util.getFullImg(scope.productInfo.productImage);
            scope.memberPrice = specItem.memberPrice;
          }
        }
        /*判断是否有选中规格*/
        var hasSpec = function(){
          if(scope.specification.specificationValues == null || scope.specification.specificationValues == '' || (scope.product.specification != '' && scope.product.specification != null)){
            return true;
          } else {
            CommonUtil.tip('请选择商品属性');
            return false;
          }
        }
        var directBuyPrecheck = function(){
          var params = {
            id : scope.product.id,
            directQuantity : scope.product.quantity
          }
          return orderService.directBuyPrecheck(params);
        }
        var isLogin = function(){
          if(userService.isLogin()){
            return true;
          }else{
            scope.closeSpecificationModal();
            $state.go('login');
          }
        }
       scope.closeSpecificationModal = function(){
         scope.modal.hide();
      }
        scope.$on('$destroy',function(){
          scope.modal.remove();
        });
      }
    }
  }])

  .directive('focusMe',[
    '$timeout',
    '$parse',
    function($timeout,$parse){
    return {
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {
          if (value === true) {
            $timeout(function () {
              scope.$apply(model.assign(scope, false));
              element[0].focus();
            }, 30);
          }
        });
      }
  }
}]);

