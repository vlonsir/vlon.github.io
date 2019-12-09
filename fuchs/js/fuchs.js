$(function(){
	//提交电话号码
	$(".index .inp>button").on("click",function(){
		var v=$.trim($(".index .inp p input").val());
		if(!v){alert("请输入手机号"); return false;}
		if(v.length!=11 || !isPhone(v)){alert("手机号错误，请重新输入");return false;}
		localStorage.fuchsTelNumber=v;
		//location.href="user.html";	
		getScore(localStorage.fuchsTelNumber,$.trim($("#telCode").val()));	
	})
	//点击发送验证码
	$("#getTelCode").on("click",function(){
		var v=$.trim($(".index .inp p input").val());
		if(!v){alert("请输入手机号"); return false;}
		if(v.length!=11 || !isPhone(v)){alert("手机号错误，请重新输入");return false;}
		getTelCode(v);
	})
	//添加订单以便提升积分
	$(".user .body .d3 a").on("click",function(){
		if($(this).hasClass("on")){
			$(".user .body .d3 div").slideUp(300);
			$(this).removeClass("on");
		}else{
			$(this).addClass("on");
			$(".user .body .d3 div").slideDown(300);
		}
	})
	//输入订单号的输入框获取焦点时的事件
	$(".user .body .d3 div input").on("focus",function(){
		if(!$(this).hasClass("on")){
			$(this).addClass("on").val("");
		}
	})
	//输入订单号的输入框失去焦点时的事件
	$(".user .body .d3 div input").on("blur",function(){
		if($.trim($(this).val())==""){
			if($(this).index()==0){
				$(this).removeClass("on").val("请输入京东/天猫福斯旗舰店订单编号");
			}else{
				$(this).removeClass("on").val("请输入手机号");
			}
		}
	})
	//点击确定按钮提升积分   先验证
	$(".user .body .d3 div button").on("click",function(){
		var v=$(".user .body .d3 div input").val();
		if($.trim(v)=="" || v=="请输入京东/天猫福斯旗舰店订单编号"){
			alert("请输入京东/天猫福斯旗舰店订单编号");
		}else if($.trim(v).length<11){
			alert("订单号不存在");
		}else{//执行提升积分事件	
			upScoreValid(v);
		}
	})
	//验证时点击确定
	$(".user .validID div button").on("click",function(){
		if(!localStorage.fuchsTelNumber){alert("获取信息失败");location.href="index.html";}
		if(!$(this).attr("name")){alert("获取订单ID失败"); return false;}
		var code=$.trim($(".user .validID div input").val());
		if(code && code.length>=4){
			upScore($(this).attr("name"),localStorage.fuchsTelNumber,code);
		}else{
			if(!code){
				alert("请输入短信验证码");
			}
			if(code.length<4){
				alert("验证码错误");
			}
		}
		
	})
	
	//点击兑换按钮
	$(document).on("click",".list .body ul li .r .b a",function(){
		$(".list .convert .scoreInfo .payScore,.list .convert .convertInfo .info .r .b .score").html($(this).prev().html());
		$(".list .convert .convertInfo .info .r .t").html($(this).parent().prev().html());
		$(".list .convert .convertInfo .info img").attr("src",$(this).parent().parent().parent().find("img").attr("src"));
		$(".list .convert button").attr("name",$(this).attr("name"));
		$(".list .convert").animate({"left":"0"},300);
	})
	//关闭兑换窗口
	$(".list .convert .header a").on("click",function(){
		$(".list .convert").animate({"left":"100%"},300);
	})
	//点击提交订单按钮
	$(".list .convert button").on("click",function(){
		if(Number($(".list .convert .scoreInfo .myScore").html())<Number($(".list .convert .scoreInfo .payScore").html())){
			alert("您的积分不足");
		}else{
			if($.trim($(".list .convert .userInfo p input[type=text]").val())==""){ alert("请输入收货人"); return false; }
			if($.trim($(".list .convert .userInfo p input[type=tel]").val())==""){ alert("请输入联系电话"); return false; }
			if(!isPhone($.trim($(".list .convert .userInfo p input[type=tel]").val()))){ alert("联系电话号码错误"); return false; }
			if($.trim($(".list .convert .userInfo p textarea").val())==""){ alert("请输入收货地址"); return false; }	
			if(!$(this).attr("name")){alert("获取商品失败");return false;}
			if(!localStorage.fuchsTelNumber){alert("获取会员信息失败"); return false;}
			var address=$.trim($(".list .convert .userInfo p input[type=text]").val())+"，"+localStorage.fuchsTelNumber+"，"+$.trim($(".list .convert .userInfo p textarea").val());
			var productId=$(this).attr("name");
			var phone=localStorage.fuchsTelNumber;
			createOrder(address,productId,phone);
		}
	})
})
var basepath="http://base.weifeng360.com/fuchsScore/";
//var basepath="http://192.168.1.200:8080/moto/fuchsScore/";
function isPhone(text){
	var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
	if(!reg.test(text)){ 
	    return false; 
	}else{
		return true;
	} 
}

