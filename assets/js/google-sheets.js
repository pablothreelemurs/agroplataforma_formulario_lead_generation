/**
 * Google Sheets Integration Module
 * Fetches lead data from Google Sheets and provides auto-refresh functionality
 */

class GoogleSheetsClient {
  constructor(config = {}) {
    // TODO: Replace with your actual Google Sheets ID
    this.sheetId = config.sheetId || '1EXqV6Z_uIvWUQSh5fC_Ia1XD1cZ2FCqtvb4_e_0ETcM';
    this.refreshInterval = config.refreshInterval || 5 * 60 * 1000; // 5 minutes
    this.cacheKey = 'agrobroker_leads_cache';
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    this.autoRefreshEnabled = config.autoRefresh !== false;
    this.refreshTimer = null;
    this.lastFetchTime = null;
    this.listeners = [];
  }

  /**
   * Get the Google Sheets JSON API URL
   */
  getSheetUrl() {
    return `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:json`;
  }

  /**
   * Fetch data from Google Sheets
   */
  async fetchData() {
    try {
      console.log('📊 Fetching data from Google Sheets...');
      console.log('🔗 URL:', this.getSheetUrl());

      const response = await fetch(this.getSheetUrl(), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'text/plain'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('📄 Response length:', text.length);
      console.log('📄 First 200 chars:', text.substring(0, 200));

      // Google Sheets returns JSONP, we need to extract the JSON
      const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s)?.[1];

      if (!jsonString) {
        console.error('❌ Could not extract JSON from response');
        console.error('Response text:', text.substring(0, 500));
        throw new Error('Invalid response format from Google Sheets');
      }

      console.log('✅ JSON extracted, parsing...');
      const data = JSON.parse(jsonString);

      if (data.status === 'error') {
        console.error('❌ Google Sheets API error:', data.errors);
        throw new Error(data.errors?.[0]?.detailed_message || 'Error fetching data');
      }

      console.log('✅ Data parsed successfully');
      console.log('📊 Rows:', data.table?.rows?.length || 0);
      console.log('📊 Columns:', data.table?.cols?.length || 0);

      const leads = this.parseSheetData(data);

      // Cache the data
      this.cacheData(leads);

      this.lastFetchTime = new Date();

      console.log(`✅ Successfully fetched ${leads.length} leads`);

      // Notify listeners
      this.notifyListeners(leads);

      return leads;

    } catch (error) {
      console.error('❌ Error fetching Google Sheets data:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);

      // Try to return cached data if available
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('📦 Using cached data');
        this.notifyListeners(cachedData);
        return cachedData;
      }

      throw error;
    }
  }

