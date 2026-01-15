'use client';

import { useEffect, useRef, useState } from 'react';

type GameState = 'welcome' | 'playing' | 'collision' | 'gameOver';

interface Pipe {
  x: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [highScore, setHighScore] = useState(0);
  const gameStateRef = useRef<GameState>('welcome');
  const animationFrameRef = useRef<number | undefined>(undefined);
  const tryAgainButtonRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Game constants - FINE-TUNED FOR LESS SENSITIVITY
  const GRAVITY = 0.45; // Balanced gravity for controlled descent
  const JUMP_FORCE = -6.5; // Reduced jump strength for heavier feel & micro-adjustments
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 220;
  const PIPE_SPEED = 2.5;
  const BIRD_RADIUS = 20;
  const PIPE_SPAWN_INTERVAL = 120;
  const FIRST_PIPE_DELAY = 60;
  const COLLISION_ANIMATION_DURATION = 30; // Frames for particle explosion

  // Colors - Base Blockchain Theme
  const BASE_BLUE = '#0052FF';
  const BACKGROUND_GRADIENT_START = '#F0F4FF';
  const BACKGROUND_GRADIENT_END = '#FFFFFF';
  const PIPE_COLOR = '#1A1A1A';
  const TEXT_COLOR = '#1A1A1A';
  const NODE_COLOR = 'rgba(0, 82, 255, 0.08)';
  const GRID_COLOR = 'rgba(0, 82, 255, 0.05)';

  // Game state
  const gameRef = useRef({
    bird: {
      x: 0,
      y: 0,
      velocity: 0,
      radius: BIRD_RADIUS,
      hoverOffset: 0,
      rotation: 0,
    },
    pipes: [] as Pipe[],
    particles: [] as Particle[],
    score: 0,
    frameCount: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    flashFrame: false,
    collisionAnimationFrame: 0,
  });

