var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;

//Connecting to the DB
mongo.connect('mongodb://127.0.0.1/entries', function(err, db){
	if(err) throw err;

	//Collection
	var col = db.collection('entries');

	//Listening connection
	client.on('connection', function(socket){
		//Listening for user inputs
		socket.on('input', function(data){
			var regex = new RegExp("^" + data);

			col.aggregate([
			    {$match: { word: regex } },
			    {$project:{word: 1}},
			    {$group:{_id:"$word"}},
			    {$limit:20}
			], function(err, res){
				if(err) throw err;
				socket.emit('autoComp', res);
			});
		});

		//Listening for search
		socket.on('search', function(data){
			col.aggregate([
			    {$match: { word: data } }

			], function(err, res){
				if(err) throw err;
				socket.emit('result', res);
			});
		});		
	});
})