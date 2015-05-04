(function(){
		
		
	if (!$) {
        throw ("component need jquery up 1.7XX");
    }
    if (!$.widget) {
        throw ("need jquery ui");
    }
	var uid=0;
	$.widget('ui.dynamiceEditInput',{
		version:'1.0.0',
		$el:null,
		$editDom:null,
		$historyTable:null,
		$inputDom:null,
		position:null,
		show:false,
		tpl:  "<div name='inputDom' style='display:none;position:absolute;height:65px'><div name='header' style='background-image: url(css/image/20141119142137.jpg);height:25px'></div><div name='body' style='background-image:url(./css/image/20141119142137.jpg);height:40px'></div></div>",
		options:{
			inputType:'text',//"text||select||date||textarea",
			inputCount:1,
			unit:"",
			historyData:null,
			opts:null,//[{text:xxx,value:xxx}] 
			targetType:'mouseover'//"mouseover||click||dbclick"
		},
		
		_create:function(){
			var self=this;		
			
			self._render();
			
		},
		
		_setupEvent:function(dom){
			var self=this;
			/**
			self.$editDom.click(function(e){ 
				self._createInput(); 
			});
			*/
			self.$editDom.live("click",function(){
				self._createInput(); 
			});
			if(self.options.targetType==="mouseover"){
				self.$el.hover(function(){
					
					//self.$editDom.show("normal");
					self.$editDom.show();
				},function(){
					//self.$editDom.hide("normal");
					self.$editDom.hide();
				});
			}else if(self.options.targetType==="click"){
				 
				self.$el.hover(function(){
					self.$editDom.show();
				},function(){
					self.$editDom.hide();
				});
			}else if(self.options.targetType==="dbclick"){
				 
				self.$el.hover(function(){
					self.$editDom.show();
				},function(){
					self.$editDom.hide();
				});
			}
			 
		},
		 
		_createInput:function(){
			if(this.show){
				this.$inputDom.slideUp(function(){
						$("#inputFream").remove();
				});
				this.show=false;
				return;
			} 
			var self=this,
				pos=self.$el.position(),
				height=pos.top+self.$el.height()+10,
				$inputDom=$(self.tpl).appendTo("body");
				
			self.$inputDom=$inputDom;
			$inputDom.offset({left:pos.left,top:height});
			$inputDom.slideDown();   
			self.show=true;
			if($inputDom.has("#inputFream").length===0){
				
				var html="<div id='inputFream'>&nbsp;&nbsp";
				for(var i=0;i<self.options.inputCount;i++){
						if(i===0){
							if(self.options.inputType==="date"){
								html+="<input name='content' style='width:80px' type='text'>";
							}else if(self.options.inputType==="select"){
								html+="<select name='content' style='width:80px' >";
								if(!self.options.opts){
									throw "opts 需要配置指定数据类型";
								}
								for(var i=0;i<self.options.opts.length;i++){
									var obj= self.options.opts[i];
									html+="<option value='"+obj.value+"'>"+obj.text+"</option>";
								}
								html+="</select>"; 
							}else if(self.options.inputType==="textarea"){
								html+="<textarea name='content' style='width:150px' type='"+self.options.inputType+"'/>";
							}else{
								html+="<input name='content' style='width:80px' type='"+self.options.inputType+"'>";
							}
						}else{
							if(self.options.inputType==="date"){
								html+="-<input name='content' style='width:80px' type='text'>";
							}else{
								html+="-<input name='content' style='width:80px' type='"+self.options.inputType+"'>";
							}
						}
						
					 
				}
				html+=self.options.unit+"&nbsp;&nbsp<button name='ok'>确定</button>&nbsp<button name='cancel' >取消</button><div>";
				$inputDom.children().eq(1).append(html);
				if(self.options.inputType==="date"){
					$("[name='content']").each(function(){
						 $(this).datepicker(); 
					});
				}
				$inputDom.find("[name='cancel']").eq(0).click(function(){
					$inputDom.slideUp(function(){
						$("#inputFream").remove();
						self.show=false;
					});
					 
				});
				$inputDom.find("[name='ok']").eq(0).click(function(){ 
					//self.$el;
					var content=""; 
					$inputDom.find("[name='content']").each(function(i){
						if(i===0){
							content+=$(this).val();
						}else{
							content+="-";
							content+=$(this).val();
						}
					});
					content+=self.options.unit;
					self.$el.text(content); 
					self.$el.append(self.$editDom);
					self.$el.append(self.$historyTable);
					$inputDom.slideUp(function(){
						self.show=false;
						$("#inputFream").remove();
					});
					 
				});
			} 
				 
		},
		
		_render:function(){
			var self=this,
				editId="edit_"+uid,
				html="&nbsp;<a id=edit_"+uid+">编辑</a>",
				editDom;
				
			self.$el=$(self.element); 
			self.$el.css("min-width: 333px;width:expression_r( document.body.clientWidth < 334 ? '333px' : 'auto");
			editDom=self.$el.append(html); 
			self.$el.find("a").hide();
			self.$editDom=$("#"+editId);
			self._renderHistoryTable();
			self._setupEvent(self.$editDom);
			uid++;
		},
		
		_renderHistoryTable:function(){
			var self=this,
				table;
			if(self.options.historyData){
				
				table="<div id='historyTable'><table border=1 style='background-color:#aaa;border: 1px solid #aaa;'>";
				for(var i=0;i<self.options.historyData.length;i++){
					table+="<tr><td>"+self.options.historyData[i].data+"</td><td>修改时间:"+self.options.historyData[i].date+"</td></tr>";
				}
				table+="</table></div>";
				self.$el.append(table);
				self.$historyTable=$("#historyTable");
			}
			 
		},
		
		getResult:function(){
			var self=this,
				resultArray=[];
			
			self.$inputDom.find("[name='content']").each(function(i){
				
				resultArray.push($(this).val());
			});
	
		}
	});

})();