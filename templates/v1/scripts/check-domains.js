#!/usr/bin/env node
require('dotenv').config();
const https = require('https');

const USER = process.env.NAMECOM_USERNAME;
const TOKEN = process.env.NAMECOM_API_TOKEN;

if (!USER || !TOKEN) {
  console.error("Set NAMECOM_USERNAME and NAMECOM_API_TOKEN");
  process.exit(1);
}

const name = process.argv[2];
if (!name) {
  console.error("Usage: node check.js <name>");
  process.exit(1);
}

const TLDs = ["com","net","org","io","co","app","dev","ai","info","biz","me"];
const domains = TLDs.map(t => `${name}.${t}`);

const body = JSON.stringify({ domainNames: domains });
const auth = Buffer.from(`${USER}:${TOKEN}`).toString("base64");

const opts = {
  hostname: "api.name.com",
  path: "/core/v1/domains:checkAvailability",
  method: "POST",
  headers: {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  }
};

const req = https.request(opts, res => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    const json = JSON.parse(data);

    console.log("\nAvailable Domains:\n");

    json.results.forEach(r => {
      if (r.purchasable) {
        const price = r.products?.[0]?.purchasePrice || r.purchasePrice || "???";
        console.log(`${r.domainName}  →  ${price} USD`);
      }
    });
  });
});

req.on("error", e => console.error("Error:", e));
req.write(body);
req.end();
