const WORKER_URL = "https://bitter-haze-2503.usermame5252.workers.dev";

async function brainCommand(t) {
    if (t.indexOf("G-KEY:") === 0) {
        return "API anahtarı artık Worker üzerinden kullanılıyor Reis 🧠";
    }

    if (t.indexOf("OR-KEY:") === 0) {
        return "Yedek API anahtarı bu sürümde Worker üzerinden yönetiliyor Reis 🧠";
    }

    if (t.indexOf("hava ") === 0) {
        try {
            const g = await (
                await fetch(
                    "https://geocoding-api.open-meteo.com/v1/search?name=" +
                    encodeURIComponent(t.slice(5)) +
                    "&count=1&language=tr"
                )
            ).json();

            if (g.results && g.results[0]) {
                const p = g.results[0];

                const w = await (
                    await fetch(
                        "https://api.open-meteo.com/v1/forecast?latitude=" +
                        p.latitude +
                        "&longitude=" +
                        p.longitude +
                        "&current_weather=true"
                    )
                ).json();

                const cw = w.current_weather;

                let d = "bilinmiyor";
                if (cw.weathercode === 0) d = "açık ☀️";
                else if (cw.weathercode < 3) d = "az bulutlu 🌤️";
                else if (cw.weathercode < 45) d = "kapalı ☁️";
                else if (cw.weathercode < 51) d = "sisli 🌫️";
                else if (cw.weathercode < 71) d = "yağmurlu 🌧️";
                else if (cw.weathercode < 95) d = "karlı ❄️";
                else d = "gök gürültülü ⛈️";

                return p.name + ": " + cw.temperature + "°C, " + d;
            }
        } catch (e) {}

        return "Hava bilgisi alınamadı Reis 🌤️";
    }

    if (t.indexOf("ara ") === 0) {
        try {
            const s = await (
                await fetch(
                    "https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
                    encodeURIComponent(t.slice(4)) +
                    "&format=json&origin=*"
                )
            ).json();

            const r = s.query && s.query.search
                ? s.query.search[0]
                : null;

            if (r) {
                return (
                    "📚 " +
                    r.title +
                    ": " +
                    r.snippet.replace(/<[^>]+>/g, "")
                );
            }
        } catch (e) {}

        return "Bulamadım Reis 📚";
    }

    if (/^mod asistan/i.test(t)) {
        return "Asistan modu aktif Reis 💼";
    }

    if (/^mod dost/i.test(t)) {
        return "Dost modu aktif Reis 😎";
    }

    return null;
}


async function askBrain(msgs, vision, notes) {

    const mode = "dost";

    const system =
        "Sen NICO adında gelişmiş bir yapay zeka asistanısın. " +
        "Kurucun Sidar Aydın'dır. " +
        "Türkçe konuş. " +
        "Kullanıcıya Reis diye hitap edebilirsin. " +
        "Samimi, zeki, doğal ve yardımcı ol. " +
        "Gerektiğinde ayrıntılı cevap ver. " +
        "Kod yazabilir, açıklama yapabilir ve fikir üretebilirsin. " +
        "Kısa ama faydalı cevaplar ver. " +
        "Kullanıcının notları: " +
        (notes || "yok");


    try {

        const response = await fetch(
            WORKER_URL + "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    system: system,

                    messages: msgs.map(function (m) {

                        let content = m.content;

                        if (typeof content !== "string") {
                            content =
                                content
                                    .map(function (x) {
                                        return x.text || "";
                                    })
                                    .join("\n");
                        }

                        return {
                            role:
                                m.role === "assistant"
                                    ? "assistant"
                                    : "user",

                            content: content
                        };
                    })
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            return {
                text: null,

                err:
                    "NICO Worker hatası: " +
                    (data.error || response.status)
            };
        }


        if (!data.ok || !data.text) {

            return {
                text: null,

                err:
                    data.error ||
                    "NICO cevap alamadı."
            };
        }


        return {
            text: data.text
        };


    } catch (e) {

        return {
            text: null,

            err:
                "NICO Worker bağlantı hatası: " +
                (e.message || e)
        };
    }
}
