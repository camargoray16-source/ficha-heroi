/* ==========================================================
   script.js — Ficha de Herói: Eliseu (Parte 2)
   Funciona nas duas páginas (index.html e contato.html):
   cada função confere se os elementos existem antes de agir.
   ========================================================== */

// ---------- Utilitário: localStorage seguro (pode estar bloqueado) ----------
function lerSalvo(chave, padrao) {
  try { return localStorage.getItem(chave) ?? padrao; } catch (e) { return padrao; }
}
function salvar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch (e) { /* sem armazenamento: segue sem salvar */ }
}

// ---------- 1. MENU HAMBÚRGUER ----------
function iniciarMenu() {
  const botao = document.getElementById('btn-menu');
  const menu = document.getElementById('menu-nav');
  if (!botao || !menu) return;

  function definirMenu(aberto) {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', aberto);
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    // Visibilidade do estado: ☰ vira ✕
    botao.innerHTML = aberto ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  }

  botao.addEventListener('click', () => definirMenu(!menu.classList.contains('aberto')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => definirMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') definirMenu(false); }); // controle do usuário
}

// ---------- 2. MODO NOTURNO DA GUILDA (salvo no localStorage) ----------
function iniciarTema() {
  const botao = document.getElementById('btn-tema');
  if (!botao) return;

  function aplicar(noturno) {
    document.body.classList.toggle('modo-noturno', noturno);
    botao.setAttribute('aria-pressed', noturno);
    botao.innerHTML = noturno
      ? '<i class="fa-solid fa-sun"></i> <span>Modo padrão</span>'
      : '<i class="fa-solid fa-moon"></i> <span>Modo noturno</span>';
  }

  aplicar(lerSalvo('tema-guilda', 'padrao') === 'noturno');
  botao.addEventListener('click', () => {
    const noturno = !document.body.classList.contains('modo-noturno');
    aplicar(noturno);
    salvar('tema-guilda', noturno ? 'noturno' : 'padrao');
  });
}

// ---------- 3. SAUDAÇÃO PELO HORÁRIO ----------
function iniciarSaudacao() {
  const el = document.getElementById('saudacao');
  if (!el) return;
  const hora = new Date().getHours();
  let texto;
  if (hora >= 5 && hora < 12) texto = 'Bom dia, viajante';
  else if (hora >= 12 && hora < 18) texto = 'Boa tarde, aventureiro(a)';
  else texto = 'Boa noite, guerreiro(a)';
  el.textContent = texto;
}

// ---------- 4. SCROLL SUAVE ENTRE SEÇÕES ----------
function iniciarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const destino = link.getAttribute('href');
      if (destino.length < 2) return;
      const alvo = document.querySelector(destino);
      if (!alvo) return;
      e.preventDefault();
      alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.link-nav').forEach(l => l.classList.remove('ativo'));
      link.classList.add('ativo');
    });
  });
}

// ---------- 5. "VER HISTÓRIA COMPLETA" ----------
function iniciarHistoria() {
  const botao = document.getElementById('btn-historia');
  const extra = document.getElementById('historia-extra');
  if (!botao || !extra) return;

  botao.addEventListener('click', () => {
    const aberto = extra.classList.toggle('revelado');
    botao.textContent = aberto ? 'Ver menos' : 'Ver história completa'; // operador ternário
    botao.setAttribute('aria-expanded', aberto);
    extra.setAttribute('aria-hidden', !aberto);
  });
}

// ---------- 6. INVENTÁRIO DINÂMICO + FILTRO ----------
const itens = [
  { nome: 'Manto do Guardião', tipo: 'Equipamento', raridade: 'Lendário', estrelas: 3, imagem: 'imagens/manto.png', icone: 'fa-user-shield',
    descricao: 'Um manto mágico que aumenta a resistência do personagem contra ataques espirituais.' },
  { nome: 'Cajado do Profeta', tipo: 'Equipamento', raridade: 'Lendário', estrelas: 3, imagem: 'imagens/cajado.png', icone: 'fa-wand-sparkles',
    descricao: 'Canaliza a energia espiritual do Guardião.' },
  { nome: 'Vaso da Abundância', tipo: 'Consumível', raridade: 'Raro', estrelas: 2, imagem: 'imagens/vaso.png', icone: 'fa-jar',
    descricao: 'Um recipiente capaz de produzir recursos durante situações de necessidade.' },
  { nome: 'Pergaminho da Sabedoria', tipo: 'Consumível', raridade: 'Épico', estrelas: 3, imagem: 'imagens/pergaminho.png', icone: 'fa-scroll',
    descricao: 'Aumenta temporariamente o atributo de Sabedoria.' },
  { nome: 'Poção de Cura', tipo: 'Consumível', raridade: 'Raro', estrelas: 2, icone: 'fa-flask',
    descricao: 'Restaura parte da vida de um aliado ferido.' },
  { nome: 'Troféu da Aliança', tipo: 'Troféu', raridade: 'Épico', estrelas: 3, icone: 'fa-trophy',
    descricao: 'Entregue a Eliseu por proteger uma comunidade inteira.' }
];

