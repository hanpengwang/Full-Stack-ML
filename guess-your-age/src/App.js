import "./App.css";
import HeadLogo from "./components/HeadLogo";
import ImageHolder from "./components/ImageHolder";
import AnimatedBcg from "./components/AnimatedBcg";

function App() {
  return (
    <div className="App">
      <AnimatedBcg />
      <HeadLogo />
      <ImageHolder />
    </div>
  );
}

export default App;
