(function(){

	var search = function(){
		$("#word").autocomplete("close");
	
		socket.emit('search', $("#word").val());

		socket.on('result', function(data){
			var html = "";
			for(var element in data){
				html += "<p><span>"+data[element].wordtype+" </span>"+data[element].definition+"</p>"
			}
			$("#result").html(html);
		});

	};

	//Seggestion generator
	var suggestMe = function(request, response){
			
		socket.emit('input', request.term);

		var resp = [];

		socket.on('autoComp', function(data){
			for(var element in data){
			 	resp.push({"label": data[element]._id });
			}
			response(resp);
		});
	};



	//Connect to server/socket
	try{
		var socket = io.connect('http://127.0.0.1:8080');
	} catch(e) {
		// Set status to warn user
		console.log(e);
	}


	
	$("#word").autocomplete({
		source: suggestMe,
		select: search
	});

	$("#search").click(search);
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	        search();
	    }
	});

})();

