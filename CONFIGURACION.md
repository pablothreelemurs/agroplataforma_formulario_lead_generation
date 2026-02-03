# 🚀 Guía de Configuración Rápida - AgroBroker Dashboard

## ⚡ Configuración en 3 Pasos

### Paso 1: Configurar Google Sheets ID

Edita el archivo: `assets/js/google-sheets.js`

Busca la línea 8:
```javascript
this.sheetId = config.sheetId || 'YOUR_GOOGLE_SHEET_ID_HERE';
```

Reemplaza `YOUR_GOOGLE_SHEET_ID_HERE` con tu Sheet ID real.

**¿Dónde encuentro mi Sheet ID?**

En la URL de tu Google Sheet:
```
https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_SHEET_ID]/edit
```

Ejemplo:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        Este es el Sheet ID
```

### Paso 2: Hacer tu Sheet Público

1. Abre tu Google Sheet
2. Click en **Compartir** (botón verde arriba a la derecha)
3. Click en **Cambiar a cualquier persona con el enlace**
4. Asegúrate que el permiso sea **Lector** (no Editor)
5. Click en **Listo**

### Paso 3: Verificar Columnas del Sheet

Tu Google Sheet debe tener estas columnas (mínimo):

**Columnas Requeridas:**
- `Name` - Nombre del lead
- `LastName` - Apellido
- `Title` - Cargo/Puesto
- `Company` - Empresa
- `Profile Score` - Score de 1 a 10
- `Created At` - Fecha de creación

**Columnas Opcionales (pero recomendadas):**
- `Email` - Email de contacto
- `Phone` o `Direct Phone` - Teléfono
- `Linkedin Url` - URL de LinkedIn
- `City` - Ciudad
- `State` - Estado
- `Country` - País (default: Mexico)
- `Apollo ID` - ID de Apollo
- `Profile Score Justification` - Razón del score

## 🧪 Probar Localmente

```bash
# Navega al directorio
cd agroplataforma_formulario_lead_generation

# Inicia servidor local
python3 -m http.server 8000

# Abre en navegador
open http://localhost:8000
```

## 🐳 Deploy en Easypanel

### Método 1: Desde Git (Recomendado)

1. Sube tu código a GitHub/GitLab
2. En Easypanel, crea nueva aplicación
3. Conecta tu repositorio
4. Easypanel detectará automáticamente el Dockerfile
5. Click en **Deploy**

### Método 2: Docker Manual

```bash
# Construir imagen
docker build -t agrobroker-dashboard .

# Subir a registry (Docker Hub, etc.)
docker tag agrobroker-dashboard tu-usuario/agrobroker-dashboard
docker push tu-usuario/agrobroker-dashboard

# En Easypanel, usar imagen de registry
```

## ✅ Verificación Post-Deploy

1. **Dashboard Principal**: `https://tu-app.easypanel.host`
   - Debe mostrar 6 KPI cards
   - Debe mostrar 6 gráficos
   - Debe mostrar tabla de leads

2. **Formulario de Leads**: `https://tu-app.easypanel.host/form.html`
   - Debe mantener el formulario original funcionando

3. **Datos de Google Sheets**:
   - Verifica que los números en los KPIs coincidan con tu Sheet
   - Verifica que la tabla muestre tus leads
   - Verifica que los gráficos se rendericen correctamente

## 🔧 Troubleshooting Común

### "Error al cargar datos"

**Causa**: Sheet ID incorrecto o Sheet no es público

**Solución**:
1. Verifica el Sheet ID en `assets/js/google-sheets.js`
2. Confirma que el Sheet sea público
3. Prueba acceder manualmente a:
   ```
   https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:json
   ```
   Debes ver JSON, no un error 404

### Los gráficos no aparecen

**Causa**: Chart.js no se cargó desde CDN

**Solución**:
- Verifica conexión a internet
- Abre DevTools (F12) y revisa la consola
- Verifica que `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js` sea accesible

### Los filtros no funcionan

**Causa**: JavaScript no se cargó correctamente

**Solución**:
- Abre DevTools (F12) → Console
- Busca errores en rojo
- Verifica que todos los archivos JS se hayan cargado:
  - `google-sheets.js`
  - `data-processor.js`
  - `charts.js`
  - `filters.js`
  - `dashboard.js`

## 🎨 Personalización

### Cambiar Colores

Edita `assets/css/dashboard.css`, líneas 8-30:

```css
:root {
  --color-primary: #10b981;      /* Tu color primario */
  --color-secondary: #f59e0b;    /* Tu color secundario */
  /* ... */
}
```

### Cambiar Intervalo de Auto-Refresh

Edita `assets/js/dashboard.js`, línea ~30:

```javascript
this.sheetsClient = new GoogleSheetsClient({
  sheetId: this.getSheetIdFromConfig(),
  refreshInterval: 5 * 60 * 1000, // Cambia 5 por los minutos que quieras
  autoRefresh: true
});
```

### Agregar más KPIs

1. Agrega el HTML en `index.html` (sección KPI cards)
2. Calcula el KPI en `assets/js/data-processor.js` → `calculateKPIs()`
3. Actualiza el KPI en `assets/js/dashboard.js` → `updateKPIs()`

## 📞 Soporte

Si tienes problemas:

1. Revisa el README.md completo
2. Abre DevTools (F12) y revisa la consola
3. Verifica que tu Google Sheet sea público
4. Confirma que el Sheet ID sea correcto

## 🎯 Checklist de Configuración

- [ ] Sheet ID configurado en `google-sheets.js`
- [ ] Google Sheet es público (modo Lector)
- [ ] Columnas del Sheet coinciden con lo esperado
- [ ] Probado localmente con `python3 -m http.server`
- [ ] Dashboard muestra datos correctamente
- [ ] Código subido a Git (si usas deploy desde Git)
- [ ] Aplicación creada en Easypanel
- [ ] Deploy exitoso
- [ ] Dashboard accesible en URL de producción
- [ ] Formulario `/form.html` sigue funcionando

---

¡Listo! Tu dashboard de AgroBroker está configurado y funcionando 🎉
