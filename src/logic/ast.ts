import type { LogicExpr } from '../types/logic';

export const Logic = {
  posEquals: (objectId: string, slot: number): LogicExpr => ({
    type: 'position_equals',
    objectId,
    slot,
  }),

  posNotEquals: (objectId: string, slot: number): LogicExpr => ({
    type: 'position_not_equals',
    objectId,
    slot,
  }),

  before: (first: string, second: string): LogicExpr => ({
    type: 'before',
    first,
    second,
  }),

  after: (first: string, second: string): LogicExpr => ({
    type: 'after',
    first,
    second,
  }),

  adjacent: (first: string, second: string): LogicExpr => ({
    type: 'adjacent',
    first,
    second,
  }),

  immediatelyBefore: (first: string, second: string): LogicExpr => ({
    type: 'immediately_before',
    first,
    second,
  }),

  between: (middle: string, boundA: string, boundB: string): LogicExpr => ({
    type: 'between',
    middle,
    boundA,
    boundB,
  }),

  not: (operand: LogicExpr): LogicExpr => ({
    type: 'not',
    operand,
  }),

  and: (...operands: LogicExpr[]): LogicExpr => ({
    type: 'and',
    operands,
  }),

  or: (...operands: LogicExpr[]): LogicExpr => ({
    type: 'or',
    operands,
  }),

  implies: (antecedent: LogicExpr, consequent: LogicExpr): LogicExpr => ({
    type: 'implies',
    antecedent,
    consequent,
  }),

  iff: (left: LogicExpr, right: LogicExpr): LogicExpr => ({
    type: 'iff',
    left,
    right,
  }),
};
