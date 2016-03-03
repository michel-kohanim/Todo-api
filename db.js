var Sequelize = require('sequelize' );
var sequelize = new Sequelize(undefined, undefined, undefined, {
	//object. Define two things:
	dialect: 'sqlite',
	storage: __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js' );
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;

