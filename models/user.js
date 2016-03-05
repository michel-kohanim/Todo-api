var bcrypt = require('bcrypt');
var _ = require('underscore');
module.exports = function(sequelize, DataTypes){

	var user = sequelize.define('user' /*model name*/, {
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate:{
			isEmail: true, //validates email addresses
		}
	},
	salt:{
		type: DataTypes.STRING
	},
	password_hash:{
		type: DataTypes.STRING
	},
	password: {
		type: DataTypes.VIRTUAL,
		allowNull: false,
		validate:{
			len: [7,100]
			//check documente for validation for regular expressions
		},
		set: function(value)//calls plaintext password
		{
			var salt = bcrypt.genSaltSync(10);
			var hashedPassword = bcrypt.hashSync(value, salt);
			this.setDataValue('password', value);
			this.setDataValue('salt', salt);
			this.setDataValue('password_hash', hashedPassword);
		}
	}
}, {
	hooks:{
		beforeValidate: function(user, option){
			if (typeof user.email !== 'undefined' && typeof user.email === 'string')
			{
				user.email = user.email.toLowerCase();
			}
		}
	},
	instanceMethods:{ 
		toPublicJSON: function(){
			var json = this.toJSON();
			return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
		}
	},
	classMethods:{
		authenticate: function(body){
			body = _.pick(body, 'email', 'password');
			console.log(body);
			//var body=req.body;
			return new Promise(function(resolve, reject){
				if (typeof body.email !== 'string' || typeof body.password!=='string')
				{
					console.log(' invalid crap');
					return reject();
				}
				var filter = {
					where: {
						email: body.email
					}
				};

				user.findOne(filter).then(function(foundUser){
					if (!foundUser || !bcrypt.compareSync(body.password, foundUser.get('password_hash'))){
						return reject();
					}
					console.log(' returning');
					console.log(foundUser);
					return resolve(foundUser);
				}, function (error)
				{
					return reject();
				}
				).catch(function(e){
					return reject();
				});
			});
		}
	}
});
	return user;
};