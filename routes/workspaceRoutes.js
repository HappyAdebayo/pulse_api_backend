const express = require('express');
const router = express.Router();
// Debug: Active Endpoints for WorkspaceController: reject_invitation, index, store, delete_workspace, accept_invitation, transfer_ownership, create_invitation
const WorkspaceRequest = require('../requests/WorkspaceRequest');
const userAuth = require('../middlewares/userAuth');
const WorkspaceController = require('../controllers/WorkspaceController');

router.post('/invitation/:tokenid/reject', userAuth, WorkspaceRequest.reject_invitation, WorkspaceController.reject_invitation);
router.get('/', userAuth, WorkspaceRequest.index, WorkspaceController.index);
router.post('/', userAuth, WorkspaceRequest.store, WorkspaceController.store);
router.delete('/:id', userAuth, WorkspaceRequest.delete_workspace, WorkspaceController.delete_workspace);
router.post('/invitation/:tokenid/accept', userAuth, WorkspaceRequest.accept_invitation, WorkspaceController.accept_invitation);
router.put('/:workspaceid/transfer-ownership', userAuth, WorkspaceRequest.transfer_ownership, WorkspaceController.transfer_ownership);
router.put('/:workspaceid/invitation', userAuth, WorkspaceRequest.create_invitation, WorkspaceController.create_invitation);

module.exports = router;
