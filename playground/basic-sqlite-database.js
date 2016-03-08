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

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);
//if you add force: true, we can wipe it:
//sequelize.sync({force: true})...
sequelize.sync({force:true}).then(function(){
	console.log('Everything is synched' );
});

