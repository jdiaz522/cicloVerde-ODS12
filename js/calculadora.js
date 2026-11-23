// =========================================================
// CicloVerde · ODS 12 · HU-06 · Calculadora "Mi consumo de descartables"
// El usuario escribe cuántos descartables usa en una semana y la página
// muestra el total semanal, el total anual (semana × 52) y cuál le
// conviene reducir primero, con un consejo y un enlace a su ficha.
// Archivo separado de menu.js. Se vincula en index.html con defer.
// =========================================================

// Nota: menu.js y este archivo son scripts clásicos y comparten los mismos
// nombres globales. Por eso aquí se usan nombres distintos (formCalculadora, etc.).

// PASO 1. Datos de cada descartable. La clave coincide con data-tipo del HTML.
// Cada enlace abre la ficha del material en "Encuentra dónde reciclar" (HU-01).
const DESCARTABLES = {
  bolsas: {
    nombre: 'bolsas plásticas',
    consejo: 'Lleva una bolsa de tela o una mochila cada vez que salgas a comprar.',
    enlace: '#m-bolsa-plastico'
  },
  botellas: {
    nombre: 'botellas descartables',
    consejo: 'Usa un tomatodo y rellénalo en casa, en la universidad o en el trabajo.',
    enlace: '#m-botella-bebida'
  },
  envases: {
    nombre: 'envases de delivery',
    consejo: 'Cuando recojas tu pedido, lleva tu propio táper o prefiere locales que no usen tecnopor.',
    enlace: '#m-taper-comida'
  },
  cubiertos: {
    nombre: 'cubiertos descartables',
    consejo: 'Marca la opción "sin cubiertos" al pedir delivery y usa los de tu casa.',
    enlace: '#m-cubiertos-descartables'
  }
};
const SEMANAS_POR_ANIO = 52;
const CANTIDAD_MAXIMA = 999;

// PASO 2. DOM: localizar el formulario, sus campos y las zonas del resultado.
const formCalculadora = document.querySelector('#form-calculadora');
const camposCalculadora = formCalculadora.querySelectorAll('input[type="number"]');
const resultadoVacio = document.querySelector('#resultado-vacio');   // mensaje inicial o de corrección
const resultadoDatos = document.querySelector('#resultado-datos');   // totales, barras y consejo
const resultadoCero = document.querySelector('#resultado-cero');     // felicitación (consumo cero)
const totalSemana = document.querySelector('#total-semana');
const totalAnio = document.querySelector('#total-anio');
const consejoTitulo = document.querySelector('#consejo-titulo');
const consejoTexto = document.querySelector('#consejo-texto');
const consejoEnlace = document.querySelector('#consejo-enlace');

// PASO 3. Mostrar u ocultar el mensaje de error de un campo.
// Cambia una clase (CSS pinta el borde), aria-invalid y el texto del mensaje.
function mostrarError(campo, mensaje) {
  const textoError = document.querySelector('#error-' + campo.dataset.tipo);
  campo.classList.add('campo-error');
  campo.setAttribute('aria-invalid', 'true');
  textoError.textContent = mensaje;
  textoError.hidden = false;
}

function limpiarError(campo) {
  const textoError = document.querySelector('#error-' + campo.dataset.tipo);
  campo.classList.remove('campo-error');
  campo.removeAttribute('aria-invalid');
  textoError.textContent = '';
  textoError.hidden = true;
}

// PASO 4. Validar un campo: debe ser un número entero de 0 a 999.
// Devuelve true si es válido y false si no lo es.
function validarCampo(campo) {
  const texto = campo.value.trim();
  const numero = Number(texto);

  if (texto === '') {
    mostrarError(campo, 'Escribe un número (0 si no usas ninguno).');
    return false;
  }
  if (!Number.isInteger(numero) || numero < 0 || numero > CANTIDAD_MAXIMA) {
    mostrarError(campo, 'Ingresa un número entero de 0 a ' + CANTIDAD_MAXIMA + '.');
    return false;
  }
  limpiarError(campo);
  return true;
}

