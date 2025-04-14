/**
 * Script unificado para formulários usando Web3Forms
 * Este script garante que todos os formulários do site enviem dados corretamente para o e-mail
 * Implementa uma solução mais confiável que o FormSubmit.co
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma página com formulário
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        console.log('Web3Forms: Encontrados ' + forms.length + ' formulários na página');
        
        // Configurar cada formulário para usar Web3Forms
        forms.forEach(function(form) {
            // Não modificar formulários que já usam Web3Forms
            if (form.action && form.action.includes('web3forms.com')) {
                console.log('Web3Forms: Formulário já configurado corretamente');
                return;
            }
            
            console.log('Web3Forms: Configurando formulário para usar Web3Forms');
            
            // Alterar a ação do formulário para usar Web3Forms
            form.action = "https://api.web3forms.com/submit";
            form.method = "POST";
            
            // Verificar se o campo de access key já existe
            let accessKeyExists = false;
            const inputs = form.querySelectorAll('input');
            inputs.forEach(function(input) {
                if (input.name === 'access_key') {
                    accessKeyExists = true;
                    input.value = "4d6a936e3760451b72637ac831d50a7c"; // Atualizar com a chave correta
                }
            });
            
            // Adicionar campo de access key se não existir
            if (!accessKeyExists) {
                const accessKeyInput = document.createElement('input');
                accessKeyInput.type = 'hidden';
                accessKeyInput.name = 'access_key';
                accessKeyInput.value = "b7e9a971-92c9-47bc-a009-2f67e1811492"; // Access Key fornecida pelo usuário
                form.appendChild(accessKeyInput);
            }
            
            // Adicionar campo de captcha (opcional, mas recomendado)
            const captchaInput = document.createElement('input');
            captchaInput.type = 'hidden';
            captchaInput.name = 'botcheck';
            captchaInput.value = '';
            form.appendChild(captchaInput);
            
            // Adicionar campo para URL de redirecionamento após envio
            const redirectInput = document.createElement('input');
            redirectInput.type = 'hidden';
            redirectInput.name = 'redirect';
            redirectInput.value = 'obrigado.html'; // Página de agradecimento padrão
            form.appendChild(redirectInput);
            
            // Tratamento especial para o formulário de diagnóstico
            if (window.location.href.includes('diagnostico.html') || form.id === 'diagnosticoForm') {
                console.log('Web3Forms: Detectado formulário de diagnóstico, aplicando tratamento especial');
                
                // Adicionar campo para resumo do diagnóstico
                const resumoInput = document.createElement('input');
                resumoInput.type = 'hidden';
                resumoInput.name = 'resumo_diagnostico';
                resumoInput.id = 'resumo_diagnostico';
                form.appendChild(resumoInput);
                
                // Adicionar evento para capturar todos os dados antes do envio
                form.addEventListener('submit', function(e) {
                    // Não interromper o envio, apenas adicionar o resumo
                    const resumoElement = document.getElementById('resumo_diagnostico');
                    if (resumoElement) {
                        resumoElement.value = gerarResumoDiagnostico(form);
                    }
                });
            }
            
            // Adicionar evento para validação antes do envio
            form.addEventListener('submit', function(e) {
                // Verificar campos obrigatórios
                const requiredFields = form.querySelectorAll('[required]');
                let formValido = true;
                
                requiredFields.forEach(function(field) {
                    if (!field.value.trim()) {
                        formValido = false;
                        field.classList.add('campo-invalido');
                    } else {
                        field.classList.remove('campo-invalido');
                    }
                });
                
                if (!formValido) {
                    e.preventDefault();
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return false;
                }
                
                // Adicionar classe para indicar que o formulário está sendo enviado
                form.classList.add('enviando');
                
                // Desabilitar o botão de envio para evitar múltiplos envios
                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                submitButtons.forEach(function(button) {
                    button.disabled = true;
                    if (button.tagName === 'BUTTON') {
                        button.innerHTML = 'Enviando...';
                    } else {
                        button.value = 'Enviando...';
                    }
                });
                
                // Permitir o envio
                return true;
            });
        });
    }
});

/**
 * Função para gerar um resumo do formulário de diagnóstico
 * Coleta todos os dados selecionados e os formata de maneira legível
 */
function gerarResumoDiagnostico(form) {
    let resumo = "=== RESUMO DO DIAGNÓSTICO ===\n\n";
    
    // Informações básicas
    const nome = form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : 'Não informado';
    const email = form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value : 'Não informado';
    const telefone = form.querySelector('[name="phone"]') ? form.querySelector('[name="phone"]').value : 'Não informado';
    
    resumo += "INFORMAÇÕES DO CLIENTE:\n";
    resumo += "Nome: " + nome + "\n";
    resumo += "Email: " + email + "\n";
    resumo += "Telefone: " + telefone + "\n\n";
    
    // Problemas selecionados (checkboxes)
    resumo += "PROBLEMAS SELECIONADOS:\n";
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxes.length > 0) {
        checkboxes.forEach(function(checkbox) {
            const label = document.querySelector('label[for="' + checkbox.id + '"]');
            const labelText = label ? label.textContent : checkbox.value;
            resumo += "- " + labelText + "\n";
        });
    } else {
        resumo += "Nenhum problema específico selecionado\n";
    }
    resumo += "\n";
    
    // Prioridades (radio buttons)
    resumo += "PRIORIDADES:\n";
    const radioGroups = {};
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(function(radio) {
        if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = [];
        }
        const label = document.querySelector('label[for="' + radio.id + '"]');
        const labelText = label ? label.textContent : radio.value;
        radioGroups[radio.name].push(labelText);
    });
    
    for (const group in radioGroups) {
        const groupLabel = document.querySelector('legend[for="' + group + '"]');
        const groupName = groupLabel ? groupLabel.textContent : group.replace('_', ' ').toUpperCase();
        resumo += groupName + ": " + radioGroups[group].join(", ") + "\n";
    }
    resumo += "\n";
    
    // Comentários adicionais
    const comentarios = form.querySelector('textarea') ? form.querySelector('textarea').value : '';
    if (comentarios) {
        resumo += "COMENTÁRIOS ADICIONAIS:\n" + comentarios + "\n\n";
    }
    
    resumo += "=== FIM DO RESUMO ===";
    
    return resumo;
}

// Adicionar estilos CSS para feedback visual
const style = document.createElement('style');
style.textContent = `
    .campo-invalido {
        border: 1px solid #ff0000 !important;
        background-color: rgba(255, 0, 0, 0.05) !important;
    }
    
    form.enviando {
        opacity: 0.7;
        pointer-events: none;
    }
`;
document.head.appendChild(style);
