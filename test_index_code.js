
      function safeGetItem(key) { try { return window.sessionStorage.getItem(key); } catch(e) { return null; } }

      // Função para o botão terminar carregamento
      function terminarCarregamento() {
        const msg = document.getElementById('end-charge-msg');
        
        // Verifica se no ecrã do controlador o botão de abrir cacifo foi clicado
        if (safeGetItem('cacifoAberto') === 'true') {
          // Envia o comando de parar pelo AppInventor se necessário
          if (window.AppInventor) {
            window.AppInventor.setWebViewString("CMD:END_CHARGE");
            setTimeout(() => {
              window.AppInventor.setWebViewString("CMD:DISCONNECT");
            }, 500);
          }
          
          msg.innerText = "Carregamento terminado, a desconectar...";
          msg.className = "mt-4 text-center text-sm font-bold bg-green-100 text-green-700 p-3 rounded-lg w-full max-w-[250px] transition-all";
          
          // Opcional: fechar a sessão ou resetar estado
          try{window.sessionStorage.removeItem('cacifoAberto');}catch(e){}
          try{window.sessionStorage.removeItem('autenticado');}catch(e){}
          
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2500);
        } else {
          msg.innerText = "Abra o cacifo no Controlador primeiro!";
          msg.className = "mt-4 text-center text-sm font-bold bg-red-100 text-red-600 p-3 rounded-lg w-full max-w-[250px] transition-all";
        }
        
        setTimeout(() => {
          msg.classList.add('hidden');
          msg.className = "hidden mt-4 text-center text-sm font-bold p-3 rounded-lg w-full max-w-[250px]";
        }, 3000);
      }

      // Guarda valores históricos de bateria para o gráfico localmente (opcionalmente pode vir do Supabase)
      if (!window.bateriaHistorico) window.bateriaHistorico = [];

      let ultimaAtualizacaoBluetooth = 0;

      function atualizarTempoRestante(percentagem) {
        const p = parseInt(percentagem);
        const trNode = document.getElementById('tempo-restante');
        trNode.classList.remove('opacity-0');
        
        if (isNaN(p)) return;
        if (p >= 100) {
          trNode.innerText = "Completamente carregado";
          trNode.className = "text-sm font-bold text-green-500 mt-2 tracking-normal transition-opacity";
          return;
        }

        // Estimativa simples: 1% recarrega em 1.5 minutos (0 a 100 em 2.5h).
        const faltamPerc = 100 - p;
        const minRestantes = Math.floor(faltamPerc * 1.5);
        
        trNode.className = "text-sm font-bold text-gray-500 mt-2 tracking-normal transition-opacity";
        if (minRestantes > 60) {
          const horas = Math.floor(minRestantes / 60);
          const minutos = minRestantes % 60;
          trNode.innerText = `~${horas}h ${minutos}m restantes`;
        } else {
          trNode.innerText = `~${minRestantes}m restantes`;
        }
      }

      let fakeBattery = 20;

      // Automatically receive data from App Inventor's WebViewString
      function checkAppInventorData() {
        const isTestMode = safeGetItem("codigoAcesso") === "6767-6767";
        
        if (window.AppInventor && !isTestMode) {
          const webString = window.AppInventor.getWebViewString();
          if (webString) {
            const bateriaElement = document.getElementById("bateria");
            if (bateriaElement) {
              // Verifica se vem do ESP32 no formato "SPACES: s,b | s,b | s,b | s,b"
              if (webString.includes("SPACES:")) {
                ultimaAtualizacaoBluetooth = Date.now();
                
                // Remove prefixo e divide pelos slots
                const slotsStr = webString.replace("SPACES:", "").trim().split("|");
                // Puxa o slot em que o utilizador fez login (1 a 4). Por defeito 1.
                const meuSlot = parseInt(safeGetItem("meuSlot")) || 1;
                
                // O Hardware envia "SPACES: s4,c4 | s3,c3 | s2,c2 | s1,c1" com o array invertido!
                // Então o Slot 1 real (s1,c1) está no índice 3. O Slot 2 no índice 2. O Slot 4 no índice 0.
                const indiceNoArray = 4 - meuSlot; 
                
                let bateriaEncontrada = "0%";
                
                if (slotsStr.length === 4 && indiceNoArray >= 0 && indiceNoArray < 4) {
                  const s = slotsStr[indiceNoArray].trim().split(",");
                  if (s[0] === "1") { // Apenas atualiza a bateria visivelmente se estiver dada como Ocupada no Hardware
                    bateriaEncontrada = s[1].trim() + "%";
                    gerarNotificacaoLimites(s[1].trim());
                  } else {
                    bateriaEncontrada = "Doca Fís. Vazia";
                  }
                }
                
                bateriaElement.innerText = bateriaEncontrada;
                atualizarTempoRestante(bateriaEncontrada);
                try{window.sessionStorage.setItem('bateriaAtual', bateriaEncontrada.replace('%', ''));}catch(e){}
              } else if (!webString.startsWith("CMD:")) {
                ultimaAtualizacaoBluetooth = Date.now();
                // Caso o AppInventor retorne apenas um número diretamente (E filtra comandos do sistema)
                bateriaElement.innerText = webString.includes("%") ? webString : webString + "%";
                try{window.sessionStorage.setItem('bateriaAtual', webString.replace('%', ''));}catch(e){}
                gerarNotificacaoLimites(webString.replace('%', ''));
                atualizarTempoRestante(webString.replace('%', ''));
              }
            }
          }
        } else {
          // Fake data simulation
          ultimaAtualizacaoBluetooth = Date.now();
          const bateriaElement = document.getElementById("bateria");
          if (bateriaElement) {
            fakeBattery += Math.random() > 0.8 ? 1 : 0;
            if (fakeBattery > 100) fakeBattery = 100;
            let fakeStr = fakeBattery.toString();
            bateriaElement.innerText = fakeStr + "%";
            try{window.sessionStorage.setItem('bateriaAtual', fakeStr);}catch(e){}
            gerarNotificacaoLimites(fakeStr);
            atualizarTempoRestante(fakeStr);
          }
        }
      }

      // Check initially when the page loads
      window.onload = function() {
        checkAppInventorData();
        // Constantly poll for updates so it updates automatically when the string changes
        setInterval(checkAppInventorData, 1000);
        // Verifica se há novas notificações para piscar a luzinha
        setInterval(checkNotificacoesBadge, 2000);
        
        // Verifica a cada 2 segundos se passou muito tempo sem ouvir do hardware (ex: 5s) para forçar o login
        setInterval(() => {
          if(ultimaAtualizacaoBluetooth > 0 && Date.now() - ultimaAtualizacaoBluetooth > 5000) {
            try{window.sessionStorage.removeItem('autenticado');}catch(e){}
            window.location.href = "login.html";
          }
        }, 2000);
      };

      let jaNotificou = false; // flag em memória para não spammar

      function gerarNotificacaoLimites(bateriaValue) {
        // Exemplo: se pagou 1€, o limite é 30% (guardado no window.sessionStorage quando fez o bypass ou real)
        const limiteCarregamento = parseInt(safeGetItem('limiteCarregamento')) || 100;
        const b = parseInt(bateriaValue);

        if (!jaNotificou && b >= limiteCarregamento) {
          jaNotificou = true;
          
          let novaMensagem = "Sua trotinete atingiu o limite de carregamento (" + b + "%).";
          
          let notificacoes = JSON.parse(safeGetItem('notificacoes') || '[]');
          notificacoes.unshift(novaMensagem); // põe no começo
          try{window.sessionStorage.setItem('notificacoes', JSON.stringify(notificacoes));}catch(e){}
          
          // Conta as não lidas
          let naoLidadas = parseInt(safeGetItem('notificacoes_nao_lidas') || '0');
          try{window.sessionStorage.setItem('notificacoes_nao_lidas', (naoLidadas + 1).toString());}catch(e){}
          
          // Pode ativar uma buzina no App Inventor, enviar Toast notification etc.
          if (window.AppInventor) {
             window.AppInventor.setWebViewString("CMD:NOTIFY_LIMIT_REACHED");
          } else {
             // Notificação do navegador (se suportado/aceite) ou apenas alert native
             if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Terminado!", {body: novaMensagem});
             } else {
                alert("Nova Notificação: " + novaMensagem);
             }
          }
        }
      }

      function checkNotificacoesBadge() {
         const badge = document.getElementById('badge-notificacao');
         let naoLidas = parseInt(safeGetItem('notificacoes_nao_lidas') || '0');
         if (naoLidas > 0) {
            badge.classList.remove('hidden');
         } else {
            badge.classList.add('hidden');
         }
      }
    