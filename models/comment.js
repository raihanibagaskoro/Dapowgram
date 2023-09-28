'use strict';
const {
  Model
} = require('sequelize');
const {published} =require('../helpers/helper');    
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Comment.belongsToMany(models.Post)
      // Comment.belongsToMany(models.User)
    }
    get time() {
      return published(this.createdAt)
    }
  }
  Comment.init({
    content: DataTypes.STRING,
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};