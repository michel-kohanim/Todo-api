//new format format for Sequelize
module.exports = function(sequelize, DataTypes){

	return sequelize.define('todo' /*model name*/, {
	description: {
		type: DataTypes.STRING,
		allowNull: false,
		validate:{
			//notEmpty:true //can't have empty string
			len: [1,250] //length between 1 and 250
		}
	},
	completed: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false, //completed is false by default
	}
});

};