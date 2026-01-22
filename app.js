// INICIALIZA EMAILJS
(function () {
  emailjs.init("SUA_PUBLIC_KEY");
})();

// ELEMENTOS
const home = document.getElementById("home");
const send = document.getElementById("send");
const statusBox = document.getElementById("status");
const statusText = document.getElementById("statusText");
const form = document.getElementById("sendForm");

// NAVEGAÇÃO
function showSend() {
  home.classList.add("hidden");
  send.classList.remove("hidden");
}

function backHome() {
  home.classList.remove("hidden");
  send.classList.add("hidden");
  statusBox.classList.add("hidden");
  statusText.innerText = "";
  form.reset();
}

// ENVIO DE ARQUIVO (FORMA CORRETA COM ANEXO)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const toEmail = document.getElementById("toEmail").value.trim();

  if (!toEmail || !toEmail.includes("@")) {
    alert("Digite um e-mail válido.");
    return;
  }

  statusText.innerText = "Transmitindo pelo vazio digital...";
  statusBox.classList.remove("hidden");
  send.classList.add("hidden");

  emailjs
    .sendForm(
      "service_59kzzve", // SEU SERVICE ID
      "SEU_TEMPLATE_ID", // TEMPLATE ID
      form
    )
    .then(() => {
      statusText.innerText = "Transmissão concluída com sucesso.";
    })
    .catch((error) => {
      console.error(error);
      statusText.innerText = "Falha na transmissão.";
    });
});
