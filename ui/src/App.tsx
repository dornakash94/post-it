import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Page from "./components/page";
import AppHeader from "./components/app-header";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <br />
      <Page />
    </div>
  );
}

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default AppWrapper;
