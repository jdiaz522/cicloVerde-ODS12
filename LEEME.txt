CicloVerde - INICIO RÁPIDO
1. Extrae todo el ZIP y abre la carpeta en Visual Studio Code.
2. Abre index.html en el navegador (doble clic o Live Server).
3. Abre "Actuar": el menú horizontal contiene un desplegable vertical (clic, Enter o toque).
4. Baja por la página: el encabezado permanece arriba gracias a position: sticky.
5. HU-01 Recicla Fácil (sección "Encuentra dónde reciclar", wireframes 1-3 de Figma):
   - Campo vacío: aparecen ejemplos.
   - Escribe "bot": desde el tercer carácter aparecen sugerencias con nombre común y código (CA-01, CA-02).
   - Elige "Botella de agua (#1 PET Bottles)": se muestran sus puntos de reciclaje y el mapa (Escenario 1).
   - Escribe algo sin coincidencia (ej. "xqzw"): tras 1 segundo aparece "No encontramos ese material",
     3 sugerencias y las dos alternativas (Escenario 2).
   - "Explora por tipo de residuo": Plásticos tiene 16 materiales y un filtro por código (CA-03).
6. Antes de comprar: marca las frases; el contador y el resultado cambian con CSS.
7. Talleres: completa datos ficticios y abre la confirmación de prueba.
8. "Video y guía" abre recursos.html. El video de YouTube necesita Internet.
9. SEMANA 11 · Menú ACME con JavaScript (js/menu.js):
   - Escritorio: el menú horizontal sigue igual y "Actuar" abre su lista vertical.
   - Celular (600 px o menos): aparece el botón "Menú" (hamburguesa). Al tocarlo se abre
     el panel con los enlaces y el texto cambia a "Cerrar".
   - Elegir un enlace cierra el panel y lleva a la sección. Escape cierra el menú.
   - Al agrandar la ventana por encima de 600 px el menú vuelve a ser horizontal.
10. SEMANA 11 · HU-06 Mi consumo de descartables (sección "Calcular mis descartables",
   js/calculadora.js):
   - Escribe 5, 3, 2 y 0 y presiona Calcular: 10 por semana y 520 al año; "bolsas" queda
     resaltado con un consejo y un enlace a su ficha del buscador (Escenario 1).
   - Deja un campo vacío o escribe -2: el campo se marca y no aparece resultado (Escenario 2).
   - Escribe 0 en los cuatro campos: aparece la felicitación y el enlace al taller (Escenario 3).
   - Limpiar borra los datos, los errores y el resultado.
No hay una aplicación móvil independiente: es la misma web adaptada al ancho.
La versión anterior (solo HTML y CSS) quedó guardada en _original_semana10.

ARCHIVOS
index.html        Landing principal: inicio, HU-01 (buscador y categorías), nosotros, servicios,
                  antes de comprar, proyectos, galería, testimonios y talleres.
js/menu.js        Menú responsive (hamburguesa, Escape, cambio de tamaño). Semana 11.
js/calculadora.js HU-06: calculadora de descartables (validación, totales y consejo). Semana 11.
recursos.html     Página de video y texto con crédito y enlace alternativo.
confirmacion.html Pantalla fija del final de la HU03.
css/estilos.css   Estilos compartidos. Los comentarios PASO explican cada bloque.
imagenes/ videos/ iconos/  Recursos locales con rutas relativas.
