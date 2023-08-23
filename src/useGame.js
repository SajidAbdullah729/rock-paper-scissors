import { create } from "zustand";

export default create((set) => ({
  player: null,
  setPlayer: (choice) => set({ player: choice }),

  computer: null,
  setComputer: (choice) => set({ computer: choice }),

  winner: null,
  setWinner: (w) => set({ winner: w }),

  round: 0,
  nextRound: () => set((state) => ({ round: state.round + 1 })),
  resetRound: () => set({ round: 0 }),
  setRound: (num) => set({ round: num }),

  playerScore: 0,
  setPlayerScore: (score) => set({ playerScore: score }),

  computerScore: 0,
  setComputerScore: (score) => set({ computerScore: score }),

  playerWinsTotal: 0,
  setPlayerWinsTotal: (wins) => set({ playerWinsTotal: wins }),

  computerWinsTotal: 0,
  setComputerWinsTotal: (wins) => set({ computerWinsTotal: wins }),

  mode: "endless", // "threeWins", "fiveWins", "endless"
  setMode: (gameMode) => set({ mode: gameMode }),

  phase: "ready", // "playing", "ended"
  setPhase: (gamePhase) => set({ phase: gamePhase }),

  start: () => set((state) => (state.phase === "ready" ? { phase: "playing" } : {})),

  restart: () => set((state) => ({ phase: "ready" })),

  end: () => set((state) => (state.phase === "playing" ? { phase: "ended" } : {})),
}));
