define(function(require,exports,module){
	require('js/jQuery');
	require('js/cQuery');
	if(jQuery==undefined){
		throw("error:控件依赖jquery库！！");
	}
	if(cQuery==undefined){
			throw("error:控件依赖cquery 库！！");
	}
	// $target
    // update no $target
	jQuery.fn.demand=function(isTest){
		
		var demand;
		if(!this.length){
			throw("error:空节点无法初始化控件！！");
		}
		
		if(this.data("demand")==undefined){
			demand= new Demand(this, isTest);
			demand.init();
			this.data("demand",demand);
		}else{
			demand=this.data("demand");
		}
        cQuery("#demandArea").mask();
		return this;
	};
	function Demand(rootDom,isTest) {
		// 组将ID
		this.componentId=null,
		//提交url
		this.url=null,
		// 组件是否显示
		this.display=null;
		// 根 dom
		this.rootDom=rootDom;
		// 是否为测试环境
		this.isTest=isTest===undefined?true:isTest;
		
		if(this.rootDom==undefined){
			throw("error:没有缺省跟节点，无法渲染组件");
		}
		if(Demand._initialize==undefined){
			Demand.prototype.init=function () {
				 
				this.render();
				this._eventSetup();
				this._initWatermark();
				this._initSubmit();
				this._initTips();
			};
			Demand.prototype._eventSetup=function () {
				/**
				jQuery(".mc_btn1").eq(0).click(function () {
					var DestinationProduct = jQuery("#DestinationProduct").text();
					var JourneyDayProduct = jQuery("#JourneyDayProduct").text();
					jQuery("#Destination").val(DestinationProduct);
					jQuery("#DestinationDemand").text(DestinationProduct);
					jQuery("#JourneyDay").val(JourneyDayProduct);
					jQuery("#JourneyDayDemand").text(JourneyDayProduct);
					//jQuery('#startDamand').val(jQuery.trim(jQuery('#citySelector').text()));
					//jQuery('#startDamand').data("empty", false);
					jQuery('#TravelNature').data("empty", false);
					cQuery("#demandArea").mask();
				});
				*/
				jQuery("#demandArea").find(".imc_close").eq(0).click(function () {
					cQuery("#demandArea").unmask();
				});
			};
			//初始化下拉框交互
			Demand.prototype._initTips=function () {
				var timeStampType,
					timeStampTheme;
			   jQuery("#Theme,#themeArrow").click(function (e) {
					if (jQuery("#themeArrow").hasClass("i_arr_down")) {
						var pos = jQuery("#Theme").offset();
						jQuery("#themeDrop").slideDown("normal");
						jQuery("#themeDrop").offset({
							top: pos.top + jQuery("#Theme").parent().height(),
							left: pos.left
						});
						jQuery("#themeArrow").removeClass("i_arr_down");
						jQuery("#themeArrow").addClass("i_arr_up");
					} else {
						jQuery("#themeDrop").slideUp("normal");
						jQuery("#themeArrow").removeClass("i_arr_up");
						jQuery("#themeArrow").addClass("i_arr_down");
					}
					if(e.timeStamp===undefined){
						var data=new Date();
						e.timeStamp= data.getTime();
						timeStampTheme=e.timeStamp;
					}else{
						timeStampTheme= e.timeStamp;
					}
					e.preventDefault();
				});
				jQuery("#themeDropUl").find("li").click(function (e) {
					if (jQuery(this).hasClass("cur")) {
						jQuery(this).removeClass("cur"); 
						var str = jQuery("#Theme").val(); 
						var strRe = str.replace(jQuery(this).text()+",", ""); 
						jQuery("#Theme").val(strRe);
						if (!strRe) {
							jQuery("#Theme").data("empty", true);
						} 
					} else {
						jQuery("#Theme").val(jQuery(this).text() + "," + jQuery("#Theme").val());
						jQuery(this).addClass("cur");
						jQuery("#Theme").data("empty", false);
					}
					//jQuery("#themeDrop").show();
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
				});
	
				//////////////////////////////货币下拉框和业务类型下拉框处理////////////////////////////////////
				jQuery("#currency,#currencyArrow").click(function (e) {
					if (jQuery("#currencyArrow").hasClass("i_arr_down")) {
						var pos = jQuery("#currency").offset();
						jQuery("#currencySel").slideDown("fast");
						jQuery("#currencySel").offset({
							top: pos.top + jQuery("#currency").parent().height(),
							left: pos.left
						});
						jQuery("#currencyArrow").removeClass("i_arr_down");
						jQuery("#currencyArrow").addClass("i_arr_up");
					} else {
						jQuery("#currencySel").slideUp("fast");
						jQuery("#currencyArrow").removeClass("i_arr_up");
						jQuery("#currencyArrow").addClass("i_arr_down");
					}
	
				});
				jQuery("#currencySel").find("li").click(function () {
					jQuery("#currency").val(jQuery(this).text());
					jQuery("#currency").data("empty", false);
					jQuery("#currencySel").slideUp("fast");
					jQuery("#currencyArrow").removeClass("i_arr_up");
					jQuery("#currencyArrow").addClass("i_arr_down");
				});
				jQuery("#currency").focusout(function () {
					jQuery("#currencySel").slideUp("fast");
					jQuery("#currencyArrow").removeClass("i_arr_up");
					jQuery("#currencyArrow").addClass("i_arr_down");
				});
	
	
				jQuery("#TravelNature,#TravelNatureArrow").click(function (e) {
					if (jQuery("#TravelNatureArrow").hasClass("i_arr_down")) {
						var pos = jQuery("#TravelNature").offset();
						jQuery("#buinessTypeSel").slideDown("fast");
						jQuery("#buinessTypeSel").offset({
							top: pos.top + jQuery("#TravelNature").parent().height(),
							left: pos.left
						});
						jQuery("#TravelNatureArrow").removeClass("i_arr_down");
						jQuery("#TravelNatureArrow").addClass("i_arr_up");
					} else {
						jQuery("#buinessTypeSel").slideUp("fast");
						jQuery("#TravelNatureArrow").removeClass("i_arr_up");
						jQuery("#TravelNatureArrow").addClass("i_arr_down");
					}
					if(e.timeStamp===undefined){
						var data=new Date();
						e.timeStamp= data.getTime();
						timeStampType=e.timeStamp;
					}else{
						timeStampType= e.timeStamp;
					}
	
				});
	
				jQuery("#buinessTypeSel").find("li").click(function () {
	
					jQuery("#TravelNature").val(jQuery(this).text());
					jQuery("#TravelNature").data("empty", false);
					jQuery("#buinessTypeSel").slideUp("fast");
					jQuery("#TravelNatureArrow").removeClass("i_arr_up");
					jQuery("#TravelNatureArrow").addClass("i_arr_down");
	
				});
				/**
				jQuery("#TravelNature").focusout(function () {
					jQuery("#buinessTypeSel").slideUp("fast");
					jQuery("#TravelNatureArrow").removeClass("i_arr_up");
					jQuery("#TravelNatureArrow").addClass("i_arr_down");
					alert(1);
				});
				*/
				jQuery(document).on("click", function (e) {
					if (timeStampTheme=== undefined) {
						jQuery("#themeDrop").slideUp("normal");
						jQuery("#themeArrow").removeClass("i_arr_up");
						jQuery("#themeArrow").addClass("i_arr_down");
						//e.preventDefault();
					}else{
						timeStampTheme=undefined;
					}
					if(timeStampType===undefined){
						jQuery("#buinessTypeSel").slideUp("fast");
						jQuery("#TravelNatureArrow").removeClass("i_arr_up");
						jQuery("#TravelNatureArrow").addClass("i_arr_down");
					}else{
						timeStampType=undefined;
					}
				});
	
	
			};
			 // 初始化需求单水印功能
			Demand.prototype._initWatermark=function () {
				jQuery("#demandArea").find("input[type='text'] ,textarea").not('#UnConfirm').each(function (index) {
					//if (this.id = "UnConfirm") { return; }
					jQuery(this).data("watermark", jQuery(this).val());
					jQuery(this).data("empty", true);
					jQuery(this).focusin(function () {
						if (jQuery(this).data("empty")) {
							jQuery(this).val("");
						}
					});
					jQuery(this).keyup(function () {
						if (jQuery(this).val()) {
							jQuery(this).data("empty", false);
						} else {
							jQuery(this).data("empty", true);
						}
					});
					jQuery(this).focusout(function () {
						if (jQuery(this).data("empty")) {
							jQuery(this).val(jQuery(this).data("watermark"));
						}
	
					});
				});
				jQuery("#startWarn").hide();
				cQuery.mod.load('calendar', '6.0', function () {
					cQuery("#UnConfirm").regMod('calendar', '6.0', {
						options: { showWeek: false },
						listeners: { onChange: function (input, value) {
							jQuery("#UnConfirm").data("empty",false);
						} }
					});
				});
			};
			Demand.prototype._resetDamand=function(){
			// 清空theme 选中内容
				jQuery("#themeDropUl").find("li").each(function (e) {
	
					jQuery(this).removeClass("cur");
					var str = jQuery("#Theme").val();
					var strRe = str.replace(jQuery(this).text()+",", "");
					jQuery("#Theme").val(strRe);
					if (!strRe) {
						jQuery("#Theme").data("empty", true);
					}
	
				});
				////////////////////////清空普通输入框////////////////////////////
				jQuery("#Theme").val("");
				jQuery("#MinPersonNum").val("");
				jQuery("#MaxPersonNum").val("");
				jQuery("#MinBudget").val("");
				jQuery("#startDamand").val("");
				jQuery("#TravelNature").val("");
				jQuery("#ReferenceLine").val("");
				jQuery("#OtherRequirement").val("");
				jQuery("#UnConfirm").val("");
				jQuery("#ConpanyName").val("");
				jQuery("#Contactor").val("");
				jQuery("#Moblie").val("");
				jQuery("#Email").val("");
	
				 
				jQuery("#Theme").data("empty", true);
				jQuery("#MinPersonNum").data("empty", true);
				jQuery("#MaxPersonNum").data("empty", true);
				jQuery("#MinBudget").data("empty", true);
				jQuery("#startDamand").data("empty", true); 
				jQuery("#TravelNature").data("empty", true);
				jQuery("#ReferenceLine").data("empty", true);
				jQuery("#OtherRequirement").data("empty", true);
				jQuery("#UnConfirm").data("empty", true);
				jQuery("#ConpanyName").data("empty", true);
				jQuery("#Contactor").data("empty", true);
				jQuery("#Moblie").data("empty", true);
				jQuery("#Email").data("empty", true);
				jQuery("#demandWarn").hide();
			///////////////////////////////恢复水印////////////////////////////////
				jQuery("#Destination").val(jQuery("#Destination").data("watermark"));
				jQuery("#MinBudget").val(jQuery("#MinBudget").data("watermark"));
				jQuery("#ReferenceLine").val(jQuery("#ReferenceLine").data("watermark"));
				jQuery("#OtherRequirement").val(jQuery("#OtherRequirement").data("watermark"));
			};
			// 初始化提交校验功能
			Demand.prototype._validate=function () {
				var arr = jQuery("#demandArea").find("#MinBudget,input[name='needStart'],input[name='need']").toArray();
				 
				for (var i = 0; i < arr.length; i++) {
				 
					if(jQuery(arr[i]).data('empty')){
						return false;
					}
					if (jQuery.trim(jQuery(arr[i]).val()) === "") {
						return false;
					}
				}
				return true;
			};
			//需求单提交
		    Demand.prototype._initSubmit= function () {
				var self = this;
				jQuery("#orderSubmit").click(function () {
					if (self._validate()) {
						jQuery("#startWarn").hide();
						var data = {
							/////新增加的三个字段////
							PageId:	jQuery("#PageId").val(),
							ProductIDString: jQuery('#ProductIDString').val(),
							ProductTitle: jQuery('#ProductTitle').text(),
							/////新增加的三个字段////
							Destination: jQuery("#Destination").data("empty") ? "" : jQuery("#Destination").val(),
							Theme: jQuery("#Theme").val(),
							MinPersonNum: jQuery("#MinPersonNum").val(),
							MaxPersonNum: jQuery("#MaxPersonNum").val(),
							MinBudget: jQuery("#MinBudget").val(),
							MinJourneyDay: jQuery("#MinJourneyDay").val(),
							MaxJourneyDay: jQuery("#MaxJourneyDay").val(),
							TravelNature: jQuery("#TravelNature").data("empty") ? "" : jQuery("#TravelNature").val(),
							ReferenceLine: jQuery("#ReferenceLine").data("empty") ? "" : jQuery("#ReferenceLine").val(),
							OtherRequirement: jQuery("#OtherRequirement").data("empty") ? "" : jQuery("#OtherRequirement").val(),
							startDamand: jQuery("#startDamand").val(),
							UnConfirm: jQuery("#UnConfirm").val(),
							ConpanyName: jQuery("#ConpanyName").val(),
							Departure:jQuery("#startDamand").val(),
							Contactor: jQuery("#Contactor").val(),
							Moblie: jQuery("#Moblie").val(),
							Email: jQuery("#Email").val()
						};
						//console.log(data);test
						cQuery("#waiting").mask();
						var url=self.isTest?"../demandXHR/Demo":"http://vacations.ctrip.com/Mice-Channel-SiteUI/Hander/MiniMiceOrderHandler.ashx?Method=SaveMiniMiceRequirementOrder";
						jQuery.ajax({
							//url: 'http://vacations.ctrip.com/Mice-Channel-SiteUI/Hander/MiniMiceOrderHandler.ashx?Method=SaveMiniMiceRequirementOrder',
							//url:"../demandXHR/Demo",
							//type: "GET",
							//dataType: 'jsonp',
							//jsonpCallback:"jsonpcallback",
							url:url,
							data: data,  
							timeout:20000,
							error:function(ms){
								if(ms.statusText==="timeout"){
									cQuery("#waiting").unmask();
									cQuery("#fail").mask();
									jQuery("#fail").find("span").eq(0).html("请求超时!");
									jQuery("#fail").find(".mc_btn1,.imc_close").click(function () {
										//cQuery("#success").unmask();
										//cQuery("#demandArea").unmask();
										cQuery("#fail").unmask();
									}); 
								}
							},
							success: function (ms) {
								var msg=jQuery.trim(ms);
								console.log(arguments);
								cQuery("#waiting").unmask();
								if (msg == 'success') {
								
									var successTitle="需求单提交成功！",
										 successTitle1="需求单提交成功！工作时间：周一至周五09:00~17:00。 现在是非工作时间，资深的客户经理将会在下一个工作日第一时间联系您为您服务。",
										 d=new Date(); 
									if(d.getHours()>=17){
										jQuery("#success").find("span").eq(0).html(successTitle1);
									}else{
										jQuery("#success").find("span").eq(0).html(successTitle);
									}
									jQuery("#demandArea").hide(); 
									cQuery("#success").mask();
									jQuery("#success").find(".mc_btn1,.imc_close").click(function () {
										cQuery("#success").unmask();
										cQuery("#demandArea").unmask();
										self._resetDamand();
									});
									setTimeout(function () {
										cQuery("#success").unmask();
										cQuery("#demandArea").unmask();
										self._resetDamand();
									}, 10000);
								} else {
									cQuery("#fail").mask();
									if(msg==="A"){
										jQuery("#fail").find("span").eq(0).html("Email格式错误!");
									}else if(msg==="B"){
										jQuery("#fail").find("span").eq(0).html("联系电话填写错误!");
									}else{
										jQuery("#fail").find("span").eq(0).html("提交失败请重新提交!");
									}
									//提交失败请重新提交！
									jQuery("#fail").find(".mc_btn1,.imc_close").click(function () {
										//cQuery("#success").unmask();
										//cQuery("#demandArea").unmask();
										cQuery("#fail").unmask();
									}); 
								}
	
							}
						});
						 
					} else {
						jQuery("#startWarn").show();
					}
	
				});
	
			}
			// 渲染dom 到页面,单纯页面渲染，不使用underscore 类库
			Demand.prototype.render=function(){
				
				var self=this, order,currencySel,typeSel,successTip,failTip,waitTip;
				order="<div class='pop pop_more' id='demandArea' style='display:none'>"
					    +"<a href='#' class='imc_icon imc_close'></a>"
						+"<h3>定制需求<span>CUSTOMIZED</span></h3>"
						+"<div class='cus_left'>"
						+"<div>"
						+"<div class='more_need'>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*目的地</span>"
						+"	<p class='mc_select'>"
						+"        <input type='text' name='needStart'  id='Destination' value='多个目的地请以逗号或者分号隔开'/>"
						+"		<span id='DestinationDemand'></span>"
						+"	</p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*主题</span>"
						+"	<p>"
						+"      <span class='mc_select'><input type='text'  name='needStart' id='Theme' value='' readonly='readonly' ><i id='themeArrow' class='i_arr i_arr_down'></i></span>"
						+"	</p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*参团人数</span>"
						+"	<p class='mc_select'>"
						+"		<input type='text' value='' style='width: 112px;' name='needStart' id='MaxPersonNum'>"
						+"	</p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*预算</span>"
						+"	<input type='text' id='MinBudget' name='needStart' style='width: 112px;' value='请输入金额'>"
						+"    <em class='ex' style='text-align: center;display: inline-block;width: 35px;font: 18px/38px 'Microsoft Yahei''></em>"
						+"    <span class='mc_select f-black'>"
						+"         元/人"
						+"    </span>    "
						+"</div>"
						+"</div>"
						+"</div>"
						+"<div class='dot'>"
						+"<div class='more_need'>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*行程天数</span>"
						+"	<p class='mc_select'>"
						+"		<input type='text' value='' style='width: 112px;' name='needStart' id='MaxPersonNum'>"
						+"	</p>"
						+"</div>"
						+"<div class='s_need'>"
						+"	<span class='lb'>业务类型</span>"
						+"	<p class='mc_select'>"
						+"		<input type='text' value='公司包团' style='width:150px' readonly='readonly' id='TravelNature'  >"
						+"		<i class='i_arr i_arr_down' id='TravelNatureArrow' ></i>"
						+"	</p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>其他需求</span>"
						+"	<p><textarea id='OtherRequirement' "
                        +"style='width:410px;height: 73px; font: 16px/1.5 Microsoft Yahei; color: #666; border: 1px solid #C9CAC5; padding-left: 10px; background-color: #ECEDE8; overflow-y: scroll; resize:none'>请输入您对本次行程酒店、用餐、航班等相关要求，我们会尽快联系您（最多500个汉字）"
                        +"</textarea></p>"
						+"</div>"
						+"</div>"
						+"</div>"
						+"</div>"
						+"<div class='cus_right'>"
						+"<div class='more_need'>"
						+"<div class='s_need'>"
						+"	<span class='lb'>*出发地</span>"
						+"	<p class='mc_select'>"
						+"		<input id='startDamand' type='text' name='needStart' >		 "
						+"	</p>"
						+"</div>"
						+"<div class='s_need'>"
						+"	<span class='lb'>*出发时间</span>"
						+"	<p class='mc_select'>"
						+"		<input type='text' name='needStart'  id='UnConfirm' readonly='readonly'>"
						+"		<i class=''></i>"
						+"	</p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*公司名称</span>"
						+"	<p><input type='text' name='needStart'  value='请输入公司名称' id='ConpanyName'></p>"
						+"</div>"
						+"<div class='s_need'>"
						+"	<span class='lb'>*联系人</span>"
						+"	<p><input type='text' name='needStart'  value='请输入姓名' id='Contactor'></p>"
						+"</div>"
						+"<div class='s_need'>"
						+"	<span class='lb'>*联系电话</span><p><input type='text' name='needStart'  id='Moblie'></p>"
						+"</div>"
						+"<div class='l_need'>"
						+"	<span class='lb'>*E-mail</span>"
						+"    <p>"
						+"        <input type='text' name='needStart'  id='Email'>"
						+"        <span class='warn' id='startWarn'><i class='imc_icon imc_info'></i>*号内容为必填项</span> "
						+"    </p>"
						+"</div>"
						+"</div>"
						+"<p><a href='javascript:void(0)' class='mc_btn1' id='orderSubmit'>提交需求</a></p>"
						+"</div>"
						+"</div>";
						
				currencySel="<div class='drop drop3' id='currencySel' style='width:127px;position:absolute;z-index:9999;display:none' > "
						+"<ul>"
						+"    <li>RMB/人</li>"
						+"    <li>美元/人</li>"
						+"    <li>英镑/人</li>"
						+"    <li>日元/人</li>"
						+"</ul></div>";
				themeSel="<div class='drop drop2' id='themeDrop' style='position:absolute;z-index:9999;display:none'>"
						+"<ul  id='themeDropUl'>"
						+"<li><a href='#' class='imc_icon imc_check'></a><span>奖励旅游</span></li>"
						+"<li><a href='#' class='imc_icon imc_check'></a><span>高端定制</span></li>"
						+"<li><a href='#' class='imc_icon imc_check'></a><span>包团旅游</span></li> "
						+"</ul></div> ";
				typeSel="<div class='drop drop3' id='buinessTypeSel' style='width:150px;position:absolute;z-index:9999;display:none' > "
						+"<ul>"
						+"    <li>公司包团</li>"
						+"    <li>高端定制</li>"
						+"</ul></div>";		
				successTip="<div class='pop pop_status' style='display:none' id='success'>"
						+"<a href='javascript:void(0)' class='imc_icon imc_close'></a>"
						+"<p><i class='imc_icon imc_succ'></i><span>需求单提交成功！</span></p>"
						+"<p><a  href='javascript:void(0)' class='mc_btn1'>确定</a></p>"
						+"</div>";
				failTip="<div class='pop pop_status' style='display:none' id='fail'>"
						+"<a href='javascript:void(0)' class='imc_icon imc_close'></a>"
						+"<p><i class='imc_icon imc_fail'></i><span>提交失败请重新提交！</span></p>"
						+"<p><a href='javascript:void(0)' class='mc_btn1'>确定</a></p>"
						+"</div>";
				waitTip="<div class='pop pop_status' style='display:none' id='waiting'>"
						+"<p><i class='imc_icon imc_loading'></i>提交中，请耐心等待</p>"
						+"<p><a style='display:none' href='javascript:void(0)' class='mc_btn1'>确定</a></p>"
						+"</div> ";
						
				jQuery(self.rootDom).append(order);
				jQuery(self.rootDom).append(themeSel);
				jQuery(self.rootDom).append(typeSel);
				jQuery(self.rootDom).append(successTip);
				jQuery(self.rootDom).append(failTip);
				jQuery(self.rootDom).append(waitTip);
				 
				/**
				
				jQuery(order).appendTo(jQuery("body")); 
				jQuery(themeSel).appendTo(jQuery("body"));
				jQuery(typeSel).appendTo(jQuery("body"));
				jQuery(successTip).appendTo(jQuery("body"));
				jQuery(failTip).appendTo(jQuery("body")); 
				jQuery(waitTip).appendTo(jQuery("body"));
				
				rootDom.append(order);
				rootDom.append(themeSel);
				rootDom.append(typeSel);
				rootDom.append(successTip);
				rootDom.append(failTip);
				rootDom.append(waitTip);
				*/
				
			};
			
			Demand.prototype.destroy=function(){

				
			};
			Demand._initialize=true; 
		}

	}
    /**
    * 加载css以及创建div节点
     * 回调创建迷你需求单
    */
    var loadComponent = function(callback){

        /**
         * 判断是否加载过需求单，加载过则不再加载，直接显示
         */
        if(document.getElementById("demand") && document.getElementById("miniDemandCss")) {
            cQuery("#demandArea").mask();
            return;
        }

        var demandDiv = document.createElement("div");
        demandDiv.id = "demand";
        document.getElementsByTagName("body")[0].appendChild(demandDiv);

        var cssNode = document.createElement("link");
        /**
         * 此处是应为真实环境css地址
         * @type {string}
         */
        cssNode.href = "css/demand.css";
        cssNode.id = "miniDemandCss";
        cssNode.rel = "stylesheet";
        cssNode.type = "text/css";

        /*
         处理css动态加载完毕回调需求单,兼容性调整
         */
        if(cssNode.readyState){
            cssNode.onreadystatechange = function(){
                if(cssNode.readyState == "loaded" || cssNode.readyState == "complete" ) {
                    callback("demand","target",false);
                    jQuery("#target").trigger("click");
                }
            };
        } else {
            cssNode.onload = function(){
                callback("demand","target",false);
                jQuery("#target").trigger("click");
            };
        }

        document.getElementsByTagName("head")[0].appendChild(cssNode);
    };

    /**
	 * componentId: 控件生成的空dIV id
	 * isTest: 是否为测试环境
	 * */
	var initComponent = function(componentId,isTest){
        jQuery("#"+componentId).demand(false);
	};

    /**
     * 在加载css方法中回调初始化需求单
     */
    exports.show = function(){
        loadComponent(initComponent);
        //initComponent("demand","target",false);
    };
});