# 🌾 AgroBroker Analytics Dashboard

Dashboard profesional de analítica de leads para AgroBroker, plataforma de financiamiento agroindustrial en México. Visualiza métricas clave de generación de leads, conversión, scoring y seguimiento de oportunidades comerciales.

![AgroBroker](https://img.shields.io/badge/AgroBroker-Analytics-10b981?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-10b981?style=for-the-badge)

## ✨ Características

### 📊 KPIs Principales
- **Total de Leads**: Contador animado con número total
- **Score Promedio**: Promedio de PreScore de todos los leads (escala 1-10)
- **Tasa de Conversión**: % de leads con score >= 8
- **Leads Hoy**: Leads generados en las últimas 24 horas
- **Cobertura de Email**: % de leads con email verificado
- **Cobertura de Teléfono**: % de leads con teléfono directo

### 📈 Visualizaciones
1. **Distribución de Scores** - Gráfico de barras con gradiente verde a dorado
2. **Leads por Fecha** - Gráfico de línea temporal con área rellena
3. **Top 10 Ciudades** - Gráfico de dona con distribución geográfica
4. **Top 10 Cargos** - Barras horizontales de títulos más frecuentes
5. **Top 15 Empresas** - Organizaciones con más leads
6. **Embudo de Conversión** - Visualización de etapas de calificación

### 🎛️ Filtros Interactivos
- **Fecha**: Rangos personalizados y presets (hoy, 7 días, 30 días, etc.)
- **Score**: Sliders de rango mínimo/máximo
- **Ubicación**: Multi-select para ciudad, estado, país
- **Seniority**: Filtros por nivel de cargo (C-Level, Director, Manager, etc.)
- **Datos**: Toggles para email, teléfono, LinkedIn, datos completos
- **Búsqueda**: Búsqueda en tiempo real con debounce de 300ms
- **Guardar/Cargar**: Guarda combinaciones de filtros en localStorage

### 📋 Tabla Dinámica
- Ordenable por cualquier columna
- Paginación (10, 25, 50, 100 por página)
- Búsqueda en tiempo real
- Badges de colores para scores
- Enlaces directos a LinkedIn y email
- Exportación a CSV

### 🎨 Diseño Premium
- Paleta de colores AgroBroker (verde agricultura + dorado)
- Animaciones suaves (fade-in, count-up, pulse)
- Modo oscuro/claro con toggle
- 100% responsive (desktop, tablet, mobile)
- Glassmorphism y efectos modernos

## 🚀 Configuración Rápida

### 1. Configurar Google Sheets

#### Opción A: Hacer tu Sheet Público (Recomendado para desarrollo)

1. Abre tu Google Sheet con los datos de leads
2. Click en **Compartir** → **Cambiar a cualquier persona con el enlace**
3. Asegúrate que esté en modo **Lector**
4. Copia el ID del Sheet de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

#### Opción B: Usar Google Sheets API (Para producción)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Crea credenciales (API Key o OAuth 2.0)
5. Configura las credenciales en el código

### 2. Actualizar el Sheet ID

Edita el archivo `assets/js/google-sheets.js` y reemplaza:

```javascript
this.sheetId = config.sheetId || 'YOUR_GOOGLE_SHEET_ID_HERE';
```

Por:

```javascript
this.sheetId = config.sheetId || 'TU_SHEET_ID_AQUI';
```

**Alternativa**: Pasa el Sheet ID por URL:
```
https://tu-dominio.com/?sheetId=TU_SHEET_ID_AQUI
```

### 3. Estructura de Datos Esperada

Tu Google Sheet debe tener estas columnas (los nombres pueden variar, el código es flexible):

| Columna | Descripción | Requerido |
|---------|-------------|-----------|
| Name | Nombre del lead | ✅ |
| LastName | Apellido | ✅ |
| Title | Cargo/Puesto | ✅ |
| Company | Empresa | ✅ |
| Email | Email de contacto | ⚠️ |
| Phone | Teléfono directo | ⚠️ |
| Profile Score | Score de 1-10 | ✅ |
| Profile Score Justification | Razón del score | ❌ |
| Linkedin Url | URL de LinkedIn | ⚠️ |
| City | Ciudad | ⚠️ |
| State | Estado | ⚠️ |
| Country | País | ❌ |
| Apollo ID | ID de Apollo | ❌ |
| Created At | Fecha de creación | ✅ |

✅ = Requerido | ⚠️ = Altamente recomendado | ❌ = Opcional

## 💻 Desarrollo Local

### Opción 1: Python HTTP Server (Más simple)

```bash
# Navega al directorio del proyecto
cd agroplataforma_formulario_lead_generation

# Inicia servidor HTTP en puerto 8000
python3 -m http.server 8000

# Abre en el navegador
open http://localhost:8000
```

### Opción 2: Docker (Producción-like)

```bash
# Construir imagen
docker build -t agrobroker-dashboard .

# Ejecutar contenedor
docker run -d -p 8080:80 agrobroker-dashboard

# Abre en el navegador
open http://localhost:8080
```

## 🐳 Deployment en Easypanel

### 1. Conectar Repositorio

1. Inicia sesión en Easypanel
2. Crea una nueva aplicación
3. Conecta tu repositorio Git (GitHub, GitLab, etc.)

### 2. Configurar Build

- **Build Method**: Dockerfile
- **Dockerfile Path**: `./Dockerfile`
- **Port**: `80`

### 3. Variables de Entorno (Opcional)

Si quieres configurar el Sheet ID por variable de entorno:

```bash
GOOGLE_SHEET_ID=tu_sheet_id_aqui
```

Y actualiza `google-sheets.js` para leerla.

### 4. Deploy

Click en **Deploy** y espera a que se construya la imagen.

### 5. Acceder

Una vez desplegado, accede a tu dashboard en:
```
https://tu-app.easypanel.host
```

El formulario de generación de leads estará en:
```
https://tu-app.easypanel.host/form.html
```

## 🎨 Paleta de Colores AgroBroker

```css
/* Verdes Agricultura */
--color-primary: #10b981;           /* emerald-500 */
--color-primary-dark: #059669;      /* emerald-600 */
--color-primary-light: #34d399;     /* emerald-400 */

/* Dorados/Amarillos Tierra */
--color-secondary: #f59e0b;         /* amber-500 */
--color-secondary-light: #fbbf24;   /* amber-400 */
--color-orange: #fb923c;            /* orange-400 */

/* Estados */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

## ⚙️ Configuración Avanzada

### Auto-Refresh

Por defecto, los datos se actualizan cada 5 minutos. Para cambiar:

```javascript
// En assets/js/dashboard.js
this.sheetsClient = new GoogleSheetsClient({
  sheetId: this.getSheetIdFromConfig(),
  refreshInterval: 10 * 60 * 1000, // 10 minutos
  autoRefresh: true
});
```

### Cache TTL

El cache de datos en localStorage dura 5 minutos. Para cambiar:

```javascript
// En assets/js/google-sheets.js
this.cacheTTL = 10 * 60 * 1000; // 10 minutos
```

### Mapeo de Columnas Personalizado

Si tus columnas tienen nombres diferentes, edita `parseSheetData()` en `google-sheets.js`:

```javascript
const getValue = (columnName) => {
  const index = columnMap[columnName];
  if (index === undefined || !cells[index]) return null;
  return cells[index].v || cells[index].f || null;
};

// Ejemplo: Si tu columna se llama "Nombre Completo" en lugar de "Name"
const name = getValue('Nombre Completo') || getValue('Name') || '';
```

## 🔧 Troubleshooting

### Error: "Invalid response format from Google Sheets"

**Causa**: El Sheet no es público o el ID es incorrecto.

**Solución**:
1. Verifica que el Sheet sea público (cualquier persona con el enlace puede ver)
2. Confirma que el Sheet ID sea correcto
3. Prueba acceder manualmente a:
   ```
   https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:json
   ```

### Error: "CORS policy"

**Causa**: Restricciones de CORS al acceder a Google Sheets.

**Solución**:
- Asegúrate de que el Sheet sea público
- Si usas autenticación, implementa un proxy backend

### Los datos no se actualizan

**Causa**: Cache de navegador o localStorage corrupto.

**Solución**:
1. Abre DevTools (F12)
2. Ve a Application → Local Storage
3. Borra las claves que empiezan con `agrobroker_`
4. Recarga la página (Cmd/Ctrl + Shift + R)

### Los gráficos no se muestran

**Causa**: Chart.js no se cargó correctamente.

**Solución**:
1. Verifica la consola del navegador (F12)
2. Asegúrate de tener conexión a internet (Chart.js se carga desde CDN)
3. Si estás offline, descarga Chart.js y sírvelo localmente

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px - Sidebar visible, charts en grid 2x3
- **Tablet**: 768px - 1023px - Sidebar colapsable, charts en 1 columna
- **Mobile**: < 768px - Sidebar como modal, KPIs apilados

## ⌨️ Keyboard Shortcuts

- **Cmd/Ctrl + R**: Refresh manual de datos
- **ESC**: Cerrar sidebar/modals
- **F**: Foco en filtros (próximamente)
- **/**: Buscar en tabla (próximamente)

## 🔐 Seguridad

- ✅ Headers de seguridad configurados en nginx
- ✅ Sanitización de HTML para prevenir XSS
- ✅ No se almacenan credenciales en el código
- ✅ HTTPS recomendado en producción
- ⚠️ El Sheet debe ser de solo lectura para usuarios

## 📊 Performance

- **Carga inicial**: < 3 segundos (3G)
- **Respuesta de filtros**: < 500ms
- **Renderizado de gráficos**: < 1 segundo
- **Tamaño de imagen Docker**: < 50MB
- **Lighthouse Score**: 90+ (performance)

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Charts**: Chart.js 4.x
- **Fonts**: Google Fonts (Inter)
- **Server**: Nginx Alpine
- **Container**: Docker
- **Deployment**: Easypanel

## 📝 Estructura de Archivos

```
/
├── index.html              # Dashboard principal
├── form.html               # Formulario de lead gen
├── assets/
│   ├── css/
│   │   └── dashboard.css   # Estilos del dashboard
│   ├── js/
│   │   ├── google-sheets.js    # Integración con Sheets
│   │   ├── data-processor.js   # Procesamiento de datos
│   │   ├── charts.js           # Configuración de gráficos
│   │   ├── filters.js          # Lógica de filtros
│   │   └── dashboard.js        # Orquestación principal
│   └── img/
│       └── (logos, iconos)
├── Dockerfile              # Configuración Docker
├── nginx.conf              # Configuración Nginx
└── README.md               # Este archivo
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de AgroBroker. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@agrobroker.tech
- Documentación: [docs.agrobroker.tech](https://docs.agrobroker.tech)

---

Hecho con 💚 por el equipo de AgroBroker
