const STORAGE_KEYS = {
  history: "nico_history_v2",
  notes: "nico_notes_v2",
  budget: "nico_budget_v2",
  tts: "nico_tts_v2",
  mode: "nico_mode_v2"
};

const chat = document.getElementById("chat");
const chatScroll = document.getElementById("chat-scroll");
const input = document.getElementById("inp");
const sendButton = document.getElementById("send-btn");
const uploadButton = document.getElementById("upload-btn");
const fileInput = document.getElementById("file");
const micButton = document.getElementById("mic");
const ttsButton = document.getElementById("tts");
const modeButton = document.getElementById("mode-toggle");
const clearButton = document.getElementById("clear-chat");
const welcomePanel = document.getElementById("welcome-panel");
const attachmentTray = document.getElementById("attachment-tray");
const statusContainer = document.getElementById("connection-status");
const statusText = document.getElementById("status-text");

let history = loadJson(STORAGE_KEYS.history, migrateHistory());
let notes = loadJson(STORAGE_KEYS.notes, []);
let budget = loadJson(STORAGE_KEYS.budget, []);
let pendingImage = null;
let isSending = false;
let ttsEnabled = localStorage.getItem(STORAGE_KEYS.tts) === "1";
let mode = localStorage.getItem(STORAGE_KEYS.mode) || "dost";

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function migrateHistory() {
  try {
    const previous = JSON.parse(localStorage.getItem("nico_h") || "[]");
    if (!Array.isArray(previous)) return [];
    return previous
      .filter((item) => item && typeof item.t === "string")
      .map((item) => ({ role: item.r === "u" ? "user" : "assistant", content: item.t }))
      .slice(-40);
  } catch {
    return [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(-40)));
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes.slice(-20)));
  localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(budget.slice(-100)));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inlineMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(text) {
  const codeBlocks = [];
  let safe = escapeHtml(text).replace(/```(?:[\w+-]+)?\n?([\s\S]*?)```/g, (_, code) => {
    const index = codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`) - 1;
    return `@@CODE_${index}@@`;
  });

  const blocks = safe.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const html = blocks.map((block) => {
    const lines = block.split("\n");
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map((line) => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    }
    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      return `<ol>${lines.map((line) => `<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    }
    if (lines.every((line) => /^&gt;\s?/.test(line))) {
      return `<blockquote>${lines.map((line) => inlineMarkdown(line.replace(/^&gt;\s?/, ""))).join("<br>")}</blockquote>`;
    }
    const heading = block.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length + 2;
      return `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
    }
    return `<p>${lines.map(inlineMarkdown).join("<br>")}</p>`;
  }).join("");

  return html.replace(/@@CODE_(\d+)@@/g, (_, index) => codeBlocks[Number(index)] || "");
}

function scrollToLatest() {
  requestAnimationFrame(() => {
    chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: "smooth" });
  });
}

function setStatus(label, state = "online") {
  statusContainer.dataset.status = state;
  statusText.textContent = label;
}

function hideWelcome() {
  if (welcomePanel && !welcomePanel.hidden) welcomePanel.hidden = true;
}

function createIconLetter() {
  const avatar = document.createElement("span");
  avatar.className = "message-avatar";
  avatar.textContent = "N";
  avatar.setAttribute("aria-hidden", "true");
  return avatar;
}

function addMessage(content, role = "assistant", options = {}) {
  const { save = false, media = null } = options;
  hideWelcome();

  const row = document.createElement("article");
  row.className = `message-row ${role === "user" ? "user" : "assistant"}`;

  if (role !== "user") row.appendChild(createIconLetter());

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  if (media) {
    const image = document.createElement("img");
    image.className = "message-media";
    image.src = media;
    image.alt = "Kullanıcının eklediği görsel";
    bubble.appendChild(image);
  }

  if (content) {
    if (role === "assistant") bubble.innerHTML += renderMarkdown(content);
    else {
      const paragraph = document.createElement("p");
      paragraph.textContent = content;
      bubble.appendChild(paragraph);
    }
  }

  row.appendChild(bubble);
  chat.appendChild(row);
  scrollToLatest();

  if (save && content) {
    history.push({ role, content });
    history = history.slice(-40);
    saveState();
  }

  return row;
}

function addTyping() {
  const row = document.createElement("article");
  row.className = "message-row assistant";
  row.id = "nico-typing";
  row.setAttribute("aria-label", "NICO yanıt hazırlıyor");
  row.appendChild(createIconLetter());

  const bubble = document.createElement("div");
  bubble.className = "message-bubble typing-bubble";
  bubble.innerHTML = "<span></span><span></span><span></span>";
  row.appendChild(bubble);
  chat.appendChild(row);
  scrollToLatest();
}

function removeTyping() {
  document.getElementById("nico-typing")?.remove();
}

