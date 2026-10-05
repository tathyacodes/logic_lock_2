import { Logic } from '../logic/ast';
import type { LabLockComparison } from '../types/game';

export const LAB_EXPERIMENTS: LabLockComparison[] = [
  {
    id: 'exp-implication-definition',
    title: 'Experiment 1: Implication vs. Either-Or',
    subtitle: 'Can an IF–THEN rule be rewritten using OR?',
    objects: ['red', 'blue', 'green'],
    slotCount: 3,
    lockA: {
      name: 'Lock A: IF–THEN Rule',
      description: 'IF Red is in slot 1, THEN Blue must be in slot 2.',
      formalRule: 'P → Q',
      constraints: [
        {
          id: 'exp1_a1',
          text: 'IF Red is in slot 1, THEN Blue must be in slot 2',
          formalNotation: '(pos(Red) = 1) → (pos(Blue) = 2)',
          expression: Logic.implies(Logic.posEquals('red', 1), Logic.posEquals('blue', 2)),
          highlightObjects: ['red', 'blue'],
          highlightSlots: [1, 2],
        },
      ],
    },
    lockB: {
      name: 'Lock B: Either-Or Rule',
      description: 'Red is NOT in slot 1, OR Blue is in slot 2.',
      formalRule: '¬P ∨ Q',
      constraints: [
        {
          id: 'exp1_b1',
          text: 'Red is NOT in slot 1 OR Blue is in slot 2',
          formalNotation: '¬(pos(Red) = 1) ∨ (pos(Blue) = 2)',
          expression: Logic.or(Logic.not(Logic.posEquals('red', 1)), Logic.posEquals('blue', 2)),
          highlightObjects: ['red', 'blue'],
          highlightSlots: [1, 2],
        },
      ],
    },
    discreteMathInsight: {
      concept: 'Material Implication Identity',
      ruleName: 'Conditional Equivalence',
      formula: '(P → Q) ≡ (¬P ∨ Q)',
      explanation:
        'In classical logic, an implication "IF P THEN Q" is broken in only one case: when P is True and Q is False. Saying "NOT P OR Q" avoids that exact same broken case! Therefore, both locks accept the exact same arrangements.',
      isActuallyEquivalent: true,
    },
  },
  {
    id: 'exp-converse-fallacy',
    title: 'Experiment 2: The Reversal Trap',
    subtitle: 'Does an IF–THEN rule mean the same thing backwards?',
    objects: ['red', 'blue', 'green'],
    slotCount: 3,
    lockA: {
      name: 'Lock A: Forward Rule',
      description: 'IF Red is in slot 1, THEN Blue must be in slot 2.',
      formalRule: 'P → Q',
      constraints: [
        {
          id: 'exp1_a1',
          text: 'IF Red is in slot 1, THEN Blue must be in slot 2',
          formalNotation: '(pos(Red) = 1) → (pos(Blue) = 2)',
          expression: Logic.implies(Logic.posEquals('red', 1), Logic.posEquals('blue', 2)),
          highlightObjects: ['red', 'blue'],
          highlightSlots: [1, 2],
        },
      ],
    },
    lockB: {
      name: 'Lock B: Reversed Rule (The Converse)',
      description: 'IF Blue is in slot 2, THEN Red must be in slot 1.',
      formalRule: 'Q → P',
      constraints: [
        {
          id: 'exp2_b1',
          text: 'IF Blue is in slot 2, THEN Red must be in slot 1',
          formalNotation: '(pos(Blue) = 2) → (pos(Red) = 1)',
          expression: Logic.implies(Logic.posEquals('blue', 2), Logic.posEquals('red', 1)),
          highlightObjects: ['blue', 'red'],
          highlightSlots: [2, 1],
        },
      ],
    },
    discreteMathInsight: {
      concept: 'The Converse Fallacy',
      ruleName: 'Converse Non-Equivalence',
      formula: '(P → Q) ≢ (Q → P)',
      explanation:
        'Reversing an IF–THEN statement creates its "Converse". The converse is NOT equivalent! If Blue is in slot 2 and Green is in slot 1 (Red in 3), Lock A is satisfied, but Lock B is broken. This single counterexample proves they are different.',
      isActuallyEquivalent: false,
    },
  },
  {
    id: 'exp-demorgan-disjunction',
    title: "Experiment 3: De Morgan's Law",
    subtitle: 'Distributing "NOT" across an OR rule turns it into AND',
    objects: ['red', 'blue', 'green'],
    slotCount: 3,
    lockA: {
      name: 'Lock A: Negated OR',
      description: 'It is NOT the case that (Red is in slot 1 OR Green is in slot 1).',
      formalRule: '¬(P ∨ Q)',
      constraints: [
        {
          id: 'exp3_a1',
          text: 'NOT (Red is in slot 1 OR Green is in slot 1)',
          formalNotation: '¬( (pos(Red) = 1) ∨ (pos(Green) = 1) )',
          expression: Logic.not(Logic.or(Logic.posEquals('red', 1), Logic.posEquals('green', 1))),
          highlightObjects: ['red', 'green'],
          highlightSlots: [1],
        },
      ],
    },
    lockB: {
      name: 'Lock B: Combined AND',
      description: 'Red is NOT in slot 1 AND Green is NOT in slot 1.',
      formalRule: '¬P ∧ ¬Q',
      constraints: [
        {
          id: 'exp3_b1',
          text: 'Red is NOT in slot 1 AND Green is NOT in slot 1',
          formalNotation: '¬(pos(Red) = 1) ∧ ¬(pos(Green) = 1)',
          expression: Logic.and(Logic.posNotEquals('red', 1), Logic.posNotEquals('green', 1)),
          highlightObjects: ['red', 'green'],
          highlightSlots: [1],
        },
      ],
    },
    discreteMathInsight: {
      concept: "De Morgan's First Law",
      ruleName: 'De Morgan Duality',
      formula: '¬(P ∨ Q) ≡ (¬P ∧ ¬Q)',
      explanation:
        'Logician Augustus De Morgan proved that denying an OR statement is identical to requiring that NEITHER part occurs. Both locks allow only configurations where slot 1 is occupied by Blue!',
      isActuallyEquivalent: true,
    },
  },
  {
    id: 'exp-contrapositive',
    title: 'Experiment 4: The Contrapositive Secret',
    subtitle: 'Flipping backwards AND negating both parts stays identical',
    objects: ['red', 'blue', 'green'],
    slotCount: 3,
    lockA: {
      name: 'Lock A: Original Rule',
      description: 'IF Red is before Blue, THEN Green must be in slot 3.',
      formalRule: 'P → Q',
      constraints: [
        {
          id: 'exp4_a1',
          text: 'IF Red is before Blue, THEN Green must be in slot 3',
          formalNotation: '(pos(Red) < pos(Blue)) → (pos(Green) = 3)',
          expression: Logic.implies(Logic.before('red', 'blue'), Logic.posEquals('green', 3)),
          highlightObjects: ['red', 'blue', 'green'],
          highlightSlots: [3],
        },
      ],
    },
    lockB: {
      name: 'Lock B: Contrapositive Rule',
      description: 'IF Green is NOT in slot 3, THEN Red must NOT be before Blue.',
      formalRule: '¬Q → ¬P',
      constraints: [
        {
          id: 'exp4_b1',
          text: 'IF Green is NOT in slot 3, THEN Red cannot be before Blue',
          formalNotation: '¬(pos(Green) = 3) → ¬(pos(Red) < pos(Blue))',
          expression: Logic.implies(Logic.posNotEquals('green', 3), Logic.not(Logic.before('red', 'blue'))),
          highlightObjects: ['green', 'red', 'blue'],
          highlightSlots: [3],
        },
      ],
    },
    discreteMathInsight: {
      concept: 'The Law of the Contrapositive',
      ruleName: 'Contraposition Equivalence',
      formula: '(P → Q) ≡ (¬Q → ¬P)',
      explanation:
        'While reversing an implication alone is a fallacy, reversing AND negating both sides is mathematically identical! A statement and its contrapositive have the exact same truth value across every possible crystal arrangement.',
      isActuallyEquivalent: true,
    },
  },
  {
    id: 'exp-strict-vs-loose',
    title: 'Experiment 5: Direct Neighbor vs. Somewhere Before',
    subtitle: 'Why "Directly Before" is stricter than "Before"',
    objects: ['red', 'blue', 'green'],
    slotCount: 3,
    lockA: {
      name: 'Lock A: Direct Neighbor',
      description: 'Red must be DIRECTLY before Blue.',
      formalRule: 'pos(Blue) - pos(Red) = 1',
      constraints: [
        {
          id: 'exp5_a1',
          text: 'Red must be directly before Blue',
          formalNotation: 'pos(Blue) - pos(Red) = 1',
          expression: Logic.immediatelyBefore('red', 'blue'),
          highlightObjects: ['red', 'blue'],
        },
      ],
    },
    lockB: {
      name: 'Lock B: Somewhere Before',
      description: 'Red must come somewhere before Blue.',
      formalRule: 'pos(Red) < pos(Blue)',
      constraints: [
        {
          id: 'exp5_b1',
          text: 'Red must come before Blue',
          formalNotation: 'pos(Red) < pos(Blue)',
          expression: Logic.before('red', 'blue'),
          highlightObjects: ['red', 'blue'],
        },
      ],
    },
    discreteMathInsight: {
      concept: 'Ordering Strictness & Subsumption',
      ruleName: 'Covering Relation vs Strict Order',
      formula: '(pos(B) - pos(A) = 1) ⇒ (pos(A) < pos(B))',
      explanation:
        'Being right next to an object is a stronger condition than simply being somewhere before it. For example, [Red, Green, Blue] works for Lock B, but fails Lock A because Green sits between them.',
      isActuallyEquivalent: false,
    },
  },
];
