// INICIALIZA EMAILJS
(function () {
  emailjs.init("YOUR_PUBLIC_KEY");
})();

// ELEMENTOS
const home = document.getElementById("home");
const send = document.getElementById("send");
const statusBox = document.getElementById("status");
const statusText = document.getElementById("statusText");

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

// ENVIO DE ARQUIVO
function sendFile() {
  const fromName = document.getElementById("fromName").value.trim();
  const toEmail = document.getElementById("toEmail").value.trim();
  const fileInput = document.getElementById("fileInput");

  if (!fromName || !toEmail || fileInput.files.length === 0) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!toEmail.includes("@")) {
    alert("Email inválido.");
    return;
  }

  const file = fileInput.files[0];

  statusText.innerText = "Transmitindo pelo vazio digital...";
  statusBox.classList.remove("hidden");
  send.classList.add("hidden");

  const templateParams = {
    from_name: fromName,
    to_email: toEmail,
    message: "Arquivo enviado via FROMBACK",
  };

  emailjs
    .send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      templateParams,
      {
        attachments: [file]
      }
    )
    .then(() => {
      statusText.innerText = "Transmissão concluída com sucesso.";
    })
    .catch((error) => {
      console.error(error);
      statusText.innerText = "Falha na transmissão.";
    });
}
