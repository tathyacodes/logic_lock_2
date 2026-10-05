import { describe, it, expect } from 'vitest';
import { Logic } from '../../src/logic/ast';
import { evaluateExpr, evaluateLock, buildPositionMap } from '../../src/logic/evaluator';
import { solveLock, generatePermutations } from '../../src/logic/solver';
import { compareLocks } from '../../src/logic/equivalence';
import type { ConstraintDefinition } from '../../src/types/logic';

describe('Logic AST & Evaluator', () => {
  it('correctly maps 1-based object positions', () => {
    const arrangement = ['red', 'blue', 'green'];
    const map = buildPositionMap(arrangement);
    expect(map['red']).toBe(1);
    expect(map['blue']).toBe(2);
    expect(map['green']).toBe(3);
    expect(map['yellow']).toBeUndefined();
  });

  it('evaluates position_equals and position_not_equals', () => {
    const map = { red: 1, blue: 2, green: 3 };
    expect(evaluateExpr(Logic.posEquals('red', 1), map)).toBe(true);
    expect(evaluateExpr(Logic.posEquals('red', 2), map)).toBe(false);

    expect(evaluateExpr(Logic.posNotEquals('green', 1), map)).toBe(true);
    expect(evaluateExpr(Logic.posNotEquals('green', 3), map)).toBe(false);
  });

  it('evaluates before and after orderings', () => {
    const map = { red: 1, blue: 2, green: 3 };
    expect(evaluateExpr(Logic.before('red', 'blue'), map)).toBe(true);
    expect(evaluateExpr(Logic.before('green', 'blue'), map)).toBe(false);

    expect(evaluateExpr(Logic.after('green', 'red'), map)).toBe(true);
    expect(evaluateExpr(Logic.after('red', 'blue'), map)).toBe(false);
  });

  it('evaluates adjacent, immediatelyBefore, and between', () => {
    const map = { red: 1, blue: 2, green: 3, yellow: 4 };
    expect(evaluateExpr(Logic.adjacent('red', 'blue'), map)).toBe(true);
    expect(evaluateExpr(Logic.adjacent('red', 'green'), map)).toBe(false);

    expect(evaluateExpr(Logic.immediatelyBefore('blue', 'green'), map)).toBe(true);
    expect(evaluateExpr(Logic.immediatelyBefore('red', 'green'), map)).toBe(false);

    expect(evaluateExpr(Logic.between('blue', 'red', 'green'), map)).toBe(true);
    expect(evaluateExpr(Logic.between('yellow', 'red', 'blue'), map)).toBe(false);
  });

  it('evaluates logical NOT, AND, OR combinators', () => {
    const map = { red: 1, blue: 2, green: 3 };

    // NOT
    expect(evaluateExpr(Logic.not(Logic.posEquals('red', 2)), map)).toBe(true);

    // AND
    expect(
      evaluateExpr(
        Logic.and(Logic.before('red', 'blue'), Logic.posEquals('green', 3)),
        map
      )
    ).toBe(true);

    expect(
      evaluateExpr(
        Logic.and(Logic.before('red', 'blue'), Logic.posEquals('green', 1)),
        map
      )
    ).toBe(false);

    // OR
    expect(
      evaluateExpr(
        Logic.or(Logic.posEquals('red', 2), Logic.posEquals('green', 3)),
        map
      )
    ).toBe(true);

    expect(
      evaluateExpr(
        Logic.or(Logic.posEquals('red', 2), Logic.posEquals('green', 1)),
        map
      )
    ).toBe(false);
  });

  it('evaluates implication (IF-THEN) correctly including vacuous truth', () => {
    // If Red is in slot 1 THEN Blue must be in slot 3
    const rule = Logic.implies(
      Logic.posEquals('red', 1),
      Logic.posEquals('blue', 3)
    );

    // Case 1: Antecedent true, consequent true => TRUE
    expect(evaluateExpr(rule, { red: 1, blue: 3 })).toBe(true);

    // Case 2: Antecedent true, consequent false => FALSE
    expect(evaluateExpr(rule, { red: 1, blue: 2 })).toBe(false);

    // Case 3: Antecedent false, consequent true => TRUE (vacuously true)
    expect(evaluateExpr(rule, { red: 2, blue: 3 })).toBe(true);

    // Case 4: Antecedent false, consequent false => TRUE (vacuously true)
    expect(evaluateExpr(rule, { red: 2, blue: 1 })).toBe(true);
  });
});

describe('Lock Evaluation & Completeness', () => {
  const constraints: ConstraintDefinition[] = [
    {
      id: 'c1',
      text: 'Red must come before Blue',
      expression: Logic.before('red', 'blue'),
      highlightObjects: ['red', 'blue'],
    },
    {
      id: 'c2',
      text: 'Green cannot be first',
      expression: Logic.posNotEquals('green', 1),
      highlightObjects: ['green'],
    },
  ];

  it('solves lock when arrangement satisfies all constraints', () => {
    const result = evaluateLock(['red', 'green', 'blue'], constraints, 3);
    expect(result.isComplete).toBe(true);
    expect(result.allSatisfied).toBe(true);
    expect(result.solved).toBe(true);
    expect(result.satisfiedCount).toBe(2);
    expect(result.violatedIds.length).toBe(0);
  });

  it('flags incomplete locks even if partial constraints pass', () => {
    const result = evaluateLock(['red', 'blue', null], constraints, 3);
    expect(result.isComplete).toBe(false);
    expect(result.solved).toBe(false);
  });

  it('identifies specific violated constraints', () => {
    // Green first (slot 1), Red slot 2, Blue slot 3
    const result = evaluateLock(['green', 'red', 'blue'], constraints, 3);
    expect(result.isComplete).toBe(true);
    expect(result.solved).toBe(false);
    expect(result.violatedIds).toContain('c2');
    expect(result.satisfiedIds).toContain('c1');
  });
});

