// server/api/health.ts
function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }
  const data = {
    status: "ok",
    service: "SNAGZ Intelligence API",
    deployment: "Vercel Serverless Function",
    time: (/* @__PURE__ */ new Date()).toISOString(),
    totalDeals: 32,
    totalStores: 39,
    pennyItemsCount: 11,
    aiConfigured: !!process.env.GEMINI_API_KEY
  };
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(200).json(data);
  } else {
    res.statusCode = 200;
    return res.end(JSON.stringify(data));
  }
}
export {
  handler as default
};
