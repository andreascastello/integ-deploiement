import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RegistrationForm from './components/RegistrationForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrationForm />
  </StrictMode>,
)

export default RegistrationForm;