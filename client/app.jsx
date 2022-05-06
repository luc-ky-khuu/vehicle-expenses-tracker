import React from 'react';
import Navbar from './components/navbar';
import MyCars from './pages/my-garage';
import Menu from './components/menu';
import CarDetails from './pages/car-details';
import AllRecords from './pages/all-records';
import VehicleId from './lib/vehicleId-context';
import SignUp from './pages/sign-up';

function parseRoute(hashRoute) {
  if (hashRoute.startsWith('#')) {
    hashRoute = hashRoute.replace('#', '');
  }
  const [path, queryString] = hashRoute.split('?');
  const params = new URLSearchParams(queryString);
  return { path, params };
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });

    });
  }

  renderPage() {
    const { route } = this.state;
    const vehicleId = route.params.get('vehicleId');
    const contextValue = { vehicleId };
    if (!navigator.onLine) {
      return (
        <>
          <div className='mt-4'>
            <h1>No Network Connection Detected</h1>
          </div>
        </>
      );
    }
    if (route.path === 'garage') {
      return <MyCars />;
    } else if (route.path === 'garage/myCar') {
      return (
        <VehicleId.Provider value={contextValue}>
          <CarDetails />
        </VehicleId.Provider>
      );
    } else if (route.path === 'vehicle-records') {
      return <AllRecords vehicleId={vehicleId}/>;
    }
    return <SignUp />;
  }

  render() {
    return (
      <>
        <Navbar route={this.state.route.path}/>
        <div className='container'>
          <div className='justify-content-center row'>
            {this.state.route.path &&
            <div className='col-lg-2 d-none d-lg-block px-0'>
              <Menu />
            </div>}
            <div className='text-center col-lg-10 '>
              {this.renderPage()}
            </div>
          </div>
        </div>
      </>
    );
  }
}
