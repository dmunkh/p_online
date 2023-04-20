$(function () {
  "use strict";

  $(document).on("click", "#gadotCollapse", function () {
    $("body").toggleClass("menu-open");
    $(".sidenav-overlay").toggleClass("d-block");
  });
  $(document).on("click", "#gadotMenuHide", function () {
    $("body").removeClass("menu-open");
    $(".sidenav-overlay").removeClass("d-block");
  });

  $(document).on("click", "#color-switch-2", function () {
    if (this.value === "true") {
      $("body").addClass("layout-dark");
      localStorage.setItem("srs-theme", "dark");
    } else {
      $("body").removeClass("layout-dark");
      localStorage.removeItem("srs-theme");
    }
  });

  function scrollTopFn() {
    var $scrollTop = $(window).scrollTop();
    if ($scrollTop > 60) {
      $("body").addClass("navbar-scrolled");
    } else {
      $("body").removeClass("navbar-scrolled");
    }

    if ($scrollTop > 20) {
      $("body").addClass("page-scrolled");
    } else {
      $("body").removeClass("page-scrolled");
    }
  }

  $(window).scroll(function () {
    scrollTopFn();
  });
});
