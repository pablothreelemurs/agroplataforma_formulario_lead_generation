/**
 * Main Dashboard Module
 * Orchestrates all dashboard components and data flow
 */

class Dashboard {
    constructor() {
        this.sheetsClient = null;
        this.dataProcessor = null;
        this.chartsManager = null;
        this.filtersManager = null;
        this.currentPage = 1;
        this.pageSize = 25;
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }

    /**
     * Initialize the dashboard
     */
    async init() {
        console.log('🚀 Initializing AgroBroker Dashboard...');

        // Show loading state
        this.showLoading();

        try {
            // Initialize modules
            this.dataProcessor = new DataProcessor();
            this.chartsManager = new ChartsManager();

            // Initialize Google Sheets client
            this.sheetsClient = new GoogleSheetsClient({
                sheetId: this.getSheetIdFromConfig(),
                refreshInterval: 5 * 60 * 1000, // 5 minutes
                autoRefresh: true
            });

            // Listen for data updates
            this.sheetsClient.addListener((leads) => {
                this.handleDataUpdate(leads);
            });

            // Initialize filters
            this.filtersManager = new FiltersManager(
                this.dataProcessor,
                () => this.handleFilterChange()
            );
            this.filtersManager.init();

            // Initialize UI event listeners
            this.initEventListeners();

            // Fetch initial data
            await this.sheetsClient.init();

            console.log('✅ Dashboard initialized successfully');

        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            this.showError('Error al cargar el dashboard. Por favor, verifica la configuración de Google Sheets.');
        }
    }

    /**
     * Get Sheet ID from configuration
     */
    getSheetIdFromConfig() {
        // Check if there's a config in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const sheetId = urlParams.get('sheetId');

        if (sheetId) {
            return sheetId;
        }

        // Check localStorage
        const savedSheetId = localStorage.getItem('agrobroker_sheet_id');
        if (savedSheetId) {
            return savedSheetId;
        }

        // Default - configured Sheet ID
        return '1EXqV6Z_uIvWUQSh5fC_Ia1XD1cZ2FCqtvb4_e_0ETcM';
    }

    /**
     * Handle data update from Google Sheets
     */
    handleDataUpdate(leads) {
        console.log(`📊 Processing ${leads.length} leads...`);

        // Update data processor
        this.dataProcessor.setLeads(leads);

        // Update all UI components
        this.updateKPIs();
        this.updateCharts();
        this.updateTable();
        this.updateLastRefreshTime();

        // Hide loading state
        this.hideLoading();

        // Repopulate location filters with new data
        if (this.filtersManager) {
            this.filtersManager.populateLocationDropdowns();
        }
    }

    /**
     * Handle filter change
     */
    handleFilterChange() {
        this.currentPage = 1; // Reset to first page
        this.updateKPIs();
        this.updateCharts();
        this.updateTable();
    }

    /**
     * Update KPI cards with count-up animation
     */
    updateKPIs() {
        const kpis = this.dataProcessor.calculateKPIs();

        this.animateKPI('kpi-total-leads', kpis.totalLeads);
        this.animateKPI('kpi-avg-score', kpis.averageScore, 1);
        this.animateKPI('kpi-conversion-rate', kpis.conversionRate, 1, '%');
        this.animateKPI('kpi-leads-today', kpis.leadsToday);
        this.animateKPI('kpi-email-coverage', kpis.emailCoverage, 1, '%');
        this.animateKPI('kpi-phone-coverage', kpis.phoneCoverage, 1, '%');

        // Update additional metrics if elements exist
        this.updateElement('kpi-high-score', kpis.highScoreLeads);
        this.updateElement('kpi-medium-score', kpis.mediumScoreLeads);
        this.updateElement('kpi-low-score', kpis.lowScoreLeads);
        this.updateElement('kpi-clevel', kpis.cLevelContacts);
        this.updateElement('kpi-complete-data', kpis.completeDataLeads);
        this.updateElement('kpi-unique-companies', kpis.uniqueCompanies);
    }

