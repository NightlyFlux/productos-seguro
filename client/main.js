$(document).ready(function () {
  var productCard = (key, value) => {
    return `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3">
    <div id="${key}"class="card">
      <img src="${value.image}" class="card-img-top m-auto p-3" alt="img${value.id}">
      <div class="card-body">
        <h3 class="card-title d-inline">${value.name}</h3>
        <small>${value.brand}</small>
        <h6 class="card-subtitle mt-1 mb-2 text-muted">${value.category}</h6>
        <p class="card-text h5">$${value.price}</p>
      </div>
    </div>
  </div>`;
  };

  function loadData() {
    $.ajaxSetup({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    $.getJSON("http://127.0.0.1:3333/api/v1/products", function (data) {
      $.each(data, function (key, value) {
        $("#todo .row").append(productCard(key, value));
      });
    });

    $.getJSON("http://127.0.0.1:3333/api/v1/products/procesador", function (data) {
      $.each(data, function (key, value) {
        $("#procesadores .row").append(productCard(key, value));
      });
    });

    $.getJSON("http://127.0.0.1:3333/api/v1/products/teclado", function (data) {
      $.each(data, function (key, value) {
        $("#teclados .row").append(productCard(key, value));
      });
    });

    $.getJSON("http://127.0.0.1:3333/api/v1/products/bocina", function (data) {
      $.each(data, function (key, value) {
        $("#bocinas .row").append(productCard(key, value));
      });
    });
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  function authCheck() {
    switch (localStorage.getItem("user_type")) {
      case "1":
        loadData();
        $("#btnAddProduct").hide();
        $("#userEmail").html(`<strong>Bienvenido</strong> ${localStorage.getItem("email")}`);
        $("#logged").show();
        $("#notLogged").hide();
        $("#authForm").hide();
        $("#userInfo").removeClass("d-none").addClass("d-flex");
        break;
      case "2":
        loadData();
        $("#btnAddProduct").show();
        $("#userEmail").html(`<strong>Bienvenido</strong> ${localStorage.getItem("email")} (Admin)`);
        $("#logged").show();
        $("#notLogged").hide();
        $("#authForm").hide();
        $("#userInfo").removeClass("d-none").addClass("d-flex");
        break;
      default:
        $("#btnAddProduct").hide();
        $("#logged").hide();
        $("#notLogged").show();
        $("#authForm").show();
        $("#userInfo").removeClass("d-flex").addClass("d-none");
        break;
    }
  }

  authCheck();

  $("#btnLogin").click(function (e) {
    e.preventDefault();
    const email = e.target.form[0].value;
    const password = e.target.form[1].value;
    $.post(
      "http://127.0.0.1:3333/api/v1/users/login",
      { email: email, password: password },
      function (data) {
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("user_type", data.user.user_type);
        localStorage.setItem("token", data.token);
        authCheck();
      },
      "json"
    );
  });

  $("#btnSignupUser").click(function (e) {
    e.preventDefault();
    const email = e.target.form[0].value;
    const password = e.target.form[1].value;
    $.post(
      "http://127.0.0.1:3333/api/v1/users/signup",
      { email: email, password: password, user_type: 1 },
      function (data) {
        $("#toastSuccess").toast("show");
      },
      "json"
    );
  });

  $("#btnSignupAdmin").click(function (e) {
    e.preventDefault();
    const email = e.target.parentElement.parentElement.parentElement[0].value;
    const password = e.target.parentElement.parentElement.parentElement[0].value;
    $.post(
      "http://127.0.0.1:3333/api/v1/users/signup",
      { email: email, password: password, user_type: 2 },
      function (data) {
        $("#toastSuccess").toast("show");
      },
      "json"
    );
  });

  $("#btnLogout").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    authCheck();
  });

  $("#btnSubmitProduct").click(function (e) {
    e.preventDefault();
    getBase64(e.target.form[4].files[0]).then((encodedImage) => {
      const name = e.target.form[0].value;
      const category = e.target.form[1].value;
      const price = parseInt(e.target.form[2].value);
      const brand = e.target.form[3].value;
      const image = encodedImage;
      $.ajaxSetup({
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      $.post(
        `http://127.0.0.1:3333/api/v1/products/add`,
        {
          name: name,
          category: category,
          price: price,
          brand: brand,
          image: image
        },
        function (data) {
          $("#toastProduct").toast("show");
        },
        "json"
      );
    });
  });

  $("#fImagen").change(function (e) {
    e.preventDefault();
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#fImagenPreview").attr("src", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  $("#addProductModal").on("hidden.bs.modal", function (e) {
    $("#fNombre").val("");
    $("#fCategoria").val("Procesador");
    $("#fPrecio").val(0);
    $("#fMarca").val("");
    $("#fImagenPreview").attr("src", "");
    $("#fImagen").val("");
  });
});
