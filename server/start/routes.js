"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/users/login", "UserController.login");
  Route.post("/users/signup", "UserController.signup");

  Route.get("/products", "ProductController.getAll").middleware("auth");
  Route.get(
    "/products/:category",
    "ProductController.getFromCategory"
  ).middleware("auth");
  Route.post("/products/add", "ProductController.store").middleware("auth");
}).prefix("/api/v1/");
