import { describe, it, expect } from 'vitest';
import { PUZZLE_LEVELS } from '../../src/data/levels';
import { evaluateLock } from '../../src/logic/evaluator';
import { solveLock } from '../../src/logic/solver';
import { storageService } from '../../src/services/storage';

describe('Gameplay Flow & Validation Cycles', () => {
  const room1 = PUZZLE_LEVELS[0];

  it('Flow: Player places objects incorrectly -> evaluation flags violated clue', () => {
    // Correct solution for Room 1 is ['red', 'blue', 'green']
    // Let's place: ['blue', 'red', 'green']
    const incorrectArrangement = ['blue', 'red', 'green'];

    const evalResult = evaluateLock(incorrectArrangement, room1.constraints, room1.slotCount);

    expect(evalResult.isComplete).toBe(true);
    expect(evalResult.solved).toBe(false);
    expect(evalResult.violatedIds.length).toBeGreaterThan(0);
    expect(evalResult.violatedIds).toContain('c1_1'); // 'Ruby must be placed before Sapphire' is violated!

    const violatedClue = evalResult.evaluations.find((e) => e.constraintId === 'c1_1');
    expect(violatedClue).toBeDefined();
    expect(violatedClue!.satisfied).toBe(false);
    expect(violatedClue!.message).toContain('Needs to come earlier');
  });

  it('Flow: Player places objects correctly -> evaluation succeeds and completes level', () => {
    // Solve Room 1
    const solution = solveLock(room1.availableObjects, room1.constraints, room1.slotCount).uniqueSolution!;
    expect(solution).toEqual(['red', 'blue', 'green']);

    const evalResult = evaluateLock(solution, room1.constraints, room1.slotCount);
    expect(evalResult.isComplete).toBe(true);
    expect(evalResult.allSatisfied).toBe(true);
    expect(evalResult.solved).toBe(true);
    expect(evalResult.violatedIds.length).toBe(0);

    // Save completion
    const updatedProgress = storageService.markLevelCompleted(room1.id, 0, 1);
    expect(updatedProgress.completedLevels).toContain(1);
    expect(updatedProgress.highestUnlockedLevel).toBeGreaterThanOrEqual(2);
  });

  it('Flow: Incomplete placement is flagged before unlocking', () => {
    const partialArrangement = ['red', null, 'green'];
    const evalResult = evaluateLock(partialArrangement, room1.constraints, room1.slotCount);

    expect(evalResult.isComplete).toBe(false);
    expect(evalResult.solved).toBe(false);
  });
});
