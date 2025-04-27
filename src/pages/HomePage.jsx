import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to EncoreLando</h1>
      <p className="text-center text-lg mb-4">
        Your comprehensive source for Orlando theme park concerts and performances
      </p>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <p className="text-center">
          Coming soon! We're building a platform to help you discover and track all the amazing live
          performances happening at Orlando's theme parks.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
