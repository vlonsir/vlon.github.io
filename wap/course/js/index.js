$(function() {
	(function(){
		if(location.search.indexOf("?") === -1) {
			$("a.add").removeClass("active");
		} else {
			var search = location.search.replace("?", "");
			if(search.indexOf("&") === -1) {
				$("a.add").removeClass("active");
			} else {
				var searchKey = search.split("&");
				if(searchKey[0].indexOf("=") === -1) {
					$("a.add").removeClass("active");
				} else {
					var nameArr = searchKey[0].split("=");
					if(searchKey[1].indexOf("=") === -1) {
						$("a.add").removeClass("active");
					} else {
						var passArr = searchKey[1].split("=");
						if(nameArr[1] === "vlon" && passArr[1] === "welcome") {
							$("a.add").addClass("active");
						} else {
							$("a.add").removeClass("active");
						}
					}
				}
			}
		}

		var list = getList();
		var html = template("listGroupTpl", {list: list});
		$("#listGroup").html(html);
		$("header").css("display","flex");
	})();

	$(document).delegate(".list-group-item", "click", function() {
		var v = {
			n: $(this).attr("name"),
			i: $(this).attr("id")
		}
		v.n = encodeURIComponent(v.n)
		location.href = `./type.html?name=${v.n}&id=${v.i}`
	})
})
function getList() {
	var load = layer.load(2);
	var list = [];
	$.ajax({
	  	"url": "https://d.apicloud.com/mcm/api/course?filter="+encodeURIComponent('{"fields":{}}'),
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
