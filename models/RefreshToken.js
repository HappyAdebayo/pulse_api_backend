module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'refresh_token',
    timestamps: true,
    underscored: false
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return RefreshToken;
};
