import type {
  ConstraintDefinition,
  SolverResult,
} from '../types/logic';
import { evaluateLock } from './evaluator';

/**
 * Generates all permutations of an array.
 * Heap's algorithm or recursive backtracking.
 */
export function generatePermutations<T>(items: T[]): T[][] {
  const result: T[][] = [];
  const current = [...items];

  function backtrack(n: number) {
    if (n === 1) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < n; i++) {
      backtrack(n - 1);
      const j = n % 2 === 0 ? i : 0;
      const temp = current[j];
      current[j] = current[n - 1];
      current[n - 1] = temp;
    }
  }

  if (items.length > 0) {
    backtrack(items.length);
  }
  return result;
}

/**
 * Solves a lock configuration by finding all valid permutations of the available objects.
 */
export function solveLock(
  availableObjects: string[],
  constraints: ConstraintDefinition[],
  slotCount?: number
): SolverResult {
  const slots = slotCount ?? availableObjects.length;
  const permutations = generatePermutations(availableObjects);
  const allSolutions: string[][] = [];

  for (const perm of permutations) {
    // If slots < objects, take slice; otherwise standard permutation
    const arrangement = perm.slice(0, slots);
    const evalResult = evaluateLock(arrangement, constraints, slots);

    if (evalResult.solved) {
      // Avoid duplicate slices if slots < availableObjects
      const key = arrangement.join(',');
      if (!allSolutions.some((sol) => sol.join(',') === key)) {
        allSolutions.push(arrangement);
      }
    }
  }

  const solutionCount = allSolutions.length;
  let satisfiability: SolverResult['satisfiability'] = 'unsatisfiable';
  if (solutionCount === 1) {
    satisfiability = 'unique';
  } else if (solutionCount > 1) {
    satisfiability = 'multiple';
  }

  return {
    satisfiability,
    isSatisfiable: solutionCount > 0,
    solutionCount,
    allSolutions,
    uniqueSolution: solutionCount === 1 ? allSolutions[0] : null,
  };
}
