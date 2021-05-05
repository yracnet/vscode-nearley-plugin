import './MainApp.scss';
import { Navbar } from '_/components/Navbar';
import { Home } from './home';

// Rename MainApp to [Project Name]App
function MainApp() {
  return (
    <div className="MainApp">
      <Navbar name="Your App" />
      <div className="container my-2">
        <Home />
      </div>
    </div>
  );
}

export default MainApp;
