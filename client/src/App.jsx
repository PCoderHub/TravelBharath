import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
