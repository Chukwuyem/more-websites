
$(document).ready(function(){
	console.log("We are ready");

	$("#comment_submit").click(function(){
		console.log("alright, a comment!");

		var comment = $("#comment_input").val();
		console.log(comment);
		$("#comment_input").val('');
	});
});