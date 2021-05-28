var layer;
var charCode = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
$(function(){

  if(location.search.indexOf("?") == -1) {
    location.href = "./login.html";
  } else {
    var search = location.search.replace("?", "");
    if(search.indexOf("&") == -1) {
      location.href = "./login.html";
    } else {
      var searchKey = search.split("&");
      if(searchKey[0].indexOf("=") == -1){
        location.href = "./login.html";
      } else {
        var nameArr = searchKey[0].split("=");
        if(searchKey[1].indexOf("=") == -1){
          location.href = "./login.html";
        } else {
          var passArr = searchKey[1].split("=");
          if(nameArr[1] === "vlon" && passArr[1] === "welcome") {
            
          } else {
            location.href = "./login.html";
          }
        }
      }
    }
  }

  layui.use("layer", function() {
    layer = layui.layer;
  })
	var swiper = new Swiper('.tabs-swiper', {
    	on: {
    		slideChangeTransitionEnd: function() {
    			$(".tab-ti a").eq(swiper.activeIndex).addClass("on").siblings().removeClass("on");
    		}
    	}
  });
  getKecheng();
  getPapers();
  //单选 多选 简答 论述 切换
  $(".tab-ti a").on("click", function() {
  	if(!$(this).hasClass("on")){
  		$(this).addClass("on").siblings().removeClass("on");
  		swiper.slideTo($(this).index(), 300, false);
  	}
  })
  //添加课程 添加试卷 切换
  $(".add-tabs .tab-item").on("click", function() {
    if(!$(this).hasClass("on")){
      $(this).addClass("on").siblings().removeClass("on");
      $(".add-wrapper .add-item").hide();
      $(".add-wrapper .add-item").eq($(this).index()).fadeIn(300);
    }
  })
  //打开 添加课程 添加试卷 弹窗
  $("header a.add").on("click", function() {
  	$(".modal").removeClass("n");
  })
  //关闭 添加课程 添加试卷 弹窗
  $(".modal .tabs a.close").on("click", function() {
  	$(".modal").addClass("n");
    $(".add-wrapper .add-item .kecheng").val("");
    $(".add-wrapper .add-item .type").val("");
    $(".shijuanList").html('<li><input type="text" placeholder="请输入试卷名" class="form-control"><a href="javascript:;" class="add"><i class="iconfont icon-add"></i></a></li>');
    $(".kechengMing").val("");
  })
  //在 添加试卷 弹窗 中 增加试卷名
  $(document).delegate(".modal .shijuanList li a.add","click", function() {
  	$(".modal .shijuanList").append('<li>'+
						'<input type="text" placeholder="请输入试卷名" class="form-control">'+
						'<a href="javascript:;" class="less"><i class="iconfont icon-minus"></i></a>'+
						'<a href="javascript:;" class="add"><i class="iconfont icon-add"></i></a>'+
					'</li>');
  })
  //在 添加试卷 弹窗 中 减去试卷名
  $(document).delegate(".modal .shijuanList li a.less", "click", function() {
  	$(this).parent("li").remove();
  })
  //保存 添加课程 或 添加试卷
  $(".modal .footer .btn").on("click", function() {
    if($(".add-tabs .tab-item.on").html()==="添加课程") {
      var v = $.trim($(".kechengMing").val());
      if(v) {
        saveClassName(v);
      } else {
        layer.msg("请输入课程名");
      }
    } else {
      var v = $(".add-wrapper .add-item .kecheng").val();
      if(!v){
        layer.msg("请先选择课程"); return false;
      }
      var t = $(".add-wrapper .add-item .type").val();
      if(!t){
        layer.msg("请先选择试卷类型"); return false;
      }
      var a = [];
      for(var i=0; i<$(".shijuanList li").length; i++) {
        var b = $.trim($(".shijuanList li").eq(i).find("input").val());
        if(b){
          a.push(b);
        }
      }
      if(a.length==0) {
        layer.msg("请输入试卷名"); return false;
      }
      savePaper(v,t,a);
    }
  });
  //当 选择课程 下拉框 改变时
  $("#kecheng").on("change", function() {
    var v = $(this).val();
    if(v) {
      $("#shijuan option").hide();
      $("#shijuan option:first-child, #shijuan option."+v).show();
    } else {
      $("#shijuan").val("");
    }
  });
  //当 选择试卷 下拉框 改变时
  $("#shijuan").on("change", function() {
    var v = $(this).val();
    if(v) { 
      getQuestionsById(v);
    } else {
      removeQuestionsItem();
    }
  });
  //单选题 选择 答案选项
  $(document).delegate(".single .choose-item .choose", "click", function() {
    if($(this).find(".iconfont").hasClass("icon-xuanzhong")) {
      $(this).find(".iconfont").removeClass("icon-xuanzhong").addClass("icon-xuanze");
      $(this).removeClass("active");
    } else {
      $(this).parent().parent().find(".choose .icon-xuanzhong").removeClass("icon-xuanzhong").addClass("icon-xuanze");
      $(this).find(".iconfont").removeClass("icon-xuanze").addClass("icon-xuanzhong");
      $(this).parent().parent().find(".choose.active").removeClass("active");
      $(this).addClass("active");
    }
  })
  //多选题 选择 答案选项
  $(document).delegate(".multiple .choose-item .choose", "click", function() {
    if($(this).find(".iconfont").hasClass("icon-duoxuan-yixuan")) {
      $(this).find(".iconfont").removeClass("icon-duoxuan-yixuan").addClass("icon-duoxuan-weixuan");
      $(this).removeClass("active");
    } else {
      $(this).find(".iconfont").removeClass("icon-duoxuan-weixuan").addClass("icon-duoxuan-yixuan");
      $(this).addClass("active");
    }
  })
  //单选题 增加 答案选项
  $(document).delegate(".single .choose-item .add", "click", function() {
    var html = "";
    var len = $(this).parent().parent().find(".choose-item").length;
    html = '<div class="choose-item">'+
                '<a href="javascript:;" class="choose">'+
                  '<i class="iconfont icon-xuanze"></i><span>'+charCode[len]+'</span>'+
                '</a>'+
                '<input type="text" placeholder="选项" class="form-control">'+
                '<a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>'+
              '</div>';
    $(this).parent().parent().append(html);
  })
  //多选题 增加 答案选项
  $(document).delegate(".multiple .choose-item .add", "click", function() {
    var html = "";
    var len = $(this).parent().parent().find(".choose-item").length;
    html = '<div class="choose-item">'+
                '<a href="javascript:;" class="choose">'+
                  '<i class="iconfont icon-duoxuan-weixuan"></i><span>'+charCode[len]+'</span>'+
                '</a>'+
                '<input type="text" placeholder="选项" class="form-control">'+
                '<a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>'+
              '</div>';
    $(this).parent().parent().append(html);
  })
  //单选题 或 多选题 减少 答案选项
  $(document).delegate(".single .choose-item .minus,.multiple .choose-item .minus", "click", function() {
    var li = $(this).parent().parent();
    $(this).parent().remove();
    var item = li.find(".choose-item");
    for(var i=0; i<item.length; i++) {
      item.eq(i).find(".choose span").html(charCode[i]);
    }
  })
  //单选题 增加题目
  $(".addSingleTimu button").on("click", function() {
    var html = `<li class="item">
                  <div class="timu">
                    <input type="text" placeholder="题目" class="form-control">
                    <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
                  </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-xuanze"></i><span>A</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set add"><i class="iconfont icon-add"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-xuanze"></i><span>B</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-xuanze"></i><span>C</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-xuanze"></i><span>D</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <input type="text" class="form-control analysis" placeholder="答案解析" />
            </li>`;
    $(html).insertBefore(".addSingleTimu");   
  });
  //多选题 增加题目
  $(".addMultipleTimu button").on("click", function() {
    var html = `<li class="item">
                <div class="timu">
                  <input type="text" placeholder="题目" class="form-control">
                  <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
                </div>  
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-duoxuan-weixuan"></i><span>A</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set add"><i class="iconfont icon-add"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-duoxuan-weixuan"></i><span>B</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-duoxuan-weixuan"></i><span>C</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <div class="choose-item">
                <a href="javascript:;" class="choose">
                  <i class="iconfont icon-duoxuan-weixuan"></i><span>D</span>
                </a>
                <input type="text" placeholder="选项" class="form-control">
                <a href="javascript:;" class="set minus"><i class="iconfont icon-minus"></i></a>
              </div>
              <input type="text" class="form-control analysis" placeholder="答案解析" />
            </li>`;
    $(html).insertBefore(".addMultipleTimu");   
  });
  //单选 多选题  简答题 论述题 删除当前题目
  $(document).delegate(".single .timu a, .multiple .timu a, .short .timu a, .discussion .timu a", "click", function() {
    $(this).parent().parent().remove();
  });
  //简答题 增加题目
  $(".short .addShortTimu button").on("click", function() {
    var html = `<li class="item">
              <div class="timu">
                <input type="text" placeholder="题目" class="form-control">
                <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
              </div>
              <textarea type="text" placeholder="答案" class="form-control" rows="10"></textarea>
            </li>`;
    $(html).insertBefore(".addShortTimu"); 
  });
  //论述题 增加题目
  $(".discussion .addDiscussionTimu button").on("click", function() {
    var html = `<li class="item">
              <div class="timu">
                <input type="text" placeholder="题目" class="form-control">
                <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
              </div>
              <textarea type="text" placeholder="答案" class="form-control" rows="10"></textarea>
            </li>`;
    $(html).insertBefore(".addDiscussionTimu"); 
  });
  //保存考题
  $("section .footer .save").on("click", function() {
    if(!$("#kecheng").val()){
      layer.msg("请选择课程");
      return false;
    }
    if(!$("#shijuan").val()){
      layer.msg("请选择试卷");
      return false;
    }
    var v = $("section .tab-ti a.on").html();
    var singleData = collectSingle();
    var multipleData = collectMultiple();
    var shortData = collectShort();
    var discussionData = collectDiscussion();
    if(!singleData && !multipleData && !shortData && !discussionData) {
      layer.msg("请录入考题");
    } else {
      var load = layer.load(2);
      var params = [];
      if(singleData && singleData.length>0){
        singleData.forEach(item => {
          params.push({
            "method": "POST",
            "path": "/mcm/api/questions",
            "body": item
          })
        })
      }
      if(multipleData && multipleData.length>0){
        multipleData.forEach(item => {
          params.push({
            "method": "POST",
            "path": "/mcm/api/questions",
            "body": item
          })
        })
      }
      if(shortData && shortData.length>0){
        shortData.forEach(item => {
          params.push({
            "method": "POST",
            "path": "/mcm/api/questions",
            "body": item
          })
        })
      }
      if(discussionData && discussionData.length>0){
        discussionData.forEach(item => {
          params.push({
            "method": "POST",
            "path": "/mcm/api/questions",
            "body": item
          })
        })
      }
      setTimeout(function(){
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/batch",
          "type": "POST",
          "cache": false,
          "headers": vlon.headers,
          "data": { "requests": params }
        }).done(function (data, status, header) {
            if(status === "success") {
              layer.msg("保存成功", function() {
                getCount($("#shijuan").val());
                $("ul.single>li.item, ul.multiple>li.item, ul.short>li.item, ul.discussion>li.item").remove();
                $("#kecheng, #shijuan").val("");
              });
            } else {
              layer.msg("保存失败");
              console.log(data, status, header);
            }
            layer.close(load);  
        }).fail(function (header, status, errorThrown) {
            console.log(header, status, errorThrown);
            layer.close(load); 
        })
      }, 500)
    }
  })
})
//保存课程名
function saveClassName(v) {
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/course",
      "method": "POST",
      "cache": false,
      "headers": vlon.headers,
      "data": { "name": v },
      success: function(data, status, header) {
        if(status === "success") {
          layer.msg("保存成功");
          $(".kechengMing").val("");
        } else {
          layer.msg("保存失败");
          console.log(data, status, header);
        }
        layer.close(load);     
      },
      error: function(header, status, errorThrown){
        console.log(header, status, errorThrown);
        layer.close(load);     
      }
  })
}
//保存试卷名
function savePaper(v,t,a) {
  var params = [];
  a.forEach(item => {
    params.push({
      "method": "POST",
      "path": "/mcm/api/type",
      "body": {
          "courseId": v,
          "name": item,
          "type": t
      }
    })
  })
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/batch",
      "type": "POST",
      "cache": false,
      "headers": vlon.headers,
      "data": {
        "requests": params
      }
  }).done(function (data, status, header) {
      if(status === "success") {
        layer.msg("保存成功", function() {
          $(".add-wrapper .add-item .kecheng").val("");
          $(".add-wrapper .add-item .type").val("");
          $(".shijuanList").html('<li><input type="text" placeholder="请输入试卷名" class="form-control"><a href="javascript:;" class="add"><i class="iconfont icon-add"></i></a></li>');
        });
      } else {
        layer.msg("保存失败");
        console.log(data, status, header);
      }
      layer.close(load);  
  }).fail(function (header, status, errorThrown) {
      console.log(header, status, errorThrown);
      layer.close(load); 
  })
}
function getKecheng() {
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/course?filter="+encodeURIComponent('{"where":{},"skip":0,"limit":10000}'),
      "method": "GET",
      "cache": false,
      "headers": vlon.headers,
      success: function(data, status, header){
        if(status === "success") {
          $("#kecheng, .modal .add-wrapper .add-item select.kecheng").html('<option value="">请选择课程</option>');
          var html = "";
          data.forEach(item => {
            html += '<option value="'+item.id+'">'+item.name+'</option>';
          })
          $("#kecheng, .modal .add-wrapper .add-item select.kecheng").append(html);
        } else {
          layer.msg("获取课程失败");
        }
        layer.close(load); 
      },
      error: function(header, status, errorThrown){
        layer.close(load); 
      }
  })
}
function getPapers() {
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/type?filter="+encodeURIComponent('{"where":{},"skip":0,"limit":10000}'),
      "method": "GET",
      "cache": false,
      "headers": vlon.headers,
      success: function(data, status, header){
        if(status === "success") {
          $("#shijuan").html('<option value="">请选择试卷</option>');
          var html = "";
          data.forEach(item => {
            html += '<option value="'+item.id+'" class="'+item.courseId+'">'+item.name+'</option>';
          })
          $("#shijuan").append(html);
        } else {
          layer.msg("获取课程失败");
        }
        layer.close(load); 
      },
      error: function(header, status, errorThrown){
        layer.close(load); 
      }
  })
}
//收集 单选题 题目
function collectSingle() {
  if($("ul.single li.item").length>0) {
    var singleData = [];
    var typeId = $("#shijuan").val();
    for(var i=0; i<$("ul.single li.item").length; i++) {
      var timu = $.trim($("ul.single li.item").eq(i).find("div.timu input").val());
      var analysis = $.trim($("ul.single li.item").eq(i).find(".analysis").val());
      var item = $("ul.single li.item").eq(i).find(".choose-item");
      var xuanxiang = [];
      var daan = [];
      for(var j=0; j<item.length; j++) {
        var c = item.eq(j).find(".choose span").html();
        var s = $.trim(item.eq(j).find("input").val());
        xuanxiang.push({"c": c, "n": s});
        if(item.eq(j).find(".choose").hasClass("active")){
          daan.push(item.eq(j).find(".choose.active span").html());
        }
      }
      if(timu && xuanxiang.length>0 && daan.length>0) {
        singleData.push({
          "typeId": typeId,
          "name": timu,
          "answer": xuanxiang,
          "analysis": analysis,
          "right": daan,
          "type": "single"
        })
      }
    }
    //console.log(singleData);
    return singleData;
  } else {
    return false;
  }
}
//收集 多选题 题目  
function collectMultiple() {
  if($("ul.multiple li.item").length>0) {
    var multipleData = [];
    var typeId = $("#shijuan").val();
    for(var i=0; i<$("ul.multiple li.item").length; i++) {
      var timu = $.trim($("ul.multiple li.item").eq(i).find("div.timu input").val());
      var analysis = $.trim($("ul.multiple li.item").eq(i).find(".analysis").val());
      var item = $("ul.multiple li.item").eq(i).find(".choose-item");
      var xuanxiang = [];
      var daan = [];
      for(var j=0; j<item.length; j++) {
        var c = item.eq(j).find(".choose span").html();
        var s = $.trim(item.eq(j).find("input").val());
        xuanxiang.push({"c": c, "n": s});
        if(item.eq(j).find(".choose").hasClass("active")){
          daan.push(item.eq(j).find(".choose.active span").html());
        }
      }
      if(timu && xuanxiang.length>0 && daan.length>0) {
        multipleData.push({
          "typeId": typeId,
          "name": timu,
          "answer": xuanxiang,
          "analysis": analysis,
          "right": daan,
          "type": "multiple"
        })
      }
    }
    //console.log(multipleData);
    return multipleData;
  } else {
    return false;
  }
}
//收集 简答题 题目
function collectShort() {
  if($("ul.short li.item").length>0) {
    var shortData = [];
    var typeId = $("#shijuan").val();
    for(var i=0; i<$("ul.short li.item").length; i++) {
      var timu = $.trim($("ul.short li.item").eq(i).find("div.timu input").val());
      var analysis = $.trim($("ul.short li.item").eq(i).find("textarea").val());
      if(timu && analysis) {
        shortData.push({
          "typeId": typeId,
          "name": timu,
          "answer": [],
          "analysis": analysis,
          "right": [],
          "type": "short"
        })
      }
    }
    //console.log(shortData);
    return shortData;
  } else {
    return false;
  }
}
//收集 论述题 题目
function collectDiscussion() {
  if($("ul.discussion li.item").length>0) {
    var discussionData = [];
    var typeId = $("#shijuan").val();
    for(var i=0; i<$("ul.discussion li.item").length; i++) {
      var timu = $.trim($("ul.discussion li.item").eq(i).find("div.timu input").val());
      var analysis = $.trim($("ul.discussion li.item").eq(i).find("textarea").val());
      if(timu && analysis) {
        discussionData.push({
          "typeId": typeId,
          "name": timu,
          "answer": [],
          "analysis": analysis,
          "right": [],
          "type": "discussion"
        })
      }
    }
    //console.log(discussionData);
    return discussionData;
  } else {
    return false;
  }
}
//查询当前试卷下的考题数
function getCount(id) {
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/questions/count?filter="+encodeURIComponent('{"where":{"typeId":"'+id+'"}}'),
      "method": "GET",
      "cache": false,
      "headers": vlon.headers,
      success: function(data, status, header){
        if(status === "success") {
          setCountByTypeId(id, data.count);
        } else {
          console.log(data, status, header);
          layer.msg("获取考题数失败");
        }
        layer.close(load); 
      },
      error: function(header, status, errorThrown){
        console.log(header, status, errorThrown);
        layer.close(load); 
      }
  })
}
//将考题数写入试卷表的对应试卷所在行的数量字段中
function setCountByTypeId(id, count) {
  var load = layer.load(2);
  $.ajax({
      "url": "https://d.apicloud.com/mcm/api/type/"+id,
      "method": "PUT",
      "cache": false,
      "data": { "count": count },
      "headers": vlon.headers,
      success: function(data, status, header){
        if(status === "success") {
          layer.msg("写入考题数成功");
        } else {
          console.log(data, status, header);
          layer.msg("写入考题数失败");
        }
        layer.close(load); 
      },
      error: function(header, status, errorThrown){
        console.log(header, status, errorThrown);
        layer.close(load); 
      }
  })
}
//根据试卷ID查询试卷下的试题
function getQuestionsById(id) {
  if(id) {
    var load = layer.load(2);
    $.ajax({
        "url": "https://d.apicloud.com/mcm/api/questions/?filter="+encodeURIComponent('{"where":{"typeId":"'+id+'"},"skip":0,"limit":10000}'),
        "method": "GET",
        "cache": false,
        "headers": vlon.headers,
        success: function(data, status, header){
          if(status === "success") {
            if(data && data.length>0) {
              var single = [], multiple = [], short = [], discussion = [];
              data.forEach(item => {
                if(item.type == "single") { single.push(item); }
                if(item.type == "multiple") { multiple.push(item); }
                if(item.type == "short") { short.push(item); }
                if(item.type == "discussion") { discussion.push(item); }
              })
              insertQuestionsToPage(single, multiple, short, discussion);
            } else {
              removeQuestionsItem()
            }
          } else {
            console.log(data, status, header);
          }
          layer.close(load); 
        },
        error: function(header, status, errorThrown){
          console.log(header, status, errorThrown);
          layer.close(load); 
        }
    })
  } else {
    removeQuestionsItem()
  }
}
//在页面上移除试题
function removeQuestionsItem() {
  if($(".single .item").length>0) {
    $(".single .item").remove()
  }
  if($(".multiple .item").length>0) {
    $(".multiple .item").remove()
  }
  if($(".short .item").length>0) {
    $(".short .item").remove()
  }
  if($(".discussion .item").length>0) {
    $(".discussion .item").remove()
  }
}
//将查询出来的试题，载入到页面中
function insertQuestionsToPage(single, multiple, short, discussion) {
  removeQuestionsItem();
  if(single.length>0) { insertSingle(single) }
  if(multiple.length>0) { insertMultiple(multiple) }
  if(short.length>0) { insertShort(short) }
  if(discussion.length>0) { insertDiscussion(discussion) }
}
//将单选试题插入页面
function insertSingle(list) {
  if(!list || list.length==0) {return false;}
  var html = "";
  list.forEach(item => {
    html += `<li class="item">
                  <div class="timu">
                    <input type="text" placeholder="题目" class="form-control" value="${item.name}">
                    <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
                  </div>`;
      if(item.answer && item.answer.length>0) {
        item.answer.forEach(a => {
          html += `<div class="choose-item">
                  <a href="javascript:;" class="choose ${item.right[0]==a.c ? 'active' : ''}">
                    <i class="iconfont ${item.right[0]==a.c ? 'icon-xuanzhong' : 'icon-xuanze'}"></i><span>${a.c}</span>
                  </a>
                  <input type="text" placeholder="选项" class="form-control" value="${a.n}">
                  <a href="javascript:;" class="set add"><i class="iconfont icon-add"></i></a>
                </div>`;
        })
      }     
              `<input type="text" class="form-control analysis" placeholder="答案解析" value="${item.analysis||''}" />
            </li>`;
    })
    $(html).insertBefore(".addSingleTimu"); 
}
//将多选试题插入页面
function insertMultiple(list) {
  if(!list || list.length==0) {return false;}
  var html = "";
  list.forEach(item => {
    html += `<li class="item">
                <div class="timu">
                  <input type="text" placeholder="题目" class="form-control" value="${item.name}">
                  <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
                </div>`;
      if(item.answer && item.answer.length>0) {
        item.answer.forEach(a => {
          var cls = '', icon = "icon-duoxuan-weixuan";
          if(item.right && item.right.length>0) {
            item.right.forEach(c => {
              if(c == a.c) {
                cls = "active";
                icon = "icon-duoxuan-yixuan"
              }
            })
          }
          html += `<div class="choose-item">
              <a href="javascript:;" class="choose ${cls}">
                <i class="iconfont ${icon}"></i><span>${a.c}</span>
              </a>
              <input type="text" placeholder="选项" class="form-control" value="${a.n}">
              <a href="javascript:;" class="set add"><i class="iconfont icon-add"></i></a>
            </div>`;
        })
      }
              
      html += `<input type="text" class="form-control analysis" placeholder="答案解析" value="${item.analysis||''}" />
      </li>`;
  })
  $(html).insertBefore(".addMultipleTimu");  
}
//将简答试题插入页面
function insertShort(list) {
  if(!list || list.length==0) {return false;}
  var html = "";
  list.forEach(item => {
    html += `<li class="item">
              <div class="timu">
                <input type="text" placeholder="题目" class="form-control" value="${item.name}">
                <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
              </div>
              <textarea type="text" placeholder="答案" class="form-control" rows="10">${item.analysis||''}</textarea>
            </li>`;
  })
  
    $(html).insertBefore(".addShortTimu"); 
}
//将论述试题插入页面
function insertDiscussion(list) {
  if(!list || list.length==0) {return false;}
  var html = "";
  list.forEach(item => {
    html += `<li class="item">
              <div class="timu">
                <input type="text" placeholder="题目" class="form-control" value="${item.name}" />
                <a href="javascript:;"><i class="iconfont icon-minus"></i></a>
              </div>
              <textarea type="text" placeholder="答案" class="form-control" rows="10">${item.analysis||''}</textarea>
            </li>`;
    $(html).insertBefore(".addDiscussionTimu"); 
  })
}