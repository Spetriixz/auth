import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignUp } from './components/SignUp.tsx';
import Status from './components/status.tsx';
import Home from './App.tsx';
import { SignIn } from './components/SignIn.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/status" element={<Status />} />
    </Routes>
  </BrowserRouter>,
)
