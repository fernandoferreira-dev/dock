# SafeCharge - E-Scooter Docking System

SafeCharge is a hybrid Web/Mobile application designed to manage and monitor electric scooter charging docks. This project integrates a responsive web interface with a physical hardware controller (ESP32), bridged seamlessly via Bluetooth using a MIT App Inventor wrapper.

## System Architecture

The project consists of three main components:

1. **Hardware (ESP32 Bluetooth)**
   A microcontroller embedded in the docking station. It reads the e-scooter's battery percentage and transmits this data continuously over Bluetooth. It also listens for specific serial commands ("CMD:UNLOCK" or "CMD:LOCK") to actuate the dock's mechanical locking relays. The source code is located in `/Hardware/ESP32_SafeCharge/`.

2. **Mobile Wrapper (MIT App Inventor)**
   A minimalist Android application acting solely as a Bluetooth-to-Web bridge. It connects to the ESP32 module, receives the hardware metrics, and injects them transparently into a full-screen `WebViewer` component.

3. **Frontend Application (HTML/Tailwind/JS)**
   The core user interface runs entirely inside the WebViewer, handling all business logic and state management:
   - `login.html`: Gatekeeper screen requiring an access code before exposing dock controls.
   - `index.html`: Main dashboard displaying the real-time battery status.
   - `graficos.html`: Utilizes Chart.js to plot battery charging progress over time.
   - `controlador.html`: Interface to manually trigger hardware dock mechanisms (Lock/Unlock).
   - `config.html`: User preferences, supporting persistent dark mode and language toggling.

## Deployment & Testing (GitHub Pages)

The frontend is continuously deployed via GitHub Pages upon pushing to the `main` branch. The application can be accessed via the repository's GitHub Pages URL.

To test the UI bypass locally or via the web:
1. Navigate to the `login.html` screen.
2. Enter the hardcoded development testing code: `6767-6767`.

## Hardware Setup

1. Navigate to the `/Hardware/ESP32_SafeCharge` directory.
2. Open the `ESP32_SafeCharge.ino` sketch in the Arduino IDE.
3. Ensure the ESP32 board and Bluetooth libraries are properly configured in your environment.
4. Flash the code to the ESP32 microcontroller.

## Dependencies

* **TailwindCSS**: Used via CDN for rapid, responsive styling.
* **Chart.js**: Graphing library for charging analytics.
* **Vanilla JavaScript**: State management and DOM interaction, utilizing `localStorage` for UI persistence.
