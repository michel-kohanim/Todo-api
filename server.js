var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db); //goes inside the routes

var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1; //increment ids

app.use(bodyParser.json());

app.get('/todos', middleware.requireAuthentication, function(req, res){

	var queryParams = req.query;
	var filter = {
		where: {
			userId:req.user.get('id')
		}
	};

	if (queryParams.hasOwnProperty('completed') && queryParams.completed==='true')
	{
		filter.where.completed = true;
	}
	else if (queryParams.hasOwnProperty('completed') && queryParams.completed==='false')
	{
		filter.where.completed = false;
	}

	if (queryParams.hasOwnProperty('description') && queryParams.description.trim().length > 0)
	{
		filter.where.description ={
					$like: '%'+queryParams.description+'%'
		}
	}


	db.todo.findAll(filter).then(function(todos){
		if (todos)
			res.json(todos);
		else
			res.status(404).send('Nothing found');
	}, function (error)
	{
		res.status(500).send(error);
	}
	).catch(function(e){
		res.status(500).send(error);
	});

	/*
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed==='true')
	{
		filteredTodos = _.where(todos, {completed:true});
	}
	else if (queryParams.hasOwnProperty('completed') && queryParams.completed==='false')
	{
		filteredTodos = _.where(todos, {completed:false});
	}

	if (queryParams.hasOwnProperty('description') && queryParams.description.trim().length > 0)
	{
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase().trim());
		});
	}
	res.json(filteredTodos);
	*/
});

app.get('/todos/:id', middleware.requireAuthentication, function(req, res){
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
	var filter = {
		where: {
			userId:req.user.get('id'),
			id:todoId
		}
	};
	db.todo.findOne(filter).then(function(todo){
		if (todo)
			res.json(todo);
		else
			res.status(404).send(todoId + ' Not found!');
	}, function(error)
		{
			res.status(500).send(error);
		}
	).catch(function(error){
			res.status(500).send(error);
	});
	/*
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if (matchedTodo)
		res.send(matchedTodo);
	else
		res.status(404).send('Id of ' + req.params.id + ' not found!');
	*/
});

app.delete('/todos/:id',middleware.requireAuthentication,  function(req, res){
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
	var filter = {
		where: {
			userId:req.user.get('id'),
			id:todoId
		}
	};
	db.todo.destroy(filter).then(function(todo){
		if (todo)
			res.json(todo);
		else
			res.status(404).send(todoId + ' Not found!');
	}, function(error)
		{
			res.status(500).send(error);
		}
	).catch(function(error){
			res.status(500).send(error);
	});
});

app.put('/todos/:id', middleware.requireAuthentication, function(req, res){
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
	var filter = {
		where: {
			userId:req.user.get('id'),
			id:todoId
		}
	};
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.update(body,filter).then(function(todo)
	{
		//returns an array
		if (todo && todo[0]===1)
			res.send('Successful!');
		else
			res.status(404).send(todoId + ' Not found!');

	},function(error){
			res.status(500).send(error);
	}).catch(function(error){
			res.status(500).send(error);
	});
	/*
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
	*/
});

app.post('/todos', middleware.requireAuthentication, function(req, res){
	//pick only description and completed
	var body = _.pick(req.body, 'description', 'completed');
	//console.log(body);
	//var body=req.body;

	db.todo.create(
		body
	).then(function(todo){
		if(todo)
		{
			req.user.addTodo(todo).then (function(){
				return todo.reload();
			}).then(function(todo){
				res.json(todo.toJSON());
			}); //create association
			//res.json(todo);
		}
		else
		{
			res.status(400).send();
		}
	}, function(){
		//failed
		res.status(500).send();
	}).catch(function(error){
		res.status(500).send(error);
	});
	/*
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		res.status(400).send();
	}
	else{
		body.description = body.description.trim(); //remove the crap
		body.id=todoNextId++;
		todos.push(body);
		res.json(todos);
	}*/

});

app.get('/', function(req, res){
	res.send('Hello world' );
});

app.post('/users', function(req, res){
	//pick only description and completed
	var body = _.pick(req.body, 'email', 'password');
	console.log(body);
	//var body=req.body;

	db.user.create(
		body
	).then(function(user){
		if(user)
		{
			res.json(user.toPublicJSON());
		}
		else
		{
			res.status(400).send('could not create user');
		}
	}, function(e){
		//failed
		res.status(500).send(e);
	}).catch(function(error){
		res.status(500).send(error);
	});

});

//post /users/login

app.post('/users/login', function(req, res){
	var userInstance;

	db.user.authenticate(req.body).then(function(user){
		var token = user.generateToken('authentication');
		userInstance=user;
		return db.token.create({
			token:token
		});
		/*
		if (token)
			res.header('Auth', token).send(user.toPublicJSON());
		else
			res.status(401).send('Invalid Username/passowrd');
		*/

	}).then(function(tokenInstance)
	{
		res.header('Auth', tokenInstance.get('token')).send(userInstance.toPublicJSON());
	}).catch(function (error){
		res.status(401).send('Invalid Username/passowrd');
	});
	/*
	var body = _.pick(req.body, 'email', 'password');
	console.log(body);
	//var body=req.body;

	if (typeof body.email !== 'string' || typeof body.password!=='string')
	{
		res.status(400).send('Invalid input');
		return;
	}
	var filter = {
		where: {
			email: body.email
		}
	};

	db.user.findOne(filter).then(function(user){
		if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
			res.status(401).send('Invalid username/password');
			return;
		}
		res.send(user.toPublicJSON());
	}, function (error)
	{
		res.status(500).send(error);
	}
	).catch(function(e){
		res.status(500).send(error);
	});
	*/

});

app.delete('/users/login', middleware.requireAuthentication, function (req,res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function(){
		res.status(500).send();
	})

});

db.sequelize.sync(/*{force:true}*/).then(function(){
app.listen(PORT, function(){
	console.log('Express started and listening on port ' + PORT);
});
})

