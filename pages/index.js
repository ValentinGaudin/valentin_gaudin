import React from 'react';
import Header from '../components/header';
import Home from './home';

export default function Index() {
  return (
    <div>
      <Header 
      info="Home"/>
      <Home />
    </div>
  )
}