//提升积分  先验证
function upScoreValid(orderID){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"sendOrderSmsCode?callback=upScoreValidCB",
		data:{"orderid":orderID},
		dataType:"JSONP"
	})
}
function upScoreValidCB(data){
	removeLoading();
	if(data.code==1){
		$(".user .validID div button").attr("name",$(".user .body .d3 div input").val());
		$(".user .validID").fadeIn(300);
	}else{
		if(data.msg=="isv.BUSINESS_LIMIT_CONTROL"){
			alert("您的提交过于频繁，请稍后再试");
		}else{
			alert(data.msg);
		}
	}
}
//提升积分  再确定 
function upScore(orderID,tel,code){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"activateAccountScore?callback=upScoreCB",
		data:{"orderid":orderID,"phone":tel,"code":code},
		dataType:"JSONP",
		success:function(){},
		error:function(){},
		complete:function(data){console.log(data);}
	})
}
function upScoreCB(data){
	removeLoading();
	if(data.code==1){
		showPopAlert('y');
		localStorage.fuchsScore = data.msg;
		$(".user .body .d2 p").html(data.msg);
	}else{
		alert(data.msg);
	}
}
//通过手机号查积分
function getScore(telNumber,telCode){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"getAccountScore?callback=getScoreCB",
		data:{"id":telNumber,"code":telCode},
		dataType:"JSONP"
	})
}
function getScoreCB(data){
	if(data.code==1){
		if(data.msg.score){
			localStorage.fuchsScore = data.msg.score;
			//$(".user .body .d2 p").html(data.msg.score);
		}else{
			localStorage.fuchsScore=0;
			//$(".user .body .d2 p").html(0);
		}
		location.href="user.html";
	}else{
		alert("查询积分失败: "+data.msg);
	}
	removeLoading();
}
//显示新增积分成功或失败
function showPopAlert(flag){
	if(flag=="y"){
		$(".user .popAlert").addClass("y").fadeIn(300);
		localStorage.addList=true;
		//getScore(localStorage.fuchsTelNumber);
	}else if(flag=="n"){
		$(".user .popAlert").addClass("n").fadeIn(300);
	}
	setTimeout(function(){
		$(".user .popAlert").removeClass("y,n").fadeOut(300);
	},1500);
	setTimeout(function(){
		if(flag=='y'){location.href="order.html";}
	},2000);
}
//获取商品
function getProduct(){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"getProduct?callback=getProductCB",
		dataType:"JSONP"
	})
}
function getProductCB(data){
	if(data.code==1){
		var html=template("tpl_prod",{list:data.msg});
		document.getElementById("prod").innerHTML=html;
	}else{
		document.getElementById("prod").innerHTML=template("tpl_prod",{noContent:true});
	}
	removeLoading();
}
//用积分兑换商品
function createOrder(address,productId,phone){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"createOrder?callback=createOrderCB",
		data:{"address":address,"productId":productId,"phone":phone},
		dataType:"JSONP"
	})
}
function createOrderCB(data){
	if(data.code==1){
		localStorage.fuchsScore = data.msg;
		alert("订单提交成功");
		location.href="order.html";
	}else{
		alert(data.msg);
	}
	removeLoading();
}
//获取兑换记录
function getScoreLogByPhone(phone){
	popLoading("body");
	$.ajax({
		type:"post",
		url:basepath+"getScoreLogByPhone?callback=getScoreLogByPhoneCB",
		data:{"phone":phone,"type":2},
		dataType:"JSONP"
	})
}
function getScoreLogByPhoneCB(data){
	if(data.code==1){
		if(data.msg.list.length>0){
			var html=template("tpl_dhList",{list:data.msg.list});
			document.getElementById("dhList").innerHTML=html;
		}else{
			document.getElementById("dhList").innerHTML=template("tpl_dhList",{noContent:true});
		}
	}else{
		alert(data.msg);
		document.getElementById("dhList").innerHTML=template("tpl_dhList",{noContent:true});
	}
	removeLoading();
}
function getScoreLogByPhone2(phone){
	$.ajax({
		type:"post",
		url:basepath+"getScoreLogByPhone?callback=getScoreLogByPhone2CB",
		data:{"phone":phone,"type":1},
		dataType:"JSONP"
	})
}
function getScoreLogByPhone2CB(data){
	if(data.code==1){
		if(data.msg.list.length>0){
			var html=template("tpl_addList",{list:data.msg.list});
			document.getElementById("addList").innerHTML=html;
		}else{
			document.getElementById("addList").innerHTML=template("tpl_addList",{noContent:true});
		}
	}else{
		alert(data.msg);
		document.getElementById("addList").innerHTML=template("tpl_addList",{noContent:true});
	}
}
/*
 * 公共的loading方法
 * */
function popLoading(element){
	var bg='<div id="maskLoading" style="position:fixed;left:0;top:0;z-index:99999999;width:100%;height:100%;background:rgba(255,255,255,0.2);">'+
	'<div id="loading" style="width:50px;height:50px;position:absolute;left:50%;top:50%; z-index:2;margin:-25px 0 0 -25px;"><img src="http://www.weifeng360.com/mobiweifeng/common/images/loading.gif" width="50" height="50" alt="" /></div></div>';
	if($("#maskLoading").length>0){
		$("#maskLoading").remove();
	}else if($("#loading").length>0){
		$("#loading").remove();
	}else if($("#maskLoading").length==0 && $("#loading").length==0){
		$("body:eq(0)").append(bg);
		if(element=="body"){
			$("body:eq(0)");return false;
		}else{
			$(element).css("position","relative");
		}
	}
}
function removeLoading(){
	$("#maskLoading,#loading").remove();
}
//刷新，获取新的图片验证码
function getTelCode(tel) {
		popLoading("body");
		$.ajax({
			type:"post",
			url:basepath+"sendSmsCode?callback=getTelCodeCB",
			data:{"phone":tel},
			dataType:"jsonp"
		});
}
function getTelCodeCB(data){
	if(data.code==1){
		$("#getTelCode").html("短信已发送").attr("disabled","disabled").addClass("n");
	}else{
		if(data.msg=="isv.BUSINESS_LIMIT_CONTROL"){
			alert("您的提交过于频繁，请稍后再试");
		}else{
			alert(data.msg);
		}
	}
	removeLoading();
}