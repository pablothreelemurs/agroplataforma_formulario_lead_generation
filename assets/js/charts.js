/**
 * Charts Module
 * Configures and renders all Chart.js visualizations with premium dark theme
 */

class ChartsManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#10b981',
            primaryDark: '#059669',
            primaryLight: '#34d399',
            secondary: '#f59e0b',
            secondaryLight: '#fbbf24',
            orange: '#fb923c',
            purple: '#8b5cf6',
            blue: '#3b82f6',
            pink: '#ec4899',
            // Dark theme colors
            gridColor: 'rgba(255, 255, 255, 0.05)',
            textColor: '#ffffff',
            textPrimary: '#ffffff'
        };

        // Set Chart.js defaults for dark theme
        Chart.defaults.color = '#ffffff';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.plugins.legend.labels.color = '#ffffff';
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 14, 39, 0.95)';
        Chart.defaults.plugins.tooltip.borderColor = this.colors.primary;
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.font.family = "'Inter', 'Roboto', sans-serif";
    }

    /**
     * Destroy existing chart if it exists
     */
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    /**
     * Render Score Distribution Chart (Bar Chart)
     */
    renderScoreDistribution(canvasId, distribution) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = Object.keys(distribution);
        const data = Object.values(distribution);
        const backgroundColors = labels.map(score => {
            const s = parseInt(score);
            if (s >= 8) return this.colors.primary;
            if (s >= 6) return this.colors.secondary;
            if (s >= 4) return this.colors.orange;
            return '#ef4444';
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(l => `${l}`),
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    /**
     * Render Temporal Leads Chart
     */
    renderTemporalLeads(canvasId, timeData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = timeData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
        });
        const data = timeData.map(d => d.count);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: data,
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    /**
     * Render Top Cities (Doughnut)
     */
    renderTopCities(canvasId, citiesData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = citiesData.map(d => d.city);
        const data = citiesData.map(d => d.count);
        const colors = [this.colors.primary, this.colors.secondary, this.colors.orange, this.colors.purple, this.colors.blue, this.colors.pink];

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#0a0e27',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'right', labels: { color: '#ffffff' } }
                }
            }
        });
    }

    /**
     * Render Top States (Horizontal Bar)
     */
    renderTopStates(canvasId, statesData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = statesData.map(d => d.state);
        const data = statesData.map(d => d.count);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: this.colors.secondary,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    /**
     * Render Top Titles (Horizontal Bar)
     */
    renderTopTitles(canvasId, titlesData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = titlesData.map(d => d.title);
        const data = titlesData.map(d => d.count);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: this.colors.orange,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

    /**
     * Render Top Companies
     */
    renderTopCompanies(canvasId, companiesData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = companiesData.map(d => d.company);
        const data = companiesData.map(d => d.count);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: this.colors.primary,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        ticks: { maxRotation: 45, minRotation: 45, color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    /**
     * Render Score by Title (Bar)
     */
    renderScoreByTitle(canvasId, data) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = data.map(d => d.title);
        const values = data.map(d => d.averageScore);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score Promedio',
                    data: values,
                    backgroundColor: this.colors.purple,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        min: 0, max: 10,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        ticks: { maxRotation: 45, minRotation: 45, color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    /**
     * Render Conversion Funnel
     */
    renderConversionFunnel(canvasId, funnelData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = funnelData.map(d => d.stage);
        const data = funnelData.map(d => d.count);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: [this.colors.primary, this.colors.primaryLight, this.colors.secondary, this.colors.orange],
                    borderRadius: 10
                }]
            },
            options: {
                indexAxis: 'y', // Keep existing indexAxis
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: { // Keep existing tooltip
                        callbacks: {
                            label: (context) => {
                                const percentage = funnelData[context.dataIndex].percentage;
                                return `${context.parsed.x} leads (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 10 } }
                    }
                }
            }
        });
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.keys(this.charts).forEach(id => this.destroyChart(id));
    }
}

// Export for use in other modules
window.ChartsManager = ChartsManager;
