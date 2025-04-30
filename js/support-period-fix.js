// Script para corrigir a exibição da seção de periodicidade do suporte
document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar se há serviços de suporte selecionados e exibir a seção correspondente
    function checkSupportServices() {
        const supportPeriodSection = document.getElementById('supportPeriodSection');
        const supportValuesSection = document.getElementById('supportValuesSection');
        
        if (!supportPeriodSection || !supportValuesSection) return;
        
        // Verifica se há serviços de suporte selecionados
        let hasSupport = false;
        if (window.selectedServices && Array.isArray(window.selectedServices)) {
            hasSupport = window.selectedServices.some(service => service.isSupport);
        }
        
        // Exibe ou oculta as seções de suporte
        if (hasSupport) {
            supportPeriodSection.style.display = 'block';
            supportValuesSection.style.display = 'block';
            
            // Atualiza os preços do suporte
            updateSupportPrices();
        } else {
            supportPeriodSection.style.display = 'none';
            supportValuesSection.style.display = 'none';
        }
    }
    
    // Função para atualizar os preços do suporte com base na periodicidade selecionada
    function updateSupportPrices() {
        if (!window.selectedServices) return;
        
        let supportTotal = 0;
        let supportMonthlyValue = 0;
        
        // Calcula o valor total do suporte
        window.selectedServices.forEach(service => {
            if (service.isSupport) {
                const supportPeriod = document.querySelector('input[name="support_period"]:checked').value;
                let price = service.price;
                supportMonthlyValue += price;
                
                if (supportPeriod === 'quarterly') {
                    // 5% de desconto para trimestral
                    price = price * 3 * 0.95;
                    supportTotal += price;
                } else if (supportPeriod === 'yearly') {
                    // 15% de desconto para anual
                    price = price * 12 * 0.85;
                    supportTotal += price;
                } else {
                    // Mensal (sem desconto)
                    supportTotal += price;
                }
            }
        });
        
        // Atualiza o elemento de preço do suporte
        const supportPriceElement = document.getElementById('supportPrice');
        if (supportPriceElement) {
            supportPriceElement.textContent = `R$ ${supportTotal.toFixed(2)}`;
        }
        
        // Atualiza o valor mensal do suporte com desconto aplicado
        const supportMonthlyPriceElement = document.getElementById('supportMonthlyPrice');
        if (supportMonthlyPriceElement) {
            const supportPeriod = document.querySelector('input[name="support_period"]:checked').value;
            let monthlyText = '';
            
            if (supportPeriod === 'quarterly') {
                // 5% de desconto para trimestral
                monthlyText = `R$ ${(supportMonthlyValue * 0.95).toFixed(2)}/mês`;
            } else if (supportPeriod === 'yearly') {
                // 15% de desconto para anual
                monthlyText = `R$ ${(supportMonthlyValue * 0.85).toFixed(2)}/mês`;
            } else {
                // Mensal (sem desconto)
                monthlyText = `R$ ${supportMonthlyValue.toFixed(2)}/mês`;
            }
            
            supportMonthlyPriceElement.textContent = monthlyText;
        }
    }
    
    // Adiciona event listeners para os botões de adicionar serviço
    const addServiceButtons = document.querySelectorAll('.btn-add-service');
    if (addServiceButtons.length > 0) {
        addServiceButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aguarda um momento para que a lista de serviços seja atualizada
                setTimeout(checkSupportServices, 100);
            });
        });
    }
    
    // Adiciona event listeners para os botões de remover serviço
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-remove-service')) {
            // Aguarda um momento para que a lista de serviços seja atualizada
            setTimeout(checkSupportServices, 100);
        }
    });
    
    // Adiciona event listeners para as opções de periodicidade
    const supportPeriodOptions = document.querySelectorAll('input[name="support_period"]');
    if (supportPeriodOptions.length > 0) {
        supportPeriodOptions.forEach(option => {
            option.addEventListener('change', updateSupportPrices);
        });
    }
    
    // Verifica inicialmente se há serviços de suporte selecionados
    checkSupportServices();
});