function iniciarInventario() {
  const lista = document.getElementById('lista-inventario');
  const filtros = document.getElementById('filtros-inventario');
  const contador = document.getElementById('contador-itens');
  if (!lista || !filtros || !contador) return;

  let filtroAtual = 'Todos';
  let salvos = [];
  try { salvos = JSON.parse(lerSalvo('favoritos-eliseu', '[]')); } catch (e) { salvos = []; }
  const favoritos = new Set(Array.isArray(salvos) ? salvos : []);
  let totalExibidos = itens.length;

  // Texto do contador (reaproveitado ao filtrar e ao favoritar)
  function atualizarContador() {
    contador.textContent = `${totalExibidos} de ${itens.length} itens conquistados · ${favoritos.size} favorito(s)`;
  }

  // Cria os botões de categoria a partir dos tipos existentes no array
  ['Todos', ...new Set(itens.map(i => i.tipo))].forEach(tipo => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-filtro';
    b.textContent = tipo;
    b.addEventListener('click', () => { filtroAtual = tipo; desenhar(); });
    filtros.appendChild(b);
  });

  function desenhar() {
    lista.innerHTML = '';
    // Estado visível: só o botão da categoria ativa fica destacado
    filtros.querySelectorAll('.btn-filtro').forEach(b => {
      const ativo = b.textContent === filtroAtual;
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-pressed', ativo);
    });

    const exibidos = filtroAtual === 'Todos' ? itens : itens.filter(i => i.tipo === filtroAtual);

    exibidos.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-item-prototipo card-dinamico';
      // remove acentos: "Lendário" -> "lendario", "Épico" -> "epico"
      const classeRar = item.raridade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const midia = item.imagem
        ? `<img src="${item.imagem}" alt="${item.nome}">`
        : `<i class="fa-solid ${item.icone} icone-item"></i>`;
      const fav = favoritos.has(item.nome);
      card.innerHTML = `
        <button type="button" class="btn-fav ${fav ? 'ativo' : ''}" aria-pressed="${fav}" aria-label="Favoritar ${item.nome}">
          <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <div class="img-box-prototipo">${midia}</div>
        <h3>${item.nome}</h3>
        <span class="raridade ${classeRar}">${item.raridade}</span>
        <div class="estrelas">${'★'.repeat(item.estrelas)}</div>
        <p>${item.descricao}</p>`;

      // Se a imagem não carregar, troca por um ícone (a ficha nunca fica com imagem quebrada)
      const img = card.querySelector('.img-box-prototipo img');
      if (img) {
        img.addEventListener('error', () => {
          img.parentElement.innerHTML = `<i class="fa-solid ${item.icone || 'fa-gem'} icone-item"></i>`;
        });
      }

      const btnFav = card.querySelector('.btn-fav');
      btnFav.addEventListener('click', () => {
        const agoraFavorito = !favoritos.has(item.nome);
        if (agoraFavorito) favoritos.add(item.nome); else favoritos.delete(item.nome);
        salvar('favoritos-eliseu', JSON.stringify([...favoritos]));
        // Feedback imediato: o coração muda na hora, sem recarregar a lista
        btnFav.classList.toggle('ativo', agoraFavorito);
        btnFav.setAttribute('aria-pressed', agoraFavorito);
        btnFav.innerHTML = `<i class="fa-${agoraFavorito ? 'solid' : 'regular'} fa-heart"></i>`;
        atualizarContador();
      });

      lista.appendChild(card);
      requestAnimationFrame(() => card.classList.add('revelado')); // transição do CSS
    });

    totalExibidos = exibidos.length;
    atualizarContador();
  }

  desenhar();
}

