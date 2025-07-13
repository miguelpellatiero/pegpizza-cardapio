// Dados das pizzas simplificados
const pizzasSalgadas = [
    "Alho e Óleo", "Atum com Cebolas", "Bacon", "Bacon com Brócolis", 
    "Calabresa e Cebolas", "Calabresa Especial", "Calabresa com Catupiry", 
    "Frango Catupiry", "Frango Caipira", "Lombo", "Lombo Champignon", 
    "Mussarela", "Portuguesa", "Bauru", "4 Queijos", "Napolitana", 
    "Margarita", "Strogonoff de Frango", "Brócolis com Catupiry", "Horta"
];

const pizzasDoces = [
    "Chocolate e Morango", "Chocolate com Amendoim", "Chocolate e Coco", 
    "Brigadeiro", "Chocolate com Banana", "Chocolate Preto e Branco", 
    "Queijo e Goiabada", "Chocolate e M&M", "Chocolate e Cereja", 
    "Chocolate Branco"
];

// Preços
const precos = {
    "25cm-salgada": 30.00,
    "25cm-doce": 25.00,
    "35cm": 60.00,
    "refri": 13.00
};

// Sistema de Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinhoPegPizza')) || [];
let currentMenuType = 'salgada';
let currentOption = 'individual';

// Variáveis para modais
let selectedSabores = [];
let currentSize = '';
let currentPromoType = '';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    atualizarCarrinho();
});

// Mostrar menu (salgada/doce)
function showMenu(type) {
    currentMenuType = type;
    
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar/esconder listas
    document.getElementById('pizzas-salgadas').style.display = type === 'salgada' ? 'block' : 'none';
    document.getElementById('pizzas-doces').style.display = type === 'doce' ? 'block' : 'none';
}

// Mostrar opção (individual/dois sabores)
function showOption(option) {
    currentOption = option;
    
    // Atualizar botões
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar/esconder conteúdo
    document.getElementById('individual-menu').style.display = option === 'individual' ? 'block' : 'none';
    document.getElementById('dois-sabores-menu').style.display = option === 'dois-sabores' ? 'block' : 'none';
}

// Renderizar menu
function renderMenu() {
    const containerSalgadas = document.getElementById('pizzas-salgadas');
    const containerDoces = document.getElementById('pizzas-doces');
    
    containerSalgadas.innerHTML = '';
    containerDoces.innerHTML = '';
    
    // Pizzas salgadas
    pizzasSalgadas.forEach((pizza, index) => {
        const pizzaElement = createPizzaElement(pizza, index + 1, 'salgada');
        containerSalgadas.appendChild(pizzaElement);
    });
    
    // Pizzas doces
    pizzasDoces.forEach((pizza, index) => {
        const pizzaElement = createPizzaElement(pizza, index + 21, 'doce');
        containerDoces.appendChild(pizzaElement);
    });
}

// Criar elemento de pizza
function createPizzaElement(nome, numero, tipo) {
    const div = document.createElement('div');
    div.className = 'pizza-item';
    div.innerHTML = `
        <div class="pizza-info">
            <span class="pizza-number">${numero}</span>
            <span class="pizza-name">${nome}</span>
        </div>
        <div class="pizza-actions">
            <button onclick="addToCart('${nome}', '25cm', '${tipo}')" class="size-btn-small">
                25cm - R$ ${tipo === 'doce' ? '25,00' : '30,00'}
            </button>
            <button onclick="addToCart('${nome}', '35cm', '${tipo}')" class="size-btn-small">
                35cm - R$ 60,00
            </button>
        </div>
    `;
    return div;
}

