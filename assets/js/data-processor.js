/**
 * Data Processor Module
 * Handles filtering, aggregation, and KPI calculations for lead data
 */

class DataProcessor {
    constructor() {
        this.allLeads = [];
        this.filteredLeads = [];
        this.filters = this.getDefaultFilters();
    }

    /**
     * Get default filter values
     */
    getDefaultFilters() {
        return {
            dateFrom: null,
            dateTo: null,
            scoreMin: 1,
            scoreMax: 10,
            cities: [],
            states: [],
            countries: [],
            seniority: {
                cLevel: true,
                director: true,
                manager: true,
                coordinator: true,
                other: true
            },
            dataFilters: {
                hasEmail: false,
                hasPhone: false,
                hasLinkedIn: false,
                isComplete: false
            },
            searchQuery: ''
        };
    }

    /**
     * Set all leads data
     */
    setLeads(leads) {
        this.allLeads = leads;
        this.applyFilters();
    }

    /**
     * Update filters
     */
    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.applyFilters();
    }

    /**
     * Reset filters to default
     */
    resetFilters() {
        this.filters = this.getDefaultFilters();
        this.applyFilters();
    }

    /**
     * Apply all filters to leads
     */
    applyFilters() {
        let filtered = [...this.allLeads];

        // Date range filter
        if (this.filters.dateFrom) {
            const fromDate = new Date(this.filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(lead => lead.createdAt >= fromDate);
        }

        if (this.filters.dateTo) {
            const toDate = new Date(this.filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(lead => lead.createdAt <= toDate);
        }

        // Score range filter
        filtered = filtered.filter(lead =>
            lead.preScore >= this.filters.scoreMin &&
            lead.preScore <= this.filters.scoreMax
        );

        // Location filters
        if (this.filters.cities.length > 0) {
            filtered = filtered.filter(lead =>
                this.filters.cities.includes(lead.city)
            );
        }

        if (this.filters.states.length > 0) {
            filtered = filtered.filter(lead =>
                this.filters.states.includes(lead.state)
            );
        }

        if (this.filters.countries.length > 0) {
            filtered = filtered.filter(lead =>
                this.filters.countries.includes(lead.country)
            );
        }

        // Seniority filter
        filtered = filtered.filter(lead => {
            const seniority = this.getSeniority(lead.title);
            return this.filters.seniority[seniority];
        });

        // Data completeness filters
        if (this.filters.dataFilters.hasEmail) {
            filtered = filtered.filter(lead => lead.hasEmail);
        }

        if (this.filters.dataFilters.hasPhone) {
            filtered = filtered.filter(lead => lead.hasPhone);
        }

        if (this.filters.dataFilters.hasLinkedIn) {
            filtered = filtered.filter(lead => lead.hasLinkedIn);
        }

        if (this.filters.dataFilters.isComplete) {
            filtered = filtered.filter(lead => lead.isComplete);
        }

        // Search query filter
        if (this.filters.searchQuery) {
            const query = this.filters.searchQuery.toLowerCase();
            filtered = filtered.filter(lead =>
                lead.fullName.toLowerCase().includes(query) ||
                lead.company.toLowerCase().includes(query) ||
                lead.title.toLowerCase().includes(query) ||
                lead.email.toLowerCase().includes(query) ||
                lead.city.toLowerCase().includes(query)
            );
        }

        this.filteredLeads = filtered;
        return filtered;
    }

    /**
     * Determine seniority level from job title
     */
    getSeniority(title) {
        const titleLower = title.toLowerCase();

        if (titleLower.match(/\b(ceo|cfo|coo|cto|cmo|founder|co-founder|president|owner)\b/)) {
            return 'cLevel';
        }

        if (titleLower.match(/\b(director|vp|vice president|head of)\b/)) {
            return 'director';
        }

        if (titleLower.match(/\b(manager|gerente|jefe)\b/)) {
            return 'manager';
        }

        if (titleLower.match(/\b(coordinator|coordinador|specialist|especialista)\b/)) {
            return 'coordinator';
        }

        return 'other';
    }

    /**
     * Calculate all KPIs
     */
    calculateKPIs() {
        const leads = this.filteredLeads;
        const total = leads.length;

        if (total === 0) {
            return {
                totalLeads: 0,
                averageScore: 0,
                conversionRate: 0,
                leadsToday: 0,
                emailCoverage: 0,
                phoneCoverage: 0,
                highScoreLeads: 0,
                mediumScoreLeads: 0,
                lowScoreLeads: 0,
                cLevelContacts: 0,
                completeDataLeads: 0,
                uniqueCompanies: 0,
                enrichmentRate: 0
            };
        }

        // Calculate average score
        const totalScore = leads.reduce((sum, lead) => sum + lead.preScore, 0);
        const averageScore = (totalScore / total).toFixed(1);

        // Calculate conversion rate (score >= 8)
        const highScoreCount = leads.filter(l => l.preScore >= 8).length;
        const conversionRate = ((highScoreCount / total) * 100).toFixed(1);

        // Leads today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const leadsToday = leads.filter(l => l.createdAt >= today).length;

        // Coverage metrics
        const emailCoverage = ((leads.filter(l => l.hasEmail).length / total) * 100).toFixed(1);
        const phoneCoverage = ((leads.filter(l => l.hasPhone).length / total) * 100).toFixed(1);

        // Score distribution
        const mediumScoreLeads = leads.filter(l => l.preScore >= 6 && l.preScore < 8).length;
        const lowScoreLeads = leads.filter(l => l.preScore < 6).length;

        // C-Level contacts
        const cLevelContacts = leads.filter(l => this.getSeniority(l.title) === 'cLevel').length;

        // Complete data
        const completeDataLeads = leads.filter(l => l.isComplete).length;

        // Unique companies
        const uniqueCompanies = new Set(leads.map(l => l.company).filter(c => c)).size;

        // Enrichment rate (has LinkedIn)
        const enrichmentRate = ((leads.filter(l => l.hasLinkedIn).length / total) * 100).toFixed(1);

        return {
            totalLeads: total,
            averageScore: parseFloat(averageScore),
            conversionRate: parseFloat(conversionRate),
            leadsToday,
            emailCoverage: parseFloat(emailCoverage),
            phoneCoverage: parseFloat(phoneCoverage),
            highScoreLeads: highScoreCount,
            mediumScoreLeads,
            lowScoreLeads,
            cLevelContacts,
            completeDataLeads,
            uniqueCompanies,
            enrichmentRate: parseFloat(enrichmentRate)
        };
    }

    /**
     * Get score distribution for chart
     */
    getScoreDistribution() {
        const distribution = {};

        for (let i = 1; i <= 10; i++) {
            distribution[i] = 0;
        }

        this.filteredLeads.forEach(lead => {
            const score = Math.max(1, Math.min(10, lead.preScore));
            distribution[score]++;
        });

        return distribution;
    }

    /**
     * Get leads by date for temporal chart
     */
    getLeadsByDate() {
        const dateMap = {};

        this.filteredLeads.forEach(lead => {
            if (lead.createdAt && typeof lead.createdAt.toISOString === 'function') {
                const dateKey = lead.createdAt.toISOString().split('T')[0];
                dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
            }
        });

        // Sort by date
        const sorted = Object.entries(dateMap).sort((a, b) =>
            new Date(a[0]) - new Date(b[0])
        );

        return sorted.map(([date, count]) => ({ date, count }));
    }

    /**
     * Get top N cities
     */
    getTopCities(limit = 10) {
        const cityMap = {};

        this.filteredLeads.forEach(lead => {
            if (lead.city) {
                const city = lead.city.trim();
                cityMap[city] = (cityMap[city] || 0) + 1;
            }
        });

        return Object.entries(cityMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([city, count]) => ({ city, count }));
    }

    /**
     * Get top N states
     */
    getTopStates(limit = 10) {
        const stateMap = {};

        this.filteredLeads.forEach(lead => {
            if (lead.state) {
                const state = lead.state.trim();
                stateMap[state] = (stateMap[state] || 0) + 1;
            }
        });

        return Object.entries(stateMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([state, count]) => ({ state, count }));
    }

    /**
     * Get average score by job title
     */
    getScoreByTitle(limit = 10) {
        const titleData = {};

        this.filteredLeads.forEach(lead => {
            if (lead.title) {
                if (!titleData[lead.title]) {
                    titleData[lead.title] = { totalScore: 0, count: 0 };
                }
                titleData[lead.title].totalScore += lead.preScore;
                titleData[lead.title].count += 1;
            }
        });

        return Object.entries(titleData)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([title, data]) => ({
                title,
                averageScore: (data.totalScore / data.count).toFixed(1)
            }));
    }

    /**
     * Get top N job titles
     */
    getTopTitles(limit = 10) {
        const titleMap = {};

        this.filteredLeads.forEach(lead => {
            if (lead.title) {
                titleMap[lead.title] = (titleMap[lead.title] || 0) + 1;
            }
        });

        return Object.entries(titleMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([title, count]) => ({ title, count }));
    }

    /**
     * Get top N companies
     */
    getTopCompanies(limit = 15) {
        const companyMap = {};

        this.filteredLeads.forEach(lead => {
            if (lead.company) {
                companyMap[lead.company] = (companyMap[lead.company] || 0) + 1;
            }
        });

        return Object.entries(companyMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([company, count]) => ({ company, count }));
    }

    /**
     * Get conversion funnel data
     */
    getConversionFunnel() {
        const total = this.filteredLeads.length;
        const withEmail = this.filteredLeads.filter(l => l.hasEmail).length;
        const score6Plus = this.filteredLeads.filter(l => l.preScore >= 6).length;
        const score8Plus = this.filteredLeads.filter(l => l.preScore >= 8).length;

        return [
            { stage: 'Total Leads', count: total, percentage: 100 },
            { stage: 'Con Email', count: withEmail, percentage: total > 0 ? (withEmail / total * 100).toFixed(1) : 0 },
            { stage: 'Score 6+', count: score6Plus, percentage: total > 0 ? (score6Plus / total * 100).toFixed(1) : 0 },
            { stage: 'Score 8+', count: score8Plus, percentage: total > 0 ? (score8Plus / total * 100).toFixed(1) : 0 }
        ];
    }

    /**
     * Get all unique cities for filter dropdown
     */
    getAllCities() {
        const cities = new Set();
        this.allLeads.forEach(l => {
            if (l.city) {
                const trimmed = l.city.toString().trim();
                if (trimmed) cities.add(trimmed);
            }
        });
        return Array.from(cities).sort();
    }

    /**
     * Get all unique states for filter dropdown
     */
    getAllStates() {
        const states = new Set();
        this.allLeads.forEach(l => {
            if (l.state) {
                const trimmed = l.state.toString().trim();
                if (trimmed) states.add(trimmed);
            }
        });
        return Array.from(states).sort();
    }

    /**
     * Get all unique countries for filter dropdown
     */
    getAllCountries() {
        const countries = new Set(this.allLeads.map(l => l.country).filter(c => c));
        return Array.from(countries).sort();
    }

    /**
     * Export filtered leads to CSV
     */
    exportToCSV() {
        const headers = [
            'Nombre Completo',
            'Empresa',
            'Cargo',
            'Email',
            'Teléfono',
            'Ciudad',
            'Estado',
            'País',
            'Score',
            'LinkedIn',
            'Fecha Creación'
        ];

        const rows = this.filteredLeads.map(lead => [
            lead.fullName,
            lead.company,
            lead.title,
            lead.email,
            lead.phone,
            lead.city,
            lead.state,
            lead.country,
            lead.preScore,
            lead.linkedinUrl,
            lead.createdAt.toLocaleDateString('es-MX')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    }

    /**
     * Download CSV file
     */
    downloadCSV(filename = 'agrobroker_leads.csv') {
        const csvContent = this.exportToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Apply date preset filter
     */
    applyDatePreset(preset) {
        const now = new Date();
        let dateFrom = null;
        let dateTo = new Date();

        switch (preset) {
            case 'today':
                dateFrom = new Date();
                dateFrom.setHours(0, 0, 0, 0);
                break;

            case 'last7days':
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 7);
                break;

            case 'last30days':
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 30);
                break;

            case 'thisMonth':
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                break;

            case 'lastMonth':
                dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                dateTo = new Date(now.getFullYear(), now.getMonth(), 0);
                break;

            case 'thisYear':
                dateFrom = new Date(now.getFullYear(), 0, 1);
                break;

            case 'all':
                dateFrom = null;
                dateTo = null;
                break;
        }

        this.updateFilters({ dateFrom, dateTo });
    }
}

// Export for use in other modules
window.DataProcessor = DataProcessor;
