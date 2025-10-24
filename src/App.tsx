import APP_CONFIG from '@/config/app.config';

/**
 * Main application component for the Fluent app
 * This is the root component that renders the entire application
 */
function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-white mb-8">Hello, {APP_CONFIG.name}!</h1>
        <p className="text-lg text-gray-300">
          Your journey to confident communication starts here.
        </p>
      </header>
    </div>
  );
}

export default App;
