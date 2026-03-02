self.addEventListener("install", e => {
  console.log("App instalada");
});

self.addEventListener("fetch", e => {
  // cache básico (lo mejoramos después)
});