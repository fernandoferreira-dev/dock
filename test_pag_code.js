
      function realizarPagamento(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        
        btn.innerHTML = '<span class="animate-pulse">A Processar...</span>';
        btn.disabled = true;

        // Simula tempo de API
        setTimeout(() => {
          try {
            // Envia o valor pago como número inteiro para o App Inventor
            const valorInput = document.getElementById('valor').value;
            const emailInput = document.getElementById('email').value;
            // Garante que é tratado como inteiro (ex: 10.50 vira 10)
            const valorInteiro = Math.floor(Number(valorInput));
            
            // Integração com Supabase (Guardar e-mail e valor)
            const SUPABASE_URL = "https://cvzhdxfomjxawjwxjmnh.supabase.co";
            const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2emhkeGZvbWp4YXdqd3hqbW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjc0MzgsImV4cCI6MjA4ODk0MzQzOH0.t6cljClgMgGiCiInch1aYUaR-4v7d35HUYp2yh9mdyU";
            
            // Define e guarda o limite para as notificações
            let limite = valorInteiro === 1 ? 30 : 100;
            try{window.sessionStorage.setItem('limiteCarregamento', limite.toString())}catch(err){console.warn("Storage err");};

            fetch(`${SUPABASE_URL}/rest/v1/pagamentos`, {
              method: 'POST',
              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
              },
              body: JSON.stringify({ email: emailInput, valor: valorInteiro, data_pagamento: new Date().toISOString() })
            }).catch(err => console.error("Erro Supabase:", err));

            try {
              if (window.AppInventor && window.AppInventor.setWebViewString) {
                window.AppInventor.setWebViewString(valorInteiro.toString());
              }
            } catch(appErr) {
              console.error("AppInventor error", appErr);
            }

            e.target.reset();
            btn.innerHTML = 'Aprovado!';
            
            // Vai direto para o ecrã inicial sem mostrar o container verde intermédio (como no outro form)
            setTimeout(() => {
              window.location.href = "index.html";
            }, 800);
          } catch(generalErr) {
            console.error("Erro na UI", generalErr);
            btn.innerHTML = 'Erro! Voltar';
            btn.disabled = false;
          }
        }, 1500);
      }
    