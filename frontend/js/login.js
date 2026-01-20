const cadastrar = document.querySelector("#cadastrar");
cadastrar.addEventListener("click", () => {
  window.location.href = "register.html";
});

const regain = document.querySelector("#regain");
regain.addEventListener("click", () => {
  toast.textContent = 'Funcionalidade em desenvolvimento';
  toast.classList.remove('bg-green-500', 'bg-red-500');
  toast.classList.add('bg-yellow-400');
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 3000);
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
    // Configura o toast
    toast.textContent = data.message;
    if (data.success) {
      toast.classList.remove('bg-red-500');
      toast.classList.add('bg-green-500');
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      toast.classList.remove('bg-green-500');
      toast.classList.add('bg-red-500');
    }

    // Mostra o toast
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');

    // Esconde depois de 3 segundos
    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
    }, 3000);

  } catch (err) {
    toast.textContent = 'Erro de conexão com o servidor';
    toast.classList.remove('opacity-0', 'bg-green-500');
    toast.classList.add('opacity-100', 'bg-red-500');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
    }, 3000);
  }
});
