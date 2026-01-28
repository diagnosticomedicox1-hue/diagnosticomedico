const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = "AIzaSyApu8g_UEZhlvdRJo4I60_8KuXjEt5dGCk";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Probando conexión con Google Gemini (modelo 2.5-flash-lite)...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent("Hola, esto es una prueba de conexión. Responde con la palabra 'OK' si recibes este mensaje.");
        const response = await result.response;
        const text = response.text();
        console.log("Respuesta de Gemini:", text);
        if (text.includes("OK")) {
            console.log("✅ Prueba exitosa: La API Key es válida.");
        } else {
            console.log("⚠️ Respuesta inesperada, pero la conexión funcionó.");
        }
    } catch (error) {
        console.error("❌ Error de conexión con Gemini:");
        console.error(error);
    }
}

testGemini();
