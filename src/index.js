import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './components/NotFound';
import ShopContainer from './components/ShopContainer';
import OrderPlaceCard from './components/OrderPlaceCard';
import POSContextWrapper from './contexts/PosContext';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'shop',
        Component: ShopContainer,
      },
      {
        path: 'orders',
        Component: OrderPlaceCard,
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <POSContextWrapper>
      <RouterProvider router={router} />
    </POSContextWrapper>
  </React.StrictMode>
);

reportWebVitals();
