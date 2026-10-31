"use strict";

/*
 * DIAMOND Un-Bunker Code Block
 * Prototipo estructural; criptografía NO validada.
 *
 * 6 lados x 4 bases x 3 unidades ternarias = 72 unidades.
 * La reciprocidad es una regla estructural de prueba,
 * no una demostración de seguridad criptográfica.
 */

(function (root) {
  const SIDES = 6;
  const BASES_PER_SIDE = 4;
  const TRITS_PER_BASE = 3;
  const STATES = [-1, 0, 1];

  function randomTrit() {
    if (!root.crypto || !root.crypto.getRandomValues) {
      throw new Error("Se requiere un generador criptográfico seguro.");
    }

    const byte = new Uint8Array(1);

    // 0..254 contiene 255 valores, divisible por 3.
    do {
      root.crypto.getRandomValues(byte);
    } while (byte[0] >= 255);

    return STATES[byte[0] % 3];
  }

  function inverse(base) {
    return base.map(value => -value);
  }

  function same(a, b) {
    return a.length === b.length &&
      a.every((value, index) => value === b[index]);
  }

  class DiamondUnBunker {
    constructor() {
      this.sides = Array.from({ length: SIDES }, (_, index) => ({
        index,
        bases: Array.from(
          { length: BASES_PER_SIDE },
          () => Array.from(
            { length: TRITS_PER_BASE },
            randomTrit
          )
        ),
        activated: false
      }));

      // Define la entrada de cada lado a partir de la salida
      // del lado anterior, incluido el cierre 6 -> 1.
      for (let i = 0; i < SIDES; i++) {
        const previous = (i + SIDES - 1) % SIDES;
        this.sides[i].bases[0] = inverse(
          this.sides[previous].bases[BASES_PER_SIDE - 1]
        );
      }
    }

    validateNeighbor(previousIndex, nextIndex) {
      const exit =
        this.sides[previousIndex].bases[BASES_PER_SIDE - 1];
      const entry = this.sides[nextIndex].bases[0];

      return same(entry, inverse(exit));
    }

    validateClosure() {
      return this.validateNeighbor(SIDES - 1, 0);
    }

    resetSequence() {
      this.sides.forEach(side => {
        side.activated = false;
      });
    }

    activateFirstSide() {
      if (this.sides.some(side => side.activated)) {
        return {
          ok: false,
          reason: "La secuencia ya comenzó."
        };
      }

      this.sides[0].activated = true;
      return { ok: true, activatedSide: 1 };
    }

    activateNextSide() {
      let last = -1;

      for (let i = 0; i < SIDES; i++) {
        if (this.sides[i].activated) last = i;
      }

      if (last < 0) {
        return {
          ok: false,
          reason: "Primero debe habilitarse el lado 1."
        };
      }

      // No permite saltar lados ni continuar una secuencia rota.
      for (let i = 0; i <= last; i++) {
        if (!this.sides[i].activated) {
          this.resetSequence();
          return {
            ok: false,
            reset: true,
            reason: "Secuencia incompleta; reinicio desde el lado 1."
          };
        }
      }

      const nextIndex = last + 1;

      if (nextIndex >= SIDES) {
        return {
          ok: false,
          reason: "Los seis lados ya están habilitados."
        };
      }

      const neighborOK = this.validateNeighbor(last, nextIndex);
      const closureOK = nextIndex === SIDES - 1
        ? this.validateClosure()
        : true;

      if (!neighborOK || !closureOK) {
        this.resetSequence();

        return {
          ok: false,
          reset: true,
          reason: "Reciprocidad fallida. Reiniciar desde el lado 1.",
          neighborOK,
          closureOK
        };
      }

      this.sides[nextIndex].activated = true;

      return {
        ok: true,
        activatedSide: nextIndex + 1,
        closureChecked: nextIndex === SIDES - 1,
        closureOK
      };
    }

    getStatus() {
      const neighborReciprocity = this.sides.every((side, i) =>
        this.validateNeighbor((i + SIDES - 1) % SIDES, i)
      );

      return {
        architecture: "DIAMOND Un-Bunker Code Block",
        sides: SIDES,
        basesPerSide: BASES_PER_SIDE,
        unitsPerBase: TRITS_PER_BASE,
        unitsPerSide: BASES_PER_SIDE * TRITS_PER_BASE,
        totalUnits: SIDES * BASES_PER_SIDE * TRITS_PER_BASE,
        activatedSides: this.sides
          .filter(side => side.activated)
          .map(side => side.index + 1),
        neighborReciprocity,
        hexagonalClosure: this.validateClosure(),
        theoreticalTernaryEntropyBits: 72 * Math.log2(3),
        target128BitsReached: false,
        cryptographicValidation: "PENDIENTE"
      };
    }
  }

  const api = { DiamondUnBunker };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.DiamondSecurity = api;
})(globalThis);
