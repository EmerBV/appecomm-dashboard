import AppRouter from './routes/AppRouter';
import Toast from './components/ui/Toast';

function App() {
  return (
    <>
      <Toast position="top-right" />
      <AppRouter />
    </>
  );
}

export default App;
