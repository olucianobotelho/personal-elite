/**
 * Formulário de Captura de Leads - Versão Otimizada
 * Com feedback visual aprimorado e labels flutuantes
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificação inicial dos elementos necessários
    const form = document.querySelector('.lead-form');
    if (!form) return;
    
    // Verificar se IMask está disponível para máscaras de input
    const hasMask = typeof IMask !== 'undefined';
    
    // Configurações centralizadas
    const config = {
        validationDelay: 300,        // Tempo de espera para validação durante digitação
        animationDuration: 300,      // Duração das animações em milissegundos
        successMessageDuration: 5000 // Tempo de exibição da mensagem de sucesso
    };
    
    // Mapeamento de campos e suas regras de validação
    const fieldConfig = {
        nome: {
            required: true,
            errorMessage: 'Por favor, insira seu nome completo'
        },
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: 'Por favor, insira um email válido'
        },
        whatsapp: {
            required: true,
            mask: hasMask ? '(00) 0 0000-0000' : null,
            pattern: /^\(\d{2}\) \d \d{4}-\d{4}$/,
            errorMessage: 'Por favor, insira um número de WhatsApp válido'
        },
        idade: {
            required: true,
            validate: (value) => {
                const age = parseInt(value);
                return age >= 10 && age <= 99; // Idade mínima de 10 anos
            },
            maxLength: 2,
            errorMessage: 'Por favor, insira uma idade válida (10-99)'
        },
        instagram: {
            required: false, // Campo opcional
            pattern: /^@[a-zA-Z0-9._]{1,30}$/,
            errorMessage: 'Por favor, insira um @ de Instagram válido'
        },
        experiencia: {
            required: true,
            errorMessage: 'Por favor, selecione sua experiência'
        },
        inicio: {
            required: true,
            errorMessage: 'Por favor, selecione quando pretende começar'
        }
    };
    
    // Coletar referências a todos os campos do formulário
    const fields = {};
    Object.keys(fieldConfig).forEach(name => {
        fields[name] = form.querySelector(`[name="${name}"]`);
    });
    
    // Campos que serão exibidos progressivamente após preenchimento dos campos iniciais
    const additionalFields = ['instagram', 'experiencia', 'inicio'];
    
    /**
     * Inicializa labels flutuantes para melhorar a experiência do usuário
     * Implementa efeito de subir o placeholder ao clicar
     */
    function initFloatingLabels() {
        const formInputs = form.querySelectorAll('input, select');
        
        formInputs.forEach(input => {
            // Guardar o placeholder original
            const originalPlaceholder = input.placeholder;
            
            // Criar wrapper se não existir
            let wrapper = input.parentElement;
            if (!wrapper.classList.contains('input-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'input-wrapper';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }
            
            // Criar label flutuante se não existir
            if (!wrapper.querySelector('.floating-label')) {
                const label = document.createElement('label');
                label.textContent = originalPlaceholder;
                label.className = 'floating-label';
                label.setAttribute('for', input.id || '');
                wrapper.appendChild(label);
                
                // Limpar placeholder para não sobrepor a label
                input.placeholder = '';
                
                // Definir estado inicial baseado no valor do campo
                if (input.value) {
                    wrapper.classList.add('has-value');
                    wrapper.classList.add('focused');
                }
                
                // Adicionar eventos para controlar o estado visual
                input.addEventListener('focus', () => {
                    wrapper.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        wrapper.classList.remove('focused');
                        wrapper.classList.remove('has-value');
                    } else {
                        wrapper.classList.add('has-value');
                    }
                });
                
                input.addEventListener('input', () => {
                    if (input.value) {
                        wrapper.classList.add('has-value');
                    } else {
                        wrapper.classList.remove('has-value');
                    }
                });
            }
            
            // Marcar campos opcionais
            if (fieldConfig[input.name] && !fieldConfig[input.name].required) {
                wrapper.classList.add('optional-field');
            }
        });
    }
    
    /**
     * Inicializa máscaras para campos específicos (ex: telefone)
     */
    function initInputMasks() {
        if (!hasMask) return;
        
        try {
            if (fields.whatsapp) {
                IMask(fields.whatsapp, {
                    mask: fieldConfig.whatsapp.mask
                });
            }
        } catch (error) {
            console.error('Erro ao inicializar máscaras:', error);
            // Fallback para validação sem máscara
            if (fieldConfig.whatsapp) {
                fieldConfig.whatsapp.pattern = /^\d{10,11}$/;
            }
        }
    }
    
    /**
     * Inicializa restrições de comprimento para campos específicos
     */
    function initInputRestrictions() {
        Object.entries(fieldConfig).forEach(([name, config]) => {
            const field = fields[name];
            if (!field) return;
            
            if (config.maxLength) {
                field.addEventListener('input', (e) => {
                    if (e.target.value.length > config.maxLength) {
                        e.target.value = e.target.value.slice(0, config.maxLength);
                    }
                });
            }
        });
    }
    
    /**
     * Oculta campos adicionais no carregamento inicial
     */
    function hideAdditionalFields() {
        additionalFields.forEach(fieldName => {
            const field = fields[fieldName];
            if (field && field.parentElement) {
                field.parentElement.style.display = 'none';
                field.setAttribute('aria-hidden', 'true');
                field.required = false;
            }
        });
    }
    
    /**
     * Mostra campos adicionais quando os campos iniciais estiverem preenchidos
     * Usa debounce para evitar múltiplas chamadas durante digitação
     */
/**
 * Mostra campos adicionais quando os campos iniciais estiverem preenchidos
 * Usa debounce para evitar múltiplas chamadas durante digitação
 */
const showAdditionalFieldsDebounced = debounce(() => {
    // Validar apenas o campo de nome, não validar e-mail ainda
    const nameValid = validateField(fields.nome, fieldConfig.nome);
    
    // Verificar se o e-mail tem algum valor, mas não mostrar erro ainda
    const emailHasValue = fields.email && fields.email.value.trim() !== '';
    
    if (nameValid && emailHasValue) {
        additionalFields.forEach(fieldName => {
            const field = fields[fieldName];
            if (field && field.parentElement) {
                // Exibir campo com animação
                field.parentElement.style.display = 'block';
                field.parentElement.style.animation = `slideDown ${config.animationDuration}ms ease-out`;
                field.setAttribute('aria-hidden', 'false');
                field.required = fieldConfig[fieldName].required;
                
                // Trigger para recalcular layout após animação
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, config.animationDuration);
            }
        });
    }
}, config.validationDelay);

    
    /**
     * Função de debounce para otimizar validações em tempo real
     * Evita múltiplas execuções durante digitação rápida
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    /**
     * Exibe mensagem de erro para um campo específico
     */
    function showError(input, message) {
        if (!input || !input.parentElement) return;
        
        const wrapper = input.parentElement;
        wrapper.classList.add('error');
        wrapper.classList.remove('success');
        
        let error = wrapper.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            error.setAttribute('aria-live', 'polite');
            wrapper.appendChild(error);
        }
        
        error.textContent = message;
    }
    
    /**
     * Remove mensagem de erro e marca campo como válido
     */
    function removeError(input) {
        if (!input || !input.parentElement) return;
        
        const wrapper = input.parentElement;
        wrapper.classList.remove('error');
        wrapper.classList.add('success');
        
        const error = wrapper.querySelector('.error-message');
        if (error) error.remove();
    }
    
    /**
     * Valida um campo individual com base em suas regras
     * CORREÇÃO: Não validar campos vazios no carregamento inicial
     */
    function validateField(input, config, isInitialLoad = false) {
        if (!input || !config) return false;
        
        const value = input.value.trim();
        
        // Se for carregamento inicial e o campo estiver vazio, não mostrar erro
        if (isInitialLoad && !value) {
            return false;
        }
        
        // Verificar se é obrigatório
        if (config.required && !value) {
            showError(input, config.errorMessage);
            return false;
        }
        
        // Se não for obrigatório e estiver vazio, é válido
        if (!config.required && !value) {
            removeError(input);
            return true;
        }
        
        // Validar com regex ou função personalizada
        if (value && config.pattern && !config.pattern.test(value)) {
            showError(input, config.errorMessage);
            return false;
        }
        
        if (value && config.validate && !config.validate(value)) {
            showError(input, config.errorMessage);
            return false;
        }
        
        // Se passou por todas as validações
        removeError(input);
        return true;
    }
    
    /**
     * Valida o formulário completo
     */
    function validateForm() {
        let isValid = true;
        
        Object.entries(fields).forEach(([name, field]) => {
            // Só validar campos visíveis
            if (field && (field.parentElement.style.display !== 'none')) {
                const fieldIsValid = validateField(field, fieldConfig[name]);
                isValid = isValid && fieldIsValid;
            }
        });
        
        return isValid;
    }
    
    /**
     * Exibe mensagem de sucesso após envio do formulário
     * Versão aprimorada com animação e ícone
     */
    function showSuccessMessage() {
        // Limpar o cabeçalho do formulário
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.style.display = 'none';
        }
        
        // Remover mensagem anterior se existir
        const existingMessage = form.querySelector('.success-message');
        if (existingMessage) existingMessage.remove();
        
        // Esconder todos os campos do formulário
        const formFields = form.querySelectorAll('.input-wrapper');
        formFields.forEach(field => {
            field.style.display = 'none';
        });
        
        // Esconder o botão de envio
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
        
        // Esconder texto de segurança
        const securityText = form.querySelector('.styled-security');
        if (securityText) {
            securityText.style.display = 'none';
        }
        
        // Criar e mostrar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
        
        // Adicionar ícone de sucesso
        const icon = document.createElement('div');
        icon.className = 'success-icon';
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4,12 L9,17 L20,6"></path></svg>';
        
        // Adicionar texto de sucesso
        const text = document.createElement('div');
        text.className = 'success-text';
        text.innerHTML = '<h3>Formulário enviado com sucesso!</h3><p>Entraremos em contato em breve para iniciar sua transformação.</p>';
        
        successMessage.appendChild(icon);
        successMessage.appendChild(text);
        form.appendChild(successMessage);
        
        return successMessage;
    }
    
    
    /**
     * Reseta o formulário para o estado inicial
     */
    function resetForm(successMessage) {
        form.reset();
        
        // Remover classes de estado
        Object.values(fields).forEach(field => {
            if (field && field.parentElement) {
                field.parentElement.classList.remove('success', 'focused', 'has-value', 'error');
            }
        });
        
        // Esconder campos adicionais novamente
        hideAdditionalFields();
        
        // Remover mensagem de sucesso com animação
        
    }
    
    /**
     * Função para envio do formulário
     */
    async function submitForm(data) {
        // Simulando uma requisição assíncrona
        return new Promise((resolve) => {
            console.log('Form submitted with data:', data);
            setTimeout(resolve, 1500); // Tempo maior para melhor visualização do loading
        });
    }
    
    /**
     * Inicializa eventos de validação para todos os campos
     */
    function initValidationEvents() {
        // Validação em tempo real com debounce
        const validateFieldDebounced = debounce((input, config) => {
            validateField(input, config);
        }, config.validationDelay);
        
        // Adicionar eventos para cada campo
        Object.entries(fields).forEach(([name, field]) => {
            if (!field) return;
            
            field.addEventListener('input', () => {
                validateFieldDebounced(field, fieldConfig[name]);
                
                // Verificar se deve mostrar campos adicionais
                if (name === 'nome' || name === 'email') {
                    showAdditionalFieldsDebounced();
                }
            });
            
            field.addEventListener('blur', () => {
                validateField(field, fieldConfig[name]);
            });
        });
    }
    
    /**
     * Estiliza o texto de segurança abaixo do botão
     */
