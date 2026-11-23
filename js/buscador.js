// =========================================================
// CicloVerde · ODS 12 · Buscador dinámico "Recicla Fácil" (HU-01)
// SEMANA 14 · Human-AI Interaction and Emerging Interfaces
//
// Qué hace este archivo:
//  1. Filtra en tiempo real los 27 materiales mientras escribes.
//  2. Muestra cuántas coincidencias hay (TRANSPARENCIA).
//  3. Tolera tildes, mayúsculas y errores leves: "boteya" → "¿Quisiste decir:
//     Botella de agua?" (RECUPERACIÓN ANTE ERRORES).
//  4. Botón × y tecla Escape para limpiar; "/" para buscar (CONTROL DEL USUARIO).
//  5. Cada sugerencia lleva a su ficha #m-... sin recargar la página (CONFIANZA).
//
// Todo el código va dentro de una función que se ejecuta sola:
// (function () { ... })();
// Así nuestras variables no chocan con las de js/menu.js ni js/calculadora.js.
// =========================================================
(function () {
  'use strict';

  // ---------------------------------------------------------
  // PASO 1. DATOS: los 27 materiales que ya existen en index.html.
  // id        → el id de su ficha (<article id="m-...">)
  // nombre    → nombre común que entiende cualquier persona
  // codigo    → código técnico (resina o material)
  // categoria → define el ícono y el color de la sugerencia
  // otros     → palabras cotidianas que también deben encontrarlo
  // ---------------------------------------------------------
  const MATERIALES = [
    { id: 'm-botella-agua', nombre: 'Botella de agua', codigo: '#1 PET Bottles', categoria: 'Plásticos', otros: ['agua mineral'] },
    { id: 'm-botella-aceite', nombre: 'Botella de aceite', codigo: '#1 PET Bottles', categoria: 'Plásticos', otros: ['aceite de cocina'] },
    { id: 'm-botella-bebida', nombre: 'Botella de bebida', codigo: '#1 PET Bottles', categoria: 'Plásticos', otros: ['gaseosa', 'refresco', 'jugo'] },
    { id: 'm-envase-fruta', nombre: 'Envase transparente de fruta', codigo: '#1 PET', categoria: 'Plásticos', otros: ['fresas', 'tapers de fruta'] },
    { id: 'm-botella-detergente', nombre: 'Botella de detergente', codigo: '#2 HDPE', categoria: 'Plásticos', otros: ['lejía', 'limpiador', 'suavizante'] },
    { id: 'm-botella-shampoo', nombre: 'Botella de shampoo', codigo: '#2 HDPE', categoria: 'Plásticos', otros: ['champú', 'jabón líquido', 'acondicionador'] },
    { id: 'm-tuberia-pvc', nombre: 'Tubería de PVC', codigo: '#3 PVC', categoria: 'Plásticos', otros: ['tubo', 'caño'] },
    { id: 'm-bolsa-plastico', nombre: 'Bolsa de plástico', codigo: '#4 LDPE', categoria: 'Plásticos', otros: ['bolsa plástica', 'bolsa de supermercado'] },
    { id: 'm-film-embalaje', nombre: 'Film de embalaje', codigo: '#4 LDPE', categoria: 'Plásticos', otros: ['stretch', 'plástico de embalar'] },
    { id: 'm-tapa-botella', nombre: 'Tapa de botella', codigo: '#5 PP', categoria: 'Plásticos', otros: ['tapita', 'tapón'] },
    { id: 'm-taper-comida', nombre: 'Táper de comida', codigo: '#5 PP', categoria: 'Plásticos', otros: ['tupper', 'túper', 'recipiente'] },
    { id: 'm-envase-yogurt', nombre: 'Envase de yogurt', codigo: '#5 PP', categoria: 'Plásticos', otros: ['yogur', 'pote'] },
    { id: 'm-vaso-descartable', nombre: 'Vaso descartable', codigo: '#6 PS', categoria: 'Plásticos', otros: ['vaso de café'] },
    { id: 'm-bandeja-tecnopor', nombre: 'Bandeja de tecnopor', codigo: '#6 PS', categoria: 'Plásticos', otros: ['tecnoport', 'teknopor', 'poliestireno'] },
    { id: 'm-cubiertos-descartables', nombre: 'Cubiertos descartables', codigo: '#6 PS', categoria: 'Plásticos', otros: ['tenedor', 'cuchara', 'cuchillo'] },
    { id: 'm-envoltura-snack', nombre: 'Envoltura de snacks', codigo: '#7 OTHER', categoria: 'Plásticos', otros: ['papitas', 'galletas', 'envoltorio'] },
    { id: 'm-botella-vidrio', nombre: 'Botella de vidrio', codigo: '#70 Glass', categoria: 'Vidrio', otros: [] },
    { id: 'm-frasco-mermelada', nombre: 'Frasco de mermelada', codigo: '#70 Glass', categoria: 'Vidrio', otros: ['frasco de conserva'] },
    { id: 'm-botella-vino', nombre: 'Botella de vino', codigo: '#71 Glass', categoria: 'Vidrio', otros: [] },
    { id: 'm-botella-cerveza', nombre: 'Botella de cerveza', codigo: '#72 Glass', categoria: 'Vidrio', otros: [] },
    { id: 'm-caja-carton', nombre: 'Caja de cartón', codigo: '#20 PAP', categoria: 'Papel y cartón', otros: ['caja de mudanza', 'caja de delivery'] },
    { id: 'm-caja-cereal', nombre: 'Caja de cereal', codigo: '#21 PAP', categoria: 'Papel y cartón', otros: ['cartulina'] },
    { id: 'm-periodico-hojas', nombre: 'Periódico y hojas', codigo: '#22 PAP', categoria: 'Papel y cartón', otros: ['diario', 'papel', 'cuaderno', 'revista'] },
    { id: 'm-caja-leche', nombre: 'Envase de leche tipo caja', codigo: '#84 C/PAP', categoria: 'Papel y cartón', otros: ['tetra pak', 'tetrapak', 'jugo en caja'] },
    { id: 'm-lata-gaseosa', nombre: 'Lata de gaseosa', codigo: '#41 ALU', categoria: 'Metales', otros: ['lata de cerveza', 'aluminio'] },
    { id: 'm-lata-atun', nombre: 'Lata de atún', codigo: '#40 FE', categoria: 'Metales', otros: ['conserva', 'hojalata', 'acero'] },
    { id: 'm-papel-aluminio', nombre: 'Papel aluminio', codigo: '#41 ALU', categoria: 'Metales', otros: ['foil'] }
  ];

  // Íconos SVG por categoría (los mismos dibujos de las fichas y categorías).
  const ICONOS = {
    'Plásticos': '<path d="M20 4h8v5l4 7v25a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V16l4-7z"/><path d="M16 24h16M16 34h16"/>',
    'Vidrio': '<rect x="14" y="5" width="20" height="7" rx="2"/><path d="M15 12h18v4c3 2 4 5 4 8v17a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V24c0-3 1-6 4-8z"/>',
    'Papel y cartón': '<path d="M6 16l18-8 18 8v20l-18 8-18-8z"/><path d="M6 16l18 8 18-8M24 24v20"/>',
    'Metales': '<ellipse cx="24" cy="9" rx="12" ry="4"/><path d="M12 9v30c0 2.2 5.4 4 12 4s12-1.8 12-4V9"/><path d="M12 18c0 2.2 5.4 4 12 4s12-1.8 12-4"/>'
  };
  // Clase CSS para el color de cada categoría.
  const CLASE_CATEGORIA = {
    'Plásticos': 'cat-plasticos',
    'Vidrio': 'cat-vidrio',
    'Papel y cartón': 'cat-papel',
    'Metales': 'cat-metales'
  };
  const FLECHA_SVG = '<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  const MINIMO_LETRAS = 3; // CA-01: las sugerencias aparecen desde el tercer carácter

  // ---------------------------------------------------------
  // PASO 2. DOM: localizar los elementos del HTML.
  // ---------------------------------------------------------
  const seccionBuscar = document.querySelector('#buscar');
  const buscador = document.querySelector('#buscador');               // <input type="search">
  const botonLimpiar = document.querySelector('#limpiar-busqueda');   // botón ×
  const contador = document.querySelector('#contador-busqueda');      // "3 coincidencias…"
  const panel = document.querySelector('#panel-sugerencias');         // caja de sugerencias
  const tituloPanel = document.querySelector('#titulo-sugerencias');
  const quisisteDecir = document.querySelector('#quisiste-decir');    // "¿Quisiste decir…?"
  const lista = document.querySelector('#lista-sugerencias');         // <ul> que llenamos
  const sinResultados = document.querySelector('#sin-resultados');    // "No encontramos…"
  const cajaBusqueda = document.querySelector('#busqueda');

  // Si falta alguna pieza (por ejemplo, en recursos.html), no hacemos nada.
  if (!buscador || !panel || !lista) return;

  // ---------------------------------------------------------
  // PASO 3. NORMALIZAR: "Cartón", "CARTON" y "carton" se vuelven "carton".
  // normalize('NFD') separa la tilde de la letra y luego la borramos.
  // ---------------------------------------------------------
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')  // quita tildes y diéresis
      .replace(/#/g, ' ')               // "#5" se busca como "5"
      .replace(/[^a-z0-9ñ/ ]/g, ' ')    // signos raros → espacio
      .replace(/\s+/g, ' ')             // varios espacios → uno
      .trim();
  }

  // Preparamos una sola vez las palabras de cada material para buscar rápido.
  MATERIALES.forEach(function (material) {
    material.palabrasNombre = normalizar(material.nombre + ' ' + material.otros.join(' ')).split(' ');
    material.palabrasCodigo = normalizar(material.codigo + ' ' + material.categoria).split(' ');
  });

  // Lista de códigos cortos válidos ("pp", "ps", "fe", "5"...) para aceptarlos con menos de 3 letras.
  const CODIGOS_CORTOS = [];
  MATERIALES.forEach(function (material) {
    normalizar(material.codigo).split(' ').forEach(function (parte) {
      if (!CODIGOS_CORTOS.includes(parte)) CODIGOS_CORTOS.push(parte);
    });
  });

  // ---------------------------------------------------------
  // PASO 4. COINCIDENCIA EXACTA: cada palabra escrita debe ser el
  // comienzo de alguna palabra del material ("bot" → "botella").
  // Los números se comparan completos para que "#4" no muestre "#41".
  // Devuelve un puntaje (menor = mejor) o -1 si no coincide.
  // ---------------------------------------------------------
  function puntajeExacto(material, palabrasBuscadas) {
    let puntaje = 0;
    for (const palabra of palabrasBuscadas) {
      const esNumero = /^\d+$/.test(palabra);
      const coincide = function (p) { return esNumero ? p === palabra : p.startsWith(palabra); };

      if (material.palabrasNombre[0] && coincide(material.palabrasNombre[0])) {
        puntaje += 0;            // empieza igual que el nombre: lo mejor
      } else if (material.palabrasNombre.some(coincide)) {
        puntaje += 1;            // otra palabra del nombre o un sinónimo
      } else if (material.palabrasCodigo.some(coincide)) {
        puntaje += 2;            // código o categoría
      } else {
        return -1;               // esta palabra no está: no coincide
      }
    }
    return puntaje;
  }

  // ---------------------------------------------------------
  // PASO 5. COINCIDENCIA APROXIMADA (errores tipográficos).
  // La "distancia de Levenshtein" cuenta cuántas letras hay que
  // cambiar, agregar o borrar para pasar de una palabra a otra.
  // "boteya" → "botella" = 2 cambios.
  // ---------------------------------------------------------
  function distancia(a, b) {
    // fila[j] guarda la distancia entre las primeras letras de a y de b.
    let fila = [];
    for (let j = 0; j <= b.length; j++) fila[j] = j;

    for (let i = 1; i <= a.length; i++) {
      const nuevaFila = [i];
      for (let j = 1; j <= b.length; j++) {
        const costo = a[i - 1] === b[j - 1] ? 0 : 1;
        nuevaFila[j] = Math.min(
          fila[j] + 1,          // borrar una letra
          nuevaFila[j - 1] + 1, // agregar una letra
          fila[j - 1] + costo   // cambiar una letra
        );
      }
      fila = nuevaFila;
    }
    return fila[b.length];
  }

  // Cuántos errores aceptamos según el largo de la palabra.
  function erroresPermitidos(palabra) {
    if (palabra.length <= 4) return 1;
    if (palabra.length <= 7) return 2;
    return 3;
  }

  // Devuelve la suma de errores o -1 si alguna palabra está demasiado lejos.
  function puntajeAproximado(material, palabrasBuscadas) {
    // Ignoramos palabras cortas como "de" o "la".
    const importantes = palabrasBuscadas.filter(function (p) { return p.length >= 3; });
    if (importantes.length === 0) return -1;

    let total = 0;
    for (const palabra of importantes) {
      let mejor = Infinity;
      material.palabrasNombre.forEach(function (p) {
        // Comparamos con la palabra completa y con su comienzo
        // (así "boteya" también se parece a "botell…").
        mejor = Math.min(mejor, distancia(palabra, p), distancia(palabra, p.slice(0, palabra.length)));
      });
      if (mejor > erroresPermitidos(palabra)) return -1;
      total += mejor;
    }
    return total;
  }

  // ---------------------------------------------------------
  // PASO 6. BUSCAR: devuelve { tipo, materiales }.
  // tipo = 'vacio' | 'corto' | 'exacta' | 'aproximada' | 'ninguna'
  // ---------------------------------------------------------
  function buscar(textoOriginal) {
    const texto = normalizar(textoOriginal);
    if (texto === '') return { tipo: 'vacio', materiales: [] };

    // Menos de 3 letras: solo seguimos si es un código ("pp", "#5", "fe").
    const sinEspacios = texto.replace(/ /g, '');
    if (sinEspacios.length < MINIMO_LETRAS && !CODIGOS_CORTOS.includes(sinEspacios)) {
      return { tipo: 'corto', materiales: [] };
    }

    const palabras = texto.split(' ');

    // 6a. Intentamos primero la coincidencia exacta.
    const exactos = [];
    MATERIALES.forEach(function (material, posicion) {
      const puntaje = puntajeExacto(material, palabras);
      if (puntaje >= 0) exactos.push({ material: material, puntaje: puntaje, posicion: posicion });
    });
    if (exactos.length > 0) {
      return { tipo: 'exacta', materiales: ordenar(exactos) };
    }

    // 6b. Si no hay ninguna, buscamos materiales parecidos.
    const parecidos = [];
    MATERIALES.forEach(function (material, posicion) {
      const puntaje = puntajeAproximado(material, palabras);
      if (puntaje >= 0) parecidos.push({ material: material, puntaje: puntaje, posicion: posicion });
    });
    if (parecidos.length > 0) {
      return { tipo: 'aproximada', materiales: ordenar(parecidos).slice(0, 5) };
    }

    return { tipo: 'ninguna', materiales: [] };
  }

  // Ordena por puntaje; si empatan, respeta el orden original de la lista.
  function ordenar(resultados) {
    resultados.sort(function (a, b) { return a.puntaje - b.puntaje || a.posicion - b.posicion; });
    return resultados.map(function (r) { return r.material; });
  }

  // ---------------------------------------------------------
  // PASO 7. DIBUJAR: crear cada sugerencia con ícono, nombre y código.
  // Usamos createElement + textContent (no innerHTML con el texto del
  // usuario) para que nadie pueda inyectar código en la página.
  // ---------------------------------------------------------

  // Pone <mark> en la parte del nombre que coincide con lo escrito.
  // Funciona porque quitar tildes no cambia la cantidad de letras.
  function nombreResaltado(nombre, textoBuscado) {
    const fuerte = document.createElement('strong');
    const primeraPalabra = normalizar(textoBuscado).split(' ')[0];
    const nombreNormal = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const inicio = primeraPalabra ? nombreNormal.indexOf(primeraPalabra) : -1;

    if (inicio === -1) {
      fuerte.textContent = nombre;
    } else {
      const fin = inicio + primeraPalabra.length;
      const marca = document.createElement('mark');
      marca.textContent = nombre.slice(inicio, fin);
      fuerte.append(nombre.slice(0, inicio), marca, nombre.slice(fin));
    }
    return fuerte;
  }

  function crearSugerencia(material, textoBuscado) {
    const item = document.createElement('li');
    const enlace = document.createElement('a');
    enlace.href = '#' + material.id;              // lleva a la ficha (:target) sin recargar
    enlace.className = 'sugerencia ' + CLASE_CATEGORIA[material.categoria];

    // Ícono de la categoría + insignia con el número de resina.
    const icono = document.createElement('span');
    icono.className = 'icono-sug';
    icono.setAttribute('aria-hidden', 'true');
    icono.innerHTML = '<svg viewBox="0 0 48 48">' + ICONOS[material.categoria] + '</svg>';
    const resina = document.createElement('span');
    resina.className = 'resina';
    resina.textContent = material.codigo.split(' ')[0];   // "#1", "#41"...
    icono.append(resina);

    // Texto: nombre común (negrita) + (código) + categoría.
    const texto = document.createElement('span');
    texto.className = 'texto-sug';
    const codigo = document.createElement('span');
    codigo.className = 'codigo';
    codigo.textContent = '(' + material.codigo + ')';
    const categoria = document.createElement('span');
    categoria.className = 'categoria-sug';
    categoria.textContent = material.categoria;
    texto.append(nombreResaltado(material.nombre, textoBuscado), ' ', codigo, categoria);

    enlace.append(icono, texto);
    enlace.insertAdjacentHTML('beforeend', FLECHA_SVG);
    item.append(enlace);
    return item;
  }

  // Escribe "1 coincidencia" o "3 coincidencias".
  function plural(numero, singular, varios) {
    return numero + ' ' + (numero === 1 ? singular : varios);
  }

  // ---------------------------------------------------------
  // PASO 8. ACTUALIZAR LA INTERFAZ según el resultado de buscar().
  // ---------------------------------------------------------
  function actualizar() {
    const textoBuscado = buscador.value;
    const resultado = buscar(textoBuscado);
    const mostrado = '«' + textoBuscado.trim() + '»';

    // El botón × solo aparece cuando hay algo escrito.
    botonLimpiar.hidden = textoBuscado === '';

    // Empezamos con todo oculto y vacío; luego mostramos lo que toque.
    lista.replaceChildren();
    quisisteDecir.hidden = true;
    quisisteDecir.replaceChildren();
    panel.hidden = true;
    sinResultados.hidden = true;
    cajaBusqueda.classList.remove('busqueda-aproximada', 'busqueda-sin-resultados');

    if (resultado.tipo === 'vacio') {
      contador.textContent = '';
      return;
    }
    if (resultado.tipo === 'corto') {
      contador.textContent = 'Sigue escribiendo… las sugerencias aparecen desde el tercer carácter.';
      return;
    }
    if (resultado.tipo === 'ninguna') {
      contador.textContent = '0 coincidencias para ' + mostrado + '.';
      sinResultados.hidden = false;
      cajaBusqueda.classList.add('busqueda-sin-resultados');
      return;
    }

    // Hay materiales que mostrar (exactos o aproximados).
    resultado.materiales.forEach(function (material) {
      lista.append(crearSugerencia(material, resultado.tipo === 'exacta' ? textoBuscado : ''));
    });
    panel.hidden = false;

    if (resultado.tipo === 'exacta') {
      // TRANSPARENCIA: número real de coincidencias de los 27 materiales.
      contador.textContent = plural(resultado.materiales.length, 'coincidencia', 'coincidencias') +
        ' de ' + MATERIALES.length + ' materiales para ' + mostrado + '.';
      tituloPanel.textContent = 'Sugerencias';
    } else {
      // RECUPERACIÓN ANTE ERRORES: proponemos el material más parecido.
      const mejor = resultado.materiales[0];
      const enlace = document.createElement('a');
      enlace.href = '#' + mejor.id;
      enlace.textContent = mejor.nombre;
      quisisteDecir.append('¿Quisiste decir: ', enlace, '?');
      quisisteDecir.hidden = false;

      contador.textContent = '0 coincidencias exactas para ' + mostrado + ' · ' +
        plural(resultado.materiales.length, 'material parecido', 'materiales parecidos') + '.';
      // Texto extra solo para lectores de pantalla (en pantalla ya se ve en el recuadro).
      const aviso = document.createElement('span');
      aviso.className = 'visualmente-oculto';
      aviso.textContent = ' ¿Quisiste decir: ' + mejor.nombre + '?';
      contador.append(aviso);
      tituloPanel.textContent = 'Materiales parecidos';
      cajaBusqueda.classList.add('busqueda-aproximada');
    }
  }

  // ---------------------------------------------------------
  // PASO 9. CONTROL DEL USUARIO: limpiar la búsqueda.
  // ---------------------------------------------------------
  function limpiar() {
    buscador.value = '';
    actualizar();       // oculta sugerencias, contador y botón ×
    buscador.focus();   // el usuario puede volver a escribir de inmediato
  }

  // Lleva el foco a la ficha elegida (útil con lector de pantalla y teclado).
  // La navegación #m-... la hace el propio enlace: no se recarga la página.
  function irAFicha(enlace) {
    const ficha = document.querySelector(enlace.hash);
    if (!ficha) return;
    panel.hidden = true;               // la ficha ya aparece debajo
    setTimeout(function () {           // esperamos a que cambie la URL (#m-...)
      ficha.setAttribute('tabindex', '-1');
      ficha.focus({ preventScroll: true });
    }, 0);
  }

  // ---------------------------------------------------------
  // PASO 10. EVENTOS
  // ---------------------------------------------------------

  // 10a. input: cada vez que el texto cambia (teclado, pegar, dictado por voz del celular).
  buscador.addEventListener('input', actualizar);

  // 10b. focus: si vuelve al campo con texto, mostramos de nuevo las sugerencias.
  buscador.addEventListener('focus', function () {
    if (buscador.value !== '' && panel.hidden) actualizar();
  });

  // 10c. Clic en el botón ×.
  botonLimpiar.addEventListener('click', limpiar);

  // 10d. Teclas dentro del campo.
  buscador.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      evento.preventDefault();         // evitamos el borrado propio del navegador
      limpiar();
    } else if (evento.key === 'ArrowDown') {
      // Flecha abajo: bajar a la primera sugerencia.
      const primera = panel.querySelector('a');
      if (!panel.hidden && primera) {
        evento.preventDefault();
        primera.focus();
      }
    } else if (evento.key === 'Enter') {
      // Enter: abrir la primera sugerencia (o la del "¿Quisiste decir?").
      const primera = panel.hidden ? null : panel.querySelector('#quisiste-decir:not([hidden]) a, .lista-sugerencias a');
      if (primera) {
        evento.preventDefault();
        primera.click();
      }
    }
  });

  // 10e. Teclas dentro del panel: flechas para moverse, Escape para limpiar.
  panel.addEventListener('keydown', function (evento) {
    const enlaces = Array.from(panel.querySelectorAll('#quisiste-decir:not([hidden]) a, .lista-sugerencias a'));
    const actual = enlaces.indexOf(document.activeElement);

    if (evento.key === 'Escape') {
      evento.preventDefault();
      limpiar();
    } else if (evento.key === 'ArrowDown' && actual !== -1) {
      evento.preventDefault();
      (enlaces[actual + 1] || enlaces[actual]).focus();
    } else if (evento.key === 'ArrowUp' && actual !== -1) {
      evento.preventDefault();
      if (actual === 0) buscador.focus();   // desde la primera, volvemos al campo
      else enlaces[actual - 1].focus();
    }
  });

  // 10f. Clic en una sugerencia: ir a su ficha (delegación de eventos).
  panel.addEventListener('click', function (evento) {
    const enlace = evento.target.closest('a');
    if (enlace && enlace.hash.startsWith('#m-')) irAFicha(enlace);
  });

  // 10g. Atajo global "/": enfocar el buscador desde cualquier parte de la página.
  // No se activa si la persona está escribiendo en otro campo (por ejemplo, la calculadora).
  document.addEventListener('keydown', function (evento) {
    if (evento.key !== '/' || evento.ctrlKey || evento.metaKey || evento.altKey) return;
    const activo = document.activeElement;
    const escribiendo = activo && (activo.matches('input, textarea, select') || activo.isContentEditable);
    if (escribiendo) return;

    evento.preventDefault();             // que no se escriba "/" en el campo
    seccionBuscar.scrollIntoView();      // respeta scroll-margin-top del encabezado sticky
    buscador.focus({ preventScroll: true });
    buscador.select();                   // si ya había texto, se reemplaza al escribir
  });

  // PASO 11. Estado inicial (por si el navegador recordó un texto escrito).
  actualizar();
})();
