import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <RegistrationForm />
  </StrictMode>,
)
