# 📋 Estructura de Datos - Google Sheets

## Ejemplo de Google Sheet

Aquí está un ejemplo de cómo debe verse tu Google Sheet:

| Name | LastName | Title | Company | Email | Phone | Profile Score | Profile Score Justification | Linkedin Url | City | State | Country | Apollo ID | Created At |
|------|----------|-------|---------|-------|-------|---------------|----------------------------|--------------|------|-------|---------|-----------|------------|
| Juan | Pérez | CEO | AgroMex SA | juan.perez@agromex.com | +52 55 1234 5678 | 9 | C-Level en empresa grande del sector | https://linkedin.com/in/juanperez | Ciudad de México | CDMX | Mexico | abc123 | 2026-01-15 |
| María | González | Directora de Operaciones | Cultivos del Norte | maria.gonzalez@cultivosnorte.mx | +52 81 9876 5432 | 8 | Director en empresa mediana | https://linkedin.com/in/mariagonzalez | Monterrey | Nuevo León | Mexico | def456 | 2026-01-16 |
| Carlos | Rodríguez | Gerente General | Frutas Tropicales | carlos@frutastrop.com | +52 33 5555 1234 | 7 | Gerente en empresa pequeña | https://linkedin.com/in/carlosr | Guadalajara | Jalisco | Mexico | ghi789 | 2026-01-17 |
| Ana | Martínez | Fundadora | AgriTech Innovations | ana.martinez@agritech.mx | +52 55 8888 9999 | 10 | Fundadora de startup AgTech | https://linkedin.com/in/anamartinez | Ciudad de México | CDMX | Mexico | jkl012 | 2026-01-18 |
| Luis | Hernández | Director Financiero | Ganadería El Rancho | luis.hernandez@elrancho.mx | | 6 | CFO sin teléfono directo | https://linkedin.com/in/luish | Querétaro | Querétaro | Mexico | mno345 | 2026-01-19 |

## Descripción de Columnas

### Columnas Obligatorias

#### Name (Texto)
- **Descripción**: Nombre del lead
- **Ejemplo**: `Juan`
- **Validación**: No puede estar vacío

#### LastName (Texto)
- **Descripción**: Apellido del lead
- **Ejemplo**: `Pérez`
- **Validación**: No puede estar vacío

#### Title (Texto)
- **Descripción**: Cargo o puesto del lead
- **Ejemplo**: `CEO`, `Director de Operaciones`, `Gerente General`
- **Nota**: Se usa para determinar el nivel de seniority

#### Company (Texto)
- **Descripción**: Nombre de la empresa u organización
- **Ejemplo**: `AgroMex SA`, `Cultivos del Norte`
- **Validación**: No puede estar vacío

#### Profile Score (Número)
- **Descripción**: Score de calificación del lead (1-10)
- **Ejemplo**: `9`, `8`, `7`
- **Validación**: Debe ser un número entre 1 y 10
- **Nota**: Se usa para calcular conversión y distribución

#### Created At (Fecha)
- **Descripción**: Fecha de creación del lead
- **Formato**: `YYYY-MM-DD` o `DD/MM/YYYY`
- **Ejemplo**: `2026-01-15`, `15/01/2026`
- **Nota**: Se usa para gráficos temporales y filtros de fecha

### Columnas Opcionales (Recomendadas)

#### Email (Texto)
- **Descripción**: Email de contacto del lead
- **Ejemplo**: `juan.perez@agromex.com`
- **Nota**: Se usa para calcular cobertura de email y enviar correos

#### Phone o Direct Phone (Texto)
- **Descripción**: Teléfono directo del lead
- **Ejemplo**: `+52 55 1234 5678`
- **Nota**: Se usa para calcular cobertura de teléfono

#### Linkedin Url (Texto)
- **Descripción**: URL del perfil de LinkedIn
- **Ejemplo**: `https://linkedin.com/in/juanperez`
- **Nota**: Se usa para enlaces directos y tasa de enriquecimiento

#### City (Texto)
- **Descripción**: Ciudad del lead
- **Ejemplo**: `Ciudad de México`, `Monterrey`
- **Nota**: Se usa para gráfico de Top Ciudades y filtros

#### State (Texto)
- **Descripción**: Estado del lead
- **Ejemplo**: `CDMX`, `Nuevo León`, `Jalisco`
- **Nota**: Se usa para filtros de ubicación

#### Country (Texto)
- **Descripción**: País del lead
- **Ejemplo**: `Mexico`
- **Default**: Si está vacío, se asume `Mexico`

#### Apollo ID (Texto)
- **Descripción**: ID del lead en Apollo
- **Ejemplo**: `abc123`, `def456`
- **Nota**: Identificador único del lead

