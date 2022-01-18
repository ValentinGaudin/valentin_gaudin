import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Title from '../components/Title';
import Xperience from '../components/Xperience';

export default function Index() {



  return (
      <>
      <Header />
        <body>
          <Title name="Home"/>
          <Xperience />
        </body>
      <Footer />
      </>
  )
}