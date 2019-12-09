$(function() {
	
	(function(){
		if(vlon.getValueByURI("id")){
			var id = vlon.getValueByURI("id");
			var list = getList(id)||[];
			var html = template("listGroupTpl", {list: list});
			$("#listGroup").html(html);
			$("header").css("display","flex");
		}

		if(vlon.getValueByURI("name")) {
			var name = decodeURIComponent(vlon.getValueByURI("name"));
			document.title = name;
			$("header span").html(name);
		}

	})();
	//点击章节
	$(document).delegate(".list-group-item", "click", function() {
		var v = {
			n: $(this).attr("name"),
			i: $(this).attr("id"),
			t: $(this).attr("data-type")
		};
		v.n = encodeURIComponent(v.n);
		location.href = `./class.html?name=${v.n}&id=${v.i}&title=${vlon.getValueByURI("name")}&type=${v.t}`;
	})
	//返回
	$(".back").on("click", function() {
		window.history.back();
	})
})
function getList(id) {
	var load = layer.load(2);
	var list = [];
	$.ajax({
	  	"url": "https://d.apicloud.com/mcm/api/type?filter="+encodeURIComponent('{"where":{"courseId":"'+id+'"}}'),
	  	"method": "GET",
	  	"cache": false,
	  	"async": false,
	  	"headers": vlon.headers,
	  	success: function(data, status, header){
	  		list = data;
	  		layer.close(load);
	  	},
	  	error: function(header, status, errorThrown){
	  		layer.close(load);
	  	}
	})
	return list;
}