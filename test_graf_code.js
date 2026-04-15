
      let chart;
      
      // Simulação inicial de log: Array de {hora, nivel}
      // Lógica de cálculo do Carregamento (Bateria Aumentada vs Tempo Juntos)
      let chargeLog = JSON.parse(window.sessionStorage.getItem('chargeLog')) || [];
      // { tempoMs: , startBattery: } -> guarda o momento e a bateria exata que a trotinete tinha quando foi conectada
      let startInfo = JSON.parse(window.sessionStorage.getItem('chargeStartInfo')) || null;
      
      let lastBatteryUpdate = Date.now();

      function renderizarGrafico() {
        const ctx = document.getElementById('bateriaChart').getContext('2d');
        
        // Começa em 0s com 0% ganhos por padrão
        const labels = chargeLog.length > 0 ? chargeLog.map(d => d.tempoStr) : ['0s'];
        const data = chargeLog.length > 0 ? chargeLog.map(d => d.ganho) : [0];

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bateria Carregada (+%)',
                    data: data,
                    borderColor: '#10B981', // Verde esmeralda (energia)
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#10B981',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Oculta a legenda superior
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Ganho Energético (%)', font: { weight: 'bold' } }
                    },
                    x: {
                        title: { display: true, text: 'Tempo a carregar na Dock', font: { weight: 'bold' } }
                    }
                }
            }
        });
      }

      function calcularRelacaoCarga() {
        let bateriaVindaDoESP = window.sessionStorage.getItem('bateriaAtual');
        
        const isTestMode = window.sessionStorage.getItem("codigoAcesso") === "6767-6767";

        // Simulação de dados se não estiver na App real ou for O MODO DE TESTE
        if (!window.AppInventor || isTestMode) {
          let fb = parseInt(bateriaVindaDoESP) || 20;
          // Sobe a bateria artificialmente mais rápido para se notar no gráfico
          if (Date.now() - lastBatteryUpdate >= 5000) {
            fb += 1;
            lastBatteryUpdate = Date.now();
          }
          if (fb > 100) fb = 100;
          bateriaVindaDoESP = fb.toString();
          try{window.sessionStorage.setItem('bateriaAtual', bateriaVindaDoESP);}catch(e){}
        }

        if (bateriaVindaDoESP) {
          let bateriaAtualInt = parseInt(bateriaVindaDoESP);
          
          // Se não houver sessão de carga registrada, ou se a bateria DE REPENTE DIMINUIU muito (alguém a retirou e colocou outra vazia)
          if (!startInfo || bateriaAtualInt < startInfo.startBattery) {
            startInfo = { tempoMs: Date.now(), startBattery: bateriaAtualInt };
            try{window.sessionStorage.setItem('chargeStartInfo', JSON.stringify(startInfo));}catch(e){}
            chargeLog = []; // Reinicia o gráfico limpo!
          }

          // Matemática: Quanto subiu desdo o minuto zero?
          let ganhoPercentual = bateriaAtualInt - startInfo.startBattery;
          
          // Matemática: Quanto tempo passou desde o minuto zero?
          let passedMs = Date.now() - startInfo.tempoMs;
          let passedSecs = Math.floor(passedMs / 1000);
          let passedMins = Math.floor(passedSecs / 60);
          let remainderSecs = passedSecs % 60;
          
          let strCronometro = passedMins > 0 ? `${passedMins}m ${remainderSecs}s` : `${remainderSecs}s`;

          // Regista este ponto no gráfico
          chargeLog.push({ tempoStr: strCronometro, ganho: ganhoPercentual });
          
          // Não deixa o gráfico "infinito" - Guarda apenas os últimos 12 pontos lidos para ter visão focada
          if (chargeLog.length > 12) chargeLog.shift();
          
          try{window.sessionStorage.setItem('chargeLog', JSON.stringify(chargeLog));}catch(e){}

          // Atualiza instantaneamente a tela
          if(chart) {
            chart.data.labels = chargeLog.map(d => d.tempoStr);
            chart.data.datasets[0].data = chargeLog.map(d => d.ganho);
            chart.update();
          }
        }
      }

      // Renderiza assim que a página abre
      renderizarGrafico();
      // Executa o "Inspetor de Bateria" a cada 3 segundos, puxando do ESP32
      setInterval(calcularRelacaoCarga, 3000);
    