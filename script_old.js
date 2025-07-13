// Dados das pizzas salgadas
const pizzasSalgadas = [
    {
        numero: 1,
        nome: "Alho e Óleo",
        ingredientes: "Alho refogado e azeite extra virgem"
    },
    {
        numero: 2,
        nome: "Atum com Cebolas",
        ingredientes: "Atum em conserva e cebolas caramelizadas"
    },
    {
        numero: 3,
        nome: "Bacon",
        ingredientes: "Bacon crocante"
    },
    {
        numero: 4,
        nome: "Bacon com Brócolis",
        ingredientes: "Bacon crocante, brócolis frescos",
        opcoes: "Opção: Catupiry ou Mussarela"
    },
    {
        numero: 5,
        nome: "Calabresa e Cebolas",
        ingredientes: "Calabresa defumada e cebolas"
    },
    {
        numero: 6,
        nome: "Calabresa Especial",
        ingredientes: "Calabresa defumada, cebolas, pimentão e pimenta calabresa"
    },
    {
        numero: 7,
        nome: "Calabresa com Catupiry",
        ingredientes: "Calabresa defumada, cebolas e catupiry"
    },
    {
        numero: 8,
        nome: "Frango Catupiry",
        ingredientes: "Frango desfiado e catupiry"
    },
    {
        numero: 9,
        nome: "Frango Caipira",
        ingredientes: "Frango caipira, milho e catupiry"
    },
    {
        numero: 10,
        nome: "Lombo Especial",
        ingredientes: "Lombo defumado, cebola, palmito e mussarela"
    },
    {
        numero: 11,
        nome: "Lombo Champignon",
        ingredientes: "Lombo defumado, champignon e catupiry"
    },
    {
        numero: 12,
        nome: "Mussarela",
        ingredientes: "Extra mussarela"
    },
    {
        numero: 13,
        nome: "Portuguesa",
        ingredientes: "Presunto, ovos, ervilha e cebola"
    },
    {
        numero: 14,
        nome: "Bauru",
        ingredientes: "Presunto, tomates e queijo"
    },
    {
        numero: 15,
        nome: "4 Queijos",
        ingredientes: "Mussarela, catupiry, provolone e queijo lanche"
    },
    {
        numero: 16,
        nome: "Napolitana",
        ingredientes: "Tomates frescos e parmesão"
    },
    {
        numero: 17,
        nome: "Margarita",
        ingredientes: "Tomates frescos e manjericão"
    },
    {
        numero: 18,
        nome: "Strogonoff de Frango",
        ingredientes: "Strogonoff de frango cremoso com batata palha"
    },
    {
        numero: 19,
        nome: "Brócolis com Catupiry",
        ingredientes: "Brócolis frescos e catupiry"
    },
    {
        numero: 20,
        nome: "Horta",
        ingredientes: "Cenoura, ervilha, milho, brócolis, palmito e catupiry"
    }
];

// Dados das pizzas doces
const pizzasDoces = [
    {
        numero: 21,
        nome: "Chocolate e Morango",
        ingredientes: "Chocolate ao leite e morangos frescos"
    },
    {
        numero: 22,
        nome: "Chocolate com Amendoim",
        ingredientes: "Chocolate cremoso e amendoim crocante"
    },
    {
        numero: 23,
        nome: "Chocolate e Coco",
        ingredientes: "Chocolate ao leite e coco ralado"
    },
    {
        numero: 24,
        nome: "Brigadeiro",
        ingredientes: "Brigadeiro cremoso e granulado"
    },
    {
        numero: 25,
        nome: "Chocolate com Banana",
        ingredientes: "Chocolate branco ou preto, banana e canela"
    },
    {
        numero: 26,
        nome: "Chocolate Preto e Branco",
        ingredientes: "Combinação de chocolate preto e branco"
    },
    {
        numero: 27,
        nome: "Queijo e Goiabada",
        ingredientes: "Queijo cremoso e goiabada"
    },
    {
        numero: 28,
        nome: "Chocolate e M&M",
        ingredientes: "Chocolate cremoso e M&M coloridos"
    },
    {
        numero: 29,
        nome: "Chocolate e Cereja",
        ingredientes: "Chocolate ao leite e cerejas"
    },
    {
        numero: 30,
        nome: "Chocolate Branco Especial",
        ingredientes: "Chocolate branco, maçã e creme de leite"
    }
];

// Sistema de Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinhoPegPizza')) || [];

// Função para criar card de pizza
function criarPizzaCard(pizza, isDoce = false) {
    const pizzaCard = document.createElement('div');
    pizzaCard.className = 'pizza-card';
    
    const baseText = isDoce ? 
        "Base: Massa doce italiana" : 
        "Base: Molho de tomate, queijo mussarela e azeitonas";
    
    pizzaCard.innerHTML = `
        <div class="pizza-number">${pizza.numero}</div>
        <h3 class="pizza-name">${pizza.nome}</h3>
        <p class="pizza-ingredients">${pizza.ingredientes}</p>
        ${pizza.opcoes ? `<p class="pizza-ingredients"><strong>${pizza.opcoes}</strong></p>` : ''}
        <div class="pizza-base">${baseText}</div>
        <div class="pizza-actions">
            <div class="size-selector">
                <label>
                    <input type="radio" name="size-${pizza.numero}" value="25cm" checked>
                    <span>25cm (2 sabores)</span>
                </label>
                <label>
                    <input type="radio" name="size-${pizza.numero}" value="35cm">
                    <span>35cm (3 sabores)</span>
                </label>
            </div>
            <button class="add-to-cart-btn" onclick="adicionarAoCarrinho(${pizza.numero}, '${pizza.nome}', '${pizza.ingredientes}', ${isDoce})">
                <i class="fas fa-plus"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    return pizzaCard;
}

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(numero, nome, ingredientes, isDoce) {
    const sizeInputs = document.querySelectorAll(`input[name="size-${numero}"]`);
    let tamanhoSelecionado = '25cm';
    
    sizeInputs.forEach(input => {
        if (input.checked) {
            tamanhoSelecionado = input.value;
        }
    });
    
    const item = {
        id: Date.now() + Math.random(),
        numero: numero,
        nome: nome,
        ingredientes: ingredientes,
        tamanho: tamanhoSelecionado,
        tipo: isDoce ? 'doce' : 'salgada',
        quantidade: 1
    };
    
    // Verificar se já existe item similar
    const itemExistente = carrinho.find(i => 
        i.numero === numero && i.tamanho === tamanhoSelecionado
    );
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push(item);
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${nome} (${tamanhoSelecionado}) adicionada ao carrinho!`);
}

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinhoPegPizza', JSON.stringify(carrinho));
}

