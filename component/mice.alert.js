(function(){
	if (!$) {
        throw ("component need jquery up 1.7XX");
    }
    if (!$.widget) {
        throw ("need jquery ui");
    }
	
	$.widget("ui.maskshow",{
		version:'1.0.0',
		defaultTpl:{
			pwd:"<div class='pop_box'><div class='pop_head'><h3>修改密码</h3><a href='#' class='pop_closed'></a></div><div><p class='text1'>密码修改成功!</p><p class='t_c text2'>恭喜您密码修改已成功，请继续您的旅程吧～</p><p class='t_c go_index'><a href='#'>&lt;&lt;返回首页</a></p></div></div>",
			userinfo:"<div class='pop_box'><div class='pop_head'><h3>账户信息</h3><a href='#' class='pop_closed'></a></div><div><p class='text1'>修改成功!</p><p class='t_c text2'>恭喜您信息已修改成功，快去登录开始您的旅程吧～</p><p class='t_c go_index'><a href='#'>&lt;&lt;返回首页</a></p></div></div>",
			register:"<div class='pop_box'><div class='pop_head'><h3>找回密码</h3><a href='#' class='pop_closed'></a></div><div><p class='text1 mt20'>密码发送成功!</p><p class='t_c go_index'><a href='#'>&lt;&lt;返回登录</a></p></div></div>",
			findpwd:"<div class='pop_box'><div class='pop_head'><h3>注册</h3><a href='#' class='pop_closed'></a></div><div><p class='text1 '>注册成功!</p><p class='t_c text2'>恭喜您已注册成功，快去登录开始您的旅程吧～</p><p class='t_c go_index'><a href='#'>&lt;&lt;返回登录</a></p></div></div>"
		},
		$showDom:null,
		$targetDom:null,
		options:{
			animate:{
				isAnimate:true,
				speed:"normal"//("slow","normal", or "fast")
			},
			defaultType:"pwd",//"pwd||userinfo||register||findpwd"
			tpl:null,
			layout:null
		},
		
		_baseTpl:function(content){
			var tpl="<div id='mask'><div class='pop_bg'></div>"+content+"</div>";
			return tpl
		},
		
		_render:function(){
			var self=this,
				html=self._baseTpl(self.defaultTpl[self.options.defaultType]);
			
			self.$targetDom=$(self.element);
			self.$showDom= self.$targetDom.append(html);
			self.$showDom.hide();
			$("[class='pop_closed']").eq(0).click(function(){
				self.hide();
			});
		},
		
		show:function(){
			var self=this;
			if(self.options.animate.isAnimate){
				self.$showDom.show(self.options.animate.speed);
			}else{	
				self.$showDom.show();
			}
			
		},
		
		hide:function(){
			var self=this;
			self._h();
		},
		
		hidden:function(){
			var self=this;
			self._h();
		},
		
		_h:function(){
			var self=this;
			if(self.options.animate.isAnimate){
				self.$showDom.hide(self.options.animate.speed);
			}else{	
				self.$showDom.hide();
			}
		},
		
		_create:function(){
			var self=this;
			self._render();
		}
	
	});

})();