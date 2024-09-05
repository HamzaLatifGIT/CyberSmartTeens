import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Components :
import App from './App.jsx'

// Redux
import { store } from './Redux/store';
import { Provider } from 'react-redux';

// CSS :
import './index.scss'






createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
