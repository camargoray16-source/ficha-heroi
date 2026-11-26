# 📙 Ficha de Herói — Eliseu (Parte 2: JavaScript)

Projeto desenvolvido para a disciplina de **Tecnologia Web**. É uma ficha/portfólio temática do herói **Eliseu, Guardião da Aliança**.

Na **Parte 1** foram criados o protótipo, a estrutura (HTML) e o visual (CSS). Na **Parte 2**, o personagem ganhou comportamento com **JavaScript** (`script.js`): inventário dinâmico, barra de XP interativa, menu hambúrguer, formulário validado e outros recursos.

---

## 📁 Estrutura do Projeto

```
ficha-heroi-parte2/
├── index.html    
├── contato.html    
├── style.css      
├── script.js       
├── README.md
└── imagens/        
```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (estrutura semântica)
- **CSS3** (Flexbox, CSS Grid, variáveis CSS, transições e media queries)
- **JavaScript** (DOM, eventos, arrays de objetos, validação de formulário)
- **Google Fonts** (Cinzel e Poppins)
- **Font Awesome** (ícones)
- **Git & GitHub** (controle de versão e hospedagem)

---

## ⚙️ Funcionalidades de JavaScript

### Requisitos mínimos

| Funcionalidade | Como funciona |
|---|---|
| **Menu hambúrguer** | Em telas pequenas e tablets, o ícone ☰ abre e fecha o menu (a classe `.aberto` é alternada via JavaScript). Ao abrir, o ícone vira ✕. O menu também fecha ao clicar em um link ou apertar `Esc`. |
| **Inventário dinâmico** | Array de objetos com 6 itens (nome, tipo, raridade e descrição). O `forEach` percorre o array e o `createElement` gera os cards dentro da seção de Inventário. Se alguma imagem não carregar, o card troca automaticamente por um ícone. |
| **Filtro do inventário** | Botões por tipo (Todos, Equipamento, Consumível e Troféu). O botão da categoria ativa fica destacado. |
| **Barra de XP** | O botão "Completar missão" soma 150 XP e atualiza o texto e a largura da barra (já sincronizada com o valor inicial ao abrir a página). Ao chegar em 3.000 XP, aparece **"Nível up!"** e o nível do herói sobe. |
| **Ver história completa** | Revela a história completa do Eliseu. O texto do botão alterna entre "Ver história completa" e "Ver menos" com o **operador ternário**. |
| **Formulário de contato** | Usa `preventDefault()` e valida nome, e-mail (formato), assunto e mensagem. As mensagens de erro e sucesso aparecem na tela, sem `alert()`. |
| **Depuração** | `console.log()` e `console.error()` foram usados durante o desenvolvimento e removidos antes da entrega. |

### Requisitos adicionais

- **Contador dinâmico** de itens conquistados, calculado a partir do array do inventário.
- **Modo noturno da guilda:** alterna a classe `modo-noturno` no `<body>`.
- **Scroll suave** entre as seções ao clicar nos links do menu.
- **Saudação dinâmica** conforme o horário do visitante ("Bom dia, viajante", "Boa tarde, aventureiro(a)", "Boa noite, guerreiro(a)").

### Pesquisa complementar

- **`localStorage`:** o modo noturno e os itens favoritados (♥) ficam salvos no navegador e continuam ao recarregar a página.

---

## 🎨 Decisões de UI/UX

### Parte 1 (UI/UX estática)

- **Hierarquia:** títulos em fonte Cinzel dourada, destacando as seções.
- **Contraste:** texto claro sobre fundo escuro, garantindo boa leitura.
- **Consistência:** molduras douradas e cores por atributo repetidas em toda a ficha.

### Parte 2 (UI/UX de interação)

- **Visibilidade do estado do sistema**
  - O menu hambúrguer muda de ☰ para ✕ quando está aberto.
  - O botão do menu muda de cor ao passar o mouse (`:hover`), ao tocar (`:active`) e enquanto o menu está aberto.
  - O filtro do inventário destaca a categoria ativa.
  - O botão de tema troca ícone e texto (modo noturno / modo padrão).
  - O contador mostra quantos itens estão sendo exibidos.
- **Feedback imediato**
  - Ao completar uma missão, aparece uma mensagem e a barra de XP anima.
  - Ao favoritar um item, o coração muda na hora.
  - No envio do formulário, o usuário vê "Enviando...", depois sucesso ou erro.
- **Prevenção de erros**
  - Campos obrigatórios marcados com `*`.
  - O erro aparece ao sair do campo e some quando é corrigido.
  - O foco vai automaticamente para o primeiro campo inválido.
  - O formulário nunca falha silenciosamente.
- **Controle e liberdade do usuário**
  - O menu, a história expandida e os filtros podem ser fechados ou desfeitos a qualquer momento, sem recarregar a página.
- **Consistência com a Parte 1**
  - Os novos estados (`.ativo`, `.revelado`, `.invalido`) reaproveitam as cores, bordas e transições já definidas no CSS.
- **Ajustes apontados na avaliação anterior**
  - Layout responsivo com media queries para desktop, tablet e celular.
  - Âncoras de navegação corrigidas (o link "Atributos" leva ao bloco certo).
  - Foco visível nos botões e links, para navegação por teclado.
  - Banner do herói com altura flexível, para o texto não vazar em telas médias.
  - Texto dos cards ligeiramente maior (legibilidade) e animações reduzidas para quem desativa movimento no sistema (`prefers-reduced-motion`).

---

## 📱 Responsividade e Testes

O menu hambúrguer aparece em telas de até **1000px** (tablets e celulares). Acima disso, o menu fica completo.

| Dispositivo | Largura testada | Comportamento |
|---|---|---|
| Desktop | acima de 1000px | menu completo, layout em colunas |
| Tablet | 768px | menu hambúrguer, seções em 1 coluna, cards em 2 colunas |
| Celular | 375px | menu hambúrguer, cards em 1 ou 2 colunas |

Os testes foram feitos no modo dispositivo das DevTools do navegador (F12).

---

## 🚀 Como Executar

- **Localmente:** baixe a pasta do projeto e abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code).
- **Online (GitHub Pages):https://camargoray16-source.github.io/ficha-heroi_parte2/
- **Repositório GitHub:** https://github.com/camargoray16-source/ficha-heroi

> **Formulário:** o envio usa o serviço Formspree. Para enviar mensagens de verdade, substitua `seu_id_aqui` pelo ID do formulário na constante `FORM_ENDPOINT` do `script.js` e no atributo `action` do `contato.html`. Sem isso, o formulário funciona em modo demonstração (valida e mostra a mensagem "Mensagem validada! (modo demonstração...)", mas não envia e-mail).

---

## 🎨 Protótipo

O protótipo do projeto está disponível em `prototipo.pdf`, na pasta do projeto.

---

## 📄 Licença

Este projeto é de uso educacional, criado como parte da disciplina **Tecnologia Web**.

---

## 👤 Desenvolvedora

**Fernanda Ray de Camargo**
- **RA:** 268222
- **Turma:** Turma A  2º semestre
- **E-mail:** camargo.ray16@gmail.com
