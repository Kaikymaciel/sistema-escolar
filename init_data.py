from database import Database
import random

def popular_banco_dados():
    db = Database()
    
    # Dados dos alunos
    alunos = [
        {
            'nome': 'Ana Silva Santos',
            'nascimento': '2008-03-15',
            'serie': '9º Ano - Fundamental II',
            'responsavel': 'Carlos Santos',
            'matricula': '2024001'
        },
        {
            'nome': 'Pedro Oliveira Costa',
            'nascimento': '2008-07-22',
            'serie': '9º Ano - Fundamental II',
            'responsavel': 'Maria Costa',
            'matricula': '2024002'
        },
        {
            'nome': 'Mariana Rodrigues Lima',
            'nascimento': '2007-11-30',
            'serie': '9º Ano - Fundamental II',
            'responsavel': 'João Lima',
            'matricula': '2024003'
        },
        {
            'nome': 'Lucas Pereira Almeida',
            'nascimento': '2008-01-10',
            'serie': '9º Ano - Fundamental II',
            'responsavel': 'Fernanda Almeida',
            'matricula': '2024004'
        },
        {
            'nome': 'Juliana Souza Martins',
            'nascimento': '2008-09-05',
            'serie': '9º Ano - Fundamental II',
            'responsavel': 'Roberto Martins',
            'matricula': '2024005'
        }
    ]
    
    # Disciplinas
    disciplinas = [
        'Matemática', 'Língua Portuguesa', 'Ciências', 'História', 
        'Geografia', 'Inglês', 'Artes', 'Educação Física'
    ]
    
    for aluno_data in alunos:
        aluno_id = db.inserir_aluno(
            aluno_data['nome'],
            aluno_data['nascimento'],
            aluno_data['serie'],
            aluno_data['responsavel'],
            aluno_data['matricula']
        )
        
        # Gerar notas aleatórias para cada disciplina
        for disciplina in disciplinas:
            nota_1 = round(random.uniform(5.0, 10.0), 1)
            nota_2 = round(random.uniform(5.0, 10.0), 1)
            frequencia = round(random.uniform(70.0, 100.0), 1)
            
            db.inserir_nota(aluno_id, disciplina, nota_1, nota_2, frequencia)
    
    print("✅ Banco de dados populado com sucesso!")
    print(f"📊 Foram cadastrados {len(alunos)} alunos com {len(disciplinas)} disciplinas cada")

def verificar_dados():
    """Função para verificar se já existem dados no banco"""
    db = Database()
    alunos = db.buscar_alunos()
    print(f"📋 Total de alunos no sistema: {len(alunos)}")
    return len(alunos) > 0

if __name__ == '__main__':
    if not verificar_dados():
        popular_banco_dados()
    else:
        print("ℹ️  O banco de dados já contém informações. Nada foi alterado.")