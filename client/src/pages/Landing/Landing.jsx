const Landing = () => {
  return (
    <div className="h-screen bg-no-repeat bg-center bg-cover bg-[url('https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <div className="container mx-auto p-4 pt-24 md:p-8 md:pt-16">
        <h1 className="text-6xl xl:text-8xl font-bold text-center text-lime-600 mb-4 lg:mb-8">
          Travel Bharath
        </h1>
        <p className="text-2xl xl:text-4xl text-center mb-4 lg:mb-8">
          Explore India with us
        </p>
        <div className="flex justify-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-white lg:text-2xl font-bold py-2 px-4 lg:py-4 lg:px-8 rounded-full">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
