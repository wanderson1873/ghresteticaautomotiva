# -*- coding: utf-8 -*-
"""Põe (ou atualiza) os blocos de medição nas páginas escritas à mão.

    python ferramentas/aplicar-medicao.py

Rode depois de preencher GTM_ID, CLARITY_ID ou PAINEL_CHAVE em config.py.
As páginas de /servicos/ recebem os mesmos blocos de gerar-paginas-servicos.py.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config
import medicao

PAGINAS = ['index.html', 'fotos/index.html', 'parcerias/index.html',
           'contato/index.html', 'privacidade/index.html']


def main():
    for rel in PAGINAS:
        caminho = os.path.join(config.RAIZ, rel)
        if not os.path.exists(caminho):
            print('  (não existe) ' + rel)
            continue
        with open(caminho, encoding='utf-8') as f:
            antes = f.read()
        depois = medicao.aplicar(antes)
        if depois != antes:
            with open(caminho, 'w', encoding='utf-8', newline='\n') as f:
                f.write(depois)
            print('  atualizado  ' + rel)
        else:
            print('  em dia      ' + rel)


if __name__ == '__main__':
    main()
