import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppBody from "./components/app-body";
import AppHeader from "./components/app-header";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import AppFooter from "./components/app-footer";

export default () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppHeader />
      <AppBody />
      <AppFooter />
    </BrowserRouter>
  </Provider>
);
