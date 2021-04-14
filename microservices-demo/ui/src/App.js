import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import CreateEvent from './CreateEvent'
import UpdateEvent from './UpdateEvent'
import GetAllEvents from './GetAllEvents'

function App() {
  return (
    <div>
     <BrowserRouter>
        <nav>
          <ul>
          <li><Link to="/getAllEvents">GetAllEvents</Link></li>
            <li><Link to="/createEvent">CreateEvent</Link></li>
            <li><Link to="/updateEvent">UpdateEvent</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/createEvent">
            <CreateEvent />
          </Route>
          <Route path="/updateEvent">
            <UpdateEvent />
          </Route>
          <Route path="/">
            <GetAllEvents />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
