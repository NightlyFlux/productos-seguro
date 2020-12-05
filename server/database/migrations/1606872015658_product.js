"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", (table) => {
      table.increments();
      table.string("name", 100).notNullable();
      table.string("category", 100).notNullable();
      table.integer("price", 100).notNullable();
      table.string("brand", 100).notNullable();
      table.text("image", "longtext").nullable();
      table.integer("user_id", 11).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
