# SafeCharge - Trotinete Docking App

SafeCharge (também referida como a aplicação Dock) é uma solução Web/Mobile combinada para gerir e monitorizar contentores e docas de carregamento de trotinetes elétricas. Este projeto conjuga uma Interface Web otimizada e um controlador físico (Hardware baseado em ESP32) ligados de forma transparente através de **Microsoft App Inventor** via Bluetooth.

## 🚀 Arquitetura do Sistema

O sistema é comporto por três pilares principais:

1. **O Hardware (ESP32 Bluetooth):**
   Um microcontrolador ESP32 alojado na placa dos cacifos. Lê a percentagem do nível de bateria e envia os dados contínuos. Fica à espera de comandos seriais ("CMD:UNLOCK" ou "CMD:LOCK") para atuar em relés de abertura/fecho mecânico. Encontra-se na pasta `/Hardware/ESP32_SafeCharge/`.

2. **Ponte Mobile (MIT App Inventor):**
   A aplicação nativa para Android reduzida apenas a 3 blocos lógicos. A sua única função é conectar-se ao Bluetooth (`ESP32_SafeCharge`), receber as métricas, e exibi-las invisivelmente dentro do ecrã de navegação principal configurado num componente `WebViewer`.

3. **Frontend da Aplicação (HTML/Tailwind/JS):**
   A aplicação Web interativa desenvolvida usando HTML5 puro e Tailwind CSS. Uma vez que o fluxo corre no WebViewer, toda a lógica de negócio existe puramente nestes ficheiros:
   - `login.html`: Gatekeeper que impede acesso sem a palavra-passe correta (Código base da dock/admin).
   - `index.html`: Home dashboard que mostra bateria em tempo real e serve de painel central.
   - `graficos.html`: Utiliza a biblioteca Chart.js para interpolar o tempo de carregamento da trotinete vs % ganha desde a hora conectada à doca.
   - `controlador.html`: Controlos diretos à fechadura. Ao clicar em Botões como "Abrir Dock" emite comandos interceptados pelo App Inventor e despachados para o ESP32.
   - `config.html`: Definições pessoais localizadas que suportam Dark Mode e Multilingue (Português / Inglês).

## 🛠 Instalação e Testes (Github Pages)

Qualquer push para a branch `main` normaliza a atualização dos UI no GitHub Pages.
Podes aceder à infraestrutura diretamente pelo URL mapeado do teu repositório (ex: `https://[username].github.io/dock/login.html`).

Para testares a UI:
1. Acede à zona de `login.html`.
2. Códigos embutidos de testes rápidos: **`6767-6767`**.

## 🧱 Hardware (Como instalar no ESP32)

1. Abre a pasta `/Hardware/ESP32_SafeCharge`.
2. Garante que possuis a placa ESP32 instalada no Arduino IDE.
3. Faz o upload do Sketch `ESP32_SafeCharge.ino`.
4. Abre o **MIT App Inventor**, importa os blocos recomendados para ativar a leitura do Clock sobre o WebViewer.

## 🔧 Dependências
* TailwindCSS (usado via CDN para styling responsivo e rápido)
* Chart.js (para gerar análises gráficas do carregamento)
* Vanilla JavaScript (para controlo DOM e Auth por SessionStorage)