describe('Lock Solver', () => {
  it('generates all permutations correctly for 3 elements', () => {
    const perms = generatePermutations(['a', 'b', 'c']);
    expect(perms.length).toBe(6);
  });

  it('finds unique solution for fully constrained puzzle', () => {
    const objects = ['red', 'blue', 'green'];
    const constraints: ConstraintDefinition[] = [
      {
        id: 'c1',
        text: 'Red in slot 1',
        expression: Logic.posEquals('red', 1),
        highlightObjects: ['red'],
      },
      {
        id: 'c2',
        text: 'Blue in slot 2',
        expression: Logic.posEquals('blue', 2),
        highlightObjects: ['blue'],
      },
      {
        id: 'c3',
        text: 'Green in slot 3',
        expression: Logic.posEquals('green', 3),
        highlightObjects: ['green'],
      },
    ];

    const result = solveLock(objects, constraints, 3);
    expect(result.satisfiability).toBe('unique');
    expect(result.solutionCount).toBe(1);
    expect(result.uniqueSolution).toEqual(['red', 'blue', 'green']);
  });

  it('detects multiple solutions when underconstrained', () => {
    const objects = ['red', 'blue', 'green'];
    const constraints: ConstraintDefinition[] = [
      {
        id: 'c1',
        text: 'Red comes before Blue',
        expression: Logic.before('red', 'blue'),
        highlightObjects: ['red', 'blue'],
      },
    ];

    const result = solveLock(objects, constraints, 3);
    expect(result.satisfiability).toBe('multiple');
    expect(result.solutionCount).toBe(3); // [red, blue, green], [red, green, blue], [green, red, blue]
  });

  it('detects impossible / unsatisfiable locks', () => {
    const objects = ['red', 'blue', 'green'];
    const constraints: ConstraintDefinition[] = [
      {
        id: 'c1',
        text: 'Red before Blue',
        expression: Logic.before('red', 'blue'),
        highlightObjects: ['red', 'blue'],
      },
      {
        id: 'c2',
        text: 'Blue before Red',
        expression: Logic.before('blue', 'red'),
        highlightObjects: ['red', 'blue'],
      },
    ];

    const result = solveLock(objects, constraints, 3);
    expect(result.satisfiability).toBe('unsatisfiable');
    expect(result.solutionCount).toBe(0);
    expect(result.isSatisfiable).toBe(false);
  });
});

describe('Equivalence Engine & Counterexamples', () => {
  const objects = ['red', 'blue', 'green'];

  it('verifies logical equivalence (e.g. Implication Law: P -> Q === !P || Q)', () => {
    // Lock A: IF Red is slot 1 THEN Blue is slot 2
    const lockA: ConstraintDefinition[] = [
      {
        id: 'a1',
        text: 'IF Red is in slot 1 THEN Blue must be in slot 2',
        expression: Logic.implies(Logic.posEquals('red', 1), Logic.posEquals('blue', 2)),
        highlightObjects: ['red', 'blue'],
      },
    ];

    // Lock B: Red is NOT in slot 1 OR Blue is in slot 2
    const lockB: ConstraintDefinition[] = [
      {
        id: 'b1',
        text: 'Red is NOT in slot 1 OR Blue is in slot 2',
        expression: Logic.or(Logic.not(Logic.posEquals('red', 1)), Logic.posEquals('blue', 2)),
        highlightObjects: ['red', 'blue'],
      },
    ];

    const comparison = compareLocks(objects, lockA, lockB, 3, {
      concept: 'Material Implication Equivalence',
      formalRule: '(P → Q) ≡ (¬P ∨ Q)',
    });

    expect(comparison.isEquivalent).toBe(true);
    expect(comparison.onlyACount).toBe(0);
    expect(comparison.onlyBCount).toBe(0);
    expect(comparison.counterexample).toBeNull();
  });

  it('finds counterexample for non-equivalent locks', () => {
    // Lock A: Red before Blue
    const lockA: ConstraintDefinition[] = [
      {
        id: 'a1',
        text: 'Red before Blue',
        expression: Logic.before('red', 'blue'),
        highlightObjects: ['red', 'blue'],
      },
    ];

    // Lock B: Red immediately before Blue
    const lockB: ConstraintDefinition[] = [
      {
        id: 'b1',
        text: 'Red immediately before Blue',
        expression: Logic.immediatelyBefore('red', 'blue'),
        highlightObjects: ['red', 'blue'],
      },
    ];

    const comparison = compareLocks(objects, lockA, lockB, 3, {
      concept: 'Strictness of Ordering',
    });

    expect(comparison.isEquivalent).toBe(false);
    expect(comparison.counterexample).not.toBeNull();
    // Arrangement ['red', 'green', 'blue'] has red before blue (Lock A pass), but not immediately (Lock B fail)
    expect(comparison.onlyACount).toBeGreaterThan(0);
  });
});
