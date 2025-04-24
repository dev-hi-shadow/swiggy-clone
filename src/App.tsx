import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RouterComponent from "./routes";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouterComponent />
    </Router>
  );
}
