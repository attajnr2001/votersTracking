import theme from "./helpers/Theme";
import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ElectoralAreas from "./components/ElectoralAreas";
import History from "./components/History";
import Gallery from "./components/Gallery";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import RootLayout from "./layouts/RootLayout";
import PrivateRoute from "./helpers/PrivateRoute";
import store from "./store";
import Users from "./components/Users";
import Groups from "./components/Groups";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="dashboard" element={<RootLayout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="electoral-areas" element={<ElectoralAreas />} />
            <Route path="history" element={<History />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="groups" element={<Groups />} /> 
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
