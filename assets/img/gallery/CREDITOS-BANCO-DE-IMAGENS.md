# Imagens de banco usadas na home

Os arquivos com prefixo `banco-` **não são fotos da GHR**. São imagens de banco
baixadas do Pexels, usadas como ilustração no fundo do hero, na faixa de
impacto, nos quatro cartões de "Cuidado em cada etapa", na foto da seção
"Quem somos" e no cartão do serviço de Vitrificação (que também vira o fundo
da página `/servicos/vitrificacao/`).

As fotos reais da empresa continuam em todo o resto: colagem do hero,
antes/depois de estofado, prévia da galeria, faixa do WhatsApp, os demais
cartões de serviço e a galeria completa em `/fotos/`.

Por isso o `alt` dessas imagens é vazio ou genérico: nenhuma delas pode ser
descrita como veículo atendido pela GHR.

## Licença

Todas vêm da [Licença Pexels](https://www.pexels.com/pt-br/license/): uso
gratuito, inclusive comercial, sem necessidade de atribuição. O crédito abaixo
fica registrado por transparência e para facilitar a conferência no futuro.

Se algum dia essas imagens forem trocadas, baixe as novas de um banco com
licença comercial (Pexels, Unsplash, Pixabay) e atualize esta lista. **Nunca
use imagem achada no Google sem verificar a licença.**

## Arquivos

| Arquivo | Onde aparece | Origem |
|---|---|---|
| `banco-hero.jpg` | fundo do hero da home | [Luxury Genesis G80 Black Sedan Studio Portrait](https://www.pexels.com/photo/luxury-genesis-g80-black-sedan-studio-portrait-32642951/) |
| `banco-faixa.jpg` | faixa "Não é apenas limpeza" | [Sleek Genesis G80 Sedan in Dark Studio Setting](https://www.pexels.com/photo/sleek-genesis-g80-sedan-in-dark-studio-setting-32644774/) |
| `banco-etapa-01.jpg` | etapa 01 — Limpeza | [Modern SUV in Car Wash with Soap Suds](https://www.pexels.com/photo/modern-suv-in-car-wash-with-soap-suds-29504457/) |
| `banco-etapa-02.jpg` | etapa 02 — Correção | [Employee Cleaning Shiny Hood of Car](https://www.pexels.com/photo/employee-cleaning-shiny-hood-of-car-20051458/) |
| `banco-etapa-03.jpg` | etapa 03 — Proteção | [A Person in Black Shirt Cleaning Black Car](https://www.pexels.com/photo/a-person-in-black-shirt-cleaning-black-car-7154634/) |
| `banco-etapa-04.jpg` | etapa 04 — Acabamento | [Close-up of a Cloth on a Car](https://www.pexels.com/photo/close-up-of-a-cloth-on-a-car-14231672/) |
| `banco-quem-somos.jpg` | seção "Quem somos" da home | [Man Polishing a Car](https://www.pexels.com/photo/man-polishing-a-car-14908957/) |
| `banco-vitrificacao.jpg` | cartão e página do serviço Vitrificação | [Close-up of a Wet Luxury Car Hood with Logo](https://www.pexels.com/photo/close-up-of-a-wet-luxury-car-hood-with-logo-32062164/) |

Todas foram recortadas em quadrado 1440×1440 para caber no mesmo pipeline das
fotos da galeria (`ferramentas/gerar-webp.py`).