// ---------- 7. BARRA DE XP ----------
function iniciarXP() {
  const botao = document.getElementById('btn-xp');
  const barra = document.getElementById('xp-barra');
  const texto = document.getElementById('xp-texto');
  const msg = document.getElementById('msg-xp');
  const nivelEl = document.getElementById('nivel-heroi');
  if (!botao || !barra || !texto || !msg) return;

  const XP_POR_MISSAO = 150;
  const XP_PARA_NIVEL = 3000;
  let xp = 2450;
  let nivel = 25;

  // Atualiza barra, texto e nível na tela a partir das variáveis
  function atualizarTela() {
    barra.style.width = (xp / XP_PARA_NIVEL * 100) + '%';
    texto.textContent = `${xp.toLocaleString('pt-BR')} / ${XP_PARA_NIVEL.toLocaleString('pt-BR')}`;
    if (nivelEl) nivelEl.textContent = nivel;
  }
  atualizarTela();

  botao.addEventListener('click', () => {
    xp += XP_POR_MISSAO;
    msg.classList.remove('levelup');

    if (xp >= XP_PARA_NIVEL) {
      nivel++;
      xp -= XP_PARA_NIVEL;
      msg.textContent = `✨ Nível up! Eliseu chegou ao nível ${nivel}!`;
      msg.classList.add('levelup');
    } else {
      msg.textContent = `Missão concluída! +${XP_POR_MISSAO} XP (faltam ${XP_PARA_NIVEL - xp} para o próximo nível)`;
    }

    atualizarTela();
  });
}

// ---------- 8. FORMULÁRIO DE CONTATO ----------
// Troque pelo seu ID real do Formspree para o envio funcionar de verdade.
const FORM_ENDPOINT = 'https://formspree.io/f/seu_id_aqui';

function iniciarFormulario() {
  const form = document.getElementById('form-guilda');
  if (!form) return;
  const status = document.getElementById('status-form');
  const botao = document.getElementById('btn-enviar');
  const campos = ['nome', 'email', 'assunto', 'mensagem'].map(id => document.getElementById(id));

  // Retorna a mensagem de erro do campo ('' = válido)
  function validar(campo) {
    const v = campo.value.trim();
    if (campo.id === 'nome') return v.length < 2 ? 'Informe seu nome ou título (mínimo 2 letras).' : '';
    if (campo.id === 'email') {
      if (!v) return 'Informe seu e-mail.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'E-mail inválido. Exemplo: nome@reino.com';
    }
    if (campo.id === 'assunto') return v ? '' : 'Escolha um assunto.';
    if (campo.id === 'mensagem') return v.length < 10 ? 'Escreva ao menos 10 caracteres na mensagem.' : '';
    return '';
  }

  // Mostra (ou limpa) o erro de um campo; retorna true se estiver válido
  function mostrar(campo) {
    const erro = validar(campo);
    const caixa = campo.closest('.campo');
    document.getElementById('erro-' + campo.id).textContent = erro;
    caixa.classList.toggle('invalido', erro !== '');
    caixa.classList.toggle('valido', erro === '');
    campo.setAttribute('aria-invalid', erro !== '');
    return erro === '';
  }

  // Prevenção de erros: avisa enquanto o usuário preenche
  campos.forEach(c => {
    c.addEventListener('blur', () => mostrar(c));
    c.addEventListener('input', () => { if (c.closest('.campo').classList.contains('invalido')) mostrar(c); });
  });

  function aviso(texto, tipo) {
    status.textContent = texto;
    status.className = 'status-form ' + tipo;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault(); // impede o envio padrão: o JS assume o controle
    const resultados = campos.map(mostrar); // valida todos os campos
    if (resultados.includes(false)) {
      aviso('Revise os campos destacados antes de enviar.', 'erro-geral');
      campos.find(c => c.closest('.campo').classList.contains('invalido')).focus();
      return;
    }

    botao.disabled = true;
    aviso('Enviando mensagem...', 'enviando');
    try {
      if (FORM_ENDPOINT.includes('seu_id_aqui')) {
        await new Promise(r => setTimeout(r, 700)); // modo demonstração (sem Formspree configurado)
      } else {
        const resp = await fetch(FORM_ENDPOINT, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
        });
        if (!resp.ok) throw new Error('Falha no envio');
      }
      const demo = FORM_ENDPOINT.includes('seu_id_aqui');
      aviso(demo
        ? '✓ Mensagem validada! (modo demonstração: configure o Formspree para enviar de verdade)'
        : '✓ Mensagem enviada! O Guardião responderá em breve.', 'sucesso');
      form.reset();
      campos.forEach(c => c.closest('.campo').classList.remove('valido'));
    } catch (erro) {
      aviso('Não foi possível enviar agora. Verifique sua conexão e tente novamente.', 'erro-geral');
    } finally {
      botao.disabled = false;
    }
  });
}

// ---------- INICIALIZAÇÃO ----------
document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  iniciarTema();
  iniciarSaudacao();
  iniciarScrollSuave();
  iniciarHistoria();
  iniciarInventario();
  iniciarXP();
  iniciarFormulario();
});
