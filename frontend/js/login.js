const cadastrar = document.querySelector("#cadastrar");
cadastrar.addEventListener("click", () => {
  window.location.href = "register.html";
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (data.success) {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor");
  }
});
