class StudentPortal {
    constructor() {
        this.currentStudent = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        const form = document.getElementById('studentLoginForm');
        form.addEventListener('submit', (e) => this.handleStudentLogin(e));
    }

    async handleStudentLogin(e) {
        e.preventDefault();
        
        const button = document.getElementById('accessButton');
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        // Mostrar loading
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        button.disabled = true;

        const formData = {
            matricula: document.getElementById('matricula').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value
        };

        try {
            const studentData = await this.verifyStudent(formData);
            
            if (studentData) {
                this.currentStudent = studentData;
                this.showStudentDashboard(studentData);
            } else {
                this.showError('Matrícula ou data de nascimento incorretos.');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao verificar dados. Tente novamente.');
        } finally {
            this.resetButton(btnText, btnLoading, button);
        }
    }

    // Dados mockados - SEU AMIGO VAI INTEGRAR COM O BANCO REAL
    async verifyStudent(formData) {
        // Simular delay de verificação
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Base de dados de alunos mockada
        const studentsDB = {
            '2024002': {
                matricula: '2024002',
                nome: 'Pedro Oliveira Costa',
                dataNascimento: '2008-03-15',
                serie: '9º Ano - Fundamental II',
                turma: '9º A',
                turno: 'Matutino'
            },
            '13122012': {
                matricula: '13122012', 
                nome: 'Julia Ester Alves de Sousa',
                dataNascimento: '2009-07-22',
                serie: '6º Ano - Fundamental II',
                turma: '6º B',
                turno: 'Vespertino'
            },
            '123456': {
                matricula: '123456',
                nome: 'Gabriel Pinto',
                dataNascimento: '2005-11-30',
                serie: '3º Ano - Ensino Médio',
                turma: '3º C',
                turno: 'Matutino'
            },
            '6993219': {
                matricula: '6993219',
                nome: 'Carlos Silva',
                dataNascimento: '2007-05-10',
                serie: '9º Ano - Fundamental II', 
                turma: '9º A',
                turno: 'Matutino'
            },
            '777999157': {
                matricula: '777999157',
                nome: 'Luiz Gabriel',
                dataNascimento: '2006-12-05',
                serie: '3º Ano - Ensino Médio',
                turma: '3º B',
                turno: 'Vespertino'
            }
        };

        const student = studentsDB[formData.matricula];
        
        if (student && student.dataNascimento === formData.dataNascimento) {
            // Adicionar notas mockadas - SEU AMIGO VAI PEGAR DO BANCO REAL
            student.notas = this.generateMockGrades(student.serie);
            return student;
        }
        
        return null;
    }

    generateMockGrades(serie) {
        // Gerar notas fictícias baseadas na série
        const subjects = this.getSubjectsByGrade(serie);
        const grades = {};
        
        subjects.forEach(subject => {
            grades[subject] = {
                n1: (Math.random() * 3 + 7).toFixed(1),
                n2: (Math.random() * 3 + 7).toFixed(1), 
                n3: (Math.random() * 3 + 7).toFixed(1),
                n4: (Math.random() * 3 + 7).toFixed(1),
                media: (Math.random() * 2 + 7).toFixed(1),
                faltas: Math.floor(Math.random() * 10)
            };
        });
        
        return grades;
    }

    getSubjectsByGrade(serie) {
        const fundamentalII = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Inglês', 'Artes', 'Educação Física'];
        const ensinoMedio = ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Inglês', 'Filosofia', 'Sociologia', 'Educação Física'];
        
        return serie.includes('Fundamental II') ? fundamentalII : ensinoMedio;
    }

    showStudentDashboard(student) {
        // Criar ou mostrar dashboard
        let dashboard = document.querySelector('.student-dashboard');
        
        if (!dashboard) {
            dashboard = this.createDashboard();
            document.querySelector('.student-login-box').style.display = 'none';
            document.querySelector('.student-container').appendChild(dashboard);
        }
        
        dashboard.style.display = 'block';
        this.populateDashboard(student);
    }

    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'student-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <div class="student-welcome">
                    <h2>Boletim Escolar</h2>
                    <div class="student-info-badge" id="studentInfo"></div>
                </div>
                <button class="logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
            
            <div class="student-data">
                <div class="info-grid">
                    <div class="info-item">
                        <label>Matrícula:</label>
                        <span id="infoMatricula"></span>
                    </div>
                    <div class="info-item">
                        <label>Série/Turma:</label>
                        <span id="infoSerie"></span>
                    </div>
                    <div class="info-item">
                        <label>Turno:</label>
                        <span id="infoTurno"></span>
                    </div>
                </div>
            </div>

            <div class="grades-section">
                <h3><i class="fas fa-chart-line"></i> Notas por Disciplina</h3>
                <div class="grades-table" id="gradesTable"></div>
            </div>

            <div class="dashboard-footer">
                <div class="print-btn" id="printBtn">
                    <i class="fas fa-print"></i> Imprimir Boletim
                </div>
            </div>
        `;

        // Event listeners do dashboard
        dashboard.querySelector('#logoutBtn').addEventListener('click', () => this.logout());
        dashboard.querySelector('#printBtn').addEventListener('click', () => this.printBoletim());

        return dashboard;
    }

    populateDashboard(student) {
        document.getElementById('studentInfo').textContent = student.nome;
        document.getElementById('infoMatricula').textContent = student.matricula;
        document.getElementById('infoSerie').textContent = `${student.serie} - ${student.turma}`;
        document.getElementById('infoTurno').textContent = student.turno;

        // Preencher tabela de notas
        const gradesTable = document.getElementById('gradesTable');
        gradesTable.innerHTML = this.createGradesTable(student.notas);
    }

    createGradesTable(grades) {
        let html = `
            <table class="grades-table">
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>1º Bim</th>
                        <th>2º Bim</th>
                        <th>3º Bim</th>
                        <th>4º Bim</th>
                        <th>Média</th>
                        <th>Faltas</th>
                        <th>Situação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const [subject, data] of Object.entries(grades)) {
            const situacao = parseFloat(data.media) >= 6 ? 'Aprovado' : 'Recuperação';
            const situacaoClass = parseFloat(data.media) >= 6 ? 'approved' : 'recovery';
            
            html += `
                <tr>
                    <td>${subject}</td>
                    <td>${data.n1}</td>
                    <td>${data.n2}</td>
                    <td>${data.n3}</td>
                    <td>${data.n4}</td>
                    <td><strong>${data.media}</strong></td>
                    <td>${data.faltas}</td>
                    <td><span class="status ${situacaoClass}">${situacao}</span></td>
                </tr>
            `;
        }

