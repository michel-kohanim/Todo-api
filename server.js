var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1; //increment ids

app.use(bodyParser.json());

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req, res){
	//console.log('param is ' + req.params.id + ' lenght of the array ' + todos.length);
	/*for (var i=0; i<todos.length; i++)
	{
		//you can also use parseInt(string, radix);
	//	console.log(todos[i]);
		if (todos[i].id == req.params.id) // === Number(req.params.id) == req.params.id) //)
		{
			res.json(todos[i]);
			return;
		}
	}*/
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if (matchedTodo)
		res.send(matchedTodo);
	else
		res.status(404).send('Id of ' + req.params.id + ' not found!');
});

app.delete('/todos/:id', function(req, res){
	//console.log('param is ' + req.params.id + ' lenght of the array ' + todos.length);
	/*for (var i=0; i<todos.length; i++)
	{
		//you can also use parseInt(string, radix);
	//	console.log(todos[i]);
		if (todos[i].id == req.params.id) // === Number(req.params.id) == req.params.id) //)
		{
			res.json(todos[i]);
			return;
		}
	}*/
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if (matchedTodo)
	{

		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	else
		res.status(404).json({"error":"no todo found with that id"});
});

app.put('/todos/:id', function(req, res){
	//console.log('param is ' + req.params.id + ' lenght of the array ' + todos.length);
	/*for (var i=0; i<todos.length; i++)
	{
		//you can also use parseInt(string, radix);
	//	console.log(todos[i]);
		if (todos[i].id == req.params.id) // === Number(req.params.id) == req.params.id) //)
		{
			res.json(todos[i]);
			return;
		}
	}*/
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if (matchedTodo)
	{
		var body = _.pick(req.body, 'description', 'completed');
		var validAttributes = {};
		if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
		{
			validAttributes.completed=body.completed;
		}else if (body.hasOwnProperty('completed'))
		{
			res.status(400).send();
			return;

		}

		if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0)
		{
			validAttributes.description=body.description;

		}else if (body.hasOwnProperty('description'))
		{
			res.status(400).send();
			return;
		}
		//everything went well. update the attributes
		_.extend(matchedTodo, validAttributes);
		res.json(matchedTodo);
	}
	else
		res.status(404).json({"error":"no todo found with that id"});
});

app.post('/todos', function(req, res){
	//pick only description and completed
	var body = _.pick(req.body, 'description', 'completed');
	//console.log(body);
	//var body=req.body;
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		res.status(400).send();
	}
	else{
		body.description = body.description.trim(); //remove the crap
		body.id=todoNextId++;
		todos.push(body);
		res.json(todos);
	}

});

app.get('/', function(req, res){
	res.send('Hello world' );
});

app.listen(PORT, function(){
	console.log('Express started and listening on port ' + PORT);
})
