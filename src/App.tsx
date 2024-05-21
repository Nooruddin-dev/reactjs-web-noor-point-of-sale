import React, { useEffect } from 'react';
import logo from './logo.svg';
import '../src/_poscommon/common/assets/css/common-global.css'


import { store, persistedStore } from "./app/globalStore/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import RouteConfig from './app/routing/RouteConfig';

function App() {
  const user: any = {userType: 'admin'};



  useEffect(() => {
    // Add class to body when component mounts (site loads for the first time)
    document.body.classList.add('page-loading');

    // Set timeout to remove the class after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      document.body.classList.remove('page-loading');
    }, 2000);

    // Clean-up function to clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistedStore}>
        <RouteConfig/>
      </PersistGate>
    </Provider>
  );
}

export default App;
