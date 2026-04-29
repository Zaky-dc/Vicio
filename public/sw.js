self.addEventListener('install', (event) => {
  console.log('SW installed');
});

self.addEventListener('fetch', (event) => {
  // basic pass-through
});
