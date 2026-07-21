module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    tableName: 'user',
    timestamps: true,
    underscored: false,
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.WorkspaceMembers, { foreignKey: 'user_id', sourceKey: 'id', as: 'workspace_members', onDelete: 'SET NULL' });
    User.hasOne(models.RefreshToken, { foreignKey: 'user_id', sourceKey: 'id', as: 'refresh_token', onDelete: 'CASCADE' });
    User.hasMany(models.Workspaces, { foreignKey: 'owner_id', sourceKey: 'id', as: 'workspaces', onDelete: 'CASCADE' });
  };

  return User;
};