function removeAttachment() {
  pendingImage = null;
  attachmentTray.classList.remove("visible");
  attachmentTray.replaceChildren();
  fileInput.value = "";
}

function showAttachment(fileName, dataUrl) {
  attachmentTray.replaceChildren();
  const card = document.createElement("div");
  card.className = "attachment-card";

  const preview = document.createElement("img");
  preview.className = "attachment-preview";
  preview.src = dataUrl;
  preview.alt = "Eklenecek görsel önizlemesi";

  const copy = document.createElement("div");
  copy.className = "attachment-copy";
  const title = document.createElement("strong");
  title.textContent = fileName;
  const description = document.createElement("span");
  description.textContent = "Görsel mesaja eklenecek";
  copy.append(title, description);

  const remove = document.createElement("button");
  remove.className = "control-button icon-button remove-attachment";
  remove.type = "button";
  remove.setAttribute("aria-label", "Ekli görseli kaldır");
  remove.title = "Görseli kaldır";
  remove.textContent = "×";
  remove.addEventListener("click", removeAttachment);

  card.append(preview, copy, remove);
  attachmentTray.appendChild(card);
  attachmentTray.classList.add("visible");
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Görsel okunamadı."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Görsel işlenemedi."));
      image.onload = () => {
        const maxDimension = 1600;
        const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
}

function getBudgetSummary() {
  const totalIncome = budget.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + entry.value, 0);
  const totalExpense = budget.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + entry.value, 0);
  return `**Bütçe özeti**\n\n- Gelir: ${formatCurrency(totalIncome)}\n- Gider: ${formatCurrency(totalExpense)}\n- Kalan: ${formatCurrency(totalIncome - totalExpense)}`;
}

function scheduleReminder(hour, minute, message) {
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= new Date()) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - Date.now();
  window.setTimeout(() => {
    addMessage(`Hatırlatma zamanı: ${message}`, "assistant");
    if (ttsEnabled) speak(`Hatırlatma zamanı. ${message}`);
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
  }, delay);
}

function handleLocalCommand(text) {
  const trimmed = text.trim();
  const lower = trimmed.toLocaleLowerCase("tr-TR");

  const noteMatch = trimmed.match(/^(?:nico\s+not:|not al|bunu böyle yap)\s+(.+)/i);
  if (noteMatch) {
    notes.push(noteMatch[1].trim());
    notes = notes.slice(-20);
    saveState();
    return "Notunu kaydettim. Sonraki sohbetlerde bunu dikkate alacağım.";
  }

  const moneyMatch = lower.match(/^(gelir|gider)\s+(\d+(?:[.,]\d+)?)/);
  if (moneyMatch) {
    const value = Number(moneyMatch[2].replace(",", "."));
    budget.push({ type: moneyMatch[1] === "gelir" ? "income" : "expense", value, createdAt: Date.now() });
    saveState();
    return `${moneyMatch[1] === "gelir" ? "Gelir" : "Gider"} olarak ${formatCurrency(value)} kaydedildi.`;
  }

  if (lower === "bütçe" || lower === "bütçe özeti") return getBudgetSummary();

  const reminderMatch = trimmed.match(/^hatırlat\s+(\d{1,2}):(\d{2})\s+(.+)/i);
  if (reminderMatch) {
    const hour = Number(reminderMatch[1]);
    const minute = Number(reminderMatch[2]);
    if (hour > 23 || minute > 59) return "Saat biçimi 00:00 ile 23:59 arasında olmalı.";
    scheduleReminder(hour, minute, reminderMatch[3]);
    return `Hatırlatmayı ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} için ayarladım.`;
  }

  if (lower === "yardım" || lower === "komutlar") {
    return "**Kısa komutlar**\n\n- `hava İstanbul` — anlık hava durumu\n- `ara yapay zekâ` — kısa bilgi araması\n- `not al ...` — not kaydetme\n- `gelir 1200` veya `gider 450` — bütçe kaydı\n- `bütçe` — bütçe özeti\n- `hatırlat 18:30 toplantı` — bu oturum için hatırlatma";
  }

  return null;
}

function updateTtsButton() {
  ttsButton.setAttribute("aria-pressed", String(ttsEnabled));
  ttsButton.textContent = ttsEnabled ? "Ses açık" : "Ses kapalı";
}

function updateModeButton() {
  const isAssistant = mode === "asistan";
  modeButton.setAttribute("aria-pressed", String(isAssistant));
  modeButton.textContent = isAssistant ? "Asistan modu" : "Dost modu";
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    setStatus("Ses desteği yok", "offline");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ""));
  utterance.lang = "tr-TR";
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("tr"));
  if (voices.length) utterance.voice = voices[0];
  window.speechSynthesis.speak(utterance);
}

function buildConversation(currentContent) {
  const prior = history.slice(-12).map((item) => ({ role: item.role, content: item.content }));
  prior.push({ role: "user", content: currentContent });
  return prior;
}

