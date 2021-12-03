import React from 'react';
import Header from '../components/header';
import Home from './home';


export default function Index() {
  return (
    <div>
      <title>Valentin Gaudin</title>
      <Header 
      info="Home"/>
      <Home />
    </div>
  )
}