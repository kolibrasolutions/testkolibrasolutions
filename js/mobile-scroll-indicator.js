// Script para indicação de rolagem no mobile e mudança de texto nos botões
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o indicador de rolagem ao corpo da página (apenas para mobile)
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<i class="fas fa-arrow-down"></i> Deslize para ver mais opções';
    document.body.appendChild(scrollIndicator);
    
    // Oculta o indicador após rolagem ou após 10 segundos
    let scrollTimeout;
    let autoHideTimeout = setTimeout(() => {
        scrollIndicator.classList.add('hidden');
    }, 10000);
    
    window.addEventListener('scroll', function() {
        // Mostra o indicador novamente ao rolar para o topo
        if (window.scrollY < 100) {
            scrollIndicator.classList.remove('hidden');
        }
        
        // Oculta o indicador após rolagem
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollIndicator.classList.add('hidden');
        }, 2000);
    });
    
    // Altera o texto dos botões de "Selecionar" para "Selecionado" quando clicados
    const selectButtons = document.querySelectorAll('.select-plan-btn');
    
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Primeiro, restaura todos os botões para "Selecionar"
            selectButtons.forEach(btn => {
                btn.textContent = 'Selecionar';
                btn.closest('.plan-option').classList.remove('selected');
            });
            
            // Altera o texto deste botão para "Selecionado"
            this.textContent = 'Selecionado';
            this.closest('.plan-option').classList.add('selected');
        });
    });
});
