class LoginSystem {
    constructor() {
        this.API_URL = 'https://seu-backend.railway.app/api'; // Seu amigo vai ajustar essa URL
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkRememberedUser();
    }

    setupEventListeners() {
        const form = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        form.addEventListener('submit', (e) => this.handleLogin(e));
        
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });

        // Efeitos visuais
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const loginButton = document.getElementById('loginButton');
        const btnText = loginButton.querySelector('.btn-text');
        const btnLoading = loginButton.querySelector('.btn-loading');
        
        // Mostrar loading
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        loginButton.disabled = true;

        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            userType: document.querySelector('input[name="userType"]:checked').value,
            remember: document.querySelector('input[name="remember"]').checked
        };

        // Validações
        if (!this.validateForm(formData)) {
            this.resetButton(btnText, btnLoading, loginButton);
            return;
        }

        try {
            // Simulação de chamada API - SEU AMIGO VAI IMPLEMENTAR
            const response = await this.mockAPICall(formData);
            
            if (response.success) {
                this.showSuccess();
                // Seu amigo vai implementar o redirecionamento real
                setTimeout(() => {
                    this.redirectToDashboard(response.userType);
                }, 2000);
            } else {
                this.showError(response.message || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showError('Erro de conexão. Tente novamente.');
        } finally {
            this.resetButton(btnText, btnLoading, loginButton);
        }
    }

    validateForm(data) {
        if (!data.email || !data.password) {
            this.showError('Por favor, preencha todos os campos.');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showError('Por favor, insira um e-mail institucional válido.');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simulação da API - SEU AMIGO VAI SUBSTITUIR POR CHAMADA REAL
    async mockAPICall(formData) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Credenciais de exemplo (seu amigo vai remover isso)
        const validUsers = {
            'professor@escola.com': { password: '123456', type: 'professor', name: 'João Silva' },
            'secretaria@escola.com': { password: '123456', type: 'secretaria', name: 'Maria Santos' }
        };

        const user = validUsers[formData.email];
        
        if (user && user.password === formData.password) {
            return {
                success: true,
                userType: user.type,
                userName: user.name,
                token: 'mock-jwt-token-' + Date.now()
            };
        } else {
            return {
                success: false,
                message: 'E-mail ou senha incorretos.'
            };
        }
    }

    // EXEMPLO de como será a integração real:
    async realAPICall(formData) {
        /*
        SEU AMIGO VAI IMPLEMENTAR ASSIM:

        const response = await fetch(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                user_type: formData.userType
            })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        return await response.json();
        */
    }

    showSuccess() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        
        // Mostrar tipo de usuário logado
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const modalText = modal.querySelector('p');
        modalText.innerHTML = `Acesso concedido como <strong>${userType === 'professor' ? 'Professor' : 'Secretaria'}</strong><br>Redirecionando...`;
    }

    showError(message) {
        // Criar ou atualizar mensagem de erro
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            document.querySelector('.login-form').prepend(errorDiv);
        }
        
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        errorDiv.style.display = 'block';
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    resetButton(btnText, btnLoading, button) {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }

    checkRememberedUser() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.querySelector('input[name="remember"]').checked = true;
        }
    }

    redirectToDashboard(userType) {
        // SEU AMIGO VAI IMPLEMENTAR OS REDIRECTS REAIS
        const routes = {
            'professor': '/professor/dashboard',
            'secretaria': '/secretaria/dashboard'
        };
        
        // Simulação - seu amigo vai usar:
        // window.location.href = routes[userType];
        console.log(`Redirecionando para: ${routes[userType]}`);
        alert(`Redirecionando para dashboard de ${userType}`);
    }
}

// CSS adicional para mensagens de erro
const errorStyles = `
    .error-message {
        display: none;
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        animation: slideDown 0.3s ease;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-content i {
        font-size: 1.2rem;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Adicionar estilos dinamicamente
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});