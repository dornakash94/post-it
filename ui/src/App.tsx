import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Page from "./components/page";
import AppHeader from "./components/app-header";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <br />
      <Page />
    </div>
  );
}

export default App;
