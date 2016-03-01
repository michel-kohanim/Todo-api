var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;
var todos = [
/*{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false,
},
{
	id: 2,
	description: 'Go to market',
	completed: false,
},
{
	id: 3,
	description: 'Learn node.js',
	completed: true,
},*/
];

var todoNextId = 1; //increment ids

app.use(bodyParser.json());

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req, res){
	//console.log('param is ' + req.params.id + ' lenght of the array ' + todos.length);
	for (var i=0; i<todos.length; i++)
	{
		//you can also use parseInt(string, radix);
	//	console.log(todos[i]);
		if (todos[i].id == req.params.id) // === Number(req.params.id) == req.params.id) //)
		{
			res.json(todos[i]);
			return;
		}
	}
	res.status(404).send('Id of ' + req.params.id + ' not found!');
});

app.post('/todos', function(req, res){
	var body=req.body;
	body.id=todoNextId++;
	todos.push(body);
	res.json(todos);

});

app.get('/', function(req, res){
	res.send('Hello world' );
});

app.listen(PORT, function(){
	console.log('Express started and listening on port ' + PORT);
})