async function sendMessage(prefilled = "") {
  if (isSending) return;
  const text = (prefilled || input.value).trim();
  if (!text && !pendingImage) return;

  const localCommand = pendingImage ? null : handleLocalCommand(text);
  input.value = "";

  if (localCommand) {
    addMessage(text, "user", { save: true });
    addMessage(localCommand, "assistant", { save: true });
    if (ttsEnabled) speak(localCommand);
    setStatus("Hazır", "online");
    return;
  }

  const attachment = pendingImage;
  removeAttachment();
  const userLabel = text || "Görseli yorumlar mısın?";
  const content = attachment
    ? [{ type: "text", text: userLabel }, { type: "image_url", image_url: { url: attachment.dataUrl } }]
    : text;

  addMessage(userLabel, "user", { media: attachment?.dataUrl || null });
  history.push({ role: "user", content: attachment ? `${userLabel}\n[Görsel eklendi]` : text });
  history = history.slice(-40);
  saveState();

  isSending = true;
  sendButton.disabled = true;
  setStatus("Yanıt hazırlanıyor", "busy");
  addTyping();

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 45000);

  try {
    const directAnswer = attachment ? null : await brainCommand(text);
    const result = directAnswer
      ? { text: directAnswer, err: null }
      : await askBrain(buildConversation(content), { mode, notes: notes.join(" | "), signal: controller.signal });

    removeTyping();
    const reply = result.text || result.err || "NICO şu anda yanıt üretemedi.";
    addMessage(reply, "assistant", { save: Boolean(result.text) });
    if (ttsEnabled && result.text) speak(reply);
    setStatus(result.text ? "Hazır" : "Bağlantı sorunu", result.text ? "online" : "offline");
  } finally {
    window.clearTimeout(timeoutId);
    removeTyping();
    isSending = false;
    sendButton.disabled = false;
    input.focus();
  }
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    addMessage("Tarayıcın sesle yazmayı desteklemiyor. Mesajını yazarak gönderebilirsin.", "assistant");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "tr-TR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  setStatus("Dinliyorum", "busy");
  micButton.disabled = true;

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    sendMessage();
  };
  recognition.onerror = () => {
    setStatus("Hazır", "online");
    addMessage("Sesi anlayamadım. Tekrar deneyebilir veya mesajını yazabilirsin.", "assistant");
  };
  recognition.onend = () => {
    micButton.disabled = false;
    if (!isSending) setStatus("Hazır", "online");
  };
  recognition.start();
}

function initialiseHistory() {
  if (!history.length) return;
  hideWelcome();
  history.forEach((entry) => addMessage(entry.content, entry.role));
}

uploadButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    addMessage("Şu an yalnızca görsel dosyaları ekleyebilirsin.", "assistant");
    removeAttachment();
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    addMessage("Görsel 12 MB’tan küçük olmalı.", "assistant");
    removeAttachment();
    return;
  }

  try {
    setStatus("Görsel hazırlanıyor", "busy");
    const dataUrl = await resizeImage(file);
    pendingImage = { name: file.name, dataUrl };
    showAttachment(file.name, dataUrl);
    setStatus("Hazır", "online");
    input.placeholder = "Görsel hakkında ne öğrenmek istiyorsun?";
    input.focus();
  } catch {
    setStatus("Hazır", "online");
    addMessage("Görsel işlenemedi. Başka bir dosya deneyebilirsin.", "assistant");
  }
});

sendButton.addEventListener("click", () => sendMessage());
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

micButton.addEventListener("click", startListening);
ttsButton.addEventListener("click", () => {
  ttsEnabled = !ttsEnabled;
  localStorage.setItem(STORAGE_KEYS.tts, ttsEnabled ? "1" : "0");
  updateTtsButton();
  if (ttsEnabled) speak("Sesli yanıtlar açıldı.");
});

modeButton.addEventListener("click", () => {
  mode = mode === "dost" ? "asistan" : "dost";
  localStorage.setItem(STORAGE_KEYS.mode, mode);
  updateModeButton();
  setStatus(mode === "asistan" ? "Asistan modu" : "Dost modu", "online");
});

clearButton.addEventListener("click", () => {
  history = [];
  saveState();
  chat.replaceChildren();
  removeAttachment();
  welcomePanel.hidden = false;
  input.placeholder = "NICO'ya bir şey sor...";
  setStatus("Yeni sohbet hazır", "online");
  input.focus();
});

document.querySelectorAll(".prompt-card").forEach((card) => {
  card.addEventListener("click", () => sendMessage(card.dataset.prompt || ""));
});

window.speechSynthesis?.addEventListener?.("voiceschanged", () => {});
updateTtsButton();
updateModeButton();
initialiseHistory();
setStatus("Hazır", "online");
