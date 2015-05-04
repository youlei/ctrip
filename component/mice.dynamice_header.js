(function () {


    if (!jQuery) {
        throw ("dependent on up jquery1.7XX");
        return;
    }
    if (!jQuery.widget) {
        throw ("dependent on jquery-ui");
        return;
    }
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month 
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
            "S": this.getMilliseconds() //millisecond 
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.jQuery1, (this.getFullYear() + "").substr(4 - RegExp.jQuery1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.jQuery1, RegExp.jQuery1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    var uid = 0;
    jQuery.widget('ui.dynamicheader', {
        version: '1.0',
        $el:null,
        options: {
             dataStore:[{text:'分配项目',value:'',check:true},{text:'认领项目',value:'',check:false},{text:'项目报价',value:'',check:false},{text:'未成团',value:'',check:false},{text:'项目成团',value:'',check:false},{text:'包团婉拒',value:'',check:false}],
			 status:0// 0 1 2 3 4
			 
        },

		_render:function(){
			this._renderImg();
			this._renderStatus();
		},
		
		_renderImg:function(){
			var self=this,
				html;
				
			self.$el.empty();
			for(var i=0;i<self.options.dataStore.length;i++){
				var data=self.options.dataStore[i];
				if(data.check){
					html= "<div name='selectImg' style='overflow:hidden;cursor:pointer;width:75px;float:left;background-image:url(css/image/2.png);'><font size=2>"+data.text+"</font></div>";
				}else{
					html= "<div name='selectImg' style='overflow:hidden;width:75px;float:left;background-image:url(css/image/1.png);'><font size=2>"+data.text+"</font></div>";
				}
			    
				$(html).appendTo(self.$el);
			}
			
		},
		
		 _renderStatus:function(text){
			var self=this,
				content="状态："+(text||self.options.status),
				html="<div><b id='status'>"+content+"</b></div>";
			self.$el.find("#status").empty();
			$(html).appendTo(self.$el);	
			 
		},
		
		_resetStore:function(){
			var self=this;
			for(var i=0;i<self.options.dataStore.length;i++){
				self.options.dataStore[i].check=false; 
			}
		
		},
		
		setSelect:function(p){
			var self=this;
			
			if($.isNumeric(p)){
				//_renderImg
				if(!(p<=self.options.dataStore.length-1)){
					throw("下标越界");
				}
				self._resetStore();
				self.options.dataStore[p].check=true;
				self._renderImg();
			}else{
				var flag=false;
				for(var i=0;i<self.options.dataStore.length;i++){
					if(self.options.dataStore.text===p){
						flag=true;
						self.options.dataStore[i].check=true;
						break;
					}
				}
				if(!flag){
					throw("没有该项信息");
				}
				self._resetStore();
				self._renderImg();
			
			}
		
		},
		
		setStatus:function(text){
			this._renderStatus(text);
		},
		
		getSelected:function(){
			var self=this,
				index;
			for(var i=0;i<self.options.dataStore.length;i++){
				if(self.options.dataStore[i].check){
					index=i;
				}
			}
			return this.$el.find("[name=selectImg]").eq(index);
		},
		
        _create: function () {
            var self = this;
			
			self.$el=$(self.element);
            self._render(true);

        }
    });

})();

