import type {
  ConstraintDefinition,
  EquivalenceComparisonResult,
} from '../types/logic';
import { evaluateLock } from './evaluator';
import { solveLock } from './solver';

export function compareLocks(
  objects: string[],
  lockAConstraints: ConstraintDefinition[],
  lockBConstraints: ConstraintDefinition[],
  slotCount: number,
  conceptInfo: {
    concept: string;
    ruleName?: string;
    formalRule?: string;
  }
): EquivalenceComparisonResult {
  const solverA = solveLock(objects, lockAConstraints, slotCount);
  const solverB = solveLock(objects, lockBConstraints, slotCount);

  const keyToArr = (arr: string[]) => arr.join('|');
  const setA = new Set(solverA.allSolutions.map(keyToArr));
  const setB = new Set(solverB.allSolutions.map(keyToArr));

  const commonSolutions: string[][] = [];
  const onlyASolutions: string[][] = [];
  const onlyBSolutions: string[][] = [];

  for (const sol of solverA.allSolutions) {
    if (setB.has(keyToArr(sol))) {
      commonSolutions.push(sol);
    } else {
      onlyASolutions.push(sol);
    }
  }

  for (const sol of solverB.allSolutions) {
    if (!setA.has(keyToArr(sol))) {
      onlyBSolutions.push(sol);
    }
  }

  const isEquivalent = onlyASolutions.length === 0 && onlyBSolutions.length === 0;

  let counterexample: EquivalenceComparisonResult['counterexample'] = null;

  if (!isEquivalent) {
    if (onlyASolutions.length > 0) {
      const sample = onlyASolutions[0];
      const evalB = evaluateLock(sample, lockBConstraints, slotCount);
      const failedClue = evalB.evaluations.find((e) => !e.satisfied);

      counterexample = {
        arrangement: sample,
        satisfiesA: true,
        satisfiesB: false,
        explanation: `This arrangement satisfies Lock A, but fails Lock B because: "${failedClue?.message || 'A constraint was violated'}".`,
      };
    } else if (onlyBSolutions.length > 0) {
      const sample = onlyBSolutions[0];
      const evalA = evaluateLock(sample, lockAConstraints, slotCount);
      const failedClue = evalA.evaluations.find((e) => !e.satisfied);

      counterexample = {
        arrangement: sample,
        satisfiesA: false,
        satisfiesB: true,
        explanation: `This arrangement satisfies Lock B, but fails Lock A because: "${failedClue?.message || 'A constraint was violated'}".`,
      };
    }
  }

  return {
    isEquivalent,
    lockASolutionCount: solverA.solutionCount,
    lockBSolutionCount: solverB.solutionCount,
    commonCount: commonSolutions.length,
    onlyACount: onlyASolutions.length,
    onlyBCount: onlyBSolutions.length,
    commonSolutions,
    onlyASolutions,
    onlyBSolutions,
    counterexample,
    mathematicalConcept: conceptInfo.concept,
    formalEquivalenceRule: conceptInfo.formalRule,
  };
}
