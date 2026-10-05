import { describe, it, expect } from 'vitest';
import { LAB_EXPERIMENTS } from '../../src/data/labLocks';
import { compareLocks } from '../../src/logic/equivalence';

describe('Discovery Lab Experiments Verification', () => {
  it('has 5 curated experiments', () => {
    expect(LAB_EXPERIMENTS.length).toBe(5);
  });

  LAB_EXPERIMENTS.forEach((exp) => {
    it(`verifies correctness of "${exp.title}"`, () => {
      const result = compareLocks(
        exp.objects,
        exp.lockA.constraints,
        exp.lockB.constraints,
        exp.slotCount,
        {
          concept: exp.discreteMathInsight.concept,
          ruleName: exp.discreteMathInsight.ruleName,
          formalRule: exp.discreteMathInsight.formula,
        }
      );

      // Verify whether the calculated equivalence matches the expected theoretical result
      expect(result.isEquivalent).toBe(exp.discreteMathInsight.isActuallyEquivalent);

      if (exp.discreteMathInsight.isActuallyEquivalent) {
        expect(result.onlyACount).toBe(0);
        expect(result.onlyBCount).toBe(0);
        expect(result.counterexample).toBeNull();
      } else {
        expect(result.counterexample).not.toBeNull();
        expect(result.onlyACount + result.onlyBCount).toBeGreaterThan(0);
      }
    });
  });
});
