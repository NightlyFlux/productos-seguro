"use strict";

const Hash = use("Hash");
const User = use("App/Models/User");

class UserController {
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();
      console.log(request.all());
      const user = await User.query()
        .where({ email: email.toLowerCase() })
        .first();
      if (user) {
        const passwordVerified = await Hash.verify(password, user.password);
        if (passwordVerified) {
          let res = {};
          const token = await auth.generate(user);
          res.token = token.token;
          res.user = {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
          };
          return response.status(200).json(res);
        } else {
          return response
            .status(502)
            .json({ message: "Contraseña incorrecta" });
        }
      } else {
        return response.status(404).json({ message: "El usuario no existe" });
      }
    } catch (error) {
      return response.status(501).json({ message: "Ha ocurrido un error!" });
    }
  }

  async signup({ request, response }) {
    try {
      const { email, password, user_type } = request.all();
      const user = await User.create({
        email,
        password,
        user_type,
      });
      return user;
    } catch (error) {
      return response.status(501).json({ message: "Ha ocurrido un error!" });
    }
  }
}
module.exports = UserController;
