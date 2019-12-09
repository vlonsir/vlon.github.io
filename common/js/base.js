

//页面打开直接加载,作用：创建HTML5标签，兼容低版本浏览器
creatHTML5Element();
function creatHTML5Element(){var arr = new Array("header","footer","nav","section","aside","article","canvas","audio","bdi","command","datalist","details","dialog","embed","figcaption","figure","keygen","meter","output","progress","rp","rt","ruby","source","summary","time","track","video","wbr");for(var i=0;i<arr.length;i++){document.createElement(arr[i]);}}

var nowYears=new Date().getFullYear();//获取当前年份
$(function(){
	$("#NowYears").html(nowYears);	//往底部版权位置填充当前年份
})


//公共的loading方法
function popLoading(element){
	var str = '<div id="maskLoading" style="width:100%;height:100%;background:#fff;opacity:0.1;position:fixed;left:0;top:0;z-index:999999;"></div><div id="loading" style="width:50px;height:50px;position:absolute;left:50%;top:50%; z-index:1000;margin:-25px 0 0 -25px;"><img src="/templets/default/images/loading.gif" width="50" height="50" alt="" /></div>';
	$(element).css("position","relative").append(str);
}
function removeLoading(){
	$("#maskLoading,#loading").remove();
}


$(function(){
	$("#mNav li:nth-child(2) a").on("click",function(){
            if($(".articleList").css("display")=="none"){
                if($("#oDivBg").length==0){
                    $("body").append('<div id="oDivBg" style="position:fixed;top:0;left:0;z-index:199;width:100%;height:100%;background:#000;opacity:0.5;"></div>');
                }
                $(".articleList").show();
            }else{
                $("#oDivBg").remove();
                $(".articleList").hide();  
            }
        })
        $(document).on("click","#oDivBg",function(){           
            $(".articleList").hide(); 
            $(this).remove(); 
        })
})
