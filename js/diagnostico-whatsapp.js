document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('diagnosticForm');
    const sections = document.querySelectorAll('.section');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitButton = document.getElementById('submitDiagnostico');
    
    // Variável global para armazenar problemas selecionados
    window.selectedProblems = [];
    
    // Mostrar uma seção específica
    function showSection(sectionNumber) {
        // Ocultar todas as seções
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar a seção solicitada
        document.getElementById(`section${sectionNumber}`).classList.add('active');
        
        // Atualizar a barra de progresso
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = (sectionNumber / 3) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
        
        // Atualizar indicadores de etapa
        const sectionSteps = document.querySelectorAll('.section-step');
        sectionSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepNumber < sectionNumber) {
                step.classList.add('completed');
            } else if (stepNumber === sectionNumber) {
                step.classList.add('active');
            }
        });
        
        // Rolar para o topo do formulário
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Capturar problemas selecionados
    function captureSelectedProblems() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        
        // Limpar array global
        window.selectedProblems = [];
        
        // Adicionar cada problema selecionado ao array global
        checkboxes.forEach((checkbox, index) => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            
            window.selectedProblems.push({
                index: index + 1,
                label: label,
                value: value
            });
        });
        
        // Salvar no localStorage também como backup
        if (window.selectedProblems.length > 0) {
            localStorage.setItem('selected_problems', JSON.stringify(window.selectedProblems));
        }
    }
    
    // Botões de próximo
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = parseInt(this.getAttribute('data-next'));
            const currentSection = parseInt(this.closest('.section').id.replace('section', ''));
            
            // Se estiver na seção 2 (problemas), capturar problemas selecionados
            if (currentSection === 2) {
                captureSelectedProblems();
                generateSummary();
            }
            
            // Validar campos da seção atual antes de avançar
            if (validateSection(currentSection)) {
                showSection(nextSection);
            }
        });
    });
    
    // Botões de anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = parseInt(this.getAttribute('data-prev'));
            showSection(prevSection);
        });
    });
    
    // Validar campos da seção
    function validateSection(sectionNumber) {
        // Seção 1: Informações do Negócio
        if (sectionNumber === 1) {
            const requiredFields = [
                'businessName',
                'businessType',
                'businessSize',
                'businessTime',
                'contactName',
                'contactEmail',
                'contactPhone',
                'businessLocation',
                'businessDescription'
            ];
            
            let isValid = true;
            
            requiredFields.forEach(field => {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    element.classList.add('is-invalid');
                    isValid = false;
                } else {
                    element.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return false;
            }
            
            return true;
        }
        
        // Seção 2: Problemas
        if (sectionNumber === 2) {
            captureSelectedProblems();
            
            // Verificar se pelo menos um problema foi selecionado
            if (window.selectedProblems.length === 0) {
                alert('Por favor, selecione pelo menos um problema.');
                return false;
            }
            
            return true;
        }
        
        return true;
    }
    
    // Gerar resumo
    function generateSummary() {
        // Preencher informações da empresa e contato
        document.getElementById('summary_business').textContent = document.getElementById('businessName').value;
        document.getElementById('summary_contact').textContent = document.getElementById('contactName').value;
        
        // Preencher problemas selecionados
        const summaryProblems = document.getElementById('summary_problems');
        summaryProblems.innerHTML = '';
        
        // Usar a variável global para os problemas
        if (window.selectedProblems.length > 0) {
            window.selectedProblems.forEach(problem => {
                const li = document.createElement('li');
                li.textContent = problem.label;
                summaryProblems.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhum problema selecionado.';
            summaryProblems.appendChild(li);
        }
    }
    
    // Configurar o formulário para enviar para WhatsApp
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar a seção final
            if (!document.getElementById('termsCheck').checked) {
                alert('Por favor, concorde com os termos para continuar.');
                return;
            }
            
            // Capturar problemas selecionados novamente para garantir
            captureSelectedProblems();
            
            // Formatar a mensagem para o WhatsApp
            const whatsappMessage = formatWhatsAppMessage();
            
            // Redirecionar para o WhatsApp
            redirectToWhatsApp(whatsappMessage);
        });
    }
    
    // Formatar a mensagem para o WhatsApp
    function formatWhatsAppMessage() {
        let message = `*DIAGNÓSTICO DE PROBLEMAS - KOLIBRA SOLUTIONS*\n\n`;
        
        // Informações da empresa
        message += `*Informações da Empresa:*\n`;
        message += `Nome: ${document.getElementById('businessName').value}\n`;
        message += `Tipo: ${document.getElementById('businessType').value}\n`;
        message += `Tamanho: ${document.getElementById('businessSize').value}\n`;
        message += `Tempo de Existência: ${document.getElementById('businessTime').value}\n`;
        message += `Localização: ${document.getElementById('businessLocation').value}\n\n`;
        
        // Informações de contato
        message += `*Informações de Contato:*\n`;
        message += `Nome: ${document.getElementById('contactName').value}\n`;
        message += `E-mail: ${document.getElementById('contactEmail').value}\n`;
        message += `Telefone: ${document.getElementById('contactPhone').value}\n`;
        message += `Contato Preferido: ${document.getElementById('preferredContact').value}\n\n`;
        
        // Descrição do negócio
        message += `*Descrição do Negócio:*\n${document.getElementById('businessDescription').value}\n\n`;
        
        // Problemas selecionados
        message += `*Problemas Selecionados:*\n`;
        
        if (window.selectedProblems && window.selectedProblems.length > 0) {
            window.selectedProblems.forEach((problem, index) => {
                message += `${index + 1}. ${problem.label}\n`;
            });
        } else {
            message += `Nenhum problema selecionado.\n`;
        }
        
        message += `\n`;
        
        // Outros problemas
        const otherProblems = document.getElementById('otherProblems').value;
        if (otherProblems) {
            message += `*Outros Problemas:*\n${otherProblems}\n\n`;
        }
        
        message += `Enviado via Formulário de Diagnóstico - KOLIBRA SOLUTIONS`;
        
        return encodeURIComponent(message);
    }
    
    // Redirecionar para o WhatsApp
    function redirectToWhatsApp(message) {
        // Número de telefone para onde a mensagem será enviada (formato internacional)
        const phoneNumber = '5535999796570';
        
        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        
        // Redirecionar para o WhatsApp
        window.location.href = whatsappURL;
    }
    
    // Inicializar o formulário
    showSection(1);
});
