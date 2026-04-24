/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hand, 
  Scissors, 
  Scroll, 
  Bug, 
  Zap, 
  RotateCcw,
  Trophy,
  User,
  Monitor
} from 'lucide-react';
import { Choice, GameState } from './types';
import { CHOICES, RULES, VERBS } from './constants';

const CHOICE_ICONS: Record<Choice, any> = {
  rock: Hand,
  paper: Scroll,
  scissors: Scissors,
  lizard: Bug,
  spock: Zap,
};

const CHOICE_COLORS: Record<Choice, string> = {
  rock: 'text-neon-cyan border-neon-cyan',
  paper: 'text-neon-magenta border-neon-magenta',
  scissors: 'text-neon-yellow border-neon-yellow',
  lizard: 'text-neon-green border-neon-green',
  spock: 'text-neon-blue border-neon-blue',
};

const CHOICE_BG_COLORS: Record<Choice, string> = {
  rock: 'bg-neon-cyan/10',
  paper: 'bg-neon-magenta/10',
  scissors: 'bg-neon-yellow/10',
  lizard: 'bg-neon-green/10',
  spock: 'bg-neon-blue/10',
};

export default function App() {
  const [state, setState] = useState<GameState>({
    playerChoice: null,
    computerChoice: null,
    result: null,
    playerScore: 0,
    computerScore: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const determineResult = (player: Choice, computer: Choice): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    return RULES[player].includes(computer) ? 'win' : 'lose';
  };

  const handleChoice = useCallback((playerChoice: Choice) => {
    if (isPlaying) return;
    setIsPlaying(true);

    const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const result = determineResult(playerChoice, computerChoice);

    setState(prev => ({
      ...prev,
      playerChoice,
      computerChoice,
      result,
      playerScore: result === 'win' ? prev.playerScore + 1 : prev.playerScore,
      computerScore: result === 'lose' ? prev.computerScore + 1 : prev.computerScore,
    }));

    setTimeout(() => setIsPlaying(false), 2000);
  }, [isPlaying]);

  const resetGame = () => {
    setState({
      playerChoice: null,
      computerChoice: null,
      result: null,
      playerScore: 0,
      computerScore: 0,
    });
  };

  const getResultText = () => {
    const { playerChoice, computerChoice, result } = state;
    if (!playerChoice || !computerChoice || result === 'draw') return result === 'draw' ? "It's a Draw!" : '';
    
    if (result === 'win') {
      const verb = VERBS[`${playerChoice}-${computerChoice}`];
      return `${playerChoice.toUpperCase()} ${verb} ${computerChoice.toUpperCase()}! You Win!`;
    } else {
      const verb = VERBS[`${computerChoice}-${playerChoice}`];
      return `${computerChoice.toUpperCase()} ${verb} ${playerChoice.toUpperCase()}! Computer Wins!`;
    }
  };

  return (
    <div className="min-h-screen bg-space-bg flex flex-col items-center justify-center p-4 selection:bg-neon-cyan/30">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-8"
      >
        {/* Header & Scoreboard */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-space-card p-6 rounded-2xl border border-space-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan" />
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white neon-text-cyan flex items-center gap-2">
              RPSLS <span className="text-xs font-mono text-neon-cyan uppercase tracking-widest opacity-70">v1.0.0</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ultimate Tactical Engine</p>
          </div>

          <div className="flex items-center gap-8 mt-6 md:mt-0">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><User size={10} /> Player</span>
              <span className="text-3xl font-mono font-bold text-neon-cyan transition-all duration-500">{state.playerScore}</span>
            </div>
            <div className="w-px h-10 bg-space-border" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Monitor size={10} /> Matrix</span>
              <span className="text-3xl font-mono font-bold text-neon-magenta transition-all duration-500">{state.computerScore}</span>
            </div>
            <button 
              onClick={resetGame}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Controls (Moved to Top) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {CHOICES.map((choice) => {
            const Icon = CHOICE_ICONS[choice];
            return (
              <motion.button
                key={choice}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                disabled={isPlaying}
                onClick={() => handleChoice(choice)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  state.playerChoice === choice 
                    ? `${CHOICE_COLORS[choice]} bg-white/5` 
                    : 'border-space-border bg-space-card hover:border-gray-500 text-gray-500 hover:text-white'
                }`}
              >
                <div className={`p-3 rounded-lg ${state.playerChoice === choice ? CHOICE_BG_COLORS[choice] : 'bg-white/5'}`}>
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{choice}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Area */}
        <div className="h-10 text-center flex items-center justify-center">
          <AnimatePresence>
            {!isPlaying && state.result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`text-lg font-bold tracking-tight uppercase ${
                  state.result === 'win' ? 'text-neon-green' : state.result === 'lose' ? 'text-neon-magenta' : 'text-gray-400'
                }`}
              >
                {getResultText()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Play Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[360px]">
          <AnimatePresence mode="wait">
            {!state.playerChoice ? (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:col-span-2 flex flex-col items-center justify-center bg-space-card/50 rounded-2xl border border-dashed border-space-border p-12"
              >
                <div className="w-20 h-20 rounded-full border border-neon-cyan/20 flex items-center justify-center animate-pulse mb-4">
                  <Trophy className="text-neon-cyan opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">System Ready</h3>
                <p className="text-gray-500 text-sm">Select your tactical move to engage the Matrix.</p>
              </motion.div>
            ) : (
              <>
                {/* Player Choice Display */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-space-card rounded-2xl border border-space-border p-8 flex flex-col items-center justify-center relative shadow-inner overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <span className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase tracking-widest">Player Signature</span>
                  {state.playerChoice && (
                    <motion.div
                      initial={{ scale: 0.5, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`w-32 h-32 rounded-full border-4 ${CHOICE_COLORS[state.playerChoice]} ${CHOICE_BG_COLORS[state.playerChoice]} flex items-center justify-center shadow-2xl transition-all duration-500`}
                    >
                      {(() => {
                        const Icon = CHOICE_ICONS[state.playerChoice];
                        return <Icon size={48} strokeWidth={2.5} />;
                      })()}
                    </motion.div>
                  )}
                  <p className="mt-6 text-xl font-black text-white uppercase tracking-tighter">{state.playerChoice}</p>
                </motion.div>

                {/* Computer Choice Display */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-space-card rounded-2xl border border-space-border p-8 flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                   <span className="absolute top-4 right-4 text-[10px] text-gray-500 uppercase tracking-widest text-right">Matrix Output</span>
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div 
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-32 h-32 rounded-full border-4 border-dashed border-neon-magenta/30 flex items-center justify-center"
                      >
                        <RotateCcw className="text-neon-magenta opacity-50" />
                      </motion.div>
                    ) : (
                      state.computerChoice && (
                        <motion.div
                          key="result"
                          initial={{ scale: 0.5, rotate: 20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`w-32 h-32 rounded-full border-4 ${CHOICE_COLORS[state.computerChoice]} ${CHOICE_BG_COLORS[state.computerChoice]} flex items-center justify-center shadow-2xl transition-all duration-500`}
                        >
                          {(() => {
                            const Icon = CHOICE_ICONS[state.computerChoice];
                            return <Icon size={48} strokeWidth={2.5} />;
                          })()}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                  <p className="mt-6 text-xl font-black text-white uppercase tracking-tighter">
                    {isPlaying ? 'CALCULATING...' : state.computerChoice}
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="text-center pt-8">
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em] font-medium">
            Project: Rock Paper Scissors Lizard Spock // Deep Space Edition
          </p>
        </div>
      </motion.div>
    </div>
  );
}
