// JS Goes here - ES6 supported
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

void (function() {
  const html = document.getElementsByTagName("html")[0];

  html.classList.remove("no-js");
  html.classList.add("js");
})();

window.onload = function() {};