  // Create particle explosion on collision
  const createParticleExplosion = (x: number, y: number) => {
    const game = gameRef.current;
    game.particles = [];

    // Spawn 15 particles exploding outward
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 3 + Math.random() * 3;
      game.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        life: 0,
        maxLife: 30 + Math.random() * 20,
      });
    }
  };

  // Update and draw particles
  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const game = gameRef.current;

    for (let i = game.particles.length - 1; i >= 0; i--) {
      const p = game.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity on particles
      p.life++;

      // Remove dead particles
      if (p.life >= p.maxLife) {
        game.particles.splice(i, 1);
        continue;
      }

      // Draw particle with fading alpha
      const alpha = 1 - p.life / p.maxLife;
      ctx.fillStyle = `rgba(0, 82, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // White inner glow
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Draw blockchain-inspired background
  const drawBlockchainBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, frameCount: number) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, BACKGROUND_GRADIENT_START);
    gradient.addColorStop(1, BACKGROUND_GRADIENT_END);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid pattern
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    const gridSize = 60;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw animated blockchain nodes (circles and connecting lines)
    const nodes = [
      { x: width * 0.15, y: height * 0.2 },
      { x: width * 0.35, y: height * 0.35 },
      { x: width * 0.65, y: height * 0.25 },
      { x: width * 0.85, y: height * 0.4 },
      { x: width * 0.25, y: height * 0.65 },
      { x: width * 0.75, y: height * 0.7 },
      { x: width * 0.5, y: height * 0.85 },
    ];

    // Animate node positions slightly
    const animationOffset = Math.sin(frameCount * 0.01) * 3;

    // Draw connecting lines between nodes
    ctx.strokeStyle = NODE_COLOR;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < width * 0.4) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y + animationOffset);
          ctx.lineTo(nodes[j].x, nodes[j].y + animationOffset);
          ctx.stroke();
        }
      }
    }

    // Draw node circles
    ctx.fillStyle = NODE_COLOR;
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y + animationOffset, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer ring
      ctx.strokeStyle = NODE_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y + animationOffset, 8, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawGameOverCard = (ctx: CanvasRenderingContext2D, width: number, height: number, score: number, bestScore: number) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Card dimensions
    const cardWidth = Math.min(450, width * 0.85);
    const cardHeight = 380;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const borderRadius = 24;

    // Draw card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Draw card background
    drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Add subtle border
    ctx.strokeStyle = 'rgba(0, 82, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw "GAME OVER" title
    ctx.fillStyle = BASE_BLUE;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', width / 2, cardY + 80);

    // Draw decorative line under title
    const lineWidth = 120;
    ctx.strokeStyle = BASE_BLUE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - lineWidth / 2, cardY + 100);
    ctx.lineTo(width / 2 + lineWidth / 2, cardY + 100);
    ctx.stroke();

    // Draw score section
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '28px Arial';
    ctx.fillText('SCORE', width / 2, cardY + 160);

    ctx.fillStyle = BASE_BLUE;
    ctx.font = 'bold 56px Arial';
    ctx.fillText(score.toString(), width / 2, cardY + 215);

    // Draw best score
    ctx.fillStyle = 'rgba(26, 26, 26, 0.6)';
    ctx.font = '24px Arial';
    ctx.fillText(`BEST: ${bestScore}`, width / 2, cardY + 260);

    // Draw "TRY AGAIN" button
    const buttonWidth = 200;
    const buttonHeight = 55;
    const buttonX = (width - buttonWidth) / 2;
    const buttonY = cardY + cardHeight - 85;
    const buttonRadius = 12;

    // Store button bounds for click detection
    tryAgainButtonRef.current = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    };

    // Button shadow
    ctx.shadowColor = 'rgba(0, 82, 255, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    // Draw button
    drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius);
    ctx.fillStyle = BASE_BLUE;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Button text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TRY AGAIN', width / 2, buttonY + 35);
  };

  const drawBird = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Add subtle shadow for depth
    ctx.shadowColor = 'rgba(0, 82, 255, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;

    // Draw the main blue circle (Base logo)
    ctx.fillStyle = BASE_BLUE;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw a white arc inside to mimic the Base logo
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, Math.PI * 0.2, Math.PI * 1.8);
    ctx.stroke();

    // Draw a small white circle in the center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, height: number) => {
    const { x, gapY, gapHeight } = pipe;

    // Draw top pipe
    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(x, 0, PIPE_WIDTH, gapY);

    // Draw pipe cap (top)
    ctx.fillRect(x - 5, gapY - 20, PIPE_WIDTH + 10, 20);

    // Draw bottom pipe
    ctx.fillRect(x, gapY + gapHeight, PIPE_WIDTH, height - (gapY + gapHeight));

    // Draw pipe cap (bottom)
    ctx.fillRect(x - 5, gapY + gapHeight, PIPE_WIDTH + 10, 20);

    // Add some detail lines to pipes
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, PIPE_WIDTH, gapY);
    ctx.strokeRect(x, gapY + gapHeight, PIPE_WIDTH, height - (gapY + gapHeight));
  };

  const checkCollision = (game: typeof gameRef.current): boolean => {
    const { bird, pipes, canvasHeight } = game;

    // Check floor and ceiling collision
    if (bird.y + bird.radius > canvasHeight || bird.y - bird.radius < 0) {
      return true;
    }

    // Check pipe collision
    for (const pipe of pipes) {
      const birdLeft = bird.x - bird.radius;
      const birdRight = bird.x + bird.radius;
      const birdTop = bird.y - bird.radius;
      const birdBottom = bird.y + bird.radius;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      // Check if bird is horizontally aligned with pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird hits top or bottom pipe
        if (birdTop < pipe.gapY || birdBottom > pipe.gapY + pipe.gapHeight) {
          return true;
        }
      }
    }

    return false;
  };

  const resetGame = () => {
    const game = gameRef.current;
    game.bird.y = game.canvasHeight / 2;
    game.bird.velocity = 0;
    game.bird.hoverOffset = 0;
    game.bird.rotation = 0;
    game.pipes = [];
    game.particles = [];
    game.score = 0;
    game.frameCount = 0;
    game.flashFrame = false;
    game.collisionAnimationFrame = 0;
  };

  const handleJump = () => {
    if (gameStateRef.current === 'welcome') {
      gameStateRef.current = 'playing';
      resetGame();
      // Apply initial jump force for smooth transition
      gameRef.current.bird.velocity = JUMP_FORCE;
    } else if (gameStateRef.current === 'playing') {
      gameRef.current.bird.velocity = JUMP_FORCE;
    }
    // Game over state is handled by handleGameOverClick
  };

  const handleGameOverClick = (x: number, y: number) => {
    if (gameStateRef.current !== 'gameOver') return;

    const button = tryAgainButtonRef.current;
    
    // Check if click is within button bounds
    if (
      x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height
    ) {
      gameStateRef.current = 'welcome';
      resetGame();
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;

    // Flash effect (1 frame white flash on collision)
    if (game.flashFrame) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(0, 0, game.canvasWidth, game.canvasHeight);
      game.flashFrame = false;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Draw blockchain-inspired background
    drawBlockchainBackground(ctx, game.canvasWidth, game.canvasHeight, game.frameCount);

    if (gameStateRef.current === 'welcome') {
      // Hovering bird animation for welcome screen
      game.frameCount++;
      game.bird.hoverOffset = Math.sin(game.frameCount * 0.05) * 15;
      const birdY = game.canvasHeight / 2 + game.bird.hoverOffset;
      
      drawBird(ctx, game.bird.x, birdY, game.bird.radius, 0);

      // Draw welcome text
      ctx.fillStyle = BASE_BLUE;
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WELCOME TO', game.canvasWidth / 2, game.canvasHeight / 2 - 120);
      ctx.font = 'bold 64px Arial';
      ctx.fillText('BASEY BIRD', game.canvasWidth / 2, game.canvasHeight / 2 - 60);

      ctx.fillStyle = TEXT_COLOR;
      ctx.font = '28px Arial';
      ctx.fillText('Tap to Start', game.canvasWidth / 2, game.canvasHeight / 2 + 80);

      if (highScore > 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(26, 26, 26, 0.6)';
        ctx.fillText(`High Score: ${highScore}`, game.canvasWidth / 2, game.canvasHeight / 2 + 130);
      }
    } else if (gameStateRef.current === 'playing') {
      // Update bird physics
      game.bird.velocity += GRAVITY;
      game.bird.y += game.bird.velocity;

      // Calculate bird rotation based on velocity
      // Tilt up (-20deg = -0.35rad) when jumping, tilt down (90deg = 1.57rad max) when falling
      const targetRotation = Math.max(-0.35, Math.min(1.57, game.bird.velocity * 0.08));
      game.bird.rotation = targetRotation;

      // Generate pipes with delay for first pipe
      game.frameCount++;
      if (game.frameCount >= FIRST_PIPE_DELAY && (game.frameCount - FIRST_PIPE_DELAY) % PIPE_SPAWN_INTERVAL === 0) {
        // Ensure gap is well-positioned (not too high or low)
        const minGapY = 100;
        const maxGapY = game.canvasHeight - PIPE_GAP - 100;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        game.pipes.push({
          x: game.canvasWidth,
          gapY,
          gapHeight: PIPE_GAP,
          passed: false,
        });
      }

      // Update and draw pipes
      for (let i = game.pipes.length - 1; i >= 0; i--) {
        const pipe = game.pipes[i];
        pipe.x -= PIPE_SPEED;

        // Check if bird passed the pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < game.bird.x) {
          pipe.passed = true;
          game.score++;
        }

        // Remove off-screen pipes
        if (pipe.x + PIPE_WIDTH < 0) {
          game.pipes.splice(i, 1);
        } else {
          drawPipe(ctx, pipe, game.canvasHeight);
        }
      }

      // Draw bird
      drawBird(ctx, game.bird.x, game.bird.y, game.bird.radius, game.bird.rotation);

      // Check collision
      if (checkCollision(game)) {
        // Trigger collision animation
        gameStateRef.current = 'collision';
        game.flashFrame = true;
        game.collisionAnimationFrame = 0;
        createParticleExplosion(game.bird.x, game.bird.y);
        
        if (game.score > highScore) {
          const newHighScore = game.score;
          setHighScore(newHighScore);
          // Save to localStorage
          try {
            localStorage.setItem('baseyBirdHighScore', newHighScore.toString());
          } catch (e) {
            console.error('Failed to save high score:', e);
          }
        }
      }

      // Draw score
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 5;
      ctx.fillText(game.score.toString(), game.canvasWidth / 2, 80);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else if (gameStateRef.current === 'collision') {
      // Collision animation state - show particle explosion
      game.collisionAnimationFrame++;

      // Draw frozen game state
      for (const pipe of game.pipes) {
        drawPipe(ctx, pipe, game.canvasHeight);
      }
      drawBird(ctx, game.bird.x, game.bird.y, game.bird.radius, game.bird.rotation);

      // Update and draw particles
      updateAndDrawParticles(ctx);

      // After animation completes, transition to game over
      if (game.collisionAnimationFrame >= COLLISION_ANIMATION_DURATION) {
        gameStateRef.current = 'gameOver';
      }
    } else if (gameStateRef.current === 'gameOver') {
      // Draw final state (frozen game)
      for (const pipe of game.pipes) {
        drawPipe(ctx, pipe, game.canvasHeight);
      }
      drawBird(ctx, game.bird.x, game.bird.y, game.bird.radius, game.bird.rotation);

      // Draw any remaining particles
      if (game.particles.length > 0) {
        updateAndDrawParticles(ctx);
      }

      // Draw polished game over card with button
      drawGameOverCard(ctx, game.canvasWidth, game.canvasHeight, game.score, highScore);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load high score from localStorage
    try {
      const savedHighScore = localStorage.getItem('baseyBirdHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    } catch (e) {
      console.error('Failed to load high score:', e);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const game = gameRef.current;
      game.canvasWidth = canvas.width;
      game.canvasHeight = canvas.height;
      game.bird.x = canvas.width * 0.25;
      game.bird.y = canvas.height / 2;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start game loop
    gameLoop();

    // Event listeners for input
    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      
      // Get click/touch coordinates
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Handle game over state separately (button click only)
      if (gameStateRef.current === 'gameOver') {
        handleGameOverClick(x, y);
      } else {
        // Welcome or playing state - jump anywhere
        handleJump();
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        touchAction: 'none',
        cursor: 'pointer',
      }}
    />
  );
};

export default GameCanvas;
