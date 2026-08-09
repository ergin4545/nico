// ======================================================
// NICO AI - BRAIN.JS
// Gemini bağlantısı Cloudflare Worker üzerinden
// API anahtarı BU DOSYADA BULUNMAZ.
// ======================================================

const WORKER_URL =
    "https://bitter-haze-2503.usermame5252.workers.dev/";


// ======================================================
// NICO KOMUTLARI
// ======================================================

async function brainCommand(t) {

    t = String(t || "").trim();

    // --------------------------------------------------
    // Worker adresini değiştirme
    // Örnek:
    // WORKER:https://ornek.workers.dev
    // --------------------------------------------------

    if (t.indexOf("WORKER:") === 0) {

        const url = t.slice(7).trim();

        if (!url) {
            return "Worker adresi boş Reis.";
        }

        localStorage.setItem("nico_worker", url);

        return "NICO Worker bağlantısı kaydedildi Reis 🧠";
    }


    // --------------------------------------------------
    // HAVA DURUMU
    // Kullanım:
    // hava Manisa
    // --------------------------------------------------

    if (t.toLowerCase().indexOf("hava ") === 0) {

        try {

            const city = t.slice(5).trim();

            const geoResponse = await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=" +
                encodeURIComponent(city) +
                "&count=1&language=tr&format=json"
            );

            const geo = await geoResponse.json();

            if (!geo.results || !geo.results.length) {
                return "Bu şehri bulamadım Reis 🌍";
            }

            const p = geo.results[0];

            const weatherResponse = await fetch(
                "https://api.open-meteo.com/v1/forecast?latitude=" +
                p.latitude +
                "&longitude=" +
                p.longitude +
                "&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto"
            );

            const weather = await weatherResponse.json();

            const current = weather.current;

            const code = current.weather_code;

            let durum = "bilinmiyor";

            if (code === 0) {
                durum = "açık ☀️";
            }
            else if (code <= 3) {
                durum = "bulutlu 🌤️";
            }
            else if (code <= 48) {
                durum = "sisli 🌫️";
            }
            else if (code <= 67) {
                durum = "yağmurlu 🌧️";
            }
            else if (code <= 77) {
                durum = "karlı ❄️";
            }
            else if (code <= 82) {
                durum = "sağanak yağışlı 🌧️";
            }
            else if (code <= 86) {
                durum = "kar yağışlı ❄️";
            }
            else {
                durum = "gök gürültülü ⛈️";
            }

            return (
                "📍 " + p.name +
                "\n🌡️ Sıcaklık: " +
                current.temperature_2m +
                "°C" +
                "\n🌤️ Durum: " +
                durum +
                "\n💨 Rüzgar: " +
                current.wind_speed_10m +
                " km/s"
            );

        }
        catch (e) {

            return "Hava bilgisine ulaşamadım Reis 🌤️";
        }
    }


    // --------------------------------------------------
    // WIKIPEDIA ARAMA
    // Kullanım:
    // ara Türkiye
    // --------------------------------------------------

    if (t.toLowerCase().indexOf("ara ") === 0) {

        try {

            const query = t.slice(4).trim();

            const response = await fetch(
                "https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
                encodeURIComponent(query) +
                "&format=json&origin=*"
            );

            const data = await response.json();

            if (
                data.query &&
                data.query.search &&
                data.query.search.length
            ) {

                const result = data.query.search[0];

                const snippet = result.snippet
                    .replace(/<[^>]*>/g, "");

                return (
                    "📚 " +
                    result.title +
                    "\n\n" +
                    snippet
                );
            }

        }
        catch (e) {}

        return "Aramada sonuç bulamadım Reis 📚";
    }


    // --------------------------------------------------
    // MODLAR
    // --------------------------------------------------

    if (/^mod asistan/i.test(t)) {

        localStorage.setItem(
            "nico_mode",
            "asistan"
        );

        return "Profesyonel Asistan modu aktif Reis 💼";
    }


    if (/^mod dost/i.test(t)) {

        localStorage.setItem(
            "nico_mode",
            "dost"
        );

        return "Dost modu aktif Reis 😎";
    }


    return null;
}


