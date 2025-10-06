// Usuário e senha fixos para simulação
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// Lista para armazenar os alunos
let alunos = [];

// Login
document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("main-screen").classList.add("active");
  } else {
    alert("Usuário ou senha incorretos!");
  }
});

// Salvar aluno
document.getElementById("student-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("student-name").value;
  const curso = document.getElementById("student-course").value;
  const ano = document.getElementById("student-year").value;

  alunos.push({ nome, curso, ano });
  alert("Aluno cadastrado com sucesso!");

  this.reset();
});

// Buscar aluno
document.getElementById("search-btn").addEventListener("click", function() {
  const termo = document.getElementById("search-student").value.toLowerCase();
  const resultadoDiv = document.getElementById("search-result");

  const encontrados = alunos.filter(a => a.nome.toLowerCase().includes(termo));

  if (encontrados.length > 0) {
    resultadoDiv.innerHTML = encontrados.map(a => `
      <p><strong>${a.nome}</strong> - ${a.curso} (Ingresso: ${a.ano})</p>
    `).join("");
  } else {
    resultadoDiv.innerHTML = "<p>Nenhum aluno encontrado.</p>";
  }
});
