var OR = localStorage.getItem("nico_or") || "";
var G = localStorage.getItem("nico_g") || "";

/* =====================================================
   NICO KOMUTLARI
===================================================== */

async function brainCommand(t) {

    if (t.indexOf("G-KEY:") === 0) {

        var key = t.slice(6).trim();

        if (!key) {
            return "Gemini anahtarı boş Reis.";
        }

        localStorage.setItem("nico_g", key);

        G = key;

        return "Gemini beyni bağlandı Reis 🧠";
    }


    if (t.indexOf("OR-KEY:") === 0) {

        var key2 = t.slice(7).trim();

        if (!key2) {
            return "OpenRouter anahtarı boş Reis.";
        }

        localStorage.setItem("nico_or", key2);

        OR = key2;

        return "Yedek beyin bağlandı Reis 🧠";
    }


    /* HAVA */

    if (t.indexOf("hava ") === 0) {

        try {

            var city =
                t.slice(5).trim();

            var g =
                await (
                    await fetch(
                        "https://geocoding-api.open-meteo.com/v1/search?name="
                        + encodeURIComponent(city)
                        + "&count=1&language=tr"
                    )
                ).json();


            if (
                g.results &&
                g.results[0]
            ) {

                var p = g.results[0];


                var w =
                    await (
                        await fetch(
                            "https://api.open-meteo.com/v1/forecast?latitude="
                            + p.latitude
                            + "&longitude="
                            + p.longitude
                            + "&current_weather=true"
                        )
                    ).json();


                var cw =
                    w.current_weather;


                var k =
                    cw.weathercode;


                var d2 =
                    k === 0
                        ? "açık ☀️"
                        : k < 3
                        ? "az bulutlu 🌤️"
                        : k < 45
                        ? "kapalı ☁️"
                        : k < 51
                        ? "sisli 🌫️"
                        : k < 71
                        ? "yağmurlu 🌧️"
                        : k < 95
                        ? "karlı ❄️"
                        : "gök gürültülü ⛈️";


                return (
                    p.name
                    + ": "
                    + cw.temperature
                    + "°C, "
                    + d2
                );
            }

        } catch (e) {

            console.error(
                "Hava hatası:",
                e
            );
        }


        return "Hava bilgisi alınamadı Reis 🌤️";
    }


    /* WIKIPEDIA */

    if (t.indexOf("ara ") === 0) {

        try {

            var search =
                t.slice(4).trim();


            var s =
                await (
                    await fetch(
                        "https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch="
                        + encodeURIComponent(search)
                        + "&format=json&origin=*"
                    )
                ).json();


            var result =
                s.query &&
                s.query.search
                    ? s.query.search[0]
                    : null;


            if (result) {

                return (
                    "📚 "
                    + result.title
                    + ": "
                    + result.snippet
                        .replace(/<[^>]+>/g, "")
                );
            }

        } catch (e) {

            console.error(
                "Arama hatası:",
                e
            );
        }


        return "Bulamadım Reis 📚";
    }


    if (
        /^mod asistan/i.test(t)
    ) {

        return "Asistan modu aktif Reis 💼";
    }


    if (
        /^mod dost/i.test(t)
    ) {

        return "Dost modu aktif Reis 😎";
    }


    return null;
}


/* =====================================================
   NICO ANA BEYİN
===================================================== */

