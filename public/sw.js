// service-worker.js
const CACHE_NAME = 'clarityflow-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other assets you want to cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});

// Periodic sync for reminders (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminders') {
    event.waitUntil(showDailyReminders());
  }
});

async function showDailyReminders() {
  const now = new Date();
  const options = {
    body: 'Time for your daily visualization practice!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png'
  };
  
  // Show morning reminder at 5 AM
  if (now.getHours() === 5 && now.getMinutes() === 0) {
    await self.registration.showNotification('Morning Reminder', {
      ...options,
      body: '🌞 Start your day with positive visualizations!'
    });
  }
  
  // Show evening reminder at 8 PM
  if (now.getHours() === 20 && now.getMinutes() === 0) {
    await self.registration.showNotification('Evening Reminder', {
      ...options,
      body: '🌙 Reflect on your visualizations before bed'
    });
  }
}

// Check for notifications every hour
function checkForReminders() {
  const now = new Date();
  showDailyReminders();
  
  // Calculate time until next hour
  const minutesToNextHour = 60 - now.getMinutes();
  setTimeout(checkForReminders, minutesToNextHour * 60 * 1000);
}

// Start the reminder check
checkForReminders();