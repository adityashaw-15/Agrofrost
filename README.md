# AGROFROST: Solar-Powered Smart Mini Cold Storage System

> **Smart India Hackathon 2026 (SIH 2026)**  
> **Problem Statement ID:** SIH26005  
> **Target Region:** North Eastern Region (NER) Rural Agricultural Clusters  
> **Hardware Prototype Software & IoT Monitoring Web System**

---

## 1. Project Overview

**AGROFROST** is an IoT-enabled smart cold storage monitoring and control web platform designed specifically for off-grid and micro-grid vegetable preservation in remote areas of the North Eastern Region (NER) of India. 

The system couples low-power thermo-electric cooling (**Peltier TEC1-12706**), a 5-layer thermal buffering chamber with a water layer, solar energy storage (**50–100W PV Panel + 12V Battery**), and an **ESP32 microcontroller** with local data persistence and offline operation capabilities.

---

## 2. Problem Statement Addressed

Smallholder farmers in the North Eastern Region (NER) face significant post-harvest losses (up to 30–40%) for perishable crops like tomatoes, cabbages, french beans, leafy vegetables, and regional specialties such as King Chilli (Bhut Jolokia). Grid power in these rural belts is often unreliable or non-existent.

**AGROFROST** solves this by delivering:
- Zero-compressor thermoelectric Peltier cooling (12V DC native).
- 5-layer wall thermal insulation with a water thermal buffer layer to retain cold during solar outages.
- Local offline monitoring telemetry with auto-sync when network reconnects.

---

## 3. Physical Hardware System Architecture

The software directly represents and monitors the following physical hardware components:

```
[ 50-100W Solar Panel ] ──> [ Solar Charge Controller ] ──> [ 12V Energy Battery ]
                                                                   │
                                                                   ▼
[ Cold Storage Chamber ] ◄── [ Aluminium Cold Plate ] ◄── [ Peltier TEC1-12706 ] ──> [ Heatsink + 12V Fan ]
        │
        ├── DS18B20 Temp Sensor
        ├── DHT22 Humidity Sensor
        ├── Submerged Water Level Sensor
        └── ESP32 Microcontroller (Control Relays + Telemetry)
```

---

## 4. Key Features

- **Professional IoT Dashboard:** High-contrast, clean 3D raised buttons, card elevations, and real-time status indicators.
- **Chamber Climate Monitoring:** Recharts telemetry graphs for Temperature vs Time and Humidity vs Time across 24 Hours, 7 Days, and 30 Days.
- **5-Layer Chamber Visualization:** Interactive visual layer breakdown:
  1. Aluminium foil
  2. Hard plastic
  3. Water layer (thermal buffering)
  4. Thin plastic
  5. Thermocol insulation
- **Energy & Microgrid Management:** Telemetry for Solar Voltage (18.6V), Current (3.4A), Power (63W), and Battery state (12.2V / 82%).
- **Interactive Closed-Loop System Control:** Toggle Peltier cooling ON/OFF, CPU Fan mode (AUTO/ON/OFF), Energy source (SOLAR/BATTERY/AUTO), and configure target temperature setpoints with live simulation drift.
- **Smart Autonomous Alerts:** Multi-severity notifications (INFO, WARNING, CRITICAL) for temperature breaches, low thermal buffer water, low battery, and power failures.
- **Fresh Produce Inventory Registry:** Track stored crops, storage dates, target ranges, and notes with `localStorage` persistence.
- **Offline Operation Engine:** Offline mode toggle, pending sync record counter, and one-click "Sync Now" simulation.
- **Food Loss & Farmer Impact Analytics:** Simulated metrics for post-harvest loss avoidance and solar contribution with clear disclaimers.

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Custom 3D & Glassmorphism CSS
- **Visualization & Charts:** Recharts
- **Iconography:** Lucide React
- **Persistence & Simulation:** `localStorage`, Custom TypeScript Live Hardware Simulation Engine

---

## 6. Architecture & Data Flow

```
[ User UI Dashboard ]
         │
         ▼
[ SystemContext Store & Local Storage ]
         │
         ├── Offline Telemetry Cache
         │
         ▼ (Future REST / WebSocket / MQTT Protocol)
[ ESP32 Firmware Gateway ]
         │
         ├── Actuators: Peltier Relay, CPU Fan PWM Relay, Buzzer, Status LEDs
         └── Sensors: Temperature (DS18B20), Humidity (DHT22), Water Level, Solar/Battery ADC
```

---

## 7. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (TypeScript check & Vite bundling)
npm run build
```

---

## 8. Demo Credentials for SIH Evaluation

Click **Login Screen** or the profile icon in the top right to test mock role authentication:

- **Demo User:** `Demo Operator`
- **Password:** `demo123`
- **Available Roles:** Admin, Operator, Viewer

---

## 9. Simulation Engine Details

The website includes a live hardware simulation engine (`simulationRunning = true`):
- When **Cooling = ON**, temperature gradually drops towards target setpoint (4°C–10°C) and Peltier status shows `COOLING`.
- When **Cooling = OFF**, chamber temperature rises towards ambient (~28°C).
- Solar power cycles dynamically based on simulated time of day.
- Battery charges when Solar Power &gt; 45W and discharges when operating purely on battery.
- Simulated threshold breaches automatically create real-time alert logs and notification badges.

---

## 10. Future Hardware Integration Roadmap

The software architecture strictly isolates hardware communication into `src/context/SystemContext.tsx` and `src/components/pages/SettingsPage.tsx`.

To connect a physical ESP32 board in future phases:
1. Enable `REST API`, `WebSocket`, or `MQTT` in **Settings → Hardware Connection**.
2. Point fetch endpoints to ESP32 IP address (e.g., `http://192.168.4.1/api/v1/telemetry`).
3. Hardware control actions will POST JSON commands to ESP32 relays (`/api/v1/control/peltier?state=ON`).
