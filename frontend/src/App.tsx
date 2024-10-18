
import { RouterProvider } from 'react-router-dom';
import './App.css'
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        duration: 2000,
        position: 'top-center',
      }}/>
      <RouterProvider router={router} />
    </>
  );
}

export default App
