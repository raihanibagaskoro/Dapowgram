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
      Comment.belongsTo(models.Post);
      Comment.belongsTo(models.User);
    }
    get time() {
      return published(this.createdAt)
    }
    showRank() {
      if(this.totalLike === 0) {
        return "Suck!"
      } else if (this.totalLike < 5) {
        return "Better!"
      } else {
        return "God!"
      }
    }
  }
  Comment.init({
    content: DataTypes.STRING,
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    totalLike: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate(comment, option) {
        comment.totalLike = 0;
      }
    },
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};