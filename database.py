import sqlite3
from datetime import datetime

class Database:
    def __init__(self, db_name='escola.db'):
        self.db_name = db_name
        self.init_db()
    
    def get_connection(self):
        return sqlite3.connect(self.db_name)
    
    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Tabela de Alunos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Alunos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_completo TEXT NOT NULL,
                data_nascimento TEXT NOT NULL,
                serie TEXT NOT NULL,
                nome_do_responsavel TEXT NOT NULL,
                matricula TEXT UNIQUE NOT NULL
            )
        ''')
        
        # Tabela de Notas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Notas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                aluno_id INTEGER NOT NULL,
                disciplina TEXT NOT NULL,
                nota_1_bimestre REAL NOT NULL,
                nota_2_bimestre REAL NOT NULL,
                media_final REAL NOT NULL,
                frequencia_percentual REAL NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (aluno_id) REFERENCES Alunos (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def inserir_aluno(self, nome_completo, data_nascimento, serie, nome_responsavel, matricula):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO Alunos (nome_completo, data_nascimento, serie, nome_do_responsavel, matricula)
            VALUES (?, ?, ?, ?, ?)
        ''', (nome_completo, data_nascimento, serie, nome_responsavel, matricula))
        
        conn.commit()
        aluno_id = cursor.lastrowid
        conn.close()
        return aluno_id
    
    def inserir_nota(self, aluno_id, disciplina, nota_1, nota_2, frequencia):
        # Calcular média final
        media_final = (nota_1 + nota_2) / 2
        
        # Determinar status
        if media_final >= 7.0 and frequencia >= 75:
            status = "Aprovado"
        elif media_final >= 5.0 and frequencia >= 75:
            status = "Recuperação"
        else:
            status = "Reprovado"
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO Notas (aluno_id, disciplina, nota_1_bimestre, nota_2_bimestre, 
                             media_final, frequencia_percentual, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (aluno_id, disciplina, nota_1, nota_2, media_final, frequencia, status))
        
        conn.commit()
        conn.close()
    
    def buscar_alunos(self, termo=None):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if termo:
            cursor.execute('''
                SELECT * FROM Alunos 
                WHERE nome_completo LIKE ? OR matricula LIKE ?
                ORDER BY nome_completo
            ''', (f'%{termo}%', f'%{termo}%'))
        else:
            cursor.execute('SELECT * FROM Alunos ORDER BY nome_completo')
        
        alunos = cursor.fetchall()
        conn.close()
        return alunos
    
    def buscar_aluno_por_matricula(self, matricula):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM Alunos WHERE matricula = ?', (matricula,))
        aluno = cursor.fetchone()
        
        if aluno:
            cursor.execute('SELECT * FROM Notas WHERE aluno_id = ?', (aluno[0],))
            notas = cursor.fetchall()
        else:
            notas = []
        
        conn.close()
        return aluno, notas
    
    def calcular_estatisticas_gerais(self, aluno_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT COUNT(*), AVG(media_final), AVG(frequencia_percentual)
            FROM Notas WHERE aluno_id = ?
        ''', (aluno_id,))
        
        stats = cursor.fetchone()
        conn.close()
        return stats