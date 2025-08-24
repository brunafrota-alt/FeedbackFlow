/* ========================================
   SISTEMA DE COLETA DE FEEDBACKS - TechFlow
   Arquivo JavaScript principal com comentários em português
   ======================================== */

// ========================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// ========================================

// Array para armazenar todos os feedbacks
let feedbacks = [];

// Avaliação atual selecionada no formulário
let currentRating = 0;

// Configurações de visualização
let currentFilter = 'all';        // Filtro atual ('all', '1'-'5', '4-5')
let currentSort = 'newest';       // Ordenação atual ('newest', 'oldest', 'highest', 'lowest')
let displayCount = 8;             // Quantos feedbacks mostrar por vez
let chartType = 'bar';            // Tipo de gráfico ('bar' ou 'pie')
let chart = null;                 // Instância do gráfico Chart.js

// Rótulos das avaliações por estrelas
const ratingLabels = {
    1: 'Muito Insatisfeito',
    2: 'Insatisfeito', 
    3: 'Neutro',
    4: 'Satisfeito',
    5: 'Muito Satisfeito'
};

// Cores verde para os gradientes dos avatares
const avatarGradients = [
    'linear-gradient(135deg, #4ade80, #059669)',  // verde claro para verde médio
    'linear-gradient(135deg, #10b981, #047857)',  // verde esmeralda para verde escuro
    'linear-gradient(135deg, #14b8a6, #0f766e)',  // teal claro para teal escuro
    'linear-gradient(135deg, #84cc16, #65a30d)',  // lima claro para lima escuro
    'linear-gradient(135deg, #22c55e, #15803d)',  // verde para verde escuro
    'linear-gradient(135deg, #06b6d4, #0e7490)',  // cyan para cyan escuro
    'linear-gradient(135deg, #6ee7b7, #059669)',  // verde muito claro para verde médio
    'linear-gradient(135deg, #a7f3d0, #047857)'   // verde pastel para verde escuro
];

// ========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ========================================

/**
 * Função principal que executa quando a página carrega
 * Configura todos os event listeners e carrega dados salvos
 */
function initializeApp() {
    console.log('🚀 Inicializando aplicação TechFlow...');
    
    // Carregar feedbacks salvos no localStorage
    loadFeedbacksFromStorage();
    
    // Configurar eventos do formulário
    setupFormEvents();
    
    // Configurar eventos de filtros e controles
    setupFilterEvents();
    
    // Configurar eventos do gráfico
    setupChartEvents();
    
    // Atualizar interface inicial
    updateInterface();
    
    // Inicializar gráfico
    initializeChart();
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

/**
 * Configura todos os event listeners do formulário
 */
function setupFormEvents() {
    // Evento de envio do formulário
    const form = document.getElementById('feedback-form');
    form.addEventListener('submit', handleFormSubmit);
    
    // Eventos das estrelas de avaliação
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        // Evento de clique na estrela
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStarDisplay();
            clearError('rating-error');
        });
        
        // Evento de hover na estrela
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    // Evento quando o mouse sai da área das estrelas
    const starRating = document.getElementById('star-rating');
    starRating.addEventListener('mouseleave', () => {
        updateStarDisplay();
    });
    
    // Validação em tempo real dos campos
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', () => {
        validateName();
    });
    
    const commentInput = document.getElementById('comment');
    commentInput.addEventListener('input', () => {
        validateComment();
    });
}

/**
 * Configura eventos dos filtros e controles de ordenação
 */
function setupFilterEvents() {
    // Botões de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
            button.classList.add('active');
            
            // Remove active de outros botões
            filterButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('active');
                }
            });
            
            updateFeedbackList();
        });
    });
    
    // Botão limpar filtros
    const clearFiltersBtn = document.getElementById('clear-filters');
    clearFiltersBtn.addEventListener('click', () => {
        setFilter('all');
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        filterButtons.forEach(btn => {
            if (btn.dataset.filter !== 'all') {
                btn.classList.remove('active');
            }
        });
        updateFeedbackList();
    });
    
    // Seletor de ordenação
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateFeedbackList();
    });
    
    // Botão carregar mais
    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.addEventListener('click', () => {
        displayCount += 8;
        updateFeedbackList();
    });
}