    /**
     * Animate KPI value with count-up effect
     */
    animateKPI(elementId, targetValue, decimals = 0, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;

            element.textContent = currentValue.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Update element text content
     */
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Update all charts
     */
    updateCharts() {
        // Score Distribution
        const scoreDistribution = this.dataProcessor.getScoreDistribution();
        this.chartsManager.renderScoreDistribution('chartScoreDistribution', scoreDistribution);

        // Temporal Leads
        const timeData = this.dataProcessor.getLeadsByDate();
        this.chartsManager.renderTemporalLeads('chartTemporalLeads', timeData);

        // Top Cities
        const cities = this.dataProcessor.getTopCities(10);
        this.chartsManager.renderTopCities('chartTopCities', cities);

        // Top States
        const states = this.dataProcessor.getTopStates(10);
        this.chartsManager.renderTopStates('chartTopStates', states);

        // Top Titles
        const titles = this.dataProcessor.getTopTitles(10);
        this.chartsManager.renderTopTitles('chartTopTitles', titles);

        // Top Companies
        const companies = this.dataProcessor.getTopCompanies(15);
        this.chartsManager.renderTopCompanies('chartTopCompanies', companies);

        // Score By Title
        const scoreByTitle = this.dataProcessor.getScoreByTitle(10);
        this.chartsManager.renderScoreByTitle('chartScoreByTitle', scoreByTitle);

        // Conversion Funnel
        const funnel = this.dataProcessor.getConversionFunnel();
        this.chartsManager.renderConversionFunnel('chartConversionFunnel', funnel);
    }

    /**
     * Update leads table
     */
    updateTable() {
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;

        const leads = this.getSortedLeads();
        const paginatedLeads = this.getPaginatedLeads(leads);

        // Clear existing rows
        tbody.innerHTML = '';

        // Add rows
        paginatedLeads.forEach(lead => {
            const row = this.createTableRow(lead);
            tbody.appendChild(row);
        });

        // Update pagination
        this.updatePagination(leads.length);
    }

    /**
     * Get sorted leads
     */
    getSortedLeads() {
        const leads = [...this.dataProcessor.filteredLeads];

        if (!this.sortColumn) {
            return leads;
        }

        return leads.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    /**
     * Get paginated leads
     */
    getPaginatedLeads(leads) {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return leads.slice(start, end);
    }

    /**
     * Create table row for a lead
     */
    createTableRow(lead) {
        const row = document.createElement('tr');

        row.innerHTML = `
      <td>${this.escapeHtml(lead.fullName)}</td>
      <td>${this.escapeHtml(lead.company)}</td>
      <td>${this.escapeHtml(lead.title)}</td>
      <td>${this.escapeHtml(lead.city)}, ${this.escapeHtml(lead.state)}</td>
      <td>${this.getScoreBadge(lead.preScore)}</td>
      <td>${this.getEmailDisplay(lead.email, lead.hasEmail)}</td>
      <td>${this.getPhoneDisplay(lead.phone, lead.hasPhone)}</td>
      <td>${this.formatDate(lead.createdAt)}</td>
      <td>${this.getActionButtons(lead)}</td>
    `;

        return row;
    }

    /**
     * Get score badge HTML
     */
    getScoreBadge(score) {
        let badgeClass = 'very-low';
        if (score >= 8) badgeClass = 'high';
        else if (score >= 6) badgeClass = 'medium';
        else if (score >= 4) badgeClass = 'low';

        return `<span class="score-badge ${badgeClass}">${score}</span>`;
    }

    /**
     * Get email display with verification icon
     */
    getEmailDisplay(email, hasEmail) {
        if (!hasEmail || !email) {
            return '<span style="color: #999;">—</span>';
        }
        return `${this.escapeHtml(email)} <span style="color: #10b981;">✓</span>`;
    }

    /**
     * Get phone display with icon
     */
    getPhoneDisplay(phone, hasPhone) {
        if (!hasPhone || !phone) {
            return '<span style="color: #999;">—</span>';
        }
        return `${this.escapeHtml(phone)} <span style="color: #10b981;">📞</span>`;
    }

    /**
     * Get action buttons HTML
     */
    getActionButtons(lead) {
        let buttons = '';

        if (lead.linkedinUrl) {
            buttons += `<a href="${this.escapeHtml(lead.linkedinUrl)}" target="_blank" class="action-btn" title="Ver LinkedIn">🔗</a>`;
        }

        if (lead.email) {
            buttons += `<a href="mailto:${this.escapeHtml(lead.email)}" class="action-btn" title="Enviar Email">✉️</a>`;
        }

        return buttons || '<span style="color: #999;">—</span>';
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        if (!date || !(date instanceof Date)) {
            // If it's a string, try to parse it
            const d = new Date(date);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
            return '—';
        }

        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    /**
     * Update pagination controls
     */
    updatePagination(totalLeads) {
        const totalPages = Math.ceil(totalLeads / this.pageSize);

        // Update info text
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, totalLeads);

        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${start}-${end} de ${totalLeads} leads`;
        }

        // Update buttons
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }

        // Update page number display
        const pageNumber = document.getElementById('currentPageNumber');
        if (pageNumber) {
            pageNumber.textContent = `Página ${this.currentPage} de ${totalPages}`;
        }
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.handleManualRefresh();
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                mainContent.classList.toggle('with-filters');
            });
        }

        if (closeSidebar && sidebar && mainContent) {
            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('open');
                mainContent.classList.remove('with-filters');
            });
        }

        // Table sorting
        document.querySelectorAll('.leads-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                this.handleSort(th.dataset.column);
            });
        });

        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.updateTable();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.dataProcessor.filteredLeads.length / this.pageSize);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.updateTable();
                }
            });
        }

        // Page size selector
        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', () => {
                this.pageSize = parseInt(pageSizeSelect.value);
                this.currentPage = 1;
                this.updateTable();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportCSV');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.dataProcessor.downloadCSV();
                this.filtersManager.showToast('Datos exportados a CSV', 'success');
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.handleManualRefresh();
            }
            if (e.key === 'Escape' && sidebar) {
                sidebar.classList.remove('open');
                if (mainContent) {
                    mainContent.classList.remove('with-filters');
                }
            }
        });
    }

    /**
     * Handle table column sorting
     */
    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update UI
        document.querySelectorAll('.leads-table th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });

        const th = document.querySelector(`th[data-column="${column}"]`);
        if (th) {
            th.classList.add(`sorted-${this.sortDirection}`);
        }

        this.updateTable();
    }

    /**
     * Handle manual refresh
     */
    async handleManualRefresh() {
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.classList.add('pulse');
            refreshBtn.disabled = true;
        }

        try {
            await this.sheetsClient.fetchData();
            this.filtersManager.showToast('Datos actualizados', 'success');
        } catch (error) {
            this.filtersManager.showToast('Error al actualizar datos', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('pulse');
                refreshBtn.disabled = false;
            }
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('agrobroker_theme', newTheme);

        // Update charts with new theme
        setTimeout(() => {
            this.updateCharts();
        }, 100);
    }

    /**
     * Update last refresh time display
     */
    updateLastRefreshTime() {
        const element = document.getElementById('lastUpdate');
        if (!element) return;

        const updateTime = () => {
            const timeString = this.sheetsClient.getTimeSinceLastFetch();
            if (timeString) {
                element.textContent = `Actualizado: ${timeString}`;
            }
        };

        updateTime();

        // Update every 10 seconds
        setInterval(updateTime, 10000);
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingEl = document.getElementById('loadingState');
        const contentEl = document.getElementById('dashboardContent');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (contentEl) contentEl.classList.add('hidden');
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.getElementById('loadingState');
        const contentEl = document.getElementById('dashboardContent');

        if (loadingEl) loadingEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorEl = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');

        if (errorMessage) errorMessage.textContent = message;
        if (errorEl) errorEl.classList.remove('hidden');

        this.hideLoading();
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('agrobroker_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Initialize dashboard
    const dashboard = new Dashboard();
    dashboard.init();

    // Make dashboard globally accessible for debugging
    window.dashboard = dashboard;
});
