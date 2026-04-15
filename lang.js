function t(ptStr) {
  const lang = window.sessionStorage ? window.sessionStorage.getItem('lang') : null;
  if (lang !== 'en') return ptStr;
  
  const dict = {
    // index.html
    "Notificações": "Notifications",
    "Configurações": "Settings",
    "A calcular...": "Calculating...",
    "TERMINAR CARREGAMENTO": "END CHARGE",
    "Carregamento terminado, a desconectar...": "Charge ended, disconnecting...",
    "Abra o cacifo no Controlador primeiro!": "Open the locker in the Controller first!",
    "Gráficos": "Graphs",
    "Início": "Home",
    "Controlador": "Controller",
    "Completamente carregado": "Fully charged",
    "Doca Fís. Vazia": "Phys. Dock Empty",
    
    // login.html
    "Conectar à Doc": "Connect to Dock",
    "Por favor, introduza o código de acesso (v3).": "Please enter the access code (v3).",
    "Código de Acesso": "Access Code",
    "Desbloquear Sistema": "Unlock System",
    "Código Incorreto! Tente de novo.": "Incorrect Code! Try again.",
    "Entrando...": "Entering...",
    "A verificar...": "Verifying...",
    "Erro Net/DB": "Net/DB Error",
    
    // pagamento.html
    "Adicionar Saldo": "Add Balance",
    "E-mail": "E-mail",
    "Opção de Carregamento": "Top-up Option",
    "Escolha uma opção": "Choose an option",
    "Número do Cartão": "Card Number",
    "Validade": "Expiry",
    "Confirmar Pagamento": "Confirm Payment",
    "A Processar...": "Processing...",
    "Aprovado!": "Approved!",
    "Erro! Voltar": "Error! Back",
    
    // controlador.html
    "Controlador Manual": "Manual Controller",
    "Sistema Físico": "Physical System",
    "Segurança": "Security",
    "ABRIR CACIFO": "OPEN LOCKER",
    "FECHAR CACIFO": "CLOSE LOCKER",
    "TRANCAR TROTINETA": "LOCK SCOOTER",
    "DESTRANCAR TROTINETA": "UNLOCK SCOOTER",
    
    // graficos.html
    "Histórico de Carga": "Charge History",
    "Sem Sessão Ativa": "No Active Session",
    "Não existem dados recolhidos nesta sessão.": "No data collected in this session.",
    "Bateria Carregada (+%)": "Battery Charged (+%)",
    "Ganho Energético (%)": "Energy Gain (%)",
    "Tempo a carregar na Dock": "Time charging in Dock",
    
    // notificacoes.html
    "Notificações Recentes": "Recent Notifications",
    "Desativar Todas": "Disable All",
    "restantes": "left"
    ,"Nenhuma notificação por enquanto...": "No notifications yet..."
    ,"Sua trotinete atingiu o limite de carregamento (": "Your scooter reached the charging limit ("
  };
  
  return dict[ptStr] || ptStr;
}

// Auto-translate static DOM elements using data-i18n property on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.sessionStorage && window.sessionStorage.getItem('lang') === 'en') {
        const translatable = [
            "Notificações", "Configurações", "A calcular...", "TERMINAR CARREGAMENTO", "Gráficos", "Início", "Controlador", "Conectar à Doc", "Por favor, introduza o código de acesso (v3).", "Código de Acesso", "Desbloquear Sistema", "Código Incorreto! Tente de novo.", "Adicionar Saldo", "E-mail", "Opção de Carregamento", "Escolha uma opção", "Número do Cartão", "Validade", "Confirmar Pagamento", "Controlador Manual", "Sistema Físico", "Segurança", "ABRIR CACIFO", "FECHAR CACIFO", "TRANCAR TROTINETA", "DESTRANCAR TROTINETA", "Histórico de Carga", "Sem Sessão Ativa", "Não existem dados recolhidos nesta sessão.", "Notificações Recentes", "Desativar Todas", "Nenhuma notificação por enquanto..."
        ];
        
        let walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
            let txt = node.nodeValue.trim();
            if (translatable.includes(txt)) {
                node.nodeValue = node.nodeValue.replace(txt, t(txt));
            }
        }
        
        document.querySelectorAll('input, select').forEach(el => {
            if (el.placeholder && t(el.placeholder) !== el.placeholder) {
                el.placeholder = t(el.placeholder);
            }
        });
    }
});
