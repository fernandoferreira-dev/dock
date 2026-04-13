    
      function formatCode(input) {
        // Remove tudo que não for letras ou números
        let val = input.value.replace(/[^a-zA-Z0-9]/g, '');
        // Adiciona automaticamente o hífen após o 4º caractere
        if (val.length > 4) {
          val = val.substring(0, 4) + '-' + val.substring(4, 8);
        }
        input.value = val;
      }

      async function verificarCodigo(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigoAcesso').value.trim();
        const erroMsg = document.getElementById('erro-msg');
        const btn = e.target.querySelector('button[type="submit"]');
        
        btn.innerHTML = 'A verificar...';
        btn.disabled = true;
        btn.classList.add('opacity-50');

        // Código hardcoded para testes (bypass)
        if (codigo === "6767-6767") {
          localStorage.setItem("autenticado", "true");
          localStorage.setItem("codigoAcesso", "6767-6767");
          localStorage.setItem("meuSlot", "1"); // Forçamos o slot 1 para testes
          window.location.href = "pagamento.html"; 
          return;
        }

        // Verificação real na Base de Dados (Supabase)
        try {
          const SUPABASE_URL = "https://cvzhdxfomjxawjwxjmnh.supabase.co";
          const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2emhkeGZvbWp4YXdqd3hqbW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjc0MzgsImV4cCI6MjA4ODk0MzQzOH0.t6cljClgMgGiCiInch1aYUaR-4v7d35HUYp2yh9mdyU";
          
          // Removemos o hífen do código apenas para enviar para a DB
          const codigoSemHifen = codigo.replace('-', '');
          
          const resposta = await fetch(`${SUPABASE_URL}/rest/v1/cacifo?codigo=eq.${codigoSemHifen}&select=slot,codigo`, {
            method: 'GET',
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": "Bearer " + SUPABASE_KEY
            }
          });
          
          const dados = await resposta.json();

          if (dados && dados.length > 0 && dados[0].slot > 0) {
            // Login com sucesso!
            localStorage.setItem("autenticado", "true");
            localStorage.setItem("codigoAcesso", dados[0].codigo);
            localStorage.setItem("meuSlot", dados[0].slot.toString());
            
            // Opcional: Se em produção deve ir para o pagamento primeiro, alterar aqui.
            window.location.href = "pagamento.html"; 
          } else {
            // Código não encontrado na base de dados
            mostrarErro(erroMsg, btn);
          }
        } catch (err) {
          console.error("Erro ao validar código no Supabase:", err);
          mostrarErro(erroMsg, btn);
        }
      }

      function mostrarErro(erroMsg, btn) {
        erroMsg.classList.remove('hidden');
        btn.innerHTML = 'Desbloquear Sistema';
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        setTimeout(() => { erroMsg.classList.add('hidden'); }, 3000);
      }

      // Se já estava autenticado na sessão, vai logo direto sem pedir código
      if(localStorage.getItem("autenticado") === "true") {
        window.location.href = "pagamento.html";
      }
    
  
