# Blueprint: Dashboard de Leads Premium (AgroBroker Edition)

Este documento es una guía técnica y un prompt maestro para replicar la estructura, diseño y lógica del Dashboard de AgroBroker en futuros proyectos.

## 1. Vision General del Proyecto
Un dashboard analítico de leads basado en **HTML5, Vanilla CSS y JavaScript**, diseñado con una estética de **Modo Oscuro Premium (Glassmorphism)**. Utiliza **Chart.js v4** para visualizaciones y consume datos directamente desde **Google Sheets** (vía JSONP) sin necesidad de un backend complejo.

## 2. Prompt Maestro de Replicación
> "Actúa como un experto en Front-end y Visualización de Datos. Crea un Dashboard Analítico para un CRM de Leads con las siguientes especificaciones:
> 
> **Diseño:** 
> - Modo oscuro profundo (Fondo: `#0a0e27`).
> - Estética Glassmorphism (Tarjetas con fondo `rgba(255,255,255,0.05)`, borde sutil y `backdrop-filter: blur(10px)`).
> - Paleta de colores: Primario Verde Lima (`#10b981`), Secundario Ámbar (`#f59e0b`), Acentos Púrpura y Azul.
> - Tipografía: Montserrat para títulos, Inter para datos.
> 
> **Estructura (Simetría 8x8):**
> - **Header:** Título a la izquierda, botones de 'Filtros', 'Actualizar' y 'Reloj de Última Sincronización' a la derecha. Sin logo.
> - **KPI Grid:** 8 tarjetas rectangulares (2 filas de 4). Métricas: Total Leads, Leads Profesionales (Score >=8), Empresas Únicas, Tasa de Conversión, Score Promedio, Leads Hoy, Cobertura de Email, Cobertura de Teléfono.
> - **Charts Grid:** 8 gráficos (4 filas de 2). Tipos: 
>   1. Distribución de Scores (Bar)
>   2. Evolución Temporal (Line)
>   3. Top 10 Ciudades (Doughnut)
>   4. Distribución por Estado (Horizontal Bar)
>   5. Top 10 Cargos (Horizontal Bar)
>   6. Top 15 Empresas (Bar)
>   7. Score Promedio por Cargo (Bar)
>   8. Embudo de Calificación (Bar Horizontal custom).
> - **Filtros:** Panel horizontal colapsable que incluya: Rango de fechas, Sliders de Score (Min/Max), Multi-select de Ubicación, Checkboxes de Seniority, Toggles de Completitud de datos.
> - **Tabla:** Tabla de leads con scroll horizontal, encabezados fijos, texto blanco puro y badges de color según el score.
> 
> **Lógica Técnica:**
> - **Data Source:** Google Sheets via `gviz/tq?tqx=out:json`.
> - **Robustez:** El parser de datos debe buscar múltiples variantes de nombres de columnas (español/inglés) y extraer Ciudad/Estado de una columna de 'Dirección' si no existen por separado.
> - **Performance:** Implementar caché en `localStorage`, filtrado reactivo en el cliente (DataProcessor class) y animaciones de 'Count-up' para los KPIs."

## 3. Especificaciones Técnicas Clave (Lo que aprendimos)

### CSS Estético (Contraste Crítico)
Para garantizar la legibilidad en el modo oscuro, es imperativo forzar el color blanco en elementos específicos donde las variables CSS pueden fallar:
```css
/* Regla de oro para legibilidad */
.chart-title, .kpi-label, .leads-table th, .filter-label, .header-title h1 {
    color: #ffffff !important;
}

/* Glassmorphism Effect */
.card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### JS: Mapeo Inteligente de Columnas
El cliente de Google Sheets (`google-sheets.js`) debe ser agnóstico al idioma de las columnas:
```javascript
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

// Ejemplo de uso robusto
const email = getValue(['Email', 'Correo', 'Mail']);
```

### JS: Extracción de Ubicación
Si el CRM solo entrega una columna de `Address`, desglosarla para habilitar los gráficos geográficos:
```javascript
if (!city && address) {
    const parts = address.split(',').map(p => p.trim());
    city = parts[0]; // Asume: Ciudad, Estado, País
    state = parts[1];
}
```

## 4. Estructura de Archivos Recomendada
- `/index.html`: Dashboard principal.
- `/form.html`: Formulario de captura.
- `/assets/css/dashboard.css`: Estilos core (Glassmorphism + Dark Mode).
- `/assets/js/`:
    - `google-sheets.js`: Cliente de API y Parser.
    - `data-processor.js`: Filtros y Cálculos KPI.
    - `charts.js`: Configuración de Chart.js (Colores de ejes en blanco).
    - `filters.js`: Manejo de UI de filtros.
    - `dashboard.js`: Orquestador principal.

## 5. Hosting (Easypanel / Nginx)
Para producción, usa Nginx con reglas de `try_files` para que `/form` cargue `form.html` limpiamente, facilitando el acceso a los usuarios finales.
