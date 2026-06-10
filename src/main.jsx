import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  GoogleReCaptchaProvider
} from "react-google-recaptcha-v3";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey="6LdYUBUtAAAAAPh2bsIf3x9j9nHWD75c-BwH92Ga"
    >
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>
)
