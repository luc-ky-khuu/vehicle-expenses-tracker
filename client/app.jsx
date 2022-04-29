import React from 'react';
import Navbar from './components/navbar';
import MyCars from './pages/my-garage';
import Menu from './components/menu';
import CarDetails from './pages/car-details';
import AllRecords from './pages/all-records';
import VehicleId from './lib/vehicleId-context';

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
      route: parseRoute(window.location.hash),
      isLoading: false
    };

  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash),
        isLoading: true
      });
    });
  }

  renderPage() {
    const { route } = this.state;
    const vehicleId = route.params.get('vehicleId');
    const contextValue = { vehicleId };
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
    return <MyCars />;
  }

  render() {
    return (
      <>
        <Navbar route={this.state.route.path}/>
        <div className="container">
          <div className='justify-content-center row'>
            <div className="col-lg-2 d-none d-lg-block px-0">
              <Menu />
            </div>
            <div className="text-center col-lg-10 ">
              {this.renderPage()}
            </div>
          </div>
        </div>
      </>
    );
  }
}