// Função para atualizar display do carrinho
function atualizarCarrinho() {
    const carrinhoCount = document.getElementById('carrinho-count');
    const carrinhoItems = document.getElementById('carrinho-items');
    const carrinhoTotal = document.getElementById('carrinho-total');
    
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    
    if (totalItens === 0) {
        carrinhoItems.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        carrinhoTotal.style.display = 'none';
        return;
    }
    
    carrinhoItems.innerHTML = '';
    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.nome} (${item.tamanho})</h4>
                <p>${item.ingredientes}</p>
            </div>
            <div class="item-controls">
                <button onclick="alterarQuantidade('${item.id}', -1)" class="qty-btn">-</button>
                <span class="quantidade">${item.quantidade}</span>
                <button onclick="alterarQuantidade('${item.id}', 1)" class="qty-btn">+</button>
                <button onclick="removerItem('${item.id}')" class="remove-btn">🗑️</button>
            </div>
        `;
        carrinhoItems.appendChild(itemElement);
    });
    
    carrinhoTotal.style.display = 'block';
}

// Função para alterar quantidade
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

// Função para remover item
function removerItem(itemId) {
    carrinho = carrinho.filter(i => i.id.toString() !== itemId);
    salvarCarrinho();
    atualizarCarrinho();
}

// Função para limpar carrinho
function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

// Função para enviar pedido via WhatsApp
function enviarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let mensagem = '*🍕 PEDIDO PEGPIZZA 🍕*\n\n';
    
    carrinho.forEach((item, index) => {
        mensagem += `*${index + 1}.* ${item.nome} (${item.tamanho})\n`;
        mensagem += `   Ingredientes: ${item.ingredientes}\n`;
        mensagem += `   Quantidade: ${item.quantidade}\n\n`;
    });
    
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    mensagem += `*Total de pizzas:* ${totalItens}\n\n`;
    mensagem += '📱 *Pedido realizado pelo site*';
    
    const numeroWhatsApp = '5512992236923';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
}

// Função para mostrar/esconder carrinho
function toggleCarrinho() {
    const carrinho = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('carrinho-overlay');
    
    if (carrinho.classList.contains('open')) {
        carrinho.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        carrinho.classList.add('open');
        overlay.style.display = 'block';
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Função para renderizar pizzas
function renderizarPizzas() {
    const containerSalgadas = document.getElementById('pizzas-salgadas');
    const containerDoces = document.getElementById('pizzas-doces-grid');
    
    // Renderizar pizzas salgadas
    pizzasSalgadas.forEach(pizza => {
        const pizzaCard = criarPizzaCard(pizza, false);
        containerSalgadas.appendChild(pizzaCard);
    });
    
    // Renderizar pizzas doces
    pizzasDoces.forEach(pizza => {
        const pizzaCard = criarPizzaCard(pizza, true);
        containerDoces.appendChild(pizzaCard);
    });
}

// Função para scroll suave
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para animações on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards de pizza
    setTimeout(() => {
        const pizzaCards = document.querySelectorAll('.pizza-card');
        pizzaCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }, 100);
}

// Função para destacar sabores especiais
function destacarSaboresEspeciais() {
    const saboresEspeciais = [4, 15, 18, 20, 25]; // Números das pizzas especiais
    
    setTimeout(() => {
        saboresEspeciais.forEach(numero => {
            const cards = document.querySelectorAll('.pizza-card');
            cards.forEach(card => {
                const numeroCard = parseInt(card.querySelector('.pizza-number').textContent);
                if (numeroCard === numero) {
                    card.style.background = 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)';
                    card.style.border = '2px solid #d4af37';
                    
                    // Adicionar badge especial
                    if (!card.querySelector('.special-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'special-badge';
                        badge.innerHTML = '<i class="fas fa-star"></i> Especial';
                        badge.style.cssText = `
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            background: #d4af37;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 15px;
                            font-size: 0.7rem;
                            font-weight: bold;
                        `;
                        card.style.position = 'relative';
                        card.appendChild(badge);
                    }
                }
            });
        });
    }, 500);
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    renderizarPizzas();
    setupSmoothScrolling();
    setupScrollAnimations();
    destacarSaboresEspeciais();
    atualizarCarrinho();
    
    // Adicionar efeito hover nas seções
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #faf8f5 0%, #f8f9fa 100%)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.background = '#faf8f5';
        });
    });
    
    // Efeito de typing na tagline
    const tagline = document.querySelector('.tagline');
    const text = tagline.textContent;
    tagline.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 1000);
});

// Efeito de parallax suave no hero
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
});