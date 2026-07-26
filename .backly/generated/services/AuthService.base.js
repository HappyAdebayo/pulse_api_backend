'use strict';

const db = require('../../../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * AuthService.base.js
 * Generated Base Business logic for Auth
 */

class AuthServiceBase {
  async refresh(input) {
    if (!input.body.refresh_token) {
      throw { status: 401, message: "Refresh token required"};
    }

    const hashedToken = crypto.createHash('sha256').update(String(input.body.refresh_token)).digest('hex');

    foundRefreshToken = await db.RefreshToken.findOne({
      where: { token_hash: hashedToken },
    });

    if (!foundRefreshToken) {
      throw { status: 403, message: "Invalid refresh token"};
    }

    const currentDate = new Date();

    if (currentDate > foundRefreshToken.expires_at) {
      throw { status: 403, message: "Invalid refresh token"};
    }

    founduser = await db.User.findOne({
      where: { id: foundRefreshToken.user_id },
    });

    const accessToken = jwt.sign({ id: founduser }, process.env.JWT_TOKEN, { expiresIn: '1h' });

    const refreshToken = jwt.sign({ id: founduser }, process.env.REFRESH_TOKEN, { expiresIn: '1h' });

    const hashedRefreshToken = crypto.createHash('sha256').update(String(refreshToken)).digest('hex');

    const expiryDate = new Date(currentDate.getTime() + (30 * 86400000)).toISOString();

    await db.RefreshToken.update({
      expires_at: expiryDate,
      token_hash: hashedRefreshToken
    }, {
      where: { user_id: founduser.id },
    });

    return { status: 200, message: "Token refreshed sucessfully", data: { accessToken, refreshToken } };
  }

  async sign_up(input) {
    foundUser = await db.User.findOne({
      where: { email: input.body.email },
    });

    if (foundUser) {
      throw { status: 409, message: "User exist already"};
    }

    const hashedPassword = await bcrypt.hash(input.body.password, 10);

    newUser = await db.User.create({
      name: input.body.name,
      email: input.body.email,
      password: hashedPassword
    });

    return { status: 201, message: "User created successfully", data: { user: newUser } };
  }

  async login(input) {
    foundUser = await db.User.findOne({
      where: { email: input.body.email },
    });

    if (!foundUser) {
      throw { status: 404, message: "User not found"};
    } else {
      const isPasswordValid = await bcrypt.compare(input.body.password, foundUser.password);

      if (isPasswordValid) {
        doesTokenExist = await db.RefreshToken.findOne({
          where: { user_id: foundUser.id },
        });

        if (doesTokenExist) {
          await db.RefreshToken.destroy({
            where: { user_id: foundUser.id }
          });

        }

        const accessToken = jwt.sign({ userId: foundUser }, process.env.JWT_TOKEN, { expiresIn: '1h' });

        const rerfreshToken = jwt.sign({ id: foundUser }, process.env.REFRESH_TOKEN, { expiresIn: '1h' });

        const hashedRefreshToken = crypto.createHash('sha256').update(String(rerfreshToken)).digest('hex');

        const currentDate = new Date();

        const expiryDate = new Date(currentDate.getTime() + (30 * 86400000)).toISOString();

        await db.RefreshToken.create({
          user_id: foundUser.id,
          expires_at: expiryDate,
          token_hash: hashedRefreshToken
        });

        return { status: 200, message: "User detail  fetched sucessfully", data: { user: foundUser, accessToken, refreshToken: rerfreshToken } };
      } else {
        throw { status: 409, message: "Wong credentials"};
      }

    }

  }

  async logout(input) {
    if (!input.body.refresh_token) {
      throw { status: 401, message: "Refresh token required"};
    }

    const hashedRefrehedToken = crypto.createHash('sha256').update(String(input.body.refresh_token)).digest('hex');

    foundRefreshedToken = await db.RefreshToken.findOne({
      where: { token_hash: hashedRefrehedToken },
    });

    if (!foundRefreshedToken) {
      throw { status: 403, message: "Invalid refresh token"};
    }

    await db.RefreshToken.destroy({
      where: { token_hash: hashedRefrehedToken }
    });

    return { status: 200, message: "User logout successfully", data: {} };
  }

}

module.exports = AuthServiceBase;
