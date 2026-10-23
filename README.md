# Princesas Disney · Plantilla editable

Abre index.html en un navegador o publica esta carpeta completa con GitHub Pages. No requiere instalación ni compilación.

## Personalizar

Edita **datos.js**. Allí cambias nombre, edad, fecha, hora, zona horaria, lugar, Google Maps, contactos, fotografías y textos. Es el único archivo que necesitas editar para los datos del festejo; los textos y el calendario se actualizan al recargar.

portada.imagenes contiene la imagen principal del tema (tres imágenes en Plaza Sésamo). También puede modificarse desde datos.js.

Para cambiar las fotos, añade tus archivos a assets/ y modifica fotos[].src. posicion permite ajustar el encuadre, por ejemplo «50% 30%».

Los valores actuales son ficticios: Isabella, 5 años. Los teléfonos están vacíos y modoDemo es true. La confirmación abre una vista de ejemplo sin enviar mensajes. Para usar WhatsApp, configura los números y cambia modoDemo a false. No hay conexión a un registro de invitados externo.

Las imágenes de los personajes que se sirven desde fuentes externas necesitan Internet. Las tres imágenes temáticas y las fuentes sí se incluyen localmente. Consulta CREDITOS.md.


## Escenario y galería

Esta edición incluye tres imágenes temáticas locales. `fotos` controla la galería; `ambientacion.src` y `ambientacion.alt` controlan el paisaje o escenario. Puedes reemplazarlos por archivos dentro de assets/. `textos` también permite editar los titulares del escenario, fecha, ubicación y confirmación.

Publicación independiente: copia **todo el contenido de esta carpeta**, incluido assets/ y .nojekyll, a tu repositorio. Activa GitHub Pages desde main / (root). Mantén las rutas relativas para poder publicar también en una subcarpeta.
