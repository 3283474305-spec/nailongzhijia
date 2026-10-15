fetch('nav.html')
.then(response => response.text())
.then(html => {
  document.getElementById('site-header').innerHTML = html;

  const links = document.querySelectorAll("nav a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if(link.getAttribute("href") === currentPage){
      link.classList.add("active");
    }
  })
});
