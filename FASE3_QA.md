# GENESIS CHALLENGE — Registro QA Fase 3

Fecha: 2026-10-31
Raíz probada: `C:\Users\seral\OneDrive\Desktop\GENESIS_RC1_REFERIDOS_TEST`
Alcance: correcciones locales. No se publicó ni se hizo push. No se instalaron dependencias.

## Cambios

- `index.html`: portada centrada antes de la moneda; paneles laterales aparecen al entrar; Memo queda bloqueado hasta terminar Sudoku; Memo conserva las posiciones; Sudoku progresa por cuatro niveles con validación contra su solución; Sopa de Letras usa la cuadrícula cuadrada del motor existente. Se conservaron los tonos/volumen de SIMON ya presentes en el archivo inicial de esta fase.
- `MANIFIESTO_SHA256.txt`: separado en hashes activos, hashes iniciales pre-Fase 3, respaldo rotativo e históricos.
- `motor-genesis.browser.js`, `diamond-security/diamond-unbunker.js` y `genesis-referrals.demo.js`: sin cambios.
- `index.html.beta-fix.bak`: respaldo rotativo actualizado antes de las tandas de edición. Los backups históricos no se alteraron.

## Pruebas ejecutadas en navegador local

- Carga final: `index.html`, `motor-genesis.browser.js`, `diamond-security/diamond-unbunker.js` y `genesis-referrals.demo.js` devolvieron HTTP 200. `favicon.ico` devolvió 404; no hubo otros errores de red observados.
- Consola JavaScript: sin errores ni advertencias durante la carga y las pruebas.
- Portada: primera vista `home`; ajustes laterales ocultos hasta tocar la moneda; Memo bloqueado en una sesión nueva.
- SIMON: vista iniciada con cuatro pads. Una entrada de prueba en la fase de respuesta generó el feedback de error y reinicio; la vista respondió sin excepciones. Sonido pasó de activado a silenciado y volvió a activado; el control mantuvo ARIA sincronizado. Volumen inicial observado: 100 %.
- Sudoku: cuatro tableros 9×9 generados con 45, 40, 35 y 30 pistas. Resolví cada nivel desde sus casillas visibles; el siguiente se habilitó solo tras resolver el anterior. Memo se desbloqueó al completar el cuarto. Un duplicado en la fila fue rechazado; “Comprobar” diferenció esa jugada de una cuadrícula válida pero incompleta. Se verificó que el progreso siguió disponible después de recargar la misma pestaña.
- Memo: 12 fichas; una pareja incorrecta se ocultó tras la demora, sin marcar aciertos. Una pareja correcta quedó visible y marcada en los mismos índices; la cantidad de fichas siguió en 12.
- Sopa de Letras: 144 casillas cuadradas (12×12), cero elementos hexagonales en el tablero activo. Se seleccionó DIAMANTE por una trayectoria recta y se marcó como encontrada.
- Servidor temporal local cerrado después de las pruebas. No se guardaron capturas como archivos.

## Pendientes y límites comprobados

- No están en la carpeta del proyecto `GENESIS_MEMO_GOTA_OPTIMIZADA.mp3`, `GENESIS_MEMO_TAPITA_OPTIMIZADA.mp3` ni `GENESIS_SONIDOS_OPTIMIZADOS.zip`. La interfaz conserva sus tonos sintéticos actuales; los dos MP3 requeridos no se pudieron integrar. Copiar los recursos desde el ZIP al proyecto para completar esa integración, sin adivinar rutas.
- Esta base no contiene manifiesto PWA, service worker ni endpoint de versión/actualización. No hay origen de actualización central contra el que validar una actualización segura; queda pendiente definir/publicar ese mecanismo. No se añadió una caché de service worker sin poder probar su actualización en el hosting.
- El volumen de SIMON está ajustado en el código existente y se conserva. La evaluación realizada verifica el estado de la interfaz y la ejecución sin errores; no mide SPL acústico del dispositivo.

## Integridad

Hashes SHA-256 activos, iniciales y de respaldos: ver `MANIFIESTO_SHA256.txt`. Los hashes históricos observados permanecen intactos.

## Adenda Fase 3B — GENESIS MATRIX y PWA de prueba

Fecha: 2026-10-31. Raíz: `C:\Users\seral\OneDrive\Desktop\GENESIS_RC1_REFERIDOS_TEST`. Build local: `0.4.0-test`. Esta adenda prevalece sobre las descripciones de la Sopa y PWA escritas antes de esta fase. No se publicaron cambios en este registro de pruebas.