// PASO 5. Mostrar solo uno de los tres estados del resultado: "vacio", "datos" o "cero".
function mostrarEstado(estado) {
  resultadoVacio.hidden = estado !== 'vacio';
  resultadoDatos.hidden = estado !== 'datos';
  resultadoCero.hidden = estado !== 'cero';
}

// Une nombres en una frase: ["a"] → "a", ["a", "b"] → "a y b", ["a", "b", "c"] → "a, b y c".
function unirNombres(lista) {
  if (lista.length === 1) return lista[0];
  return lista.slice(0, -1).join(', ') + ' y ' + lista[lista.length - 1];
}

// PASO 6. Evento submit: ocurre al hacer clic en "Calcular" o al presionar Enter en un campo.
formCalculadora.addEventListener('submit', function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  // 6a. Validar los cuatro campos y guardar las cantidades válidas.
  const cantidades = {};
  let primerCampoConError = null;
  camposCalculadora.forEach(function (campo) {
    if (validarCampo(campo)) {
      cantidades[campo.dataset.tipo] = Number(campo.value);
    } else if (primerCampoConError === null) {
      primerCampoConError = campo;
    }
  });

  // Escenario 2: hay datos no válidos → no se muestra ningún resultado.
  if (primerCampoConError !== null) {
    resultadoVacio.textContent = 'Corrige los campos marcados para ver tu resultado.';
    mostrarEstado('vacio');
    primerCampoConError.focus();
    return;
  }

  // 6b. Calcular el total de la semana.
  const tipos = Object.keys(cantidades);
  let total = 0;
  tipos.forEach(function (tipo) {
    total = total + cantidades[tipo];
  });

  // Escenario 3: no usa ningún descartable → felicitación e invitación al taller.
  if (total === 0) {
    mostrarEstado('cero');
    return;
  }

  // Escenario 1: escribir los totales (semana y año).
  totalSemana.textContent = total;
  totalAnio.textContent = total * SEMANAS_POR_ANIO;

  // 6c. Buscar el descartable más usado (puede haber empate).
  const mayor = Math.max(...Object.values(cantidades));
  const tiposMayores = tipos.filter(function (tipo) {
    return cantidades[tipo] === mayor;
  });

  // 6d. Actualizar cada barra: ancho proporcional, texto y resaltado del mayor.
  tipos.forEach(function (tipo) {
    const fila = document.querySelector('#fila-' + tipo);
    const cantidad = cantidades[tipo];
    fila.querySelector('.barra-relleno').style.width = (cantidad / mayor) * 100 + '%';
    fila.querySelector('.barra-valor').textContent =
      cantidad + ' por semana · ' + cantidad * SEMANAS_POR_ANIO + ' al año';
    fila.classList.toggle('mayor', tiposMayores.includes(tipo));
  });

  // 6e. Consejo para el descartable más usado y enlace a su ficha en el buscador.
  const nombresMayores = tiposMayores.map(function (tipo) {
    return DESCARTABLES[tipo].nombre;
  });
  consejoTitulo.textContent = 'Empieza por reducir: ' + unirNombres(nombresMayores);
  consejoTexto.textContent = tiposMayores.map(function (tipo) {
    return DESCARTABLES[tipo].consejo;
  }).join(' ');
  consejoEnlace.href = DESCARTABLES[tiposMayores[0]].enlace;
  consejoEnlace.textContent = 'Ver dónde reciclar ' + DESCARTABLES[tiposMayores[0]].nombre;

  mostrarEstado('datos');
});

// PASO 7. Evento input: cuando el usuario corrige un campo marcado, se vuelve a validar
// en ese momento (un solo evento en el formulario sirve para los cuatro campos).
formCalculadora.addEventListener('input', function (evento) {
  if (evento.target.classList.contains('campo-error')) {
    validarCampo(evento.target);
  }
});

// PASO 8. Evento reset: el botón "Limpiar" borra los datos, los errores y el resultado.
formCalculadora.addEventListener('reset', function () {
  camposCalculadora.forEach(limpiarError);
  resultadoVacio.textContent = 'Aquí aparecerá tu resultado.';
  mostrarEstado('vacio');
});
