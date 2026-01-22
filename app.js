// ================================
// CONFIGURAÇÃO DO FIREBASE
// ================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Serviços
const db = firebase.firestore();
const storage = firebase.storage();

// Tempo de vida do arquivo (1 hora)
const EXPIRE_TIME = 60 * 60 * 1000;

// ================================
// FUNÇÃO ENVIAR ARQUIVO
// ================================

async function sendFile() {
  const sender = document.getElementById("sender").value.trim();
  const receiver = document.getElementById("receiver").value.trim();
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!sender || !receiver || !file) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const fileRef = storage.ref(
      `files/${Date.now()}_${file.name}`
    );

    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();

    await db.collection("files").add({
      sender: sender,
      receiver: receiver,
      fileUrl: fileUrl,
      createdAt: Date.now()
    });

    alert("Arquivo enviado. Ele expira em 1 hora ⏳");

    fileInput.value = "";

  } catch (error) {
    console.error(error);
    alert("Erro ao enviar arquivo.");
  }
}

// ================================
// FUNÇÃO RECEBER ARQUIVOS
// ================================

async function loadFiles() {
  const receiverName = document
    .getElementById("receiverName")
    .value
    .trim();

  if (!receiverName) {
    alert("Digite seu nome.");
    return;
  }

  const messagesBox = document.getElementById("messages");
  messagesBox.innerHTML = "";

  try {
    const now = Date.now();

    const snapshot = await db
      .collection("files")
      .where("receiver", "==", receiverName)
      .get();

    if (snapshot.empty) {
      messagesBox.innerHTML = "<p>Nenhum envio encontrado.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      // Verifica expiração (1 hora)
      if (now - data.createdAt <= EXPIRE_TIME) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        bubble.innerHTML = `
          <strong>${data.sender}</strong>
          <a href="${data.fileUrl}" target="_blank">Baixar arquivo</a>
        `;

        messagesBox.appendChild(bubble);
      }
    });

  } catch (error) {
    console.error(error);
    alert("Erro ao buscar arquivos.");
  }
}
