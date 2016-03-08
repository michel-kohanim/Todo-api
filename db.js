var Sequelize = require('sequelize' );
//NODE_ENV is in heroku
var env = process.env.NODE_ENV || 'development' ;
var sequelize;

if (env === 'production' /*heroku*/)
{ 
	sequelize = new Sequelize(process.env.DATABASE_URL, {
	//object. Define two things:
	dialect: 'postgres',
	});
}else{
	sequelize = new Sequelize(undefined, undefined, undefined, {
	//object. Define two things:
	dialect: 'sqlite',
	storage: __dirname + '/data/dev-todo-api.sqlite'
	});
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js' );
db.user = sequelize.import(__dirname + '/models/user.js' );
db.sequelize = sequelize;
db.Sequelize = Sequelize;
/**
Create associations
**/
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);


module.exports = db;

