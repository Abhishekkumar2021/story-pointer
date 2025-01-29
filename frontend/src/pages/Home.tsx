import React from 'react';
import Header from '../components/Header';
import SessionForm from '../components/SessionForm';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      <Header />
      <SessionForm />
      <Footer />
    </div>
  );
};

export default Home;