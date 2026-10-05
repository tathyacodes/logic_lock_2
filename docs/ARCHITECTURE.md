# Logic Lock — Architectural Specification

## 1. Architectural Philosophy

The architecture of **Logic Lock** strictly separates the mathematical engine from the visual user interface. The logic engine is written in pure TypeScript with zero DOM or UI dependencies, making it universally portable, headless-testable, and reusable in non-browser environments.

```text
       ┌────────────────────────┐
       │     Presentation       │  React 19 + Tailwind CSS
       └───────────┬────────────┘
                   │ reads state & dispatches actions
                   ▼
       ┌────────────────────────┐
       │      Game State        │  Room progression, stats, storage
       └───────────┬────────────┘
                   │ sends configuration to evaluate
                   ▼
       ┌────────────────────────┐
       │      Logic Engine      │  AST evaluation & position mapping
       └───────────┬────────────┘
                   │ exhaustive search & set intersections
                   ▼
       ┌────────────────────────┐
       │     Solver Engine      │  Permutations, satisfiability,
       └────────────────────────┘  equivalence & counterexamples
```

---

## 2. The Logic Engine & AST Model

Constraints are represented as an Abstract Syntax Tree (AST):

```typescript
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
```

### Evaluation Semantics
1. **Material Implication ($P \rightarrow Q$):** Evaluated strictly as $\neg P \lor Q$. If the antecedent $P$ is false in the current arrangement, the expression is vacuously true.
2. **Partial vs. Complete Evaluation:** Individual constraints can be evaluated on partial arrangements to provide live feedback, but the lock is only considered `solved` when all slots are occupied and all constraints return `true`.

---

## 3. The Permutation Solver

For a lock with $N$ objects and $K$ slots ($K \le N \le 5$), the state space consists of $P(N, K) \le 120$ possible permutations.

The solver (`src/logic/solver.ts`) generates all permutations exhaustively via Heap's algorithm, evaluates each arrangement, and classifies the puzzle's satisfiability:
- **`unique`:** Exactly one valid permutation exists. (Required for all curated adventure levels)
- **`multiple`:** More than one arrangement satisfies all constraints.
- **`unsatisfiable`:** No arrangement exists that satisfies all constraints simultaneously (impossible lock).

---

## 4. Logical Equivalence & Counterexamples

In Mode 2 (Discovery Lab), the equivalence engine (`src/logic/equivalence.ts`) compares two locks, $\mathcal{L}_A$ and $\mathcal{L}_B$:

$$\mathcal{S}_A = \text{solutions}(\mathcal{L}_A), \quad \mathcal{S}_B = \text{solutions}(\mathcal{L}_B)$$

- **Common Solutions:** $\mathcal{S}_A \cap \mathcal{S}_B$
- **Exclusive to A:** $\mathcal{S}_A \setminus \mathcal{S}_B$
- **Exclusive to B:** $\mathcal{S}_B \setminus \mathcal{S}_A$
- **Equivalence:** $\mathcal{S}_A = \mathcal{S}_B \iff (\mathcal{S}_A \setminus \mathcal{S}_B = \emptyset) \land (\mathcal{S}_B \setminus \mathcal{S}_A = \emptyset)$

If $\mathcal{S}_A \neq \mathcal{S}_B$, any element in the symmetric difference $(\mathcal{S}_A \Delta \mathcal{S}_B)$ serves as a concrete **counterexample**. The engine extracts this arrangement and details which specific rule in the opposing lock failed.

---

## 5. Web Audio API Procedural Synthesizer

Rather than depending on external audio files that might fail to load or add latency, `sound.ts` synthesizes sound effects in real time:
- Clicks: Short exponential frequency ramps (800Hz $\rightarrow$ 300Hz sine).
- Harmonic chimes: Multi-voice arpeggiated triads (C5, E5, G5).
- Vault unlock: 6-oscillator harmonic chord with decay tails.
- Mute state is integrated with user preferences and persistent storage.