/**
 * Estiliza o texto de segurança abaixo do botão
 */
function styleSecurityText() {
    const securityText = form.querySelector('.form-security');
    if (securityText) {
        securityText.innerHTML = '<div class="security-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12,1L3,5v6c0,5.5,3.8,10.7,9,12c5.2-1.3,9-6.5,9-12V5L12,1z M12,11h7c-0.5,4-3,7.7-7,8.8V11H5V6.3l7-3.1l7,3.1V11H12z"></path></svg></div><span>Seus dados estão 100% seguros</span>';
        securityText.classList.add('styled-security');
    }
}

/**
 * Inicializa evento de envio do formulário
 */
function initFormSubmission() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Adicionar classe para feedback visual
        form.classList.add('form-submitting');
        
        // Desabilitar o botão de envio para evitar múltiplos envios
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
        }
        
        // Validar todos os campos
        const isValid = validateForm();
        
        if (isValid) {
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Enviar dados para o backend
                const response = await fetch('submit.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.message || 'Erro ao enviar formulário');
                }
                
                // Mostrar mensagem de sucesso
                const successMessage = showSuccessMessage();
                
                // Resetar formulário após tempo definido
                setTimeout(() => {
                    resetForm(successMessage);
                }, config.successMessageDuration);
                
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                
                // Mostrar mensagem de erro geral
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error-message';
                errorMessage.setAttribute('role', 'alert');
                errorMessage.textContent = 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.';
                form.appendChild(errorMessage);
                
                setTimeout(() => {
                    errorMessage.remove();
                }, config.successMessageDuration);
            } finally {
                // Garantir que o estado de carregamento seja removido
                form.classList.remove('form-submitting');
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                }
            }
        } else {
            // Se o formulário não for válido, remover estado de carregamento
            form.classList.remove('form-submitting');
            
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }
    });
}

/**
 * Inicializa todas as funcionalidades do formulário
 */
function init() {
    try {
        initFloatingLabels();
        initInputMasks();
        initInputRestrictions();
        hideAdditionalFields();
        styleSecurityText();
        initValidationEvents();
        initFormSubmission();
    } catch (error) {
        console.error('Erro ao inicializar formulário:', error);
    }
}

// Iniciar o formulário
init();
});