# -*- coding: utf-8 -*-
"""Fotos tiradas dos vídeos do cenário NOVO da GHR (abril/2024 em diante).

Cada item vira dois arquivos em assets/img/gallery/:

    <nome>.jpg     quadro inteiro, vertical 9:16 (1440x2560) — carrossel
    <nome>-q.jpg   recorte 4:5 (1440x1800) escolhido à mão — cards e capas

Campos:
    video  trecho do nome do arquivo em ../ghr_esteticaautomotiva/ (a data
           basta quando só há um vídeo naquele dia)
    t      segundo do vídeo
    y      onde começa o recorte 4:5, em pixels do quadro 1440x2560.
           O recorte sempre pega a largura toda; escolha y para o carro
           caber inteiro. None = sem versão 4:5.
    so_q   True quando o quadro inteiro tem texto gravado por cima (legenda
           do Instagram): só o recorte 4:5, que fica fora do texto, é gerado.

Quadros com texto por cima, faixa preta ou tremidos ficaram de fora.
Placas: cadastre em placas.py com o nome do arquivo 9:16 (ex.: 'ghr-v02').
"""

QUADROS = [
    # --- 2024-04-11 · VW up! branco: polimento ------------------------------
    {'nome': 'ghr-v01', 'video': '2024-04-11', 't': 7.0,  'y': 500},
    {'nome': 'ghr-v02', 'video': '2024-04-11', 't': 15.0, 'y': 560},
    {'nome': 'ghr-v03', 'video': '2024-04-11', 't': 20.5, 'y': 450},
    {'nome': 'ghr-v04', 'video': '2024-04-11', 't': 23.0, 'y': 500},
    {'nome': 'ghr-v05', 'video': '2024-04-11', 't': 24.5, 'y': 520},
    # --- 2024-06-17 · SUV grafite: polimento (legenda gravada embaixo) ------
    {'nome': 'ghr-v06', 'video': '2024-06-17', 't': 5.5,  'y': 0,   'so_q': True},
    {'nome': 'ghr-v07', 'video': '2024-06-17', 't': 10.5, 'y': 200, 'so_q': True},
    # --- 2025-01-24 · moto -------------------------------------------------
    {'nome': 'ghr-v08', 'video': '2025-01-24', 't': 20.0, 'y': 500},
    # --- 2025-04-10 · sedã preto: polimento --------------------------------
    {'nome': 'ghr-v09', 'video': '2025-04-10', 't': 5.5,  'y': 500},
    {'nome': 'ghr-v10', 'video': '2025-04-10', 't': 8.5,  'y': 500},
    # --- 2025-08-26 · sedã azul: brilho sob o LED ---------------------------
    {'nome': 'ghr-v11', 'video': '2025-08-26', 't': 3.0,  'y': 300},
    {'nome': 'ghr-v12', 'video': '2025-08-26', 't': 9.5,  'y': 300},
    {'nome': 'ghr-v13', 'video': '2025-08-26', 't': 11.5, 'y': 200},
    {'nome': 'ghr-v14', 'video': '2025-08-26', 't': 14.0, 'y': 400},
    {'nome': 'ghr-v15', 'video': '2025-08-26', 't': 15.5, 'y': 400},
    # --- 2026-05-07 · SUV azul ---------------------------------------------
    {'nome': 'ghr-v16', 'video': '2026-05-07', 't': 28.0, 'y': 500},
    # --- 2026-09-02 · SUV preto: exterior e interior ------------------------
    {'nome': 'ghr-v17', 'video': '2026-09-02', 't': 1.0,  'y': 600},
    {'nome': 'ghr-v18', 'video': '2026-09-02', 't': 2.5,  'y': 700},
    {'nome': 'ghr-v19', 'video': '2026-09-02', 't': 14.5, 'y': 400},
    {'nome': 'ghr-v20', 'video': '2026-09-02', 't': 17.0, 'y': 700},
    {'nome': 'ghr-v21', 'video': '2026-09-02', 't': 22.0, 'y': 400},
    {'nome': 'ghr-v22', 'video': '2026-09-02', 't': 25.0, 'y': 400},
    {'nome': 'ghr-v23', 'video': '2026-09-02', 't': 29.5, 'y': 400},
]
