module.exports = (sequelize, DataTypes) => {
  const WorkspaceInvitations = sequelize.define('WorkspaceInvitations', {
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'member',
    },
    token: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'pending',
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejected_at: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'workspace_invitations',
    timestamps: true,
    underscored: false
  });

  WorkspaceInvitations.associate = (models) => {
    WorkspaceInvitations.belongsTo(models.Workspaces, { foreignKey: 'workspace_id', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return WorkspaceInvitations;
};
