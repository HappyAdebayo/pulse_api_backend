const Joi = require('joi');

const refreshSchema = Joi.object({
  "refresh_token": Joi.string().required()
}).unknown(true);

exports.refresh = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = refreshSchema.validate(dataToValidate, { abortEarly: false });

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

const sign_upSchema = Joi.object({
  "name": Joi.string().required(),
  "email": Joi.string().email().required(),
  "password": Joi.string().required()
}).unknown(true);

exports.sign_up = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = sign_upSchema.validate(dataToValidate, { abortEarly: false });

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

const loginSchema = Joi.object({
  "email": Joi.string().email().required(),
  "password": Joi.string().required()
}).unknown(true);

exports.login = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = loginSchema.validate(dataToValidate, { abortEarly: false });

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

const logoutSchema = Joi.object({
  "refresh_token": Joi.string().required()
}).unknown(true);

exports.logout = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = logoutSchema.validate(dataToValidate, { abortEarly: false });

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

