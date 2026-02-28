import { GameScene } from './components/GameScene';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <GameScene />
    </ErrorBoundary>
  );
}

export default App;
