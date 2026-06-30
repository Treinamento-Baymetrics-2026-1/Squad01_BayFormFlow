import './App.css';
import { RouterProvider } from 'react-router-dom';
import { Router } from '../router/routes';

function App() {
  return <RouterProvider router={Router} />;
}

export default App;