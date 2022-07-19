import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppBody from "./components/app-body";
import AppHeader from "./components/app-header";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <AppBody />
    </div>
  );
}

export default () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
