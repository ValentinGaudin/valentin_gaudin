import React from 'react';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Title from '../component/Title';
import Xperience from '../component/Xperience';

export default function Index() {
  return (
    <div>
      <Header />
        <body>
          <Title name="Home"/>
          <Xperience />
        </body>
      <Footer />
    </div>
  )
}