async function askBrain(
    msgs,
    vision,
    notes
) {

    var mode = "dost";


    msgs.forEach(function (m) {

        if (
            m.role === "user" &&
            typeof m.content === "string"
        ) {

            if (
                /mod asistan/i.test(
                    m.content
                )
            ) {

                mode = "asistan";

            } else if (
                /mod dost/i.test(
                    m.content
                )
            ) {

                mode = "dost";
            }
        }
    });


    var sys =
        (
            mode === "asistan"
                ? "ASİSTAN modu: profesyonel, net ve düzenli cevap ver. "
                : "DOST modu: samimi, doğal ve esprili ol; kullanıcıya Reis diye hitap et. "
        )
        +
        "Sen NICO adında Türkçe konuşan yapay zeka asistanısın. "
        +
        "Kurucun Sidar Aydın'dır. "
        +
        "Sorulursa 'Ben Sidar Aydın'ın eseriyim' de. "
        +
        "Bilmediğin bilgiyi uydurma. "
        +
        "Kullanıcının sorusuna doğrudan cevap ver. "
        +
        "Tercihler: "
        +
        (notes || "yok");


    var err =
        "Bağlı yapay zeka beyni bulunamadı Reis.";


    /* =================================================
       GEMINI
    ================================================= */

    if (G) {

        try {

            var contents = [];


            for (
                var i = 0;
                i < msgs.length;
                i++
            ) {

                var m =
                    msgs[i];


                if (
                    m.role === "system"
                ) {

                    continue;
                }


                var parts = [];


                if (
                    typeof m.content === "string"
                ) {

                    parts.push({
                        text: m.content
                    });

                } else if (
                    Array.isArray(m.content)
                ) {

                    for (
                        var j = 0;
                        j < m.content.length;
                        j++
                    ) {

                        var p =
                            m.content[j];


                        if (
                            p.type === "text"
                        ) {

                            parts.push({
                                text: p.text
                            });

                        } else if (
                            p.type === "image_url"
                        ) {

                            var url =
                                p.image_url &&
                                p.image_url.url;


                            if (
                                url &&
                                url.indexOf(
                                    "data:"
                                ) === 0
                            ) {

                                var comma =
                                    url.indexOf(",");


                                if (comma !== -1) {

                                    var header =
                                        url.slice(
                                            5,
                                            comma
                                        );


                                    var base64 =
                                        url.slice(
                                            comma + 1
                                        );


                                    var mime =
                                        header.split(
                                            ";"
                                        )[0]
                                        || "image/jpeg";


                                    parts.push({

                                        inline_data: {

                                            mime_type:
                                                mime,

                                            data:
                                                base64
                                        }

                                    });
                                }
                            }
                        }
                    }
                }


                if (parts.length) {

                    contents.push({

                        role:
                            m.role === "user"
                                ? "user"
                                : "model",

                        parts: parts
                    });
                }
            }


            if (!contents.length) {

                throw new Error(
                    "Gönderilecek mesaj bulunamadı."
                );
            }


            var url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + encodeURIComponent(G);


            var r =
                await fetch(
                    url,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            system_instruction: {

                                parts: [
                                    {
                                        text: sys
                                    }
                                ]

                            },

                            contents: contents,

                            generationConfig: {

                                temperature: 0.7,

                                maxOutputTokens:
                                    1500

                            }

                        })
                    }
                );


            var d =
                await r.json();


            if (!r.ok) {

                err =
                    "Gemini "
                    + r.status
                    + ": "
                    + (
                        d.error &&
                        d.error.message
                            ? d.error.message
                            : "API hatası"
                    );

            } else {

                var answer =
                    d.candidates &&
                    d.candidates[0] &&
                    d.candidates[0].content &&
                    d.candidates[0].content.parts;


                if (
                    answer &&
                    answer.length
                ) {

                    var text = "";

                    answer.forEach(
                        function (part) {

                            if (part.text) {
                                text += part.text;
                            }

                        }
                    );


                    if (text.trim()) {

                        return {
                            text: text.trim()
                        };
                    }
                }


                err =
                    "Gemini cevap üretmedi.";
            }

        } catch (e) {

            err =
                "Gemini bağlantı hatası: "
                + (
                    e.message || e
                );

        }
    }


    /* =================================================
       OPENROUTER YEDEK BEYİN
    ================================================= */

    if (OR) {

        try {

            var messages = [

                {
                    role: "system",
                    content: sys
                }

            ];


            msgs
                .slice(-12)
                .forEach(
                    function (m) {

                        if (
                            typeof m.content === "string"
                        ) {

                            messages.push({

                                role:
                                    m.role === "user"
                                        ? "user"
                                        : "assistant",

                                content:
                                    m.content

                            });
                        }
                    }
                );


            var orResponse =
                await fetch(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + OR,

                            "HTTP-Referer":
                                window.location.origin,

                            "X-Title":
                                "NICO AI Assistant"

                        },

                        body: JSON.stringify({

                            model:
                                "meta-llama/llama-3.3-70b-instruct:free",

                            messages:
                                messages,

                            temperature:
                                0.7,

                            max_tokens:
                                1500

                        })

                    }
                );


            var od =
                await orResponse.json();


            if (!orResponse.ok) {

                err =
                    "OpenRouter "
                    + orResponse.status
                    + ": "
                    + (
                        od.error &&
                        od.error.message
                            ? od.error.message
                            : "API hatası"
                    );

            } else {

                var ot =
                    od.choices &&
                    od.choices[0] &&
                    od.choices[0].message &&
                    od.choices[0].message.content;


                if (ot) {

                    return {
                        text:
                            ot.trim()
                    };
                }
            }

        } catch (e) {

            err =
                "OpenRouter hatası: "
                + (
                    e.message || e
                );
        }
    }


    /* =================================================
       SON YEDEK
    ================================================= */

    try {

        var lastM =
            msgs[msgs.length - 1];


        var lp = "";


        if (lastM) {

            if (
                typeof lastM.content === "string"
            ) {

                lp =
                    lastM.content;

            } else if (
                Array.isArray(
                    lastM.content
                )
            ) {

                var textPart =
                    lastM.content.find(
                        function (x) {
                            return (
                                x.type === "text"
                            );
                        }
                    );


                lp =
                    textPart
                        ? textPart.text
                        : "";
            }
        }


        if (lp) {

            var fallbackUrl =
                "https://text.pollinations.ai/"
                + encodeURIComponent(
                    sys
                    + "\n\nKullanıcının sorusu:\n"
                    + lp
                );


            var fallback =
                await fetch(
                    fallbackUrl
                );


            if (fallback.ok) {

                var ft =
                    await fallback.text();


                if (
                    ft &&
                    ft.length < 4000
                ) {

                    return {
                        text:
                            ft.trim()
                    };
                }
            }
        }

    } catch (e) {

        console.log(
            "Yedek beyin çalışmadı:",
            e
        );
    }


    return {

        text: null,

        err: err

    };
}


/* =====================================================
   EN ÖNEMLİ KISIM
   nico.js'nin askBrain'e erişmesini garanti eder.
===================================================== */

window.brainCommand =
    brainCommand;

window.askBrain =
    askBrain;

console.log(
    "NICO brain.js başarıyla yüklendi 🧠"
);
