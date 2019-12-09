$(function(){
	$("#file").on("change", function(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			$("#v").attr("src", this.result).fadeIn(300);
			$(".i span").fadeOut(300);
		};
	})
	$("#save").on("click", function() {
		
	})
})