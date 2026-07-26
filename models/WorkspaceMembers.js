module.exports = (sequelize, DataTypes) => {
  const WorkspaceMembers = sequelize.define('WorkspaceMembers', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('owner', 'admin', 'developer', 'member', 'viewer'),
      allowNull: true,
      defaultValue: 'member',
    }
  }, {
    tableName: 'workspace_members',
    timestamps: true,
    underscored: false
  });

  WorkspaceMembers.associate = (models) => {
    WorkspaceMembers.belongsTo(models.Workspaces, { foreignKey: 'workspace_id', targetKey: 'id', onDelete: 'SET NULL' });
    WorkspaceMembers.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'SET NULL' });
  };

  return WorkspaceMembers;
};