/**
 * Configura eventos dos controles do gráfico
 */
function setupChartEvents() {
    // Botão gráfico de barras
    const barChartBtn = document.getElementById('bar-chart-btn');
    barChartBtn.addEventListener('click', () => {
        setChartType('bar');
        barChartBtn.classList.add('active');
        document.getElementById('pie-chart-btn').classList.remove('active');
    });
    
    // Botão gráfico de pizza
    const pieChartBtn = document.getElementById('pie-chart-btn');
    pieChartBtn.addEventListener('click', () => {
        setChartType('pie');
        pieChartBtn.classList.add('active');
        document.getElementById('bar-chart-btn').classList.remove('active');
    });
}

// ========================================
// FUNÇÕES DO FORMULÁRIO
// ========================================

/**
 * Manipula o envio do formulário de feedback
 * @param {Event} event - Evento de envio do formulário
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    console.log('📝 Enviando formulário...');
    
    // Validar todos os campos
    if (!validateForm()) {
        console.log('❌ Formulário contém erros');
        return;
    }
    
    // Coletar dados do formulário
    const formData = collectFormData();
    
    // Criar objeto feedback
    const feedback = createFeedbackObject(formData);
    
    // Adicionar feedback à lista
    addFeedback(feedback);
    
    // Limpar formulário
    resetForm();
    
    // Mostrar mensagem de sucesso
    showSuccessMessage();
    
    // Atualizar interface
    updateInterface();
    
    console.log('✅ Feedback enviado com sucesso!', feedback);
}

/**
 * Valida todo o formulário
 * @returns {boolean} - True se válido, false se inválido
 */
function validateForm() {
    let isValid = true;
    
    // Validar nome
    if (!validateName()) {
        isValid = false;
    }
    
    // Validar avaliação
    if (!validateRating()) {
        isValid = false;
    }
    
    // Validar comentário (opcional, mas se preenchido deve estar correto)
    if (!validateComment()) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Valida o campo nome
 * @returns {boolean} - True se válido
 */
function validateName() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
        showError('name-error', 'Nome deve ter pelo menos 2 caracteres');
        return false;
    }
    
    clearError('name-error');
    return true;
}

/**
 * Valida a avaliação selecionada
 * @returns {boolean} - True se válido
 */
function validateRating() {
    if (currentRating === 0) {
        showError('rating-error', 'Por favor, selecione uma avaliação');
        return false;
    }
    
    clearError('rating-error');
    return true;
}

/**
 * Valida o campo comentário
 * @returns {boolean} - True se válido
 */
function validateComment() {
    const commentInput = document.getElementById('comment');
    const comment = commentInput.value.trim();
    
    if (comment.length > 500) {
        showError('comment-error', 'Comentário deve ter no máximo 500 caracteres');
        return false;
    }
    
    return true;
}

/**
 * Mostra mensagem de erro
 * @param {string} errorId - ID do elemento de erro
 * @param {string} message - Mensagem de erro
 */
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

/**
 * Limpa mensagem de erro
 * @param {string} errorId - ID do elemento de erro
 */
function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/**
 * Coleta os dados do formulário
 * @returns {Object} - Dados do formulário
 */
function collectFormData() {
    const name = document.getElementById('name').value.trim();
    const comment = document.getElementById('comment').value.trim();
    
    return {
        name: name,
        rating: currentRating,
        comment: comment
    };
}

/**
 * Cria objeto feedback com dados únicos
 * @param {Object} formData - Dados do formulário
 * @returns {Object} - Objeto feedback completo
 */
function createFeedbackObject(formData) {
    return {
        id: generateUniqueId(),
        name: formData.name,
        rating: formData.rating,
        comment: formData.comment,
        timestamp: new Date().toISOString()
    };
}

/**
 * Gera um ID único para o feedback
 * @returns {string} - ID único
 */
