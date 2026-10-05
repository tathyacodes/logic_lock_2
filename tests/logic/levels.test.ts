import { describe, it, expect } from 'vitest';
import { PUZZLE_LEVELS } from '../../src/data/levels';
import { solveLock } from '../../src/logic/solver';
import { evaluateLock } from '../../src/logic/evaluator';

describe('Curated Adventure Levels Solvability', () => {
  it('contains exactly 10 curated levels', () => {
    expect(PUZZLE_LEVELS.length).toBe(10);
  });

  PUZZLE_LEVELS.forEach((level) => {
    it(`Room ${level.roomNumber} (${level.name}) has exactly one unique solution`, () => {
      const solverResult = solveLock(
        level.availableObjects,
        level.constraints,
        level.slotCount
      );

      // Verify each level is solvable
      expect(solverResult.isSatisfiable).toBe(true);

      // Verify each level has a unique solution
      expect(solverResult.satisfiability).toBe('unique');
      expect(solverResult.solutionCount).toBe(1);
      expect(solverResult.uniqueSolution).not.toBeNull();

      // Verify the found solution actually solves the lock evaluation
      const evalResult = evaluateLock(
        solverResult.uniqueSolution!,
        level.constraints,
        level.slotCount
      );
      expect(evalResult.solved).toBe(true);
      expect(evalResult.violatedIds.length).toBe(0);
      expect(evalResult.satisfiedCount).toBe(level.constraints.length);
    });
  });
});
