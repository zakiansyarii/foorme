export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Metode tidak didukung." });
  }

  const endpoint = process.env.APPS_SCRIPT_URL;
  if (!endpoint) {
    return res.status(503).json({
      success: false,
      message: "Server belum dikonfigurasi. Tambahkan APPS_SCRIPT_URL di Environment Variables Vercel.",
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });
    const result = await response.json();
    return res.status(response.ok ? 200 : 502).json(result);
  } catch {
    return res.status(502).json({
      success: false,
      message: "Tidak dapat menghubungi Google Apps Script. Periksa URL dan deployment Apps Script.",
    });
  }
}
