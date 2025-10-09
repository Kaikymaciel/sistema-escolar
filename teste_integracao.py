from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/teste')
def teste():
    # Verificar se os templates existem
    template_path = os.path.join(os.path.dirname(__file__), 'templates')
    print(f"📁 Caminho dos templates: {template_path}")
    print(f"📄 Arquivos na pasta templates: {os.listdir(template_path) if os.path.exists(template_path) else 'PASTA NÃO EXISTE'}")
    
    return "Teste completo - verifique o terminal"

if __name__ == '__main__':
    print("🔍 Iniciando teste de integração...")
    app.run(debug=True, port=5001)