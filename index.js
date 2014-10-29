
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express  = require('express');

var ids = []
    , idsData = [];

app.use(express.static(__dirname + '/data'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}
function sendTime() {
	data = toObject(ids);
	io.sockets.emit('playerGone',data);	
	}

	setInterval(sendTime, 1000);

io.on('connection', function(socket){
	socket.emit('boop');
	socket.on('beep', function(){
		console.log('beep!!!')
		socket.emit('boop');
	});

	socket.on("playerColor", function(data){
		console.log(data);
		io.sockets.emit("playerChangeColor",data);
	});


	//
socket.on('idAvailable',function(newId,available){
		console.log(newId);
		if(ids.indexOf(newId) === -1){
			console.log('id IS Available');	
			ids.push(newId); /// push new id 
			io.sockets.emit("idsOnline",ids,idsData);
			console.log('sended that a' + newId + "is created");
			available(true);
			socket.ids = newId;

			var data = {newId:newId};
			socket.emit('initPlayerUnity',data);

		}else{
			console.log('id is NOT Available');
			available(false);
		}
	});

	socket.on('controllerInput',function(data){
		console.log('controllerInput from ' + data.id 
			+" leftButton "+ data.leftButton
			+" rightButton "+ data.rightButton
			+" upButton "+ data.upButton
			+" downButton "+ data.downButton
			+" radians "+ data.radians
			+" dash "+ data.dash
			+" distance "+ data.distance
			+" screenWidth " + data.screenWidth
			+" tapped " + data.tapped
			);
			io.sockets.emit('controllerInputUnity',data);



	});



socket.on('disconnect',function(data){
		io.sockets.emit('disconnect','test');

		console.log('someDisconnected');
		console.log(socket.ids);
		console.log(ids)
		 if(!socket.ids) return; // al er niet is ga terug
		 ids.splice(ids.indexOf(socket.ids),1);
		 idsData.splice(idsData.indexOf(socket.ids))
		 console.log(ids);
	})

});



var port = process.env.PORT || 5000;

http.listen(port, function(){
  console.log('serverIsworkin2');
});