function generateUniqueId() {
    return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Limpa todos os campos do formulário
 */
function resetForm() {
    document.getElementById('feedback-form').reset();
    currentRating = 0;
    updateStarDisplay();
    
    // Limpar erros
    clearError('name-error');
    clearError('rating-error');
    clearError('comment-error');
}

/**
 * Mostra mensagem de sucesso temporária
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');
    
    // Ocultar após 3 segundos
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

// ========================================
// FUNÇÕES DO SISTEMA DE ESTRELAS
// ========================================

/**
 * Atualiza a exibição das estrelas baseado na avaliação atual
 */
function updateStarDisplay() {
    const stars = document.querySelectorAll('.star');
    const ratingLabel = document.getElementById('rating-label');
    
    // Atualizar cada estrela
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Atualizar texto da avaliação
    if (currentRating > 0) {
        ratingLabel.textContent = ratingLabels[currentRating];
    } else {
        ratingLabel.textContent = 'Selecione uma avaliação';
    }
}

/**
 * Destaca estrelas até o índice especificado (para efeito hover)
 * @param {number} rating - Número de estrelas a destacar
 */
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Atualizar temporariamente o texto
    const ratingLabel = document.getElementById('rating-label');
    ratingLabel.textContent = ratingLabels[rating];
}

// ========================================
// FUNÇÕES DE GERENCIAMENTO DE FEEDBACKS
// ========================================

/**
 * Adiciona um novo feedback à lista
 * @param {Object} feedback - Objeto feedback
 */
function addFeedback(feedback) {
    feedbacks.unshift(feedback); // Adiciona no início da lista
    saveFeedbacksToStorage();
    console.log('➕ Feedback adicionado:', feedback);
}

/**
 * Carrega feedbacks do localStorage
 */
function loadFeedbacksFromStorage() {
    try {
        const saved = localStorage.getItem('techflow-feedbacks');
        if (saved) {
            feedbacks = JSON.parse(saved);
            console.log(`📁 Carregados ${feedbacks.length} feedbacks do storage`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar feedbacks:', error);
        feedbacks = [];
    }
}

/**
 * Salva feedbacks no localStorage
 */
function saveFeedbacksToStorage() {
    try {
        localStorage.setItem('techflow-feedbacks', JSON.stringify(feedbacks));
        console.log(`💾 ${feedbacks.length} feedbacks salvos no storage`);
    } catch (error) {
        console.error('❌ Erro ao salvar feedbacks:', error);
    }
}

// ========================================
// FUNÇÕES DE FILTROS E ORDENAÇÃO
// ========================================

/**
 * Define o filtro atual
 * @param {string} filter - Tipo de filtro
 */
function setFilter(filter) {
    currentFilter = filter;
    displayCount = 8; // Reset do contador de exibição
    console.log(`🔍 Filtro alterado para: ${filter}`);
}

/**
 * Aplica filtros nos feedbacks
 * @returns {Array} - Feedbacks filtrados
 */
function applyFilters() {
    let filtered = [...feedbacks];
    
    // Aplicar filtro por avaliação
    if (currentFilter === '4-5') {
        filtered = filtered.filter(f => f.rating >= 4);
    } else if (currentFilter !== 'all') {
        const rating = parseInt(currentFilter);
        filtered = filtered.filter(f => f.rating === rating);
    }
    
    console.log(`🔍 Filtro '${currentFilter}' aplicado: ${filtered.length} feedbacks`);
    return filtered;
}

/**
 * Aplica ordenação nos feedbacks
 * @param {Array} feedbacks - Feedbacks para ordenar
 * @returns {Array} - Feedbacks ordenados
 */
function applySorting(feedbacks) {
    const sorted = [...feedbacks];
    
    sorted.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            case 'oldest':
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });
    
    console.log(`📊 Ordenação '${currentSort}' aplicada`);
    return sorted;
}

// ========================================
// FUNÇÕES DE CÁLCULOS E ESTATÍSTICAS
// ========================================

/**
 * Calcula estatísticas dos feedbacks
 * @returns {Object} - Objeto com estatísticas
 */
