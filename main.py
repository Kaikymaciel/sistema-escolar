from flask import Flask, render_template, request, send_file
from database import Database
from pdf_generator import gerar_boletim_pdf
import io
import os

# Configurar o Flask para encontrar os templates
app = Flask(__name__, template_folder='templates')
db = Database()

print("=" * 50)
print("🚀 INICIANDO SISTEMA DE BOLETIM ESCOLAR")
print("=" * 50)
print(f"📁 Diretório atual: {os.getcwd()}")
print(f"📁 Pasta templates existe: {os.path.exists('templates')}")

if os.path.exists('templates'):
    print(f"📄 Arquivos nos templates: {os.listdir('templates')}")
else:
    print("❌ ERRO: Pasta templates não encontrada!")

@app.route('/')
def index():
    try:
        termo_busca = request.args.get('busca', '')
        alunos = db.buscar_alunos(termo_busca)
        print(f"✅ Página inicial carregada - {len(alunos)} alunos")
        return render_template('index.html', alunos=alunos, termo_busca=termo_busca)
    except Exception as e:
        error_msg = f"❌ ERRO: {str(e)}"
        print(error_msg)
        return f"""
        <html>
            <body>
                <h1>Erro ao carregar a página</h1>
                <p><strong>Erro:</strong> {e}</p>
                <p>Verifique se o arquivo templates/index.html existe</p>
                <a href="/">Tentar novamente</a>
            </body>
        </html>
        """

@app.route('/aluno/<matricula>')
def detalhes_aluno(matricula):
    try:
        aluno, notas = db.buscar_aluno_por_matricula(matricula)
        if not aluno:
            return "Aluno não encontrado", 404
        print(f"✅ Página do aluno carregada - {aluno[1]}")
        return render_template('aluno.html', aluno=aluno, notas=notas)
    except Exception as e:
        return f"Erro: {e}"

@app.route('/gerar_boletim/<matricula>')
def gerar_boletim(matricula):
    try:
        print(f"🔍 Buscando aluno com matrícula: {matricula}")
        aluno, notas = db.buscar_aluno_por_matricula(matricula)
        
        if not aluno:
            print("❌ Aluno não encontrado")
            return "Aluno não encontrado", 404
        
        print(f"📊 Gerando PDF para: {aluno[1]} - {len(notas)} disciplinas")
        
        # Gerar PDF
        pdf = gerar_boletim_pdf(aluno, notas)
        
        # Criar arquivo em memória - CORREÇÃO DO ERRO
        pdf_output = pdf.output(dest='S')  # Remove o .encode('latin1')
        
        # Nome do arquivo
        nome_aluno = aluno[1].replace(' ', '_')
        nome_arquivo = f"BOLETIM_{nome_aluno}.pdf"
        
        print(f"📥 Enviando arquivo: {nome_arquivo}")
        
        return send_file(
            io.BytesIO(pdf_output),
            as_attachment=True,
            download_name=nome_arquivo,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        print(f"❌ ERRO na geração do PDF: {e}")
        import traceback
        traceback.print_exc()
        return f"""
        <html>
            <body>
                <h1>Erro ao gerar PDF</h1>
                <p><strong>Erro:</strong> {e}</p>
                <a href="/aluno/{matricula}">Voltar</a>
            </body>
        </html>
        """, 500

if __name__ == '__main__':
    print("🌐 Servidor iniciado! Acesse: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)