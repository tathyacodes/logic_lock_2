# Logic Lock

> **Solve the clues. Open the doors.**  
> An educational puzzle game designed for young problem-solvers (~15 years old), built on core principles of **Discrete Mathematics**, logical satisfiability, and deductive reasoning.

---

## What is Logic Lock?

**Logic Lock** is a puzzle adventure game where players progress through sealed rooms by solving logical clues.

Each room features a lock mechanism with numbered slots and colorful crystals. By reading clues that describe relative order, position restrictions, alternatives, and IF–THEN rules, players deduce the correct crystal arrangement to unlock the door.

Underneath the tactile gameplay lives a rigorous, pure discrete mathematics engine.

---

## Key Improvements in This Edition

1. **Single-Viewport Board & Clues Layout:**
   - The crystal slots and the clue cards are placed side-by-side on desktop/laptop screens.
   - The player no longer needs to scroll back and forth just to compare the crystals with the clues.
2. **Accessible, Engaging Tone:**
   - Replaced heavy sci-fi jargon (*"quantum cores"*, *"operative"*, *"containment systems"*) with clean, natural language suitable for 15-year-old school students.
3. **Real Vector Faceted Crystals (No Emojis):**
   - Replaced raw emojis with clean SVG faceted gemstones with distinct jewel cuts (Ruby, Sapphire, Emerald, Topaz, Amethyst).
4. **Immediate, Constructive Feedback:**
   - When a configuration doesn't match, the game highlights the exact violated clue with a simple, helpful note (e.g. *"Needs to come earlier"*).
   - Hovering any clue highlights its referenced crystals on the board.
5. **Discrete Mathematics Preserved 100%:**
   - Formal mathematical engine, SAT solver, truth tables, and equivalence checks remain completely intact.
   - Players can toggle **Math Form** on any clue card to view the formal mathematical notation (e.g. $pos(Red) < pos(Blue)$, $P \rightarrow Q$, etc.).

---

## Mathematical Concepts Covered

| Concept | Game Representation | Mathematical Formulation |
| :--- | :--- | :--- |
| **Atomic Propositions** | Crystal placed in slot | $pos(\text{Ruby}) = 1$ |
| **Strict Ordering** | Relative placement rules | $pos(A) < pos(B)$ |
| **Logical Negation (NOT)** | Exclusion rules | $\neg (pos(\text{Emerald}) = 1)$ |
| **Conjunction (AND)** | Simultaneous constraints | $C_1 \land C_2 \land C_3$ |
| **Disjunction (OR)** | Either/or choices | $(pos(R) = 1) \lor (pos(R) = 4)$ |
| **Material Implication** | IF–THEN rules | $P \rightarrow Q \equiv \neg P \lor Q$ |
| **Modus Ponens** | Rule trigger when IF is true | $(P \land (P \rightarrow Q)) \vdash Q$ |
| **Modus Tollens** | Rule backward deduction | $(\neg Q \land (P \rightarrow Q)) \vdash \neg P$ |
| **Vacuous Truth** | IF–THEN when IF is false | $\neg P \Rightarrow (P \rightarrow Q) = \text{True}$ |
| **Logical Equivalence** | Two locks accepting identical arrangements | $\mathcal{S}(\text{Lock } A) = \mathcal{S}(\text{Lock } B)$ |
| **Counterexamples** | Concrete configuration disproving equivalence | $\exists x \text{ s.t. } (x \in A \land x \notin B)$ |

---

## Game Modes

### 1. Adventure (Main Campaign)
- **10 Curated Rooms:** From *Room 1: The First Door* to *Room 10: The Master Lock*.
- **Smooth Learning Curve:** Begins with simple ordering, introduces `AND`, `OR`, `NOT`, and `between`, advances to `IF–THEN` implications, and concludes with a master unification puzzle.
- **3-Tier Progressive Hints:**
  - *Hint 1: General Direction* (nudge without spoiling)
  - *Hint 2: Key Deduction* (rules out an impossible slot)
  - *Hint 3: Direct Placement* (tells you where a crystal belongs)

### 2. Discovery Lab (Experiment & Equivalence)
- Compare two locks side-by-side (**Lock A** vs **Lock B**).
- **Interactive Testing Bench:** Place crystals and observe both locks evaluate simultaneously.
- **Solution-Set Comparison:** Automatically computes all valid permutations:
  - Valid in Lock A
  - Valid in Lock B
  - Common Solutions (Intersection)
  - Exclusive differences
- **Counterexample Inspector:** When two locks disagree, automatically finds a concrete counterexample arrangement with step-by-step reasoning.
- 5 curated experiments exploring core theorems (Material Implication, The Converse Fallacy, De Morgan's Law, The Contrapositive, and Strict Ordering).

### 3. Challenge Replay
- Timed practice mode using the curated lock pool.
- Stopwatch timer, attempt counter, and 3-star performance ratings.

---

## Installation & Running Locally

```bash
# Navigate to the project directory
cd logic-lock-next

# Install dependencies
npm install

# Start the development server
npm run dev

# Run the test suite
npm test

# Build for production
npm run build
```

---

## Testing

The project includes 35 automated tests verifying:
- **AST & Evaluator:** Equality, inequality, ordering, AND, OR, NOT, Implication (including vacuous truth), and IFF.
- **Level Solvability:** Proves all 10 curated adventure levels have **exactly one unique solution**.
- **Discovery Theorems:** Proves equivalence and counterexample detection for all 5 lab experiments.
- **Gameplay Loops:** Verifies incorrect placement feedback, incomplete lock blocking, and victory completion triggers.

---
