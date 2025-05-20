module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isDraft: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    readingTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  }, {
    hooks: {
      beforeCreate: (post) => {
        // Calculate reading time (assuming 200 words per minute)
        const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        post.readingTime = Math.ceil(wordCount / 200);
      },
      beforeUpdate: (post) => {
        if (post.changed('content')) {
          const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          post.readingTime = Math.ceil(wordCount / 200);
        }
      },
    },
  });

  return Post;
};