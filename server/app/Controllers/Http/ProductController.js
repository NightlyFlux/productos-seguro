"use strict";

const Product = use("App/Models/Product");
const Encryption = use("Encryption");

class ProductController {
  async getAll({ response }) {
    const products = await Product.query().fetch();
    return response.json(products);
  }

  async getFromCategory({ response, params }) {
    const products = await Product.query()
      .where({ category: params.category })
      .fetch();
    return response.json(products);
  }

  async store({ request, response, params, auth }) {
    const user = await auth.getUser();
    if (user.user_type == 2) {
      const { name, category, price, brand, image } = request.all();
      const encryptedBrand = Encryption.encrypt(brand);
      const user_id = parseInt(user.id);
      const product = await Product.create({
        name,
        category,
        price,
        brand: encryptedBrand,
        image,
        user_id,
      });
      return product;
    } else {
      return response.status(501).json({ message: "Usuario no autorizado" });
    }
  }
}

module.exports = ProductController;
