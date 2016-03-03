module.exports = function(sequelize, DataTypes){

	return sequelize.define('user' /*model name*/, {
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate:{
			isEmail: true, //validates email addresses
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate:{
			len: [7,100]
			//check documente for validation for regular expressions
		}
	}
});

};