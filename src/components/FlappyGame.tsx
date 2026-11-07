import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Copy,
  Check,
  Award,
  Sparkles,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import contentData from '../data/contentData.json';

// Declare window callback types
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

interface FlappyGameProps {
  onBackToMainMenu: () => void;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onBackToMainMenu }) => {
  const { gameConfig } = contentData;

  // Game state
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver' | 'won'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [latestVoucher, setLatestVoucher] = useState<{ code: string; date: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Audio Context for synthetic sound effects (default off)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked
    }
  };

  // Game Physics & Objects Ref
  const gameRef = useRef({
    bird: {
      x: 70,
      y: 200,
      width: 44,
      height: 30,
      velocity: 0,
      rotation: 0
    },
    pipes: [] as Array<{
      x: number;
      topHeight: number;
      bottomY: number;
      passed: boolean;
    }>,
    pipeTimer: 0,
    width: 480,
    height: 480,
    shake: 0
  });

  // Load high score and latest voucher from localStorage
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('vb_flappy_high_score');
      if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));

      const savedVoucher = localStorage.getItem('vb_flappy_latest_voucher');
      if (savedVoucher) {
        setLatestVoucher(JSON.parse(savedVoucher));
      }
    } catch {
      // ignore
    }
  }, []);

  // Generate Voucher code VB-XXXXXX
  const generateVoucherCode = useCallback(() => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  }, []);

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Encouragement quote according to score
  const getEncouragement = (currentScore: number) => {
    if (currentScore < 5) return 'Khởi động nhẹ nhàng!';
    if (currentScore < 10) return 'Tốt lắm, tiếp tục nào!';
    if (currentScore < 15) return 'Một nửa chặng đường rồi!';
    if (currentScore < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Win Game logic
  const winGame = useCallback(() => {
    setGameState('won');
    const newCode = generateVoucherCode();
    setVoucherCode(newCode);

    const voucherData = {
      code: newCode,
      date: new Date().toLocaleDateString('vi-VN')
    };
    setLatestVoucher(voucherData);

    try {
      localStorage.setItem('vb_flappy_latest_voucher', JSON.stringify(voucherData));
      localStorage.setItem('vb_flappy_high_score', '20');
      setHighScore(20);
    } catch {
      // ignore
    }

    // Call window callback
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: 20,
        voucherCode: newCode,
        reward: gameConfig.voucherText,
        timestamp: new Date().toISOString()
      });
    }

    // Sound & Confetti
    playBeep(587.33, 'triangle', 0.2);
    setTimeout(() => playBeep(880, 'triangle', 0.4), 150);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [gameConfig.voucherText, generateVoucherCode]);

  // End Game (Lose) logic
  const endGame = useCallback((finalScore: number) => {
    setGameState('gameOver');

    // Light vibrate
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Sound
    playBeep(180, 'sawtooth', 0.25);

    // High score check
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('vb_flappy_high_score', finalScore.toString());
      } catch {
        // ignore
      }
    }

    // Call window callback
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore]);

  // Reset Game
  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.bird.y = g.height / 2;
    g.bird.velocity = 0;
    g.bird.rotation = 0;
    g.pipes = [];
    g.pipeTimer = 0;
    g.shake = 0;
    setScore(0);
    setCopied(false);
  }, []);

  // Jump action
  const jump = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.bird.velocity = gameConfig.jumpForce;
      playBeep(440, 'sine', 0.08);
    } else if (gameState === 'start' || gameState === 'gameOver') {
      resetGame();
      setGameState('playing');
      playBeep(523, 'sine', 0.1);
    }
  }, [gameState, gameConfig.jumpForce, resetGame]);

  // Handle Resize of Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const w = Math.min(container.clientWidth, 480);
      const h = Math.min(window.innerHeight * 0.55, 480);
      canvas.width = w;
      canvas.height = h;
      gameRef.current.width = w;
      gameRef.current.height = h;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;

    const loop = () => {
      const g = gameRef.current;
      const { width, height, bird, pipes } = g;

      // Clear & Background
      ctx.clearRect(0, 0, width, height);

      // Sky Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#E0F2FE'); // light sky blue
      skyGradient.addColorStop(0.8, '#F0F9FF');
      skyGradient.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Distant clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80, 70, 26, 0, Math.PI * 2);
      ctx.arc(110, 65, 36, 0, Math.PI * 2);
      ctx.arc(140, 70, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(320, 110, 20, 0, Math.PI * 2);
      ctx.arc(345, 105, 30, 0, Math.PI * 2);
      ctx.arc(370, 110, 20, 0, Math.PI * 2);
      ctx.fill();

      // Distant bank towers skyline outline
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(40, height - 80, 35, 60);
      ctx.fillRect(100, height - 110, 45, 90);
      ctx.fillRect(220, height - 95, 40, 75);
      ctx.fillRect(360, height - 120, 50, 100);

      // City ground base
      ctx.fillStyle = '#005A9E';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(0, height - 24, width, 4);

      if (gameState === 'playing') {
        // Bird Physics
        bird.velocity += gameConfig.gravity;
        bird.y += bird.velocity;
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.08));

        // Ground collision
        if (bird.y + bird.height / 2 >= height - 20) {
          bird.y = height - 20 - bird.height / 2;
          endGame(localScore);
          return;
        }

        // Ceiling limit
        if (bird.y - bird.height / 2 <= 0) {
          bird.y = bird.height / 2;
          bird.velocity = 0;
        }

        // Pipes generation
        g.pipeTimer += 1;
        if (g.pipeTimer >= 95) {
          g.pipeTimer = 0;
          const minPipe = 40;
          const maxPipe = height - gameConfig.pipeGap - minPipe - 30;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          const bottomY = topHeight + gameConfig.pipeGap;
          pipes.push({
            x: width + 20,
            topHeight,
            bottomY,
            passed: false
          });
        }

        // Move pipes & collision
        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= gameConfig.pipeSpeed;

          // Draw Pipes (Clean bank style column: #003B70 with silver accents)
          const pipeWidth = 52;

          // Top Pipe
          ctx.fillStyle = '#004A82';
          ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
          // Top Pipe Rim
          ctx.fillStyle = '#00335A';
          ctx.fillRect(p.x - 3, p.topHeight - 16, pipeWidth + 6, 16);
          // Highlight stripe
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(p.x + 6, 0, 4, p.topHeight - 16);

          // Bottom Pipe
          const bottomHeight = height - p.bottomY - 20;
          ctx.fillStyle = '#004A82';
          ctx.fillRect(p.x, p.bottomY, pipeWidth, bottomHeight);
          // Bottom Pipe Rim
          ctx.fillStyle = '#00335A';
          ctx.fillRect(p.x - 3, p.bottomY, pipeWidth + 6, 16);
          // Highlight stripe
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(p.x + 6, p.bottomY + 16, 4, bottomHeight);

          // Check pass for score
          if (!p.passed && p.x + pipeWidth < bird.x - bird.width / 2) {
            p.passed = true;
            localScore += 1;
            setScore(localScore);
            playBeep(659, 'sine', 0.08);

            // Check Win Condition
            if (localScore >= gameConfig.winScore) {
              winGame();
              return;
            }
          }

          // Collision Detection (Circle vs Rect hitbox check)
          const birdLeft = bird.x - bird.width / 2 + 4;
          const birdRight = bird.x + bird.width / 2 - 4;
          const birdTop = bird.y - bird.height / 2 + 4;
          const birdBottom = bird.y + bird.height / 2 - 4;

          if (birdRight > p.x && birdLeft < p.x + pipeWidth) {
            if (birdTop < p.topHeight || birdBottom > p.bottomY) {
              endGame(localScore);
              return;
            }
          }

          // Remove offscreen pipes
          if (p.x + pipeWidth < -20) {
            pipes.splice(i, 1);
          }
        }
      }

      // Draw Bird / Flying VietinBank Card Mascot
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // Card body (VietinBank Blue gradient card)
      ctx.fillStyle = '#005A9E';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 5);
      ctx.fill();

      // Red accent curve
      ctx.fillStyle = '#ED1C24';
      ctx.beginPath();
      ctx.roundRect(-22, 6, 44, 5, 2);
      ctx.fill();

      // Chip icon on card
      ctx.fillStyle = '#FCD34D';
      ctx.fillRect(-16, -6, 8, 7);

      // VietinBank text initials
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('VB', 2, -2);

      // Angel Wings
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(-6, -16, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Wing outline
      ctx.strokeStyle = '#BAE6FD';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, gameConfig, endGame, winGame, score]);

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div
      id="flappy-voucher-game"
      className="max-w-2xl mx-auto space-y-6 select-none touch-none"
      style={{ touchAction: 'none' }}
    >
      {/* Header bar of the game container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#005A9E] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
              Minigame Quầy Giao Dịch
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Kỷ lục: {highScore}/20
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {gameConfig.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#005A9E]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onBackToMainMenu}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Progress & Encouragement banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <span>Điểm:</span>
            <strong className="text-base text-[#005A9E]">{score}</strong> / {gameConfig.winScore}
          </span>
          <span className="text-[#005A9E] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            {getEncouragement(score)}
          </span>
        </div>

        {/* Progress bar 0 to 20 */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#005A9E] via-[#0072BC] to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (score / gameConfig.winScore) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Viewport Box */}
      <div
        className="relative bg-sky-100 rounded-3xl overflow-hidden shadow-md border-2 border-slate-200 cursor-pointer flex justify-center items-center"
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full max-w-[480px] h-[360px] sm:h-[420px]"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold tracking-tight">
                {gameConfig.title}
              </h3>
              <p className="text-sm text-sky-100 font-medium max-w-xs">
                {gameConfig.description}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                jump();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>BẮT ĐẦU CHƠI</span>
            </button>

            <p className="text-xs text-sky-200 font-semibold tracking-wide">
              {gameConfig.instruction}
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                Kết quả lượt chơi
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Rất tiếc, bạn đã vượt qua {score}/{gameConfig.winScore} thử thách
              </h3>
              <p className="text-xs text-slate-300">
                {gameConfig.defeatEncouragement}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                  setGameState('playing');
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBackToMainMenu();
                }}
                className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Screen Overlay (PDF 6 requirements) */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                Chúc mừng!
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 font-medium">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>{gameConfig.voucherText}</strong>.
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl w-full max-w-xs shadow-xl space-y-2 border-2 border-amber-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mã Voucher Thưởng
              </span>
              <div className="text-2xl font-black text-[#005A9E] tracking-widest font-mono">
                {voucherCode}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyVoucherCode(voucherCode);
                }}
                className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-[#005A9E] font-bold text-xs rounded-lg border border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép mã!' : 'Sao chép mã'}</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-200 max-w-xs leading-tight">
              {gameConfig.claimInstruction}
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                  setGameState('playing');
                }}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-xs"
              >
                Chơi lại
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBackToMainMenu();
                }}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Latest Voucher History from localStorage (PDF 6 requirement) */}
      {latestVoucher && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Mã voucher gần nhất của bạn
              </span>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {latestVoucher.code}
                <span className="text-xs text-slate-400 font-normal font-sans ml-2">
                  (Ngày {latestVoucher.date})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => copyVoucherCode(latestVoucher.code)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Sao chép</span>
          </button>
        </div>
      )}
    </div>
  );
};
