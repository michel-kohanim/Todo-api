var Sequelize = require('sequelize' );
var sequelize = new Sequelize(undefined, undefined, undefined, {
	//object. Define two things:
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database-sqlite'
});

var Todo = sequelize.define('todo' /*model name*/, {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			//notEmpty:true //can't have empty string
			len: [1,250] //length between 1 and 250
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false, //completed is false by default

	}
});

//if you add force: true, we can wipe it:
//sequelize.sync({force: true})...
sequelize.sync().then(function(){
	console.log('Everything is synched' );
	Todo.findById(2).then(function(todo){
		if (todo)
			console.log(todo.toJSON());
		else
			console.log ('nothing found by that id' );
	}, function(error){
		console.log ('nothing found by that id' );
	}).catch(function(error){
		console.log('catch - nothing found by that id')
	});
	/*
	Todo.create({
		description: 'Hello world',
		completed: true
	}).then(function(todo){
		return Todo.create({
			description: 'Promise crap'
		});
	}).then(function(){
		//return Todo.findById(1);
		return Todo.findAll({
			where:{
				//completed:false
				description: {
					$like: '%crap%'
				}
			}
		})
	}).then(function(todos){
		if (todos)
		{
			todos.forEach(function(todo)
			{
				console.log(todo.toJSON());
			});
		}
		else{
			console.log('Nothing found');
		}
	}).catch(function(e){
		console.log(e);
	});
	*/
});

