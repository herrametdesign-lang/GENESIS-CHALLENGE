"use strict";

class GenesisEngine {
  constructor() {
    this.errors = 0;
    this.previousWordSet = "";
  }

  randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  shuffle(list) {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  normalizeWord(word) {
    return String(word)
      .toLocaleUpperCase("es-AR")
      .replace(/[ÁÀÄ]/g, "A")
      .replace(/[ÉÈË]/g, "E")
      .replace(/[ÍÌÏ]/g, "I")
      .replace(/[ÓÒÖ]/g, "O")
      .replace(/[ÚÙÜ]/g, "U")
      .replace(/[^A-ZÑ]/g, "");
  }

  countSpanishSyllables(word) {
    const strong = new Set(["A", "E", "O"]);
    let syllables = 0;
    let previousVowel = "";
    for (const letter of this.normalizeWord(word)) {
      if (!"AEIOU".includes(letter)) {
        previousVowel = "";
        continue;
      }
      if (!previousVowel || (strong.has(previousVowel) && strong.has(letter))) {
        syllables++;
      }
      previousVowel = letter;
    }
    return syllables;
  }

  // Genera palabras nuevas para cada partida.
  generateWordSearch(wordBank, count = 6, size = 12) {
    if (!Array.isArray(wordBank) || size < 2 || count < 1) {
      throw new Error("Configuración de sopa de letras inválida.");
    }

    const bank = [...new Set(
      wordBank.map(w => this.normalizeWord(w))
        .filter(w => w.length >= 2 && w.length <= size)
    )];

    if (bank.length < count) {
      throw new Error(
        `Se necesitan al menos ${count} palabras válidas de hasta ${size} letras.`
      );
    }

    let candidates = this.shuffle(bank);
    let chosen = candidates.slice(0, count);
    let key = [...chosen].sort().join("|");

    // Evita repetir el conjunto completo de la partida anterior.
    if (key === this.previousWordSet) {
      candidates = this.shuffle(bank.filter(w => !chosen.includes(w)));
      if (candidates.length >= count) {
        chosen = candidates.slice(0, count);
        key = [...chosen].sort().join("|");
      } else {
        // Si el banco es pequeño, permite reutilizar palabras,
        // pero intenta generar otra combinación.
        chosen = this.shuffle(bank);
        key = [...chosen].slice(0, count).sort().join("|");
      }
    }

    chosen = chosen.slice(0, count).sort((a, b) => b.length - a.length);

    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    for (let attempt = 0; attempt < 100; attempt++) {
      const grid = Array.from(
        { length: size },
        () => Array(size).fill("")
      );
      const placements = [];
      let success = true;

      for (const word of chosen) {
        let placed = false;

        for (let tries = 0; tries < 300 && !placed; tries++) {
          const [dr, dc] = directions[this.randomInt(directions.length)];
          const row = this.randomInt(size);
          const col = this.randomInt(size);
          const endRow = row + dr * (word.length - 1);
          const endCol = col + dc * (word.length - 1);

          if (
            endRow < 0 || endRow >= size ||
            endCol < 0 || endCol >= size
          ) continue;

          let fits = true;
          for (let k = 0; k < word.length; k++) {
            const r = row + dr * k;
            const c = col + dc * k;
            if (grid[r][c] && grid[r][c] !== word[k]) {
              fits = false;
              break;
            }
          }

          if (!fits) continue;

          for (let k = 0; k < word.length; k++) {
            grid[row + dr * k][col + dc * k] = word[k];
          }

          placements.push({
            word, row, col, dr, dc
          });
          placed = true;
        }

        if (!placed) {
          success = false;
          break;
        }
      }

      if (!success) continue;

      const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!grid[r][c]) {
            grid[r][c] = alphabet[this.randomInt(alphabet.length)];
          }
        }
      }

