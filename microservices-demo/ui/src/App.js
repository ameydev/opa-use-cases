import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import CreateEvent from './CreateEvent'
import GetAllEvents from './GetAllEvents'

function App() {
  return (
    <div>
     <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/createEvent">CreateEvent</Link></li>
            <li><Link to="/getAllEvents">GetAllEvents</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/createEvent">
            <CreateEvent />
          </Route>
          <Route path="/getAllEvents">
            <GetAllEvents />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