// Adicionar ao carrinho
function addToCart(nome, tamanho, tipo) {
    const preco = tamanho === '25cm' ? (tipo === 'doce' ? precos['25cm-doce'] : precos['25cm-salgada']) : precos['35cm'];
    
    const item = {
        id: Date.now() + Math.random(),
        nome: nome,
        tamanho: tamanho,
        tipo: tipo,
        preco: preco,
        quantidade: 1,
        isPromo: false
    };
    
    // Verificar se já existe
    const existente = carrinho.find(i => 
        i.nome === nome && i.tamanho === tamanho && !i.isPromo
    );
    
    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push(item);
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${nome} (${tamanho}) adicionada!`);
}

// Iniciar seleção de dois sabores
function initDoisSabores(tamanho) {
    currentSize = tamanho;
    selectedSabores = [];
    
    const maxSabores = 2; // Sempre 2 sabores
    const tipo = currentMenuType;
    const sabores = tipo === 'salgada' ? pizzasSalgadas : pizzasDoces;
    const preco = tamanho === '25cm' ? 
        (tipo === 'doce' ? 'R$ 25,00' : 'R$ 30,00') : 
        'R$ 60,00';
    
    document.getElementById('modal-title').textContent = 
        `Escolha 2 sabores (${tamanho}) - ${preco}`;
    
    const selection = document.getElementById('sabores-selection');
    selection.innerHTML = `
        <p>Selecione 2 sabores de pizza ${tipo}:</p>
        <div class="sabores-grid">
            ${sabores.map((sabor, index) => `
                <label class="sabor-option">
                    <input type="checkbox" value="${sabor}" onchange="updateSabores()">
                    <span>${sabor}</span>
                </label>
            `).join('')}
        </div>
        <div class="selected-count">
            <span id="count-display">0/2 selecionados</span>
        </div>
    `;
    
    document.getElementById('dois-sabores-modal').style.display = 'block';
}

// Atualizar sabores selecionados
function updateSabores() {
    const checkboxes = document.querySelectorAll('#sabores-selection input[type="checkbox"]');
    const maxSabores = 2; // Sempre 2 sabores
    
    selectedSabores = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Limitar seleção
    if (selectedSabores.length > maxSabores) {
        checkboxes.forEach(cb => {
            if (!selectedSabores.slice(0, maxSabores).includes(cb.value)) {
                cb.checked = false;
            }
        });
        selectedSabores = selectedSabores.slice(0, maxSabores);
    }
    
    document.getElementById('count-display').textContent = 
        `${selectedSabores.length}/2 selecionados`;
}

// Adicionar dois sabores ao carrinho
function addDoisSaboresToCart() {
    const maxSabores = 2; // Sempre 2 sabores
    
    if (selectedSabores.length !== maxSabores) {
        alert('Selecione exatamente 2 sabores!');
        return;
    }
    
    const tipo = currentMenuType;
    const preco = currentSize === '25cm' ? 
        (tipo === 'doce' ? precos['25cm-doce'] : precos['25cm-salgada']) : 
        precos['35cm'];
    
    const item = {
        id: Date.now() + Math.random(),
        nome: selectedSabores.join(' + '),
        tamanho: currentSize,
        tipo: tipo,
        preco: preco,
        quantidade: 1,
        isPromo: false
    };
    
    carrinho.push(item);
    salvarCarrinho();
    atualizarCarrinho();
    closeModal();
    mostrarNotificacao('Pizza 2 sabores adicionada!');
}

// Iniciar promoção
function iniciarPromo(tipo) {
    currentPromoType = tipo;
    selectedSabores = [];
    
    document.getElementById('promo-title').textContent = 
        `Promoção ${tipo === 'doce' ? 'Doce' : 'Salgado'}`;
    
    const selection = document.getElementById('promo-selection');
    selection.innerHTML = `
        <div class="promo-step">
            <h4>1. Pizza 35cm Salgada (3 sabores):</h4>
            <div class="sabores-grid" id="sabores-35cm">
                ${pizzasSalgadas.map(sabor => `
                    <label class="sabor-option">
                        <input type="checkbox" value="${sabor}" name="sabores-35" onchange="updatePromoSabores()">
                        <span>${sabor}</span>
                    </label>
                `).join('')}
            </div>
            <span class="count" id="count-35">0/3 selecionados</span>
        </div>
        
        <div class="promo-step">
            <h4>2. Pizza 25cm ${tipo === 'doce' ? 'Doce' : 'Salgada'} (2 sabores):</h4>
            <div class="sabores-grid" id="sabores-25cm">
                ${(tipo === 'doce' ? pizzasDoces : pizzasSalgadas).map(sabor => `
                    <label class="sabor-option">
                        <input type="checkbox" value="${sabor}" name="sabores-25" onchange="updatePromoSabores()">
                        <span>${sabor}</span>
                    </label>
                `).join('')}
            </div>
            <span class="count" id="count-25">0/2 selecionados</span>
        </div>
        
        <div class="promo-step">
            <h4>3. Refrigerante 2L GRÁTIS incluído!</h4>
        </div>
        
        <div class="promo-total">
            <strong>Total: R$ ${tipo === 'doce' ? '85,00' : '90,00'}</strong>
        </div>
    `;
    
    document.getElementById('promo-modal').style.display = 'block';
}

// Atualizar sabores da promoção
function updatePromoSabores() {
    const checkboxes35 = document.querySelectorAll('input[name="sabores-35"]');
    const checkboxes25 = document.querySelectorAll('input[name="sabores-25"]');
    
    const selected35 = Array.from(checkboxes35).filter(cb => cb.checked);
    const selected25 = Array.from(checkboxes25).filter(cb => cb.checked);
    
    // Limitar seleções
    if (selected35.length > 3) {
        checkboxes35.forEach((cb, index) => {
            if (index >= 3 && cb.checked) cb.checked = false;
        });
    }
    
    if (selected25.length > 2) {
        checkboxes25.forEach((cb, index) => {
            if (index >= 2 && cb.checked) cb.checked = false;
        });
    }
    
    document.getElementById('count-35').textContent = 
        `${Math.min(selected35.length, 3)}/3 selecionados`;
    document.getElementById('count-25').textContent = 
        `${Math.min(selected25.length, 2)}/2 selecionados`;
}

// Adicionar promoção ao carrinho
function addPromoToCart() {
    const sabores35 = Array.from(document.querySelectorAll('input[name="sabores-35"]:checked')).map(cb => cb.value);
    const sabores25 = Array.from(document.querySelectorAll('input[name="sabores-25"]:checked')).map(cb => cb.value);
    
    if (sabores35.length !== 3 || sabores25.length !== 2) {
        alert('Selecione todos os sabores necessários!');
        return;
    }
    
    const preco = currentPromoType === 'doce' ? 85.00 : 90.00;
    
    const item = {
        id: Date.now() + Math.random(),
        nome: `PROMOÇÃO ${currentPromoType.toUpperCase()}`,
        detalhes: `35cm: ${sabores35.join(' + ')} | 25cm: ${sabores25.join(' + ')} | Refri 2L GRÁTIS`,
        preco: preco,
        quantidade: 1,
        isPromo: true
    };
    
    carrinho.push(item);
    salvarCarrinho();
    atualizarCarrinho();
    closePromoModal();
    mostrarNotificacao('Promoção adicionada!');
}

// Fechar modais
function closeModal() {
    document.getElementById('dois-sabores-modal').style.display = 'none';
}

function closePromoModal() {
    document.getElementById('promo-modal').style.display = 'none';
}

// Sistema do carrinho (simplificado)
function salvarCarrinho() {
    localStorage.setItem('carrinhoPegPizza', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
    const count = document.getElementById('carrinho-count');
    const items = document.getElementById('carrinho-items');
    const total = document.getElementById('carrinho-total');
    
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    count.textContent = totalItens;
    
    if (totalItens === 0) {
        items.innerHTML = '<p class="carrinho-vazio">Carrinho vazio</p>';
        total.style.display = 'none';
        return;
    }
    
    items.innerHTML = carrinho.map(item => `
        <div class="carrinho-item">
            <div class="item-info">
                <h4>${item.nome}</h4>
                ${item.detalhes ? `<p>${item.detalhes}</p>` : ''}
                ${!item.isPromo ? `<p>${item.tamanho} - ${item.tipo}</p>` : ''}
                <strong>R$ ${item.preco.toFixed(2)}</strong>
            </div>
            <div class="item-controls">
                <button onclick="alterarQuantidade('${item.id}', -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade('${item.id}', 1)">+</button>
                <button onclick="removerItem('${item.id}')" class="remove-btn">🗑️</button>
            </div>
        </div>
    `).join('');
    
    total.style.display = 'block';
}

function alterarQuantidade(itemId, mudanca) {
    const item = carrinho.find(i => i.id.toString() === itemId);
    if (item) {
        item.quantidade += mudanca;
        if (item.quantidade <= 0) {
            removerItem(itemId);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

function removerItem(itemId) {
    carrinho = carrinho.filter(i => i.id.toString() !== itemId);
    salvarCarrinho();
    atualizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

function toggleCarrinho() {
    const sidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('carrinho-overlay');
    
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    }
}

// Enviar pedido simplificado
function enviarPedido() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    let mensagem = 'Boa noite dona Vania, gostaria de fazer um pedido:\n\n';
    
    let valorTotal = 0;
    carrinho.forEach((item, index) => {
        // Verificar se é uma pizza de múltiplos sabores
        if (item.nome.includes(' + ') && !item.isPromo) {
            const sabores = item.nome.split(' + ');
            mensagem += `${index + 1}. pizza 2 sabores:\n`;
            sabores.forEach((sabor, saborIndex) => {
                mensagem += `   sabor ${saborIndex + 1} ${sabor.toLowerCase()}\n`;
            });
            mensagem += `   tamanho: ${item.tamanho}\n`;
        } else if (item.detalhes) {
            // Promoções
            mensagem += `${index + 1}. ${item.nome}\n`;
            mensagem += `   ${item.detalhes}\n`;
        } else {
            // Pizza individual
            mensagem += `${index + 1}. ${item.nome.toLowerCase()}\n`;
            mensagem += `   tamanho: ${item.tamanho}\n`;
        }
        
        mensagem += `   quantidade: ${item.quantidade}\n`;
        mensagem += `   valor: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
        
        valorTotal += item.preco * item.quantidade;
    });
    
    mensagem += `💰 *Total: R$ ${valorTotal.toFixed(2)}*`;
    
    const numero = '5554981516682';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Notificação simples
function mostrarNotificacao(texto) {
    const div = document.createElement('div');
    div.className = 'notificacao show';
    div.textContent = texto;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: target.offsetTop - offset - 20,
                behavior: 'smooth'
            });
        }
    });
});