const fs = require("fs");
const path = require("path");

const bar = (active) => {
  const links = [
    { href: "/", label: "BDF Production (accueil)", key: "hub" },
    { href: "/flyers/index.html", label: "Flyer Éclair", key: "flyers" },
    { href: "/parfums", label: "Parfums", key: "parfums" },
    { href: "/bdf-production/index.html", label: "BDF Production", key: "bdf" },
  ];
  const items = links
    .map(
      (l) =>
        `<a href="${l.href}" style="color:${
          l.key === active ? "#fff" : "rgba(255,255,255,.65)"
        };text-decoration:none;font-weight:${
          l.key === active ? "700" : "500"
        };padding:4px 10px;border-radius:999px;${
          l.key === active ? "background:rgba(255,255,255,.15);" : ""
        }">${l.label}</a>`
    )
    .join("");
  return `<div style="background:#0b0b12;padding:8px 16px;display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;position:fixed;top:0;left:0;right:0;height:40px;box-sizing:border-box;z-index:100000;">${items}</div>
<style>body{padding-top:40px !important;}header{top:40px !important;}</style>`;
};

const targets = [
  { dir: "public/flyers", active: "flyers" },
  { dir: "public/bdf-production", active: "bdf" },
];

const root = path.join(__dirname, "..");

for (const t of targets) {
  const dirPath = path.join(root, t.dir);
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".html"));
  for (const f of files) {
    const filePath = path.join(dirPath, f);
    let html = fs.readFileSync(filePath, "utf8");
    if (html.includes("data-hub-nav")) continue;
    const injected = bar(t.active).replace(
      "<div style=",
      '<div data-hub-nav="1" style='
    );
    html = html.replace(/<body([^>]*)>/, (m) => `${m}\n${injected}`);
    fs.writeFileSync(filePath, html, "utf8");
    console.log("Injected into", t.dir + "/" + f);
  }
}