      this.previousWordSet = key;
      return { grid, words: chosen, placements, size };
    }

    throw new Error(
      "No se pudo generar el tablero. Probá con menos palabras o una cuadrícula mayor."
    );
  }

  // Crea seis parejas sólido/contorno listas para presentar como Memo Test.
  generateMemoPairs(figures = ["◆", "●", "▲", "■", "★", "⬟"]) {
    if (!Array.isArray(figures) || figures.length < 2) {
      throw new Error("Memo Test necesita al menos dos figuras.");
    }
    const pairs = figures.flatMap((figure, pairId) => [
      { pairId, figure: String(figure), style: "solid" },
      { pairId, figure: String(figure), style: "outline" }
    ]);
    return this.shuffle(pairs).map((card, index) => ({ ...card, index }));
  }

  // Tablero cíclico de 30 letras, cinco posiciones por cada lado del hexágono.
  // Las palabras se ubican en tramos conectados y el resto se rellena al azar.
  generateHexWordSearch(wordBank, count = 4) {
    const size = 30;
    if (!Array.isArray(wordBank) || !Number.isInteger(count) || count < 1) {
      throw new Error("Configuración de sopa hexagonal inválida.");
    }
    const chemicalSymbols = new Set([
      "HE", "LI", "BE", "NE", "NA", "MG", "AL", "SI", "CL", "AR",
      "CA", "SC", "TI", "CR", "MN", "FE", "CO", "NI", "CU", "ZN",
      "AG", "SN", "AU", "HG", "PB", "BI", "U"
    ]);
    const bank = [...new Set(wordBank.map(word => this.normalizeWord(word))) ]
      .filter(word => word.length >= 3 && word.length <= 12 &&
        this.countSpanishSyllables(word) >= 2 && !chemicalSymbols.has(word));
    const candidates = this.shuffle(bank);
    const words = [];
    let used = 0;
    for (const word of candidates) {
      if (words.length === count) break;
      if (used + word.length + words.length < size) {
        words.push(word);
        used += word.length;
      }
    }
    if (words.length !== count) throw new Error("No hay suficientes palabras para esta dificultad.");

    const letters = Array(size).fill("");
    const placements = [];
    const start = this.randomInt(size);
    let cursor = start;
    for (const word of words) {
      const indices = [];
      for (const letter of word) {
        letters[cursor] = letter;
        indices.push(cursor);
        cursor = (cursor + 1) % size;
      }
      placements.push({ word, indices });
      letters[cursor] = "";
      cursor = (cursor + 1) % size;
    }
    const vowels = "AEIOU";
    const consonants = "BCDFGHJKLMNÑPQRSTVWXYZ";
    for (let i = 0; i < size; i++) {
      if (!letters[i]) {
        const source = Math.random() < 0.38 ? vowels : consonants;
        letters[i] = source[this.randomInt(source.length)];
      }
    }
    return { letters, words, placements, size, sides: 6, cellsPerSide: 5 };
  }

  validateSudoku(board) {
    if (!Array.isArray(board) || board.length !== 9 || board.some(row => !Array.isArray(row) || row.length !== 9)) {
      return { valid: false, complete: false, errors: ["La cuadrícula debe ser de 9 × 9."] };
    }
    const errors = [];
    const validGroup = group => {
      const values = group.filter(value => value !== 0 && value !== "");
      return new Set(values).size === values.length && values.every(value => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 9);
    };
    for (let i = 0; i < 9; i++) {
      if (!validGroup(board[i])) errors.push(`Fila ${i + 1}`);
      if (!validGroup(board.map(row => row[i]))) errors.push(`Columna ${i + 1}`);
    }
    for (let boxRow = 0; boxRow < 3; boxRow++) for (let boxCol = 0; boxCol < 3; boxCol++) {
      const box = [];
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) box.push(board[boxRow * 3 + row][boxCol * 3 + col]);
      if (!validGroup(box)) errors.push(`Bloque ${boxRow + 1}-${boxCol + 1}`);
    }
    const complete = board.every(row => row.every(value => Number(value) >= 1 && Number(value) <= 9));
    return { valid: errors.length === 0, complete, errors };
  }

  // Genera una solución Sudoku válida y luego oculta casillas.
  countSudokuSolutions(board, limit = 2) {
    const findCandidates = (row, col) => {
      const used = new Set();

      for (let i = 0; i < 9; i++) {
        used.add(board[row][i]);
        used.add(board[i][col]);
      }

      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;

      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          used.add(board[r][c]);
        }
      }

      const candidates = [];
      for (let value = 1; value <= 9; value++) {
        if (!used.has(value)) candidates.push(value);
      }
      return candidates;
    };

    const solve = () => {
      let bestRow = -1;
      let bestCol = -1;
      let bestCandidates = null;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] !== 0) continue;

          const candidates = findCandidates(row, col);
          if (candidates.length === 0) return 0;

          if (bestCandidates === null ||
              candidates.length < bestCandidates.length) {
            bestRow = row;
            bestCol = col;
            bestCandidates = candidates;
            if (candidates.length === 1) break;
          }
        }
        if (bestCandidates && bestCandidates.length === 1) break;
      }

      if (bestCandidates === null) return 1;

      let solutions = 0;

      for (const value of bestCandidates) {
        board[bestRow][bestCol] = value;
        solutions += solve();
        board[bestRow][bestCol] = 0;

        if (solutions >= limit) return solutions;
      }

      return solutions;
    };

    return solve();
  }

  // Genera tableros con exactamente una solución.
  generateSudoku(clues = 35) {
    if (!Number.isInteger(clues) || clues < 17 || clues > 81) {
      throw new Error("Las pistas deben estar entre 17 y 81.");
    }

    for (let attempt = 0; attempt < 8; attempt++) {
      const shuffle = arr => this.shuffle(arr);
      const bands = shuffle([0, 1, 2]);
      const rows = bands.flatMap(b =>
        shuffle([0, 1, 2]).map(r => b * 3 + r)
      );

      const stacks = shuffle([0, 1, 2]);
      const cols = stacks.flatMap(s =>
        shuffle([0, 1, 2]).map(c => s * 3 + c)
      );

      const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const solution = rows.map(r =>
        cols.map(c => digits[(r * 3 + Math.floor(r / 3) + c) % 9])
      );

      const puzzle = solution.map(row => [...row]);
      const cells = shuffle(
        Array.from({ length: 81 }, (_, i) => i)
      );

      let remaining = 81;

      for (const index of cells) {
        if (remaining <= clues) break;

        const row = Math.floor(index / 9);
        const col = index % 9;
        const previous = puzzle[row][col];

        puzzle[row][col] = 0;

        if (this.countSudokuSolutions(puzzle.map(r => [...r]), 2) === 1) {
          remaining--;
        } else {
          puzzle[row][col] = previous;
        }
      }

      if (remaining === clues) {
        return { puzzle, solution, clues: remaining };
      }
    }

    throw new Error(
      `No se pudo generar un Sudoku único con ${clues} pistas tras 8 intentos.`
    );
  }
  // Cada error se cuenta. Al tercero se mezclan TODAS las piezas.
  registerError(pieces) {
    this.errors++;

    if (this.errors < 3) {
      return {
        reshuffled: false,
        errors: this.errors,
        message: `Error ${this.errors} de 3.`
      };
    }

    const values = this.shuffle(pieces.map(piece => piece.value));

    // Evita que la mezcla termine exactamente igual.
    if (
      values.length > 1 &&
      values.every((value, i) => value === pieces[i].value)
    ) {
      [values[0], values[1]] = [values[1], values[0]];
    }

    // No conserva ninguna pieza bloqueada como correcta.
    pieces.forEach((piece, i) => {
      piece.value = values[i];
      piece.locked = false;
      piece.correct = false;
    });

    this.errors = 0;

    return {
      reshuffled: true,
      errors: 0,
      pieces,
      message: "Tercer error: se mezclaron todas las piezas."
    };
  }

  resetErrors() {
    this.errors = 0;
  }
}

if (typeof module !== "undefined") {
  module.exports = { GenesisEngine };
}

if (typeof window !== "undefined") {
  window.GenesisEngine = GenesisEngine;
}