function calculateStats() {
    const total = feedbacks.length;
    
    if (total === 0) {
        return {
            total: 0,
            average: 0,
            satisfied: 0,
            neutral: 0,
            unsatisfied: 0
        };
    }
    
    // Calcular média
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const average = (sum / total).toFixed(1);
    
    // Contar por categoria
    const satisfied = feedbacks.filter(f => f.rating >= 4).length;
    const neutral = feedbacks.filter(f => f.rating === 3).length;
    const unsatisfied = feedbacks.filter(f => f.rating <= 2).length;
    
    return {
        total,
        average: parseFloat(average),
        satisfied,
        neutral,
        unsatisfied
    };
}

/**
 * Calcula dados para o gráfico de distribuição
 * @returns {Object} - Dados do gráfico
 */
function calculateChartData() {
    const data = [1, 2, 3, 4, 5].map(rating => 
        feedbacks.filter(feedback => feedback.rating === rating).length
    );
    
    return {
        labels: ['1 Estrela', '2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas'],
        data: data
    };
}

// ========================================
// FUNÇÕES DE ATUALIZAÇÃO DA INTERFACE
// ========================================

/**
 * Atualiza toda a interface da aplicação
 */
function updateInterface() {
    updateStatsDisplay();
    updateFeedbackList();
    updateChart();
    console.log('🔄 Interface atualizada');
}

/**
 * Atualiza a exibição das estatísticas
 */
function updateStatsDisplay() {
    const stats = calculateStats();
    
    // Atualizar contador no cabeçalho
    document.getElementById('total-feedbacks').textContent = `${stats.total} Feedbacks`;
    
    // Atualizar cards de estatísticas
    document.getElementById('average-rating').textContent = stats.average.toFixed(1);
    document.getElementById('satisfied-count').textContent = stats.satisfied;
    document.getElementById('neutral-count').textContent = stats.neutral;
    document.getElementById('unsatisfied-count').textContent = stats.unsatisfied;
    
    console.log('📊 Estatísticas atualizadas:', stats);
}

/**
 * Atualiza a lista de feedbacks exibida
 */
function updateFeedbackList() {
    // Aplicar filtros e ordenação
    let filtered = applyFilters();
    let sorted = applySorting(filtered);
    
    // Limitar quantidade exibida
    const displayed = sorted.slice(0, displayCount);
    
    // Atualizar contador
    const countText = `Mostrando ${displayed.length} de ${sorted.length} feedbacks`;
    document.getElementById('feedback-count').textContent = countText;
    
    // Renderizar lista
    renderFeedbackList(displayed);
    
    // Mostrar/ocultar botão "carregar mais"
    const loadMoreBtn = document.getElementById('load-more');
    if (sorted.length > displayCount) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }
    
    console.log(`📋 Lista atualizada: ${displayed.length} de ${sorted.length} feedbacks`);
}

/**
 * Renderiza a lista de feedbacks no DOM
 * @param {Array} feedbacks - Feedbacks para renderizar
 */
function renderFeedbackList(feedbacks) {
    const listContainer = document.getElementById('feedback-list');
    
    // Limpar lista atual
    listContainer.innerHTML = '';
    
    // Se não há feedbacks, mostrar estado vazio
    if (feedbacks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>Nenhum feedback encontrado para os filtros selecionados.</p>';
        listContainer.appendChild(emptyState);
        return;
    }
    
    // Renderizar cada feedback
    feedbacks.forEach(feedback => {
        const feedbackElement = createFeedbackElement(feedback);
        listContainer.appendChild(feedbackElement);
    });
}

/**
 * Cria elemento DOM para um feedback
 * @param {Object} feedback - Dados do feedback
 * @returns {HTMLElement} - Elemento DOM do feedback
 */
