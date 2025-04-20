document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar o formulário
            if (!validateForm()) {
                return false;
            }
            
            // Obter os dados do formulário
            const formData = getFormData();
            
            // Formatar a mensagem para o WhatsApp
            const whatsappMessage = formatWhatsAppMessage(formData);
            
            // Redirecionar para o WhatsApp
            redirectToWhatsApp(whatsappMessage);
        });
    }
    
    // Validar o formulário
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
        
        return isValid;
    }
    
    // Obter os dados do formulário
    function getFormData() {
        const formData = {
            businessName: document.getElementById('businessName').value,
            businessType: document.getElementById('businessType').value,
            businessSize: document.getElementById('businessSize').value,
            businessTime: document.getElementById('businessTime').value,
            contactName: document.getElementById('contactName').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            businessLocation: document.getElementById('businessLocation').value,
            businessDescription: document.getElementById('businessDescription').value,
            problems: [],
            otherProblems: document.getElementById('otherProblems').value,
            priorities: [],
            preferredContact: document.getElementById('preferredContact').value
        };
        
        // Obter problemas selecionados
        const problemCheckboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        problemCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            formData.problems.push({
                label: label,
                value: value
            });
        });
        
        // Obter prioridades
        formData.problems.forEach(problem => {
            const prioritySelect = document.getElementById(`priority_${problem.value}`);
            if (prioritySelect) {
                const priority = prioritySelect.value;
                const priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;
                formData.priorities.push({
                    problem: problem.label,
                    priority: priority,
                    priorityText: priorityText
                });
            }
        });
        
        return formData;
    }
    
    // Formatar a mensagem para o WhatsApp
    function formatWhatsAppMessage(data) {
        let message = `*DIAGNÓSTICO DE PROBLEMAS - KOLIBRA SOLUTIONS*\n\n`;
        
        // Informações da empresa
        message += `*Informações da Empresa:*\n`;
        message += `Nome: ${data.businessName}\n`;
        message += `Tipo: ${data.businessType}\n`;
        message += `Tamanho: ${data.businessSize}\n`;
        message += `Tempo de Existência: ${data.businessTime}\n`;
        message += `Localização: ${data.businessLocation}\n\n`;
        
        // Informações de contato
        message += `*Informações de Contato:*\n`;
        message += `Nome: ${data.contactName}\n`;
        message += `E-mail: ${data.contactEmail}\n`;
        message += `Telefone: ${data.contactPhone}\n`;
        message += `Contato Preferido: ${data.preferredContact}\n\n`;
        
        // Descrição do negócio
        message += `*Descrição do Negócio:*\n${data.businessDescription}\n\n`;
        
        // Problemas e prioridades
        message += `*Problemas Prioritários:*\n`;
        if (data.priorities.length > 0) {
            data.priorities.forEach((item, index) => {
                message += `${index + 1}. ${item.problem} - ${item.priorityText}\n`;
            });
        } else {
            message += `Nenhum problema selecionado.\n`;
        }
        message += `\n`;
        
        // Outros problemas
        if (data.otherProblems) {
            message += `*Outros Problemas:*\n${data.otherProblems}\n\n`;
        }
        
        message += `Enviado via Formulário de Diagnóstico - KOLIBRA SOLUTIONS`;
        
        return encodeURIComponent(message);
    }
    
    // Redirecionar para o WhatsApp
    function redirectToWhatsApp(message) {
        // Número de telefone para onde a mensagem será enviada (formato internacional)
        const phoneNumber = '5511999999999'; // Substitua pelo número correto
        
        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        
        // Redirecionar para o WhatsApp
        window.location.href = whatsappURL;
    }
});
