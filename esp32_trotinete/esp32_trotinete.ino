#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

// Variáveis de Controlo
int nivelBateria = 100;
unsigned long ultimoEnvio = 0;
const int intervaloEnvio = 2000; // Envia o nível de bateria a cada 2 segundos (2000ms)

float saldoAtual = 0.0;

void setup() {
  Serial.begin(115200);
  
  // Inicializa o Bluetooth Classic do ESP32 com o nome visível no telemóvel
  SerialBT.begin("Trotinete_ESP32"); 
  Serial.println("Bluetooth Iniciado! Pode emparelhar o telemóvel com 'Trotinete_ESP32'.");
}

void loop() {
  // ==========================================================
  // 1. LER DADOS DO APP INVENTOR (PAGAMENTOS/COMANDOS)
  // ==========================================================
  if (SerialBT.available()) {
    // Lê tudo o que foi enviado até quebrar a linha ou esgotar
    String dadosRecebidos = SerialBT.readStringUntil('\n');
    dadosRecebidos.trim(); // Limpa espaços vazios ou quebras invisíveis
    
    if (dadosRecebidos.length() > 0) {
      int valorPagamento = dadosRecebidos.toInt();
      
      if (valorPagamento > 0) {
        saldoAtual += valorPagamento;
        Serial.print("💰 NOVO PAGAMENTO: ");
        Serial.print(valorPagamento);
        Serial.println(" EUR recebidos via Bluetooth!");
        Serial.print("💳 Saldo atual da Trotinete: ");
        Serial.println(saldoAtual);
        
        // TODO: Aqui ativa o relé do motor ou liberta as rodas da dock!
      }
    }
  }

  // ==========================================================
  // 2. ENVIAR DADOS PARA O APP INVENTOR (BATERIA)
  // ==========================================================
  // Usamos millis() no lugar do delay() para o processador não "congelar"
  if (millis() - ultimoEnvio > intervaloEnvio) {
    
    // --- SIMULAÇÃO --- 
    // Diminui a bateria 1% a cada envio só para podermos ver o site mudar.
    // No projeto final, trocar isto por: nivelBateria = analogRead(PINO_BATERIA);
    nivelBateria--;
    if(nivelBateria < 0) nivelBateria = 100;
    // -----------------

    // Envia o valor (ex: "85") para o App Inventor, juntando um fim de linha.
    SerialBT.println(nivelBateria);
    
    Serial.print("🔋 A enviar Bateria para o telemóvel: ");
    Serial.print(nivelBateria);
    Serial.println("%");

    ultimoEnvio = millis();
  }
}
