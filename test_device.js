// test_device.js (Final JSON-Fixed Version)
const mqtt = require('mqtt');

// Connect to Broker (1883)
const client = mqtt.connect('mqtt://localhost:1883');
const PREFIX = 'ITB/IIOT';

client.on('connect', () => {
    console.log('✅ HMI COMPATIBLE SIMULATOR CONNECTED!');
    console.log('🚀 Sending CORRECT JSON formats...');

    setInterval(() => {
        // --- 1. SYSTEM STATUS ---
        // Expects: { "mode": "automatic" }
        publish(`${PREFIX}/conveyor/system/mode`, { mode: "automatic" });
        
        // Expects: { "status": "live" }
        publish(`${PREFIX}/conveyor/power/electricity/status`, { status: "live" });

        // Expects: { "status": 1 }
        publish(`${PREFIX}/conveyor/mqtt_status`, { status: 1 });

        // --- 2. SENSORS (WRAP IN STATE) ---
        // Expects: { "state": true }
        publish(`${PREFIX}/conveyor/sensor/ir/state`, { state: false });
        publish(`${PREFIX}/conveyor/sensor/inductive/state`, { state: false });
        publish(`${PREFIX}/conveyor/sensor/capacitive/state`, { state: false });
        publish(`${PREFIX}/conveyor/sensor/position_inner/state`, { state: false });
        publish(`${PREFIX}/conveyor/sensor/position_outer/state`, { state: false });

        // --- 3. DYNAMIC DATA (WRAP IN STATE) ---
        const innerCount = Math.floor(Date.now() / 1000) % 100;
        const speed = 2500; 
        
        publish(`${PREFIX}/conveyor/sensor/object_inner/state`, { state: innerCount });
        publish(`${PREFIX}/conveyor/sensor/object_outer/state`, { state: innerCount + 5 });
        publish(`${PREFIX}/conveyor/sensor/motor_speed/state`, { state: speed });

        // --- 4. ACTUATORS (WRAP IN STATE) ---
        publish(`${PREFIX}/conveyor/feedback/actuator/DL/push`, { state: false });
        publish(`${PREFIX}/conveyor/feedback/actuator/DL/pull`, { state: false });
        publish(`${PREFIX}/conveyor/feedback/actuator/LD/push`, { state: false });
        publish(`${PREFIX}/conveyor/feedback/actuator/LD/pull`, { state: false });

        // --- 5. CONVEYOR RUNNING STATE ---
        // This is likely why it said "Idle" -> It thought conveyors were stopped!
        publish(`${PREFIX}/conveyor/actuator/stepper/inner`, { state: true });
        publish(`${PREFIX}/conveyor/actuator/stepper/outer`, { state: true });
        
        // New Feedback Topics
        publish(`${PREFIX}/conveyor/feedback/actuator/stepper/inner`, { state: false });
        publish(`${PREFIX}/conveyor/feedback/actuator/stepper/outer`, { state: true });

        process.stdout.write("🟢"); 
    }, 1000);
});

function publish(topic, payload) {
    // CRITICAL: We now stringify EVERY payload into JSON
    client.publish(topic, JSON.stringify(payload));
}