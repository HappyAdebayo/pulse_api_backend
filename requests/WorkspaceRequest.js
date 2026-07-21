const Joi = require('joi');

exports.reject_invitation = (req, res, next) => {
  next();
};

exports.index = (req, res, next) => {
  next();
};

const storeSchema = Joi.object({
  "name": Joi.string().required(),
  "description": Joi.string()
}).unknown(true);

exports.store = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = storeSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

exports.delete_workspace = (req, res, next) => {
  next();
};

exports.accept_invitation = (req, res, next) => {
  next();
};

const transfer_ownershipSchema = Joi.object({
  "user_id": Joi.string().required()
}).unknown(true);

exports.transfer_ownership = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = transfer_ownershipSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

const create_invitationSchema = Joi.object({
  "email": Joi.string().email().required(),
  "role": Joi.string().email().required().valid("owner", "admin", "developer", "member", "viewer")
}).unknown(true);

exports.create_invitation = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = create_invitationSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

