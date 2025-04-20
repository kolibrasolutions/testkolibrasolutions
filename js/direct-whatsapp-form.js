// Script direto para envio de formulário para WhatsApp sem dependências externas
document.addEventListener('DOMContentLoaded', function() {
    const problemsForm = document.getElementById('problemsForm');
    
    if (problemsForm) {
        // Remover qualquer action existente para evitar envio por e-mail
        problemsForm.removeAttribute('action');
        problemsForm.removeAttribute('method');
        
        problemsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos obrigatórios
            const requiredFields = problemsForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff3860';
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return false;
            }
            
            try {
                // Coletar dados do formulário
                const formData = new FormData(problemsForm);
                let formFields = {};
                
                for (let [key, value] of formData.entries()) {
                    // Tratar arrays (checkboxes)
                    if (key.endsWith('[]')) {
                        const cleanKey = key.slice(0, -2);
                        if (!formFields[cleanKey]) {
                            formFields[cleanKey] = [];
                        }
                        formFields[cleanKey].push(value);
                    } else {
                        formFields[key] = value;
                    }
                }
                
                // Formatar mensagem para WhatsApp
                let whatsappMessage = `*Formulário de Diagnóstico - Kolibra Solutions*\n\n`;
                
                // Informações Básicas
                whatsappMessage += `*INFORMAÇÕES BÁSICAS*\n`;
                whatsappMessage += `*Nome:* ${formFields.name || 'Não informado'}\n`;
                whatsappMessage += `*Email:* ${formFields.email || 'Não informado'}\n`;
                whatsappMessage += `*Telefone:* ${formFields.phone || 'Não informado'}\n`;
                whatsappMessage += `*Empresa:* ${formFields.company || 'Não informado'}\n`;
                whatsappMessage += `*Segmento:* ${formFields.segment || 'Não informado'}\n\n`;
                
                // Situação Atual
                whatsappMessage += `*SITUAÇÃO ATUAL*\n`;
                whatsappMessage += `*Estágio do Negócio:* ${formFields.business_stage || 'Não informado'}\n`;
                whatsappMessage += `*Descrição do Negócio:* ${formFields.business_description || 'Não informado'}\n`;
                whatsappMessage += `*Desafios Atuais:* ${formFields.challenges || 'Não informado'}\n\n`;
                
                // Objetivos e Necessidades
                whatsappMessage += `*OBJETIVOS E NECESSIDADES*\n`;
                
                // Áreas de melhoria (checkboxes)
                if (formFields.improvement_areas && formFields.improvement_areas.length > 0) {
                    whatsappMessage += `*Áreas para Melhorias:* ${formFields.improvement_areas.join(', ')}\n`;
                } else {
                    whatsappMessage += `*Áreas para Melhorias:* Não selecionado\n`;
                }
                
                whatsappMessage += `*Objetivos de Negócio:* ${formFields.business_goals || 'Não informado'}\n`;
                whatsappMessage += `*Orçamento:* ${formFields.budget || 'Não informado'}\n\n`;
                
                // Informações Adicionais
                whatsappMessage += `*INFORMAÇÕES ADICIONAIS*\n`;
                whatsappMessage += `*Concorrentes:* ${formFields.competitors || 'Não informado'}\n`;
                whatsappMessage += `*Informações Adicionais:* ${formFields.additional_info || 'Não informado'}\n`;
                whatsappMessage += `*Preferência de Contato:* ${formFields.contact_preference || 'Não informado'}\n\n`;
                
                whatsappMessage += `Olá, preenchi o formulário de diagnóstico no site e gostaria de receber mais informações.`;
                
                // Codificar mensagem para URL
                const maxLength = 1000; // WhatsApp tem limite de caracteres na URL
                let encodedMessage = encodeURIComponent(whatsappMessage);
                
                if (encodedMessage.length > maxLength) {
                    // Se a mensagem for muito longa, simplificar
                    const shortMessage = `*Formulário de Diagnóstico - Kolibra Solutions*\n\n` +
                        `*Nome:* ${formFields.name || 'Não informado'}\n` +
                        `*Email:* ${formFields.email || 'Não informado'}\n` +
                        `*Telefone:* ${formFields.phone || 'Não informado'}\n` +
                        `*Empresa:* ${formFields.company || 'Não informado'}\n\n` +
                        `Olá, preenchi o formulário de diagnóstico no site e gostaria de receber mais informações.`;
                    
                    encodedMessage = encodeURIComponent(shortMessage);
                }
                
                // Número de WhatsApp da Kolibra Solutions
                const whatsappNumber = '5535999796570';
                
                // Redirecionar para WhatsApp
                window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                
                return true;
            } catch (error) {
                console.error("Erro ao processar dados do formulário:", error);
                alert("Ocorreu um erro ao processar seu formulário. Clique em OK para entrar em contato direto pelo WhatsApp.");
                window.location.href = "https://wa.me/5535999796570";
                return false;
            }
        });
    }
});
