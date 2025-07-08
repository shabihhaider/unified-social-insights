// src/serviceWorkerRegistration.ts

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is localhost for IPv6
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are localhost IPv4
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
    )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      // Running on localhost: check if service worker exists and is valid
      checkValidServiceWorker(swUrl, config);

      navigator.serviceWorker.ready.then(() => {
        console.log('Service worker ready (localhost)');
      });
    } else {
      // Not localhost — just register
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(reg => {
      if (reg.waiting) {
        config?.onUpdate?.(reg);
      } else {
        config?.onSuccess?.(reg);
      }
    })
    .catch(error => {
      console.error('Service worker registration failed:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(res => {
      if (
        res.status === 404 ||
        res.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then(reg =>
          reg.unregister().then(() => window.location.reload())
        );
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection — offline mode only');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.unregister();
    });
  }
}
