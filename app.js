// INICIALIZA EMAILJS
(function () {
  emailjs.init("i-jN_KeZlxvTVqSUD");
})();

// ELEMENTOS
const home = document.getElementById("home");
const send = document.getElementById("send");
const statusBox = document.getElementById("status");
const statusText = document.getElementById("statusText");
const form = document.getElementById("emailForm");

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
}

// ENVIO DE EMAIL + ARQUIVO
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const fromName = document.getElementById("fromName").value.trim();
  const toEmail = document.getElementById("toEmail").value.trim();
  const fileInput = document.getElementById("fileInput");

  if (!fromName || !toEmail || fileInput.files.length === 0) {
    alert("Preencha todos os campos e selecione um arquivo.");
    return;
  }

  statusText.innerText = "Transmitindo pelo vazio digital...";
  statusBox.classList.remove("hidden");
  send.classList.add("hidden");

  emailjs
    .sendForm(
      "service_59kzzve",
      "template_453o0lb",
      form
    )
    .then(() => {
      statusText.innerText = "Transmissão concluída com sucesso.";
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      statusText.innerText = "Falha na transmissão.";
    });
});