  /**
   * Parse Google Sheets data into lead objects
   */
  parseSheetData(data) {
    const rows = data.table.rows;
    const cols = data.table.cols;

    // Create column name mapping
    const columnMap = {};
    cols.forEach((col, index) => {
      columnMap[col.label || col.id] = index;
    });

    // Parse each row into a lead object
    const leads = rows.map(row => {
      const cells = row.c;

      // Helper function to get cell value from multiple possible column names
      const getValue = (columnNames) => {
        if (typeof columnNames === 'string') columnNames = [columnNames];

        for (const name of columnNames) {
          const index = columnMap[name];
          if (index !== undefined && cells[index]) {
            return cells[index].v || cells[index].f || null;
          }
        }
        return null;
      };

      const name = getValue(['Name', 'First Name', 'Firstname', 'Nombre']) || '';
      const lastName = getValue(['LastName', 'Last Name', 'Lastname', 'Apellido']) || '';
      const preScore = parseInt(getValue(['Profile Score', 'PreScore', 'Score', 'Calificación']) || 0);
      const createdAt = getValue(['Created At', 'CreatedAt', 'Date', 'Fecha', 'Timestamp']);

      const cityVal = getValue(['City', 'Ciudad', 'Location city', 'Location City']) || '';
      const stateVal = getValue(['State', 'Estado', 'Location state', 'Location State']) || '';
      const countryVal = getValue(['Country', 'País', 'Location country', 'Location Country']) || 'Mexico';
      const addressVal = getValue(['Address', 'Dirección']) || '';

      // If city/state are empty but address is not, try to parse address
      let finalCity = cityVal;
      let finalState = stateVal;
      let finalCountry = countryVal;

      if (!finalCity && addressVal) {
        const parts = addressVal.split(',').map(p => p.trim());
        // Prioritize more specific parsing for common address formats
        if (parts.length >= 3) { // e.g., "City, State, Country" or "Street, City, State"
          // Attempt to identify City, State, Country from the end
          finalCountry = parts[parts.length - 1];
          finalState = parts[parts.length - 2];
          finalCity = parts[parts.length - 3];
        } else if (parts.length === 2) { // e.g., "City, State" or "Street, City"
          finalState = parts[parts.length - 1];
          finalCity = parts[parts.length - 2];
        } else if (parts.length === 1) { // e.g., "City"
          finalCity = parts[0];
        }
        console.log(`Parsed Address: "${addressVal}" -> City: "${finalCity}", State: "${finalState}"`);
      }

      return {
        id: getValue(['Apollo ID', 'ApolloID', 'ID']) || Math.random().toString(36).substr(2, 9),
        fullName: `${name} ${lastName}`.trim(),
        firstName: name,
        lastName: lastName,
        title: getValue(['Title', 'Job Title', 'Cargo', 'Puesto']) || '',
        company: getValue(['Company', 'Organization', 'Empresa', 'Compañía']) || '',
        email: getValue(['Email', 'Correo', 'Correo Electrónico']) || '',
        phone: getValue(['Phone', 'Direct Phone', 'Teléfono', 'Celular']) || '',
        stage: getValue(['Stage', 'Etapa', 'Estado lead']) || '',
        preScore: preScore,
        preReason: getValue(['Profile Score Justification', 'PreReason', 'Justificación']) || '',
        linkedinUrl: getValue(['Linkedin Url', 'LinkedIn', 'Linkedin']) || '',
        city: finalCity,
        state: finalState,
        country: finalCountry,
        address: addressVal,
        createdAt: this.parseDate(createdAt),
        hasEmail: !!getValue(['Email', 'Correo']),
        hasPhone: !!getValue(['Phone', 'Direct Phone', 'Teléfono']),
        hasLinkedIn: !!getValue(['Linkedin Url', 'LinkedIn', 'Linkedin']),
        isComplete: !!(getValue(['Email', 'Correo']) && (getValue(['Phone', 'Teléfono']) || getValue(['Linkedin Url', 'LinkedIn'])))
      };
    });

    console.log('Parsed leads sample:', leads.slice(0, 3).map(l => ({ city: l.city, state: l.state })));

    // Filter out invalid leads (no name)
    return leads.filter(lead => lead.fullName.length > 0);
  }

  /**
   * Parse date from various formats
   */
  parseDate(dateValue) {
    if (!dateValue) return new Date();

    // If it's already a Date object
    if (dateValue instanceof Date) return dateValue;

    // Google Sheets date string: "Date(2025,1,3)"
    if (typeof dateValue === 'string' && dateValue.includes('Date(')) {
      const matches = dateValue.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
      if (matches) {
        // Month is 0-indexed in JavaScript Date, but 1-indexed in Google Sheets Date() constructor
        const [_, y, m, d, h, min, s] = matches.map(Number);
        return new Date(y, m, d, h || 0, min || 0, s || 0);
      }
    }

    // Standard date string
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  /**
   * Cache data to localStorage
   */
  cacheData(data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  /**
   * Get cached data from localStorage
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const cacheObject = JSON.parse(cached);
      const age = Date.now() - cacheObject.timestamp;

      // Check if cache is still valid
      if (age > this.cacheTTL) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      return cacheObject.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }

  /**
   * Start auto-refresh
   */
  startAutoRefresh() {
    if (!this.autoRefreshEnabled) return;

    this.stopAutoRefresh(); // Clear any existing timer

    this.refreshTimer = setInterval(() => {
      console.log('🔄 Auto-refreshing data...');
      this.fetchData();
    }, this.refreshInterval);

    console.log(`✅ Auto-refresh enabled (every ${this.refreshInterval / 1000}s)`);
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('⏸️ Auto-refresh stopped');
    }
  }

  /**
   * Add a listener for data updates
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove a listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of data update
   */
  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in listener callback:', error);
      }
    });
  }

  /**
   * Get time since last fetch
   */
  getTimeSinceLastFetch() {
    if (!this.lastFetchTime) return null;

    const now = new Date();
    const diff = now - this.lastFetchTime;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''} atrás`;
    } else {
      return `${seconds} segundo${seconds !== 1 ? 's' : ''} atrás`;
    }
  }

  /**
   * Initialize and fetch initial data
   */
  async init() {
    // Try to get cached data first
    const cachedData = this.getCachedData();

    if (cachedData) {
      console.log('📦 Loading cached data...');
      this.notifyListeners(cachedData);
    }

    // Fetch fresh data
    await this.fetchData();

    // Start auto-refresh
    this.startAutoRefresh();

    return cachedData || [];
  }
}

// Export for use in other modules
window.GoogleSheetsClient = GoogleSheetsClient;
