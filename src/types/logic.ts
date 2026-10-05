/**
 * Core Abstract Syntax Tree (AST) & Logic Types for Logic Lock
 */

export type AtomicExpr =
  | { type: 'position_equals'; objectId: string; slot: number }
  | { type: 'position_not_equals'; objectId: string; slot: number }
  | { type: 'before'; first: string; second: string }
  | { type: 'after'; first: string; second: string }
  | { type: 'adjacent'; first: string; second: string }
  | { type: 'immediately_before'; first: string; second: string }
  | { type: 'between'; middle: string; boundA: string; boundB: string };

export type LogicExpr =
  | AtomicExpr
  | { type: 'not'; operand: LogicExpr }
  | { type: 'and'; operands: LogicExpr[] }
  | { type: 'or'; operands: LogicExpr[] }
  | { type: 'implies'; antecedent: LogicExpr; consequent: LogicExpr }
  | { type: 'iff'; left: LogicExpr; right: LogicExpr };

export interface ConstraintDefinition {
  id: string;
  text: string;
  formalNotation?: string;
  expression: LogicExpr;
  highlightObjects: string[];
  highlightSlots?: number[];
}

/**
 * Arrangement representation:
 * Array of object IDs indexed by slot (0-indexed).
 * e.g., ['red', 'blue', 'green'] means:
 * Slot 1: 'red'
 * Slot 2: 'blue'
 * Slot 3: 'green'
 */
export type Arrangement = (string | null)[];

/**
 * Object to 1-based slot index mapping (0 or -1 means not placed)
 */
export type ObjectPositionMap = Record<string, number>;

export interface ConstraintEvaluation {
  constraintId: string;
  satisfied: boolean;
  message: string;
  involvedObjects: string[];
  involvedSlots?: number[];
  formalNotation?: string;
}

export interface LockEvaluationResult {
  isComplete: boolean;
  allSatisfied: boolean;
  solved: boolean;
  satisfiedCount: number;
  totalCount: number;
  evaluations: ConstraintEvaluation[];
  satisfiedIds: string[];
  violatedIds: string[];
}

export type SatisfiabilityType = 'unique' | 'multiple' | 'unsatisfiable';

export interface SolverResult {
  satisfiability: SatisfiabilityType;
  isSatisfiable: boolean;
  solutionCount: number;
  allSolutions: string[][];
  uniqueSolution: string[] | null;
}

export interface EquivalenceComparisonResult {
  isEquivalent: boolean;
  lockASolutionCount: number;
  lockBSolutionCount: number;
  commonCount: number;
  onlyACount: number;
  onlyBCount: number;
  commonSolutions: string[][];
  onlyASolutions: string[][];
  onlyBSolutions: string[][];
  counterexample: {
    arrangement: string[];
    satisfiesA: boolean;
    satisfiesB: boolean;
    explanation: string;
  } | null;
  mathematicalConcept: string;
  formalEquivalenceRule?: string;
}
