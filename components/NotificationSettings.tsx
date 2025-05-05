// components/NotificationSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';


// Custom Switch Component
const CustomSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export function NotificationSettings() {
  const [isClient, setIsClient] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morningTime, setMorningTime] = useState('08:00');
  const [eveningTime, setEveningTime] = useState('20:00');
  const [showPrayerTab, setShowPrayerTab] = useState(true);
  const [prayerReminders, setPrayerReminders] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '05:00',
    dhuhr: '13:00',
    asr: '16:00',
    maghrib: '18:00',
    isha: '20:00'
  });

  const [showTestNotification, setShowTestNotification] = useState(false);

  // Add function to send test notification
  const sendTestNotification = async () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification('Test Notification', {
            body: 'This is a test notification to verify your settings.',
            icon: '/icons/mosque-icon.png',
            badge: '/icons/badge-72x72.png',
            tag: 'test-notification'
          });
        } else {
          alert('Notification permission denied. Please enable notifications in your browser settings.');
        }
      } catch (error) {
        console.error('Error sending test notification:', error);
        alert('Failed to send test notification. Please check your browser settings.');
      }
    }
  };

  const togglePrayerTab = () => {
    const newValue = !showPrayerTab;
    setShowPrayerTab(newValue);
    saveToLocalStorage('showPrayerTab', String(newValue));
    
    // Dispatch custom event to notify NavigationTabs
    window.dispatchEvent(new Event('prayerTabChange'));
  };

  // Load all settings from localStorage
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('notificationsEnabled') === 'true';
      const morning = localStorage.getItem('morningTime') || '08:00';
      const evening = localStorage.getItem('eveningTime') || '20:00';
      const showPrayer = localStorage.getItem('showPrayerTab') !== 'false';
      const prayerRemindersEnabled = localStorage.getItem('prayerReminders') === 'true';
      const savedPrayerTimes = JSON.parse(
        localStorage.getItem('prayerTimes') || 
        JSON.stringify({
          fajr: '05:00',
          dhuhr: '13:00',
          asr: '16:00',
          maghrib: '18:00',
          isha: '20:00'
        })
      );
      
      setNotificationsEnabled(enabled);
      setMorningTime(morning);
      setEveningTime(evening);
      setShowPrayerTab(showPrayer);
      setPrayerReminders(prayerRemindersEnabled);
      setPrayerTimes(savedPrayerTimes);
    }
  }, []);

  const saveToLocalStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notifications blocked. Please enable them in browser settings.');
        return;
      }
    }
    
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    saveToLocalStorage('notificationsEnabled', String(newValue));
    
    if (newValue) {
      scheduleNotifications();
    }
  };


  const togglePrayerReminders = () => {
    const newValue = !prayerReminders;
    setPrayerReminders(newValue);
    saveToLocalStorage('prayerReminders', String(newValue));
    
    if (newValue) {
      schedulePrayerNotifications();
    }
  };

  const handlePrayerTimeChange = (prayer: string, time: string) => {
    const newPrayerTimes = { ...prayerTimes, [prayer]: time };
    setPrayerTimes(newPrayerTimes);
    saveToLocalStorage('prayerTimes', JSON.stringify(newPrayerTimes));
    
    if (prayerReminders) {
      schedulePrayerNotifications();
    }
  };

  const scheduleNotifications = () => {
    try {
      // Save to localStorage
      saveToLocalStorage('morningTime', morningTime);
      saveToLocalStorage('eveningTime', eveningTime);
      
      // Schedule the notifications here
      console.log('Scheduling notifications for', morningTime, 'and', eveningTime);
      
      // Show success toast
      toast.success('Settings saved successfully!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };

  const schedulePrayerNotifications = () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window && prayerReminders) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => {
            if (notification.tag?.startsWith('prayer-')) {
              notification.close();
            }
          });
        });
        
        Object.entries(prayerTimes).forEach(([name, time]) => {
          if (!time) return;
          
          const [hours, minutes] = time.split(':').map(Number);
          const now = new Date();
          const notificationTime = new Date();
          
          notificationTime.setHours(hours, minutes, 0, 0);
          if (notificationTime < now) {
            notificationTime.setDate(notificationTime.getDate() + 1);
          }
          
          const delay = notificationTime.getTime() - now.getTime();
          
          setTimeout(() => {
            registration.showNotification(`Time for ${name} Prayer`, {
              body: `It's time for ${name} prayer. May your prayers be accepted.`,
              icon: '/icons/mosque-icon.png',
              badge: '/icons/badge-72x72.png',
              tag: `prayer-${name}`
            });
          }, delay);
        });
      });
    }
  };

  if (!isClient) {
    return <div className="p-4 border rounded-lg">Loading settings...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
      
      <div className="space-y-4">
        {/* General Notifications */}
        <div className="flex items-center justify-between">
          <span>Enable General Reminders</span>
          <CustomSwitch
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
        </div>
        
        {notificationsEnabled && (
          <>
            <div>
              <label className="block mb-1">Morning Reminder</label>
              <input
                type="time"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Evening Reminder</label>
              <input
                type="time"
                value={eveningTime}
                onChange={(e) => setEveningTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}
        
        {/* Prayer Settings */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={20} className="text-primary" />
            <h4 className="font-medium">Prayer Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Show Prayer Tab</span>
              <CustomSwitch
                checked={showPrayerTab}
                onChange={togglePrayerTab}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Enable Prayer Reminders</span>
              <CustomSwitch
                checked={prayerReminders}
                onChange={togglePrayerReminders}
              />
            </div>
            
            {prayerReminders && (
              <div className="space-y-3">
                {Object.entries(prayerTimes).map(([prayer, time]) => (
                  <div key={prayer} className="flex items-center justify-between">
                    <span className="capitalize">{prayer}</span>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handlePrayerTimeChange(prayer, e.target.value)}
                      className="p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Test Notifications</span>
                <CustomSwitch
                  checked={showTestNotification}
                  onChange={setShowTestNotification}
                />
              </div>
              
              {showTestNotification && (
                <button
                  onClick={sendTestNotification}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Send Test PWA CHECKK Notification
                </button>
              )}
            </div>
        
        <button
          onClick={() => {
            scheduleNotifications();
            if (prayerReminders) schedulePrayerNotifications();
          }}
          className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600 transition-colors"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
}