# Prototipo SIRLOC en HTML, CSS y JavaScript

## Cómo abrirlo

Abre `index.html` en un navegador moderno. No necesita instalar dependencias, iniciar un servidor ni conectarse a internet.

## Recorridos de demostración

- **Registro:** inicia en “Registrar datos”, escribe `40374767` como DNI de demostración y avanza por las cinco etapas. Puedes agregar estudios, cursos y experiencias, aceptar las declaraciones y revisar la ficha.
- **Consulta y cancelación:** consulta el registro desde la página de inicio y usa “Cancelar registro” para probar el diálogo de confirmación.
- **Ficha:** la opción “Imprimir o guardar como PDF” abre el diálogo de impresión del navegador.

Los datos son ficticios y se mantienen solo en memoria mientras la página está abierta. No se envían a ningún servicio ni representan una integración con RENIEC o con el JNE.

## Mejoras de accesibilidad aplicadas

- Campos vinculados con etiquetas, identificadores y ayuda relacionada.
- Progreso presentado como lista ordenada; la etapa actual se anuncia con `aria-current="step"`.
- Acciones con texto visible y nombre comprensible.
- Listas y navegación con HTML semántico, sin roles ARIA de pestañas incompletos.
- Colores oscuros sobre fondos claros y foco de teclado visible.
- Encabezados semánticos con jerarquía.
- Texto de interfaz de al menos 14 px y diseño adaptable al zoom.
- Tablas semánticas que se reorganizan como tarjetas etiquetadas en pantallas estrechas.


