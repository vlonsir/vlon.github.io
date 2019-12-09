$(function(){
	
	if(vlon.getValueByURI("title")) {
		var title = decodeURIComponent(vlon.getValueByURI("title"));
		document.title = title;
	}
	if(vlon.getValueByURI("name")) {
		var name = decodeURIComponent(vlon.getValueByURI("name"));
		$("header span").html(name);
	}
	setTimeout(() => {
		if(vlon.getValueByURI("type")) {
			var type = vlon.getValueByURI("type");
			if(type === "chapter") {
				$(".panel-heading span, .single .panel-footer").hide();
			} else if(type === "paper") {
				$(".panel-heading span, .single .panel-footer").show();
			}
		}
	}, 200)
	if(vlon.getValueByURI("id")) {
		var id = decodeURIComponent(vlon.getValueByURI("id"));
		getQuestions(id);
	}
	//选择单选答案
	$(document).delegate(".single .list-group-item", "click", function() {
		if($(this).hasClass("bg-success")) {
			$(this).removeClass("bg-success").find("i").removeClass("icon-yuanxingxuanzhongfill").addClass("icon-yuanxingweixuanzhong");
			$(this).parent("dd").parent("dl").removeClass("r");
		} else {
			if(!$(this).parent("dd").parent("dl").hasClass("r")){
				if($(this).attr("name")) {
					$(this).addClass("bg-success").find("i").removeClass("icon-yuanxingweixuanzhong").addClass("icon-yuanxingxuanzhongfill");
					$(this).parent("dd").prev("dt").find("span").html($(this).attr("name"));
					if(!$(this).parent("dd").parent("dl").hasClass("w")){
						$(this).parent("dd").parent("dl").addClass("r");
					}
				} else {
					$(this).addClass("bg-danger").find("i").removeClass("icon-yuanxingweixuanzhong").addClass("icon-guanbi2fill");
					$(this).parent("dd").prev("dt").find("span").html('<a href="javascript:;" class="reChoose">重选</a>');
					$(this).parent("dd").parent("dl").addClass("w");
				}
			}
		}
	})
	//选择多选答案
	$(document).delegate(".multiple .list-group-item", "click", function() {
		if($(this).hasClass("bg-success")) {
			var a = $(this).parent("dd").prev("dt").find("span").html();
			var b = $(this).attr("name");
			a = a.split("");
			a = a.filter(i=>i!=b);
			a = a.join("");
			$(this).parent("dd").prev("dt").find("span").html(a);
			$(this).removeClass("bg-success").find("i").removeClass("icon-fangxingxuanzhongfill").addClass("icon-fangxingweixuanzhong");
			$(this).parent("dd").parent("dl").removeClass("r");

		} else {
			if($(this).parent("dd").prev("dt").find(".reChoose").length==0){	
				if($(this).attr("name")) {
					$(this).addClass("bg-success").find("i").removeClass("icon-fangxingweixuanzhong").addClass("icon-fangxingxuanzhongfill");
					var a = $(this).parent("dd").prev("dt").find("span").html();
					var b = $(this).attr("name");
					if(a) {
						a = a.split("");
						a.push(b);
						var x = "";
						a.forEach((item, index) => {
							if(a[index+1] && (item.charCodeAt()>a[index+1].charCodeAt())) {
								x=item;
								a[index] = a[index+1];
								a[index+1] = x;
							}
						})
						a = a.join("");
					} else {
						a = b;
					}
					$(this).parent("dd").prev("dt").find("span").html(a);

					if(!$(this).parent("dd").parent("dl").hasClass("w")){
						$(this).parent("dd").parent("dl").addClass("r");
					}
				} else {
					$(this).addClass("bg-danger").find("i").removeClass("icon-fangxingxuanzhongfill icon-fangxingweixuanzhong").addClass("icon-duoxuan-cuo");
					$(this).parent("dd").prev("dt").find("span").html('<a href="javascript:;" class="reChoose">重选</a>');
					$(this).parent("dd").parent("dl").addClass("w");
				}
			}
		}
	})
	//查看解析
	$(document).delegate(".showAnalysis", "click", function() {
		if($(this).hasClass("open")) {
			$(this).parent("p").next(".analysis").slideUp(300);
			$(this).removeClass("open");
		} else {
			$(this).addClass("open");
			$(this).parent("p").next(".analysis").slideDown(300);
		}
	})
	//单选重选
	$(document).delegate(".single .reChoose", "click", function() {
		var dd = $(this).parent("span").parent("dt").next("dd");
		$(dd).find("a.bg-danger").find("i").removeClass("icon-guanbi2fill").addClass("icon-yuanxingweixuanzhong");
		$(dd).find("a.bg-danger").removeClass("bg-danger");
		$(this).remove();
	})
	//多选重选
	$(document).delegate(".multiple .reChoose", "click", function() {
		var dl = $(this).parent("span").parent("dt").parent("dl");
		$(dl).find("a.bg-danger").find("i").removeClass("icon-duoxuan-cuo").addClass("icon-fangxingweixuanzhong");
		$(dl).find("a.bg-danger").removeClass("bg-danger");
		$(dl).find("a.bg-success").find("i").removeClass("icon-fangxingxuanzhongfill").addClass("icon-fangxingweixuanzhong");
		$(dl).find("a.bg-success").removeClass("bg-success");
		$(this).remove();
	})
	//得分
	$(".result").on("click", function() {
		var a = $("dl").length;
		var r = $("dl.r").length;
		var w = $("dl.w").length;
		var n = a - r - w; 
		if(r>0){
			$(".res .r span.num").html(r);
			$(".res .r span.score").html(r*2);
			$(".res .r").fadeIn(300);
		} else {
			$(".res .r").hide();
		}
		if(w>0){
			$(".res .w span").html(w);
			$(".res .w").fadeIn(300);
		} else {
			$(".res .w").hide();
		}
		if(n>0){
			$(".res .n span").html(n);
			$(".res .n").fadeIn(300);
		} else {
			$(".res .n").hide();
		}
	})
	//返回
	$(".back").on("click", function() {
		window.history.back();
	})
	$(".panel-heading a").on("click", function() {
		if($(this).hasClass("slideUp")) {
			$(this).parent(".panel-heading").next(".panel-body").slideUp(500);
			$(this).removeClass("slideUp").addClass("slideDown");
			$(this).find("i").addClass("icon-moreunfold").removeClass("icon-less");
		} else {
			$(this).parent(".panel-heading").next(".panel-body").slideDown(500);
			$(this).removeClass("slideDown").addClass("slideUp");
			$(this).find("i").addClass("icon-less").removeClass("icon-moreunfold");
		}
	})
})
//设置单选框架高度
function setSingleHeight() {
	var h = window.innerHeight
		h1 = $("header").innerHeight(),
		h2 = $(".panel-heading").innerHeight(),
		h3 = $(".panel-footer").innerHeight(),
		h4 = h - h1 - h2 - h3 - 20;
	$("#single").css("height",h4+"px");
}
//通过试卷ID查询考题
function getQuestions(id) {
	var load = layer.load(2);
	$.ajax({
	  	"url": "https://d.apicloud.com/mcm/api/questions?filter="+encodeURIComponent('{"where":{"typeId":"'+id+'"},"skip":0,"limit":100}'),
	  	"method": "GET",
	  	"cache": false,
	  	"headers": vlon.headers,
	  	success: function(data, status, header){
	  		if(data && data.length>0) {
	  			setClassify(data);
	  			$(".none").addClass("n");
	  		} else {
	  			$(".multiple").hide();
	  			$(".none").removeClass("n");
	  		}
	  		layer.close(load); 
	  	},
	  	error: function(header, status, errorThrown){
	  		layer.close(load); 
	  	}
	})
}
function setClassify(list) {
	var single = [], multiple = [], short = [], discussion = [];
	list.forEach( item => {
		switch(item.type) {
			case "single": single.push(item); break;
			case "multiple": multiple.push(item); break;
			case "short": short.push(item); break;
			case "discussion": discussion.push(item); break;
		}
	})
	if(single.length>0) {
		getSingle(single);
	}
	if(multiple.length>0) {
		$(".panel.multiple").show();
		getMultiple(multiple);
	} else {
		$(".panel.multiple").hide();
	}
	if(short.length>0) {
		getShort(short);
	}
	if(discussion.length>0) {
		getDiscussion(discussion);
	}
}
//获取单选题
function getSingle(list) {
	var html = template("singleTpl", {list: list});
	$("#single").html(html);
	$("header").css("display","flex");
	$(".single").show();
	//setSingleHeight();
}
//获取单选题
function getMultiple(list) {
	var html = template("multipleTpl", {list: list});
	$("#multiple").html(html);
	$(".multiple").show();
}
//获取单选题
function getShort(list) {
	var html = template("shortTpl", {list: list});
	$("#short").html(html);
	$(".short").show();
}
//获取单选题
function getDiscussion(list) {
	var html = template("discussionTpl", {list: list});
	$("#discussion").html(html);
	$(".discussion").show();
}