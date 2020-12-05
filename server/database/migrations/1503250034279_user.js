"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("email", 254).notNullable().unique();
      table.string("password", 60).notNullable();
      table.enu("user_type", ["1", "2"]).nullable().defaultTo("1");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