#### Profile Score Justification (Texto)
- **Descripción**: Razón o justificación del score asignado
- **Ejemplo**: `C-Level en empresa grande del sector`
- **Nota**: Ayuda a entender por qué se asignó ese score

## Niveles de Seniority Detectados

El dashboard detecta automáticamente el nivel de seniority basado en el **Title**:

### C-Level
Keywords: `CEO`, `CFO`, `COO`, `CTO`, `CMO`, `Founder`, `Co-Founder`, `President`, `Owner`

**Ejemplos**:
- CEO
- Chief Executive Officer
- Fundador
- Co-Founder
- Presidente

### Director/VP
Keywords: `Director`, `VP`, `Vice President`, `Head of`

**Ejemplos**:
- Director de Operaciones
- VP de Ventas
- Head of Marketing
- Directora Financiera

### Manager/Gerente
Keywords: `Manager`, `Gerente`, `Jefe`

**Ejemplos**:
- Gerente General
- Manager de Proyectos
- Jefe de Producción

### Coordinator/Especialista
Keywords: `Coordinator`, `Coordinador`, `Specialist`, `Especialista`

**Ejemplos**:
- Coordinador de Logística
- Especialista en Agronegocios

### Otros
Cualquier otro título que no coincida con los anteriores.

## Scores y Badges

El dashboard asigna colores a los scores automáticamente:

| Score | Badge | Color | Descripción |
|-------|-------|-------|-------------|
| 8-10 | High | Verde (#10b981) | Leads prioritarios, alta probabilidad de conversión |
| 6-7 | Medium | Amarillo/Dorado (#f59e0b) | Leads viables, probabilidad media |
| 4-5 | Low | Naranja (#fb923c) | Leads de baja prioridad |
| 1-3 | Very Low | Rojo (#ef4444) | Leads de muy baja calidad |

## Métricas Calculadas

### Tasa de Conversión
```
(Leads con Score >= 8) / (Total de Leads) * 100
```

### Cobertura de Email
```
(Leads con Email) / (Total de Leads) * 100
```

### Cobertura de Teléfono
```
(Leads con Teléfono) / (Total de Leads) * 100
```

### Tasa de Enriquecimiento
```
(Leads con LinkedIn) / (Total de Leads) * 100
```

### Datos Completos
Un lead tiene "datos completos" si tiene:
- Email ✅
- Teléfono ✅
- LinkedIn ✅

## Ejemplo de Datos de Prueba

Si quieres probar el dashboard sin datos reales, puedes crear un Google Sheet con estos datos de ejemplo:

```csv
Name,LastName,Title,Company,Email,Phone,Profile Score,City,State,Country,Created At
Juan,Pérez,CEO,AgroMex SA,juan@agromex.com,+52 55 1234 5678,9,Ciudad de México,CDMX,Mexico,2026-01-15
María,González,Directora,Cultivos Norte,maria@cultivos.mx,+52 81 9876 5432,8,Monterrey,Nuevo León,Mexico,2026-01-16
Carlos,Rodríguez,Gerente,Frutas Tropicales,carlos@frutas.com,+52 33 5555 1234,7,Guadalajara,Jalisco,Mexico,2026-01-17
Ana,Martínez,Fundadora,AgriTech,ana@agritech.mx,+52 55 8888 9999,10,Ciudad de México,CDMX,Mexico,2026-01-18
Luis,Hernández,CFO,El Rancho,luis@rancho.mx,,6,Querétaro,Querétaro,Mexico,2026-01-19
```

## Validación de Datos

Antes de usar tu Google Sheet, verifica:

- [ ] Todas las columnas obligatorias están presentes
- [ ] Los nombres de las columnas coinciden exactamente (case-sensitive)
- [ ] Los scores están entre 1 y 10
- [ ] Las fechas tienen un formato válido
- [ ] No hay filas completamente vacías
- [ ] Los emails tienen formato válido (si están presentes)
- [ ] El Sheet es público (modo Lector)

## Mapeo Flexible de Columnas

El código es flexible y acepta variaciones en los nombres de columnas:

| Columna Esperada | Alternativas Aceptadas |
|------------------|------------------------|
| `Name` | `Nombre`, `First Name` |
| `LastName` | `Last Name`, `Apellido` |
| `Title` | `Job Title`, `Cargo`, `Puesto` |
| `Company` | `Organization`, `Empresa` |
| `Profile Score` | `PreScore`, `Score` |
| `Phone` | `Direct Phone`, `Teléfono` |
| `Linkedin Url` | `LinkedIn`, `LinkedIn URL` |
| `Created At` | `CreatedAt`, `Date`, `Fecha` |

Si tus columnas tienen nombres diferentes, el código intentará encontrarlas automáticamente.

---

¿Necesitas ayuda con la estructura de datos? Revisa el archivo `CONFIGURACION.md` para más detalles.