        html += `</tbody></table>`;
        return html;
    }

    logout() {
        this.currentStudent = null;
        document.querySelector('.student-dashboard').style.display = 'none';
        document.querySelector('.student-login-box').style.display = 'block';
        document.getElementById('studentLoginForm').reset();
    }

    printBoletim() {
        window.print();
    }

    showError(message) {
        alert(`Erro: ${message}`);
    }

    resetButton(btnText, btnLoading, button) {
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }

    checkExistingSession() {
        // Verificar se já existe sessão (para futuro desenvolvimento)
    }
}

// CSS adicional para a tabela de notas
const dashboardStyles = `
    .student-data {
        margin-bottom: 30px;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        background: var(--student-light);
        border-radius: 8px;
    }

    .info-item label {
        font-weight: 600;
        color: var(--student-dark);
        margin: 0;
    }

    .grades-section {
        margin-bottom: 30px;
    }

    .grades-section h3 {
        color: var(--student-dark);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .grades-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .grades-table th {
        background: var(--student-primary);
        color: white;
        padding: 12px 8px;
        text-align: center;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .grades-table td {
        padding: 10px 8px;
        text-align: center;
        border-bottom: 1px solid var(--student-light);
        font-size: 0.9rem;
    }

    .grades-table tr:hover {
        background: #f8f9fa;
    }

    .status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .status.approved {
        background: #d4edda;
        color: #155724;
    }

    .status.recovery {
        background: #fff3cd;
        color: #856404;
    }

    .dashboard-footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid var(--student-light);
    }

    .print-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--student-primary);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .print-btn:hover {
        background: var(--student-secondary);
    }

    @media print {
        .logout-btn, .print-btn {
            display: none;
        }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);

// Inicializar o portal do aluno
document.addEventListener('DOMContentLoaded', () => {
    new StudentPortal();
});