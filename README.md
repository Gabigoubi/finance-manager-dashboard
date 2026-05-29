# 📊 Finance Manager Dashboard (FMD)

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
</p>

---

O **FMD (Finance Manager Dashboard)** é um aplicativo de Business Intelligence (BI) focado em gestão financeira pessoal. O projeto foi desenvolvido com uma **estética Cyberpunk/Sci-Fi** e funciona inteiramente como uma SPA (Single Page Application).

## 🎯 Motivação do Projeto

Antes de pular direto para um framework (como React ou Vue), este projeto foi construído para **entender a base da web de verdade**. O objetivo foi recriar os padrões que os frameworks usam por baixo dos panos:
* **Single Page Application (SPA):** Navegação e interações fluidas sem nenhum *refresh* de página.
* **Gerenciamento de Estado Manual:** Um estado centralizado (`expenses`) que dita o que deve ser renderizado na tela a cada mudança (reatividade pura).
* **Simulação de Banco de Dados:** Uso estratégico do `localStorage` para persistência ágil de dados durante a fase de aprendizado técnico.

---

## 📸 Demonstração Visual

> 💡 *Dica: Insira um print ou GIF do seu painel cyberpunk brilhando aqui!*

<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Adicione+um+print+do+seu+Dashboard+aqui" alt="FMD Preview" width="100%">
</p>

---

## ✨ Funcionalidades de BI & UX

* **CRUD Completo Sem Recarga:** Cadastre, edite, liste e delete despesas em tempo real.
* **Painel de Insights (Métricas Críticas):** Cálculos automáticos em JS que exibem o gasto total, a despesa mais alta e a categoria mais crítica instantaneamente.
* **Cinco Gráficos Interativos (Chart.js):**
    * Despesas por Categoria (Pizza)
    * Métodos de Pagamento mais utilizados (Rosca)
    * Ranking de Maiores Despesas (Barras)
    * Ranking de Principais Fornecedores (Barras)
    * Histórico de Gastos ao Longo do Tempo (Linha)
* **Interface Imersiva (Cyberpunk Dark Mode):** Fontes futuristas (`Orbitron` e `Oxanium`), efeitos de brilho (*shimmer*) nos cards, bordas animadas via CSS Houdini e isolamento visual por desfoque (*blur*) inteligente ao editar um item.

---

## 🛠️ Engenharia do Código: Simulando um Framework

Para fazer o app rodar com performance de framework usando JavaScript Puro (Vanilla), foram aplicadas técnicas avançadas de engenharia de software:

* **Event Delegation (Delegação de Eventos):** Um único *listener* de clique foi atrelado ao container pai da lista. O JS identifica dinamicamente qual botão (`Edit`, `Delete`, `Save`, `Cancel`) foi clicado usando classes. Isso economiza memória e processamento.
* **Validação Declarativa de Formulários:** Em vez de dezenas de `if/else` espalhados, as regras de negócio e mensagens de erro ficam centralizadas no objeto `validationRules`.
* **Imutabilidade no Fluxo de Dados:** Uso de sintaxe moderna como o operador *Spread* (`[...]`) e métodos funcionais (`.reduce()`, `.map()`, `.sort()`) para garantir que os cálculos de BI não gerem efeitos colaterais no estado principal do app.
* **Gerenciamento de Ciclo de Vida do Canvas:** Destruição manual e recriação dos gráficos via código para evitar vazamento de memória (*memory leaks*) e sobreposição visual.

---

## 🚀 Como Executar o Projeto

Graças ao ambiente de desenvolvimento ultra-rápido do **Vite**, você coloca o projeto de pé em segundos.

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.

### Passo a Passo

1. Clone o repositório:
```bash
git clone [https://github.com/gabigoubi/finance-manager-dashboard.git](https://github.com/gabigoubi/finance-manager-dashboard.git)
Entre na pasta do projeto:

Bash
cd finance-manager-dashboard
Instale as dependências (Chart.js, UUID, Vite):

Bash
npm install
Inicie o servidor de desenvolvimento local:

Bash
npm run dev
Abra o endereço gerado no terminal (geralmente http://localhost:5173) no seu navegador.

📄 Licença
Este projeto está sob a licença ISC.
