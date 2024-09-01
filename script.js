// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1SL5he0SXbq7bDW7OW-Wr9nl2Hk2pL90",
  authDomain: "smart-home-93faa.firebaseapp.com",
  databaseURL: "https://smart-home-93faa-default-rtdb.firebaseio.com",
  projectId: "smart-home-93faa",
  storageBucket: "smart-home-93faa.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to fetch sensor data
function fetchSensorData() {
  const sensorRef = ref(database, '/sensor');
  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    document.getElementById('temperature').innerText = data.temperature;
    document.getElementById('humidity').innerText = data.humidity;
    document.getElementById('gasValue').innerText = data.gas;
    document.getElementById('ldrValue').innerText = data.ldr;
    document.getElementById('motionDetected').innerText = data.motion ? "Yes" : "No";
    document.getElementById('vibrationDetected').innerText = data.vibration ? "Yes" : "No";

    // Alerts for specific conditions
    if (data.temperature > 35) {
      alert('Temperature exceeds 35°C!');
    }
    if (data.gas > 300) {
      alert('Gas level exceeds 300!');
    }
  });
}

// Function to fetch LED states and update button text
function fetchLEDStates() {
  const ledPaths = ['/ledStatus/led1', '/ledStatus/led2', '/ledStatus/led3', '/ledStatus/led4'];
  ledPaths.forEach((path, index) => {
    const ledRef = ref(database, path);
    onValue(ledRef, (snapshot) => {
      const ledState = snapshot.val();
      const ledButton = document.getElementById(`led${index + 1}`);
      ledButton.innerText = ledState ? "ON" : "OFF";
    });
  });
}

// Attach the toggleLED function to the window object to make it globally accessible
window.toggleLED = function(led) {
  const ledPath = ref(database, `/ledStatus/${led}`);
  get(ledPath).then((snapshot) => {
    const currentValue = snapshot.val();
    set(ledPath, currentValue === 0 ? 1 : 0).then(() => {
      // Update the button text after changing the state
      document.getElementById(led).innerText = currentValue === 0 ? "ON" : "OFF";
    });
  });
};

// Fetch sensor data and LED states on page load
window.onload = function() {
  fetchSensorData();
  fetchLEDStates();
};