### Cambios implementados

- `motor-genesis.browser.js`: se añadió `generateWordMatrix`. El cambio de motor fue necesario porque las API existentes solo generaban un tablero cuadrado y permitían solapar palabras, incompatible con dimensiones rectangulares y letras consumibles. Se conservaron sin alteraciones `generateWordSearch` y `generateHexWordSearch` (histórico de 30 celdas).
- `index.html`: cuatro matrices: 6×10 (3 palabras), 6×12 (4), 12×12 (7) y 10×20 (10); búsqueda horizontal, vertical y diagonal en ambos sentidos; no hay solapamiento; letras halladas quedan consumidas/bloqueadas; cuenta errores, progreso y puntaje por longitud con multiplicador de dificultad. Al tercer error se genera una ronda completa nueva y se informa “TERCER ERROR”.
- Los objetivos deben tener al menos dos sílabas según el contador español existente y se filtran símbolos químicos; las casillas libres usan mezcla aleatoria con objetivo de 42 % de vocales.
- `index.html` y `service-worker.js`: se añadió parámetro de versión en las URLs de scripts para impedir que un shell nuevo reutilice un motor viejo desde caché. La actualización se difiere al volver al menú o reiniciar, no durante una partida.
- PWA marcada `0.4.0-test`; `MANIFIESTO_SHA256.txt` identifica hashes vigentes, estado inicial, históricos y backup rotativo.

### Pruebas ejecutadas

- Motor de matriz: 100 rondas por cada dimensión (400 en total). Se comprobaron cantidad/dimensiones, trayectorias, límites, reglas de palabra, ausencia de solapamientos y balance de vocales. Se observaron las ocho orientaciones en los cuatro tamaños. Media de vocales por tamaño: 43,8 %, 44,2 %, 44,1 % y 44,1 %.
- Compatibilidad: el generador hexagonal histórico sigue devolviendo sus 30 celdas.
- Navegador local: build 0.4.0 cargado con el motor actualizado en un origen limpio. Se completaron los siete objetivos de una matriz 12×12 mediante clics; estado final 7/7, 0/3 errores y 117 puntos; 39 celdas consumidas, igual a la suma de longitudes.
- Interfaz 6×10, 6×12 y 10×20: se validó un total de 60, 72 y 200 celdas respectivamente, y se resolvió al menos un objetivo en cada tamaño sin error, con las casillas consumidas equivalentes a la longitud. En una prueba 10×20 se resolvieron cinco de diez objetivos antes de exceder el tiempo de la herramienta; la cobertura de caminos de las cuatro matrices está demostrada por 100 rondas automatizadas por tamaño, pero no afirmo haber completado toda la ronda 10×20 por clics.
- Errores: se provocaron tres selecciones inválidas desde una casilla ajena a prefijos/sufijos de objetivos. El tercero mostró “TERCER ERROR”, cambió la firma de las 200 letras, renovó objetivos y reinició el contador a 0/3, conservando el puntaje acumulado.
- Regresión previa de Sudoku/Memo/SIMON: ver las pruebas originales de este registro. La matriz no modifica sus funciones; no se repitió aquí la resolución interactiva completa de Sudoku ni las secuencias de SIMON.
- Una pestaña anterior controlada por caché mostró el error real `generateWordMatrix is not a function` al combinar HTML nuevo y motor guardado. En origen limpio funcionó. Se añadió versionado a las URLs de script; falta revalidar esa corrección en ciclo completo de update sobre un SW previo.

### Diferencia de diseño para testers

- El método histórico de 30 fichas conserva 6 lados de 5 letras y ubica palabras en secuencias contiguas del recorrido cíclico perimetral. Su generador permanece en el motor; el módulo activo usa MATRIX.
- MATRIX incorpora grilla rectangular de cuatro tamaños, ocho direcciones y casillas bloqueadas tras encontrar cada palabra. En el tercer error mezcla la matriz entera. Probar 12×12 contra el recuerdo del tablero de 30 fichas y registrar preferencia, legibilidad, dificultad y control percibido.

### Límites pendientes

