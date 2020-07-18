"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const { app } = require("../../../config/firebase");
// import * as admin from "firebase-admin";
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      console.log("data", data);
      console.log("Files", files);
      entity = await strapi.services.order.create(data, { files });
    } else {
      entity = await strapi.services.order.create(ctx.request.body);
    }

    const { total_amount } = ctx.request.body;

    const roles = await strapi.query("role", "users-permissions").model.find();
    const role = roles.find((r) => r.type == "supplier");
    const users = await strapi.query("user", "users-permissions").model.find();
    const filteredUsers = users.filter((r) => r.role == role.id && r.fcmToken);

    const messages = filteredUsers.map((u) => ({
      notification: {
        title: `You have got a new order`,
        body: ` of Rs. ${total_amount}. `,
      },
      token: u.fcmToken,
    }));
    const messaging = app.messaging();
    await messaging.sendAll(messages);
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