function createFeedbackElement(feedback) {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    
    // Gerar iniciais do nome
    const initials = feedback.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    
    // Escolher gradiente baseado no nome
    const gradientIndex = feedback.name.length % avatarGradients.length;
    const gradient = avatarGradients[gradientIndex];
    
    // Gerar estrelas
    const stars = generateStarsHTML(feedback.rating);
    
    // Formatar timestamp
    const timeAgo = formatTimeAgo(feedback.timestamp);
    
    item.innerHTML = `
        <div class="feedback-content">
            <div class="user-avatar-feedback" style="background: ${gradient}">
                ${initials}
            </div>
            <div class="feedback-details">
                <div class="feedback-header">
                    <span class="feedback-name">${escapeHTML(feedback.name)}</span>
                    <div class="feedback-meta">
                        <span class="feedback-stars">${stars}</span>
                        <span class="feedback-time">${timeAgo}</span>
                    </div>
                </div>
                ${feedback.comment ? `<p class="feedback-comment">${escapeHTML(feedback.comment)}</p>` : ''}
            </div>
        </div>
    `;
    
    return item;
}

/**
 * Gera HTML das estrelas para uma avaliação
 * @param {number} rating - Avaliação (1-5)
 * @returns {string} - HTML das estrelas
 */
function generateStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '⭐';
        } else {
            starsHTML += '☆';
        }
    }
    return starsHTML;
}

/**
 * Formata timestamp para "há X tempo"
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} - Texto formatado
 */
function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `há ${minutes} minutos`;
    } else if (hours < 24) {
        return `há ${hours} horas`;
    } else {
        return `há ${days} dias`;
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto para escapar
 * @returns {string} - Texto escapado
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// FUNÇÕES DO GRÁFICO (CHART.JS)
// ========================================

/**
 * Inicializa o gráfico Chart.js
 */
function initializeChart() {
    const canvas = document.getElementById('ratings-chart');
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
        type: chartType,
        data: getChartDataConfig(),
        options: getChartOptionsConfig()
    });
    
    console.log('📈 Gráfico inicializado');
}

/**
 * Define o tipo de gráfico e atualiza
 * @param {string} type - Tipo do gráfico ('bar' ou 'pie')
 */
function setChartType(type) {
    chartType = type;
    updateChart();
    console.log(`📊 Tipo de gráfico alterado para: ${type}`);
}

/**
 * Atualiza os dados do gráfico
 */
function updateChart() {
    if (!chart) return;
    
    // Destruir gráfico existente
    chart.destroy();
    
    // Criar novo gráfico
    const canvas = document.getElementById('ratings-chart');
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
        type: chartType,
        data: getChartDataConfig(),
        options: getChartOptionsConfig()
    });
    
    console.log('📈 Gráfico atualizado');
}

/**
 * Configuração dos dados do gráfico
 * @returns {Object} - Configuração de dados
 */
function getChartDataConfig() {
    const chartData = calculateChartData();
    
    return {
        labels: chartData.labels,
        datasets: [{
            label: 'Número de Avaliações',
            data: chartData.data,
            backgroundColor: [
                'hsl(0, 75%, 60%)',     // vermelho para 1 estrela
                'hsl(35, 95%, 55%)',    // laranja para 2 estrelas  
                'hsl(100, 60%, 55%)',   // verde claro para 3 estrelas
                'hsl(140, 70%, 50%)',   // verde médio para 4 estrelas
                'hsl(120, 60%, 45%)'    // verde escuro para 5 estrelas
            ],
            borderColor: [
                'hsl(0, 75%, 50%)',     
                'hsl(35, 95%, 45%)',    
                'hsl(100, 60%, 45%)',   
                'hsl(140, 70%, 40%)',   
                'hsl(120, 60%, 35%)'    
            ],
            borderWidth: chartType === 'bar' ? 2 : 0
        }]
    };
}

/**
 * Configuração das opções do gráfico
 * @returns {Object} - Configuração de opções
 */
function getChartOptionsConfig() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: chartType === 'pie',
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        scales: chartType === 'bar' ? {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                grid: {
                    color: 'hsla(120, 30%, 85%, 0.5)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        } : {}
    };
}

// ========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ========================================

// Aguardar carregamento completo da página
document.addEventListener('DOMContentLoaded', initializeApp);

// Aguardar carregamento das fontes
document.fonts.ready.then(() => {
    console.log('🔤 Fontes carregadas');
});

// Log de inicialização
console.log('📱 TechFlow - Sistema de Feedbacks carregado!');