// ======================================================
// GERÇEK YAPAY ZEKA
// NICO → CLOUDFLARE WORKER → GEMINI
// ======================================================

async function askBrain(
    msgs,
    vision,
    notes
) {

    let worker =
        localStorage.getItem("nico_worker") ||
        WORKER_URL;


    if (
        !worker ||
        worker === "BURAYA_CLOUDFLARE_WORKER_URL"
    ) {

        return {
            text: null,
            err: "NICO Worker adresi ayarlanmamış Reis."
        };
    }


    worker = worker.trim();

    // URL sonunda / varsa kaldır
    worker = worker.replace(/\/+$/, "");


    // --------------------------------------------------
    // NICO MODU
    // --------------------------------------------------

    const mode =
        localStorage.getItem("nico_mode") ||
        "dost";


    // --------------------------------------------------
    // SİSTEM MESAJI
    // --------------------------------------------------

    const systemMessage = {

        role: "system",

        content:
            "Sen NICO adında gelişmiş bir Türkçe yapay zeka asistanısın. " +

            "Kurucun Sidar Aydın'dır. " +

            "Kullanıcıya gerektiğinde Reis diye hitap edebilirsin. " +

            "Samimi, doğal, akıllı ve yardımcı ol. " +

            "Soruyu gerçekten anlamaya çalış. " +

            "Bilmediğin bilgiyi uydurma. " +

            "Kod istenirse eksiksiz ve çalışabilir kod üret. " +

            "Türkçe konuş. " +

            "Mod: " +
            mode +
            ". " +

            "Kullanıcı hafızası: " +
            (notes || "yok")
    };


    // --------------------------------------------------
    // MESAJLARI HAZIRLA
    // --------------------------------------------------

    const messages = [
        systemMessage
    ];


    for (
        let index = 0;
        index < msgs.length;
        index++
    ) {

        const m = msgs[index];

        if (!m) continue;


        let content = m.content;


        // String değilse dönüştür
        if (typeof content !== "string") {

            if (Array.isArray(content)) {

                let text = "";

                for (
                    let j = 0;
                    j < content.length;
                    j++
                ) {

                    const part = content[j];

                    if (
                        part &&
                        part.type === "text"
                    ) {

                        text +=
                            part.text +
                            "\n";
                    }
                }

                content = text.trim();

            }
            else {

                content = "";
            }
        }


        messages.push({

            role:
                m.role === "assistant"
                    ? "assistant"
                    : "user",

            content:
                content || ""
        });
    }


    // --------------------------------------------------
    // CLOUDFLARE WORKER'A GÖNDER
    // --------------------------------------------------

    try {

        const response = await fetch(
            worker,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    messages: messages,

                    vision:
                        !!vision

                })
            }
        );


        let data;


        try {

            data =
                await response.json();

        }
        catch (e) {

            return {

                text: null,

                err:
                    "Worker geçerli cevap vermedi. HTTP " +
                    response.status
            };
        }


        // ------------------------------------------------
        // WORKER HATASI
        // ------------------------------------------------

        if (!response.ok) {

            return {

                text: null,

                err:
                    data.error ||
                    (
                        "Worker HTTP " +
                        response.status
                    )
            };
        }


        // ------------------------------------------------
        // GEMINI CEVABI
        // ------------------------------------------------

        if (
            data &&
            data.text
        ) {

            return {

                text: data.text,

                err: null
            };
        }


        return {

            text: null,

            err:
                "Gemini boş cevap verdi Reis."
        };


    }
    catch (e) {

        return {

            text: null,

            err:
                "NICO Worker bağlantı hatası: " +
                (e.message || e)
        };
    }
}


// ======================================================
// TEST
// ======================================================

async function testNicoBrain() {

    const result =
        await askBrain(

            [
                {
                    role: "user",

                    content:
                        "Merhaba NICO"
                }
            ],

            false,

            ""
        );


    console.log(
        "NICO BRAIN TEST:",
        result
    );


    return result;
}


// ======================================================
// NICO BRAIN SON
// ======================================================
