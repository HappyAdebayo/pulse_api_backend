'use strict';

const WorkspaceService = require('../../../services/WorkspaceService');
const validateRequest = require('../../../requests/WorkspaceRequest');

/**
 * WorkspaceController.base.js
 * Generated Base controller calling the business service.
 */

class WorkspaceControllerBase {
  async reject_invitation(req, res) {
    try {
      const params = { tokenid: req.params.tokenid };
      const input = { params };

      const result = await WorkspaceService.reject_invitation(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:reject_invitation]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async index(req, res) {
    try {

      const result = await WorkspaceService.index(req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:index]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async store(req, res) {
    try {
      const body = { name: req.body.name, description: req.body.description };
      const input = { body };

      const result = await WorkspaceService.store(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:store]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async delete_workspace(req, res) {
    try {
      const params = { id: req.params.id };
      const input = { params };

      const result = await WorkspaceService.delete_workspace(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:delete_workspace]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async accept_invitation(req, res) {
    try {
      const params = { tokenid: req.params.tokenid };
      const input = { params };

      const result = await WorkspaceService.accept_invitation(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:accept_invitation]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async transfer_ownership(req, res) {
    try {
      const body = { user_id: req.body.user_id };
      const params = { workspaceid: req.params.workspaceid };
      const input = { body, params };

      const result = await WorkspaceService.transfer_ownership(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:transfer_ownership]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async create_invitation(req, res) {
    try {
      const body = { email: req.body.email, role: req.body.role };
      const params = { workspaceid: req.params.workspaceid };
      const input = { body, params };

      const result = await WorkspaceService.create_invitation(input, req.user);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[WorkspaceController:create_invitation]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

}

module.exports = WorkspaceControllerBase;
