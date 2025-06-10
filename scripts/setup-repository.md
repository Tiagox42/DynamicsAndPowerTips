# Configuração do Repositório GitHub

## Estrutura de Pastas Necessária

Crie a seguinte estrutura no seu repositório GitHub:

\`\`\`
dynamics-crm-resources/
├── README.md
├── resources/
│   ├── blogs/
│   │   ├── principais-blogs-sobre-dynamics-crm/
│   │   ├── comunidades-e-foruns/
│   │   └── canais-do-youtube-e-podcasts/
│   ├── desenvolvimento/
│   │   ├── modelos-de-plugins-e-codigo-em-csharp/
│   │   ├── ferramentas-para-debug-e-logging/
│   │   ├── customizacoes-de-formularios-e-views/
│   │   ├── manipulacao-de-ribbon-comandos-de-botao/
│   │   ├── scripts-javascript-para-dynamics-365/
│   │   └── uso-de-web-resources/
│   ├── consultas/
│   │   ├── consultas-fetchxml/
│   │   ├── consultas-linq-e-queryexpression/
│   │   └── power-bi-e-dashboards-no-dynamics/
│   ├── automate/
│   │   ├── fluxos-de-automacao-no-power-automate/
│   │   ├── integracao-com-apis-externas/
│   │   └── uso-de-connectors-customizados/
│   ├── ferramentas/
│   │   ├── xrmtoolbox-e-plugins-uteis/
│   │   └── geradores-de-codigo-e-snippets/
│   ├── seguranca/
│   │   ├── controle-de-acessos-e-perfis-de-seguranca/
│   │   ├── gerenciamento-de-solucoes/
│   │   └── melhores-praticas-para-alm/
│   └── dicas/
│       ├── melhores-praticas-para-performance/
│       ├── atalhos-e-comandos-uteis/
│       └── erros-comuns-e-como-resolver/
\`\`\`

## Exemplo de Arquivo de Recurso

Crie arquivos `.md` dentro das subcategorias com o seguinte formato:

**Arquivo: `resources/desenvolvimento/ferramentas-para-debug-e-logging/debug-plugins-tutorial.md`**

\`\`\`markdown
---
title: How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial
url: https://www.youtube.com/watch?v=exemplo
description: Como debugar plugin do Dynamics no visual studio
submittedBy: Maria Santos
submittedAt: 2024-01-14
category: desenvolvimento
subcategory: Ferramentas Para Debug E Logging
---

Este tutorial mostra como usar o Plugin Profiler e Plugin Trace Viewer para debugar plugins do Dynamics 365. 

Inclui:
- Configuração do ambiente de debug
- Uso do Plugin Registration Tool
- Análise de logs e traces
- Melhores práticas para debugging
\`\`\`

## Comandos Git para Criar a Estrutura

\`\`\`bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/dynamics-crm-resources.git
cd dynamics-crm-resources

# Criar estrutura de pastas
mkdir -p resources/blogs/principais-blogs-sobre-dynamics-crm
mkdir -p resources/blogs/comunidades-e-foruns
mkdir -p resources/blogs/canais-do-youtube-e-podcasts

mkdir -p resources/desenvolvimento/modelos-de-plugins-e-codigo-em-csharp
mkdir -p resources/desenvolvimento/ferramentas-para-debug-e-logging
mkdir -p resources/desenvolvimento/customizacoes-de-formularios-e-views
mkdir -p resources/desenvolvimento/manipulacao-de-ribbon-comandos-de-botao
mkdir -p resources/desenvolvimento/scripts-javascript-para-dynamics-365
mkdir -p resources/desenvolvimento/uso-de-web-resources

mkdir -p resources/consultas/consultas-fetchxml
mkdir -p resources/consultas/consultas-linq-e-queryexpression
mkdir -p resources/consultas/power-bi-e-dashboards-no-dynamics

mkdir -p resources/automate/fluxos-de-automacao-no-power-automate
mkdir -p resources/automate/integracao-com-apis-externas
mkdir -p resources/automate/uso-de-connectors-customizados

mkdir -p resources/ferramentas/xrmtoolbox-e-plugins-uteis
mkdir -p resources/ferramentas/geradores-de-codigo-e-snippets

mkdir -p resources/seguranca/controle-de-acessos-e-perfis-de-seguranca
mkdir -p resources/seguranca/gerenciamento-de-solucoes
mkdir -p resources/seguranca/melhores-praticas-para-alm

mkdir -p resources/dicas/melhores-praticas-para-performance
mkdir -p resources/dicas/atalhos-e-comandos-uteis
mkdir -p resources/dicas/erros-comuns-e-como-resolver

# Criar arquivos .gitkeep para manter as pastas vazias no Git
find resources -type d -exec touch {}/.gitkeep \;

# Commit inicial
git add .
git commit -m "Initial repository structure for Dynamics CRM resources"
git push origin main
