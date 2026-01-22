// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyCkAw62AKQF0H7qksBxyhAuIumHX-z_5AY",
  authDomain: "fromback-e5597.firebaseapp.com",
  projectId: "fromback-e5597",
  storageBucket: "fromback-e5597.appspot.com",
  messagingSenderId: "173863771952",
  appId: "1:173863771952:web:412c570ed32486721e72f5"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

// ===============================
// ELEMENTOS DO DOM
// ===============================
const home = document.getElementById("home");
const send = document.getElementById("send");
const receive = document.getElementById("receive");
const files = document.getElementById("files");

const fromName = document.getElementById("fromName");
const toName = document.getElementById("toName");
const fileInput = document.getElementById("fileInput");
const receiveName = document.getElementById("receiveName");

// ===============================
// NAVEGAÇÃO
// ===============================
function showSend() {
  home.style.display = "none";
  send.style.display = "block";
  receive.style.display = "none";
}

function showReceive() {
  home.style.display = "none";
  send.style.display = "none";
  receive.style.display = "block";
}

function backHome() {
  home.style.display = "block";
  send.style.display = "none";
  receive.style.display = "none";
  files.innerHTML = "";
}

// ===============================
// ENVIAR ARQUIVO
// ===============================
function sendFile() {
  const from = fromName.value.trim();
  const to = toName.value.trim();
  const file = fileInput.files[0];

  if (!from || !to || !file) {
    alert("Preencha todos os campos.");
    return;
  }

  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora
  const filePath = `fromback/${Date.now()}_${file.name}`;
  const ref = storage.ref(filePath);

  ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      return db.collection("files").add({
        from,
        to,
        url,
        path: filePath,
        expiresAt
      });
    })
    .then(() => {
      alert("Arquivo enviado com sucesso!");
      fromName.value = "";
      toName.value = "";
      fileInput.value = "";
      backHome();
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao enviar arquivo.");
    });
}

// ===============================
// RECEBER ARQUIVOS
// ===============================
function loadFiles() {
  const name = receiveName.value.trim();
  if (!name) {
    alert("Digite seu nome.");
    return;
  }

  files.innerHTML = "";

  db.collection("files")
    .where("to", "==", name)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        files.innerHTML = "<p>Nenhum arquivo encontrado.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        // Expirado → remove do Firestore (frontend cleanup)
        if (Date.now() > data.expiresAt) {
          doc.ref.delete();
          return;
        }

        const div = document.createElement("div");
        div.className = "file-bubble";
        div.innerHTML = `
          <p><strong>De:</strong> ${data.from}</p>
          <a href="${data.url}" target="_blank">Abrir arquivo</a>
        `;
        files.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao buscar arquivos.");
    });
}
