# GENESIS CHALLENGE — Guía breve de pruebas

Build: **RC1 · 0.4.1-test**. Uso local para testers; todavía no representa una versión estable.

## Recorrido sugerido

1. Abrí `index.html` desde un servidor local. Observá la portada antes de tocar la moneda. Entrá al menú con la moneda FREAKCOIN y anotá si entendiste qué hacer y cómo volver al menú.
2. Probá SIMON: iniciar, repetir una secuencia, equivocarte, reiniciar, llegar a una ronda posterior y probar los cuatro pads. Activá/desactivá sonido y volumen. El estado inicial esperado es sonido activado y volumen 100 %.
3. Probá Sudoku: completá los cuatro niveles 9×9. Revisá un duplicado por fila, columna y bloque, una cuadrícula incompleta y una solución correcta. El siguiente nivel solo debe abrirse al resolver el actual.
4. Después del nivel 4, confirmá que Memo Test se desbloquea. Jugá varias parejas correctas e incorrectas, reiniciá y observá que las fichas no se mueven, los aciertos quedan visibles y los errores se ocultan tras una breve espera.
5. Probá GENESIS MATRIX en cada tamaño: 6×10 (3 objetivos), 6×12 (4), 12×12 (7) y 10×20 (10). Marcá palabras horizontales, verticales y diagonales, también en sentido inverso. Las letras acertadas deben quedar consumidas. Provocá tres errores y revisá el mensaje “TERCER ERROR” y el remezclado de toda la matriz.

## Estudio de desbloqueo Memo

Invitá a una persona que no conozca el flujo. Sin explicarle el requisito, pedile que busque Memo Test y que continúe jugando hasta acceder. Registrá:

- ¿Entendió por qué Memo estaba bloqueado? ¿Qué texto o pista le ayudó?
- ¿Cuánto tardó en completar Sudoku y encontrar Memo?
- Al desbloquearse, ¿sintió que fue una recompensa clara, una sorpresa o una interrupción?
- ¿Quiso continuar con Memo? Puntaje de interés de 1 a 5 y comentario libre.
- ¿Preferiría que el desbloqueo aparezca en la portada, en el menú o dentro de Sudoku?

## Comparación con el diseño histórico de 30 fichas

La versión activa es MATRIX. El motor conserva la variante histórica de 30 fichas: recorrido cíclico por seis lados de cinco letras. No hay un selector para abrir esa variante en esta build. Pedí a testers que comparen sus recuerdos o registros del modo anterior y evalúen claridad, rapidez para localizar palabras, sensación de dificultad y preferencia entre 30 fichas y las grillas actuales. No describir MATRIX como el diseño hexagonal.

## Instalación y actualización PWA

En un servidor HTTPS o `localhost`, verificá el manifiesto, iconos, instalación ofrecida por el navegador y modo sin conexión. Con una partida abierta, serví una build nueva y pulsá **BUSCAR ACTUALIZACIONES**. Confirmá que el juego no se interrumpe y que la actualización se aplica al volver al menú o reiniciar. Reabrí Sudoku y Memo para comprobar persistencia de desbloqueos de sesión.

Pendiente: repetir el ciclo con GitHub Pages y un teléfono Android real; registrar navegador, versión, modo de instalación, conectividad, actualización recibida y estado de progreso. La instalación nativa no se considera verificada por abrir la página desde localhost.

## Registro de observaciones

Tester / dispositivo / navegador: ______________________________

Módulo y dificultad: __________________________________________

Resultado, bloqueos o errores reproducibles: ____________________

Claridad (1–5): ____  Diversión (1–5): ____  Dificultad percibida (1–5): ____

Sugerencia prioritaria: ________________________________________
