module.exports = (sequelize, DataTypes) => {

  const { Sequelize } = require('sequelize');
  
  const Workspaces = sequelize.define('Workspaces', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'active',
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    }
  }, {
    tableName: 'workspaces',
    timestamps: true,
    underscored: false
  });

  Workspaces.associate = (models) => {
    Workspaces.belongsTo(models.User, { foreignKey: 'owner_id', targetKey: 'id', onDelete: 'CASCADE' });
    Workspaces.hasMany(models.WorkspaceInvitations, { foreignKey: 'workspace_id', sourceKey: 'id', as: 'workspace_invitations', onDelete: 'CASCADE' });
    Workspaces.hasMany(models.WorkspaceMembers, { foreignKey: 'workspace_id', sourceKey: 'id', as: 'workspace_members', onDelete: 'SET NULL' });
  };

  return Workspaces;
};
