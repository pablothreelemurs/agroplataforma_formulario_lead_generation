/**
 * Filters Module
 * Manages filter UI and state
 */

class FiltersManager {
    constructor(dataProcessor, onFilterChange) {
        this.dataProcessor = dataProcessor;
        this.onFilterChange = onFilterChange;
        this.searchDebounceTimer = null;
        this.savedFilters = this.loadSavedFilters();
    }

    /**
     * Initialize all filter event listeners
     */
    init() {
        this.initDateFilters();
        this.initScoreFilters();
        this.initLocationFilters();
        this.initSeniorityFilters();
        this.initDataFilters();
        this.initSearchFilter();
        this.initFilterActions();
        this.populateLocationDropdowns();
    }

    /**
     * Initialize date range filters
     */
    initDateFilters() {
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');

        if (dateFrom) {
            dateFrom.addEventListener('change', () => {
                this.dataProcessor.updateFilters({ dateFrom: dateFrom.value || null });
                this.onFilterChange();
            });
        }

        if (dateTo) {
            dateTo.addEventListener('change', () => {
                this.dataProcessor.updateFilters({ dateTo: dateTo.value || null });
                this.onFilterChange();
            });
        }

        // Date presets
        const presets = {
            'preset-today': 'today',
            'preset-7days': 'last7days',
            'preset-30days': 'last30days',
            'preset-month': 'thisMonth',
            'preset-lastmonth': 'lastMonth',
            'preset-year': 'thisYear',
            'preset-all': 'all'
        };

        Object.entries(presets).forEach(([id, preset]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.dataProcessor.applyDatePreset(preset);
                    this.updateDateInputs();
                    this.highlightActivePreset(id);
                    this.onFilterChange();
                });
            }
        });
    }

    /**
     * Update date inputs to reflect current filter
     */
    updateDateInputs() {
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const filters = this.dataProcessor.filters;

        if (dateFrom) {
            dateFrom.value = filters.dateFrom ? this.formatDateForInput(filters.dateFrom) : '';
        }

        if (dateTo) {
            dateTo.value = filters.dateTo ? this.formatDateForInput(filters.dateTo) : '';
        }
    }

    /**
     * Format date for input field
     */
    formatDateForInput(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    /**
     * Highlight active preset button
     */
    highlightActivePreset(activeId) {
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => btn.classList.remove('active'));

        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * Initialize score range filters
     */
    initScoreFilters() {
        const scoreMin = document.getElementById('scoreMin');
        const scoreMax = document.getElementById('scoreMax');
        const scoreMinValue = document.getElementById('scoreMinValue');
        const scoreMaxValue = document.getElementById('scoreMaxValue');

        if (scoreMin) {
            scoreMin.addEventListener('input', () => {
                const min = parseInt(scoreMin.value);
                const max = parseInt(scoreMax.value);

                // Ensure min doesn't exceed max
                if (min > max) {
                    scoreMin.value = max;
                }

                if (scoreMinValue) {
                    scoreMinValue.textContent = scoreMin.value;
                }

                this.dataProcessor.updateFilters({ scoreMin: parseInt(scoreMin.value) });
                this.onFilterChange();
            });
        }

        if (scoreMax) {
            scoreMax.addEventListener('input', () => {
                const min = parseInt(scoreMin.value);
                const max = parseInt(scoreMax.value);

                // Ensure max doesn't go below min
                if (max < min) {
                    scoreMax.value = min;
                }

                if (scoreMaxValue) {
                    scoreMaxValue.textContent = scoreMax.value;
                }

                this.dataProcessor.updateFilters({ scoreMax: parseInt(scoreMax.value) });
                this.onFilterChange();
            });
        }

        // Score category quick filters
        const priorityBtn = document.getElementById('filter-priority');
        const viableBtn = document.getElementById('filter-viable');
        const allScoresBtn = document.getElementById('filter-all-scores');

        if (priorityBtn) {
            priorityBtn.addEventListener('click', () => {
                scoreMin.value = 8;
                scoreMax.value = 10;
                if (scoreMinValue) scoreMinValue.textContent = '8';
                if (scoreMaxValue) scoreMaxValue.textContent = '10';
                this.dataProcessor.updateFilters({ scoreMin: 8, scoreMax: 10 });
                this.onFilterChange();
            });
        }

        if (viableBtn) {
            viableBtn.addEventListener('click', () => {
                scoreMin.value = 6;
                scoreMax.value = 7;
                if (scoreMinValue) scoreMinValue.textContent = '6';
                if (scoreMaxValue) scoreMaxValue.textContent = '7';
                this.dataProcessor.updateFilters({ scoreMin: 6, scoreMax: 7 });
                this.onFilterChange();
            });
        }

        if (allScoresBtn) {
            allScoresBtn.addEventListener('click', () => {
                scoreMin.value = 1;
                scoreMax.value = 10;
                if (scoreMinValue) scoreMinValue.textContent = '1';
                if (scoreMaxValue) scoreMaxValue.textContent = '10';
                this.dataProcessor.updateFilters({ scoreMin: 1, scoreMax: 10 });
                this.onFilterChange();
            });
        }
    }

    /**
     * Populate location dropdowns with unique values
     */
    populateLocationDropdowns() {
        const citySelect = document.getElementById('filterCity');

        if (citySelect) {
            const cities = this.dataProcessor.getAllCities();
            this.populateMultiSelect(citySelect, cities);
        }
    }

    /**
     * Populate a multi-select dropdown
     */
    populateMultiSelect(selectElement, options) {
        if (!selectElement) return;

        // Save current selection
        const selectedValues = Array.from(selectElement.selectedOptions).map(opt => opt.value);

        selectElement.innerHTML = '';

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            if (selectedValues.includes(option)) {
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        });

        if (options.length === 0) {
            selectElement.innerHTML = '<option value="">No hay datos disponibles</option>';
        }
    }

    /**
     * Initialize location filters
     */
    initLocationFilters() {
        const citySelect = document.getElementById('filterCity');

        if (citySelect) {
            citySelect.addEventListener('change', () => {
                const selected = Array.from(citySelect.selectedOptions).map(opt => opt.value).filter(val => val !== "");
                this.dataProcessor.updateFilters({ cities: selected });
                this.onFilterChange();
            });
        }
    }

    /**
     * Initialize seniority filters
     */
    initSeniorityFilters() {
        const checkboxes = {
            'filter-clevel': 'cLevel',
            'filter-director': 'director',
            'filter-manager': 'manager',
            'filter-coordinator': 'coordinator',
            'filter-other': 'other'
        };

        Object.entries(checkboxes).forEach(([id, key]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const seniority = { ...this.dataProcessor.filters.seniority };
                    seniority[key] = checkbox.checked;
                    this.dataProcessor.updateFilters({ seniority });
                    this.onFilterChange();
                });
            }
        });
    }

    /**
     * Initialize data completeness filters
     */
    initDataFilters() {
        const toggles = {
            'filter-email': 'hasEmail',
            'filter-phone': 'hasPhone',
            'filter-linkedin': 'hasLinkedIn',
            'filter-complete': 'isComplete'
        };

        Object.entries(toggles).forEach(([id, key]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    const dataFilters = { ...this.dataProcessor.filters.dataFilters };
                    dataFilters[key] = toggle.checked;
                    this.dataProcessor.updateFilters({ dataFilters });
                    this.onFilterChange();
                });
            }
        });
    }

    /**
     * Initialize search filter with debounce
     */
    initSearchFilter() {
        const searchInput = document.getElementById('searchLeads');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                // Clear existing timer
                if (this.searchDebounceTimer) {
                    clearTimeout(this.searchDebounceTimer);
                }

                // Set new timer for 300ms debounce
                this.searchDebounceTimer = setTimeout(() => {
                    this.dataProcessor.updateFilters({ searchQuery: searchInput.value });
                    this.onFilterChange();
                }, 300);
            });
        }
    }

    /**
     * Initialize filter action buttons
     */
    initFilterActions() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        const saveBtn = document.getElementById('saveFilters');
        const loadSelect = document.getElementById('loadFilters');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.onFilterChange();
                this.showToast('Filtros aplicados', 'success');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAllFilters();
                this.onFilterChange();
                this.showToast('Filtros restablecidos', 'info');
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCurrentFilters();
            });
        }

        if (loadSelect) {
            this.populateSavedFilters(loadSelect);
            loadSelect.addEventListener('change', () => {
                if (loadSelect.value) {
                    this.loadFilterPreset(loadSelect.value);
                }
            });
        }
    }

    /**
     * Reset all filters to default
     */
    resetAllFilters() {
        this.dataProcessor.resetFilters();

        // Reset UI elements
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const scoreMin = document.getElementById('scoreMin');
        const scoreMax = document.getElementById('scoreMax');
        const searchInput = document.getElementById('searchLeads');

        if (dateFrom) dateFrom.value = '';
        if (dateTo) dateTo.value = '';
        if (scoreMin) {
            scoreMin.value = 1;
            const scoreMinValue = document.getElementById('scoreMinValue');
            if (scoreMinValue) scoreMinValue.textContent = '1';
        }
        if (scoreMax) {
            scoreMax.value = 10;
            const scoreMaxValue = document.getElementById('scoreMaxValue');
            if (scoreMaxValue) scoreMaxValue.textContent = '10';
        }
        if (searchInput) searchInput.value = '';

        // Reset checkboxes and toggles
        document.querySelectorAll('.filter-checkboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });

        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.checked = false;
        });

        // Reset multi-selects
        document.querySelectorAll('select[multiple]').forEach(select => {
            Array.from(select.options).forEach(opt => opt.selected = false);
        });

        // Clear active preset
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    }

    /**
     * Save current filters
     */
    saveCurrentFilters() {
        const name = prompt('Nombre para este filtro:');
        if (!name) return;

        const filters = { ...this.dataProcessor.filters };
        this.savedFilters[name] = filters;

        localStorage.setItem('agrobroker_saved_filters', JSON.stringify(this.savedFilters));

        const loadSelect = document.getElementById('loadFilters');
        if (loadSelect) {
            this.populateSavedFilters(loadSelect);
        }

        this.showToast(`Filtro "${name}" guardado`, 'success');
    }

    /**
     * Load saved filters from localStorage
     */
    loadSavedFilters() {
        try {
            const saved = localStorage.getItem('agrobroker_saved_filters');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load saved filters:', error);
            return {};
        }
    }

    /**
     * Populate saved filters dropdown
     */
    populateSavedFilters(selectElement) {
        selectElement.innerHTML = '<option value="">Cargar filtro guardado...</option>';

        Object.keys(this.savedFilters).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectElement.appendChild(option);
        });
    }

    /**
     * Load a saved filter preset
     */
    loadFilterPreset(name) {
        const filters = this.savedFilters[name];
        if (!filters) return;

        this.dataProcessor.updateFilters(filters);
        this.updateUIFromFilters(filters);
        this.onFilterChange();
        this.showToast(`Filtro "${name}" cargado`, 'success');
    }

    /**
     * Update UI elements from filter object
     */
    updateUIFromFilters(filters) {
        // Update date inputs
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        if (dateFrom) dateFrom.value = filters.dateFrom ? this.formatDateForInput(filters.dateFrom) : '';
        if (dateTo) dateTo.value = filters.dateTo ? this.formatDateForInput(filters.dateTo) : '';

        // Update score sliders
        const scoreMin = document.getElementById('scoreMin');
        const scoreMax = document.getElementById('scoreMax');
        if (scoreMin) {
            scoreMin.value = filters.scoreMin;
            const scoreMinValue = document.getElementById('scoreMinValue');
            if (scoreMinValue) scoreMinValue.textContent = filters.scoreMin;
        }
        if (scoreMax) {
            scoreMax.value = filters.scoreMax;
            const scoreMaxValue = document.getElementById('scoreMaxValue');
            if (scoreMaxValue) scoreMaxValue.textContent = filters.scoreMax;
        }

        // Update search
        const searchInput = document.getElementById('searchLeads');
        if (searchInput) searchInput.value = filters.searchQuery || '';
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
      <span>${this.getToastIcon(type)}</span>
      <span>${message}</span>
    `;

        container.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Get icon for toast type
     */
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Export for use in other modules
window.FiltersManager = FiltersManager;
