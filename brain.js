const WORKER_URL = "https://bitter-haze-2503.usermame5252.workers.dev";

function buildSystem(mode, notes) {
  const tone = mode === "asistan"
    ? "Profesyonel, düzenli ve sonuç odaklı konuş. Yanıtlarını başlıklar ve kısa adımlarla yapılandır."
    : "Samimi, doğal ve yardımcı konuş. Gerektiğinde kullanıcıya Reis diye hitap edebilirsin.";

  return [
    "Sen NICO adında Türkçe konuşan bir yapay zekâ asistanısın.",
    tone,
    "Kısa fakat yararlı yanıtlar ver; kullanıcı ayrıntı isterse derinleş.",
    "Kod istenirse eksiksiz ve çalıştırılabilir örnekler sun.",
    "Görsel gönderilmişse yalnızca gerçekten seçebildiğin ayrıntıları açıkla; görmediğin bilgileri uydurma.",
    "Yanıtlarında gerektiğinde Markdown kullanabilirsin.",
    notes ? `Kullanıcının kaydettiği notlar: ${notes}` : "Kullanıcının kaydedilmiş notu yok."
  ].join(" ");
}

function weatherDescription(code) {
  if (code === 0) return "açık";
  if ([1, 2].includes(code)) return "az bulutlu";
  if (code === 3) return "kapalı";
  if ([45, 48].includes(code)) return "sisli";
  if ([51, 53, 55, 56, 57].includes(code)) return "çiselemeli";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "yağmurlu";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "karlı";
  if ([95, 96, 99].includes(code)) return "gök gürültülü";
  return "değişken";
}

async function brainCommand(text) {
  const query = String(text || "").trim();
  const lower = query.toLocaleLowerCase("tr-TR");

  if (lower.startsWith("hava ")) {
    const place = query.slice(5).trim();
    if (!place) return "Hava durumunu öğrenmek istediğin şehri yazmalısın.";

    try {
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=tr`
      );
      const geocode = await geocodeResponse.json();
      const location = geocode.results?.[0];
      if (!location) return `${place} için konum bulunamadı.`;

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m`
      );
      const weather = await weatherResponse.json();
      const current = weather.current;
      if (!current) throw new Error("Hava verisi eksik.");

      return `${location.name} için şu an ${current.temperature_2m}°C, ${weatherDescription(current.weather_code)}. Rüzgâr hızı ${current.wind_speed_10m} km/sa.`;
    } catch {
      return "Hava bilgisi şu anda alınamadı. Biraz sonra yeniden deneyebilirsin.";
    }
  }

  if (lower.startsWith("ara ")) {
    const searchTerm = query.slice(4).trim();
    if (!searchTerm) return "Aramak istediğin konuyu yazmalısın.";

    try {
      const response = await fetch(
        `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`
      );
      const data = await response.json();
      const result = data.query?.search?.[0];
      if (!result) return `“${searchTerm}” için bir sonuç bulunamadı.`;

      const excerpt = result.snippet.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return `**${result.title}**\n\n${excerpt}`;
    } catch {
      return "Arama şu anda tamamlanamadı. Daha sonra tekrar deneyebilirsin.";
    }
  }

  return null;
}

async function askBrain(messages, options = {}) {
  const { mode = "dost", notes = "", signal } = options;

  try {
    const response = await fetch(`${WORKER_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        system: buildSystem(mode, notes),
        messages: messages.map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content
        }))
      })
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : {};

    if (!response.ok || !data.ok) {
      return {
        text: null,
        err: data.error || `NICO servisi ${response.status} koduyla yanıt verdi.`
      };
    }

    if (typeof data.text !== "string" || !data.text.trim()) {
      return { text: null, err: "NICO bu istek için boş bir yanıt verdi." };
    }

    const text = data.text.trim();
    const serviceFailure = /(ana ve yedek beyni.*cevap veremiyor|kotası dolmuş|anahtar.*eksik|anahtar.*geçersiz|rate limit)/i;
    if (serviceFailure.test(text)) {
      return { text: null, err: "NICO’nun yapay zekâ servisi şu anda kullanılamıyor. Lütfen biraz sonra yeniden dene." };
    }

    return { text, err: null };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { text: null, err: "İstek zaman aşımına uğradı. Lütfen yeniden dene." };
    }
    return { text: null, err: "NICO servisine şu anda ulaşılamıyor. Bağlantını kontrol edip tekrar deneyebilirsin." };
  }
}