- No se localizaron `GENESIS_MEMO_GOTA_OPTIMIZADA.mp3`, `GENESIS_MEMO_TAPITA_OPTIMIZADA.mp3` ni `GENESIS_SONIDOS_OPTIMIZADOS.zip`; Memo conserva audio sintético. Copiar MP3 desde el paquete al proyecto para integrarlos, sin inventar rutas.
- No se verificó instalación nativa ni Android físico. Manifest, recursos locales, registro SW, carga offline y aplicación diferida a menú/reinicio se probaron en ciclo 0.3.x; actualización 0.4.0 con scripts versionados requiere validación en hosting con un SW anterior.
- Publicación GitHub Pages e instalación Android real con persistencia/actualización siguen pendientes. Esta entrega no se considera estable.
- Volumen acústico real no medido; se verifica control software y volumen al 100 %, no nivel SPL del dispositivo.

### Validación adicional 0.4.0-test

- Validación con la página servida en `localhost`: manifest JSON y referencias de iconos parsean y existen. La carga de build muestra `PWA lista · versión 0.4.0-test`.
- Tras instalar/cargar el shell 0.4.0-test, se detuvo el servidor temporal y se recargó desde la caché administrada por el service worker. La página volvió a abrir offline y Sopa generó las 144 casillas de MATRIX; consola de esa pestaña sin errores/advertencias.
- La pestaña previa que mezcló recursos pertenecía a una sesión de caché antigua; no se borró la caché del usuario. El query-string de build ahora diferencia cada motor, seguridad y referidos en el cache. La activación diferida por menú/reinicio se había verificado en transición 0.3.2→0.3.3; queda repetir la transición 0.3.x→0.4.0 en hosting/Android.
- Los botones de instalación y el diálogo nativo no se probaron porque el navegador integrado no expone la instalación nativa. Prueba pendiente en navegador compatible/Android.

### Corrección de caché y validación 0.4.1-test

- El HTML `.4.0` previamente instalado se mantuvo desde la caché aun después de cambios hechos sin cambiar la versión. Para invalidarlo de manera verificable, el build se incrementó a `0.4.1-test`; backup rotativo actualizado antes de cambiar `index.html`.
- Con una sesión local `.4.0` abierta en Sopa 12×12, se sirvió `.4.1` y se pulsó “BUSCAR ACTUALIZACIONES”. El aviso apareció mientras seguían visibles el tablero, los 7 objetivos y el estado de ronda; el badge continuó `.4.0`, sin interrupción ni error.
- Al pulsar reiniciar (punto de actualización segura), la pestaña volvió al menú y mostró `.4.1-test`. La vista nueva tenía encabezado “GENESIS MATRIX” y botón “NUEVA MATRIZ”.
- Se detuvo el servidor y se recargó `.4.1` offline: el encabezado y botón nuevos aparecieron, PWA reportó lista `.4.1`, y al entrar a MATRIX se generaron 144 celdas. Consola del navegador sin errores/advertencias. Esto verifica la invalidación/carga del shell local `.4.1` y recursos con query versionado.
- La limpieza de cachés antiguas está implementada en el evento `activate` del SW. No se inspeccionó directamente el inventario interno de cachés; el flujo de actualización y carga offline sí se ejecutaron.
- Esta build no fue instalada en Chrome/Android como app nativa; queda pendiente el diálogo real de instalación y el ciclo publicado en GitHub Pages.

### Regresión documentada de módulos preservados

- Sudoku: en navegador local se resolvieron los cuatro niveles y el progreso se conservó tras recargar la misma pestaña. Duplicados se rechazaron en fila/columna/bloque; una cuadrícula incompleta y una inválida dieron estados diferentes. Niveles 9×9 con 45/40/35/30 pistas.
- Memo: se probó pareja incorrecta (ocultamiento tras espera) y pareja correcta (queda visible en su índice original); el tablero mantuvo 12 fichas. El desbloqueo tras Sudoku 4/4 se vio en la navegación. El estudio de percepción con testers humanos queda preparado en `GUIA_TESTERS.md`, todavía no ejecutado.
- SIMON: se completaron secuencias correctas de rondas 1 y 2, avance de ronda, error intencional y reinicio. Los cuatro pads emitieron su tono/feedback de entrada; se verificaron mute y reactivación, volumen inicial 100 %. Tonos de software: 392/523/659/784 Hz; no se midió nivel acústico en dispositivo.
- Los módulos de motor, referidos y seguridad DIAMOND no recibieron modificaciones aparte del nuevo método aditivo en el motor GENESIS.
