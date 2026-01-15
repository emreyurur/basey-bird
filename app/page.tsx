import GameCanvas from '@/components/GameCanvas';

export default function Home() {
  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      <GameCanvas />
    </main>
  );
}
