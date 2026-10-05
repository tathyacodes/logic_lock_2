import type {
  Arrangement,
  ConstraintDefinition,
  ConstraintEvaluation,
  LockEvaluationResult,
  LogicExpr,
  ObjectPositionMap,
} from '../types/logic';

/**
 * Builds a lookup map from object ID to 1-based slot index.
 * Slots containing null or empty objects are ignored.
 */
export function buildPositionMap(arrangement: Arrangement): ObjectPositionMap {
  const map: ObjectPositionMap = {};
  arrangement.forEach((objId, index) => {
    if (objId) {
      map[objId] = index + 1; // 1-based
    }
  });
  return map;
}

/**
 * Evaluates a single LogicExpr AST node against the given object positions.
 */
export function evaluateExpr(expr: LogicExpr, positions: ObjectPositionMap): boolean {
  switch (expr.type) {
    case 'position_equals': {
      const pos = positions[expr.objectId];
      return pos !== undefined && pos === expr.slot;
    }

    case 'position_not_equals': {
      const pos = positions[expr.objectId];
      // If placed, must not be in that slot. If not placed, it's not satisfied yet.
      return pos !== undefined && pos !== expr.slot;
    }

    case 'before': {
      const posA = positions[expr.first];
      const posB = positions[expr.second];
      if (posA === undefined || posB === undefined) return false;
      return posA < posB;
    }

    case 'after': {
      const posA = positions[expr.first];
      const posB = positions[expr.second];
      if (posA === undefined || posB === undefined) return false;
      return posA > posB;
    }

    case 'adjacent': {
      const posA = positions[expr.first];
      const posB = positions[expr.second];
      if (posA === undefined || posB === undefined) return false;
      return Math.abs(posA - posB) === 1;
    }

    case 'immediately_before': {
      const posA = positions[expr.first];
      const posB = positions[expr.second];
      if (posA === undefined || posB === undefined) return false;
      return posB - posA === 1;
    }

    case 'between': {
      const posM = positions[expr.middle];
      const posA = positions[expr.boundA];
      const posB = positions[expr.boundB];
      if (posM === undefined || posA === undefined || posB === undefined) return false;
      return (posA < posM && posM < posB) || (posB < posM && posM < posA);
    }

    case 'not': {
      return !evaluateExpr(expr.operand, positions);
    }

    case 'and': {
      if (expr.operands.length === 0) return true;
      return expr.operands.every((op) => evaluateExpr(op, positions));
    }

    case 'or': {
      if (expr.operands.length === 0) return false;
      return expr.operands.some((op) => evaluateExpr(op, positions));
    }

    case 'implies': {
      const p = evaluateExpr(expr.antecedent, positions);
      const q = evaluateExpr(expr.consequent, positions);
      // Discrete Math Implication: P -> Q is equivalent to (!P || Q)
      return !p || q;
    }

    case 'iff': {
      const p = evaluateExpr(expr.left, positions);
      const q = evaluateExpr(expr.right, positions);
      return p === q;
    }

    default:
      return false;
  }
}

/**
 * Generates an intuitive feedback message for a constraint evaluation.
 */
function createFeedbackMessage(
  constraint: ConstraintDefinition,
  satisfied: boolean,
  positions: ObjectPositionMap
): string {
  if (satisfied) {
    return `Satisfied: ${constraint.text}`;
  }

  // Provide contextual violated message
  const expr = constraint.expression;
  if (expr.type === 'position_equals') {
    const curPos = positions[expr.objectId];
    if (curPos === undefined) return `${constraint.text} (not placed yet)`;
    return `${constraint.text} (currently in slot ${curPos})`;
  }
  if (expr.type === 'position_not_equals') {
    const curPos = positions[expr.objectId];
    if (curPos === expr.slot) {
      return `Cannot be in slot ${expr.slot}`;
    }
  }
  if (expr.type === 'before') {
    const posA = positions[expr.first];
    const posB = positions[expr.second];
    if (posA && posB && posA >= posB) {
      return `Needs to come earlier (currently at slot ${posA}, target at slot ${posB})`;
    }
  }
  if (expr.type === 'after') {
    const posA = positions[expr.first];
    const posB = positions[expr.second];
    if (posA && posB && posA <= posB) {
      return `Needs to come later (currently at slot ${posA}, target at slot ${posB})`;
    }
  }
  if (expr.type === 'implies') {
    const anteSatisfied = evaluateExpr(expr.antecedent, positions);
    if (anteSatisfied) {
      return `Condition triggered: since the IF condition is met, the THEN requirement must follow!`;
    }
  }

  return `Not satisfied: ${constraint.text}`;
}

/**
 * Evaluates an entire lock configuration against a list of constraints.
 */
export function evaluateLock(
  arrangement: Arrangement,
  constraints: ConstraintDefinition[],
  expectedSlotCount?: number
): LockEvaluationResult {
  const positions = buildPositionMap(arrangement);
  const slotCount = expectedSlotCount ?? arrangement.length;
  
  // Check completeness: all slots must be filled with non-null objects
  const filledSlots = arrangement.filter((item) => item !== null && item !== undefined);
  const isComplete = filledSlots.length === slotCount && arrangement.length === slotCount;

  const evaluations: ConstraintEvaluation[] = [];
  const satisfiedIds: string[] = [];
  const violatedIds: string[] = [];

  for (const constraint of constraints) {
    const satisfied = evaluateExpr(constraint.expression, positions);
    const message = createFeedbackMessage(constraint, satisfied, positions);

    evaluations.push({
      constraintId: constraint.id,
      satisfied,
      message,
      involvedObjects: constraint.highlightObjects,
      involvedSlots: constraint.highlightSlots,
      formalNotation: constraint.formalNotation,
    });

    if (satisfied) {
      satisfiedIds.push(constraint.id);
    } else {
      violatedIds.push(constraint.id);
    }
  }

  const allSatisfied = violatedIds.length === 0;
  const solved = isComplete && allSatisfied;

  return {
    isComplete,
    allSatisfied,
    solved,
    satisfiedCount: satisfiedIds.length,
    totalCount: constraints.length,
    evaluations,
    satisfiedIds,
    violatedIds,
  };
}
