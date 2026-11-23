// =========================================================
// CicloVerde · ODS 12 · Menú responsive con JavaScript
// Adaptado del ejemplo ACME entregado por el docente (semana 11).
// HTML define el botón y la navegación, CSS decide cómo se ven
// en escritorio y en celular, y este archivo responde a los eventos.
// =========================================================

// PASO 1. DOM: localizar los elementos del HTML usando sus identificadores.
const botonMenu = document.querySelector('#boton-menu');   // botón hamburguesa
const navegacion = document.querySelector('#navegacion');  // <nav> con los enlaces
const textoMenu = document.querySelector('#texto-menu');   // texto "Menú" / "Cerrar"
const submenu = document.querySelector('#actuar');         // <details> "Actuar" (en ACME era #resolver)
const marca = document.querySelector('.marca');            // logotipo CicloVerde

// PASO 2. Usar exactamente el mismo límite que la media query del CSS (600 px).
const pantallaMovil = window.matchMedia('(max-width: 600px)');

// PASO 3. Una función concentra los cambios para abrir o cerrar el menú.
function cambiarMenu(abrir) {
  // En escritorio la navegación siempre está visible; en celular depende de "abrir".
  navegacion.hidden = pantallaMovil.matches && !abrir;
  botonMenu.setAttribute('aria-expanded', String(abrir));
  botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  textoMenu.textContent = abrir ? 'Cerrar' : 'Menú';

  // Si cerramos el menú principal, cerramos también el desplegable "Actuar".
  if (!abrir) {
    submenu.open = false;
  }
}

// CAMBIO respecto a ACME: nuestros enlaces son "index.html#buscar" (no "#buscar")
// para que también funcionen desde recursos.html y confirmacion.html.
// Esta función compara rutas ignorando "index.html" (en GitHub Pages "/" e
// "/index.html" son la misma página).
function rutaSinIndex(ruta) {
  return ruta.replace(/index\.html$/, '');
}

// PASO 4. Evento clic en la hamburguesa: invertir el estado del botón.
// Un <button> nativo también produce clic con Enter o la barra espaciadora.
botonMenu.addEventListener('click', function () {
  const estaAbierto = botonMenu.getAttribute('aria-expanded') === 'true';
  cambiarMenu(!estaAbierto);
});

// PASO 5. Cerrar el menú al seleccionar cualquiera de sus enlaces.
// Un solo evento en <nav> sirve para todos los enlaces (delegación de eventos).
navegacion.addEventListener('click', function (evento) {
  const enlace = evento.target.closest('a');
  if (!enlace) return; // clic en "Actuar" (summary): no es un enlace

  cambiarMenu(false);

  // Si el destino está en esta misma página, llevar el foco a esa sección.
  // El enlace conserva su navegación normal (cambia la URL y baja hasta la sección).
  const mismaPagina = rutaSinIndex(enlace.pathname) === rutaSinIndex(window.location.pathname);
  const destino = mismaPagina && enlace.hash ? document.querySelector(enlace.hash) : null;
  if (destino) {
    destino.focus({ preventScroll: true });
  }
});

// El logotipo regresa al inicio: también cierra la navegación.
marca.addEventListener('click', function () {
  cambiarMenu(false);
});

// PASO 6. Escape cierra el menú móvil y devuelve el foco al botón.
document.addEventListener('keydown', function (evento) {
  if (evento.key !== 'Escape') return;

  if (pantallaMovil.matches && !navegacion.hidden) {
    cambiarMenu(false);
    botonMenu.focus();
  } else if (submenu.open) {
    // En escritorio solo se cierra el desplegable "Actuar".
    submenu.open = false;
    submenu.querySelector('summary').focus();
  }
});

// PASO 7. Evitar estados incorrectos al pasar de celular a escritorio (o al revés).
function ajustarPantalla() {
  const focoEstabaEnNavegacion = navegacion.contains(document.activeElement);
  const focoEstabaEnBoton = document.activeElement === botonMenu;
  cambiarMenu(false);

  if (pantallaMovil.matches && focoEstabaEnNavegacion) {
    botonMenu.focus();
  } else if (!pantallaMovil.matches && focoEstabaEnBoton) {
    navegacion.querySelector('a').focus();
  }
}
pantallaMovil.addEventListener('change', ajustarPantalla);

// PASO 8. Estado inicial: cerrado en celular y visible en escritorio.
ajustarPantalla();
