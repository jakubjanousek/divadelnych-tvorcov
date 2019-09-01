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

/*window.addEventListener("DOMContentLoaded", event => {
  const html = document.getElementsByTagName("html")[0];

  html.classList.remove("no-js");
  html.classList.add("js");

  const randomizeEls = document.querySelectorAll("[data-randomize]");
  console.log(randomizeEls);
  Array.from(randomizeEls).forEach(el => {
    const min = 1;
    const max = Number.parseInt(el.getAttribute("data-randomize"), 10) + 1;
    const number = Math.floor(Math.random() * (+max - +min)) + +min;
    el.classList.add(`randomize--${number}`);
  });
});
window.onload = function() {};
*/
