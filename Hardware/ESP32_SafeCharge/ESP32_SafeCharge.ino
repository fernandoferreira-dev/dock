#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

// UART
#define TXD2 21 
#define RXD2 22 

// sensores/switches 
#define PIN_SW3      13  
#define PIN_SW2      14  
#define PIN_SW1      27  
#define PIN_SW0      26  
#define PIN_SYNC     25  
#define PIN_BTN_RST  33  
#define PIN_APP_RST  32  

// Pinos para a Fechadura (Exemplo: Relés em dois pinos)
// Apenas defina consoante a sua eletrónica
#define PIN_LOCK_RELAY 15

// Variáveis de bateria (0 a 100)
int counter3 = 0, counter2 = 0, counter1 = 0, counter0 = 0;

// Estados anteriores para detectar quando a trotinete é inserida
bool lastS3 = false, lastS2 = false, lastS1 = false, lastS0 = false;
bool lastSyncState = false;

unsigned long lastReportTime = 0;

void setup() {
  Serial.begin(115200); 
  Serial2.begin(2400, SERIAL_8N1, RXD2, TXD2); 

  // Configuração dos Pinos com Pull-down para evitar leituras falsas
  pinMode(PIN_SW3, INPUT_PULLDOWN);
  pinMode(PIN_SW2, INPUT_PULLDOWN);
  pinMode(PIN_SW1, INPUT_PULLDOWN);
  pinMode(PIN_SW0, INPUT_PULLDOWN);
  pinMode(PIN_SYNC, INPUT_PULLDOWN);
  pinMode(PIN_BTN_RST, INPUT_PULLDOWN);
  
  pinMode(PIN_APP_RST, OUTPUT);
  digitalWrite(PIN_APP_RST, LOW);

  pinMode(PIN_LOCK_RELAY, OUTPUT);
  digitalWrite(PIN_LOCK_RELAY, LOW); // Assumimos Fechado por defeito (LOW)

  // Iniciar comunicação Bluetooth que a App Inventor vai procurar
  SerialBT.begin("ESP32_SafeCharge");
}

void loop() {
  if (Serial.available() >= 4) {
    uint8_t t = Serial.read();
    uint8_t b = Serial.read();
    uint8_t tr = Serial.read();
    uint8_t init = Serial.read();
    
    // Repassa para a Basys2
    Serial2.write(0xFF); 
    Serial2.write(t);
    Serial2.write(b);
    Serial2.write(tr);
    Serial2.write(init);
    
    while(Serial.available() > 0) Serial.read(); 

    // Reset 
    if (init == 1) { 
      counter3 = 0; counter2 = 0; counter1 = 0; counter0 = 0;
      digitalWrite(PIN_APP_RST, HIGH);
    } else {
      digitalWrite(PIN_APP_RST, LOW);
    }
  }

  
  if (Serial2.available()) {
    uint8_t status = Serial2.read();
    Serial.printf("HW_STATE:%d\n", status);
  }

  bool s3 = digitalRead(PIN_SW3);
  bool s2 = digitalRead(PIN_SW2);
  bool s1 = digitalRead(PIN_SW1);
  bool s0 = digitalRead(PIN_SW0);
  bool currentSync = digitalRead(PIN_SYNC);

  if (s3 && !lastS3) counter3 = 0;
  if (s2 && !lastS2) counter2 = 0;
  if (s1 && !lastS1) counter1 = 0;
  if (s0 && !lastS0) counter0 = 0;

  
  lastS3 = s3; lastS2 = s2; lastS1 = s1; lastS0 = s0;

  // CARREGAMENTO
  if (currentSync == HIGH && lastSyncState == LOW) {
    if (s3 && counter3 < 100) counter3++;
    if (s2 && counter2 < 100) counter2++;
    if (s1 && counter1 < 100) counter1++;
    if (s0 && counter0 < 100) counter0++;
  }
  lastSyncState = currentSync;

  if (digitalRead(PIN_BTN_RST) == HIGH) {
    counter3 = 0; counter2 = 0; counter1 = 0; counter0 = 0;
  }

  // *** LEITURA DE COMANDOS BLUETOOTH (DA PÁGINA WEB ATRAVÉS DO APP INVENTOR) ***
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\n'); // Ligar o buffer de série
    command.trim();

    if (command.startsWith("CMD:")) {
      Serial.println("Comando Bluetooth Recebido: " + command);
      
      // Controla fisicamente a fechadura
      if (command == "CMD:UNLOCK") {
         digitalWrite(PIN_LOCK_RELAY, HIGH);
         Serial.println("Fechadura ABERTA!");
      } 
      else if (command == "CMD:LOCK") {
         digitalWrite(PIN_LOCK_RELAY, LOW);
         Serial.println("Fechadura FECHADA!");
      }
    }
  }

  if (millis() - lastReportTime >= 1000) {
    lastReportTime = millis();
    
    // FORMATO USADO NA APLICAÇÃO WEB
    String output = "SPACES: " + String(s3) + "," + String(counter3) + " | " + 
                    String(s2) + "," + String(counter2) + " | " + 
                    String(s1) + "," + String(counter1) + " | " + 
                    String(s0) + "," + String(counter0);
    
    Serial.println(output); 
    SerialBT.println(output); // MANDAR PARA O TELEMÓVEL!!!!!

    // Sinal de fim de carregamento
    if (counter3 >= 100 || counter2 >= 100 || counter1 >= 100 || counter0 >= 100) {
      Serial.println("SINAL: Fim de carregamento (100% atingido)");
      SerialBT.println("CMD:END_CHARGE");
    }
  }
}