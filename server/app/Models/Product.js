"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Encryption = use("Encryption");

class Product extends Model {
  static boot() {
    super.boot();

    this.addHook("afterFetch", async (productInstances) => {
      for (const product of productInstances) {
        product.brand = await Encryption.decrypt(product.brand);
      }
    });
  }
}

module.exports = Product;
