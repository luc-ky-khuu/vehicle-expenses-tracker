/* global google */

import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

let center = {
  lat: 33.680,
  lng: -117.828
};
class MyComponents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      infoWindow: false,
      currentLocation: null,
      places: ''
    };
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.createMarker = this.createMarker.bind(this);
  }

  getLocation() {
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        center: center,
        zoom: 13,
        streetViewControl: false
      });
    navigator.geolocation.getCurrentPosition(
      position => {
        center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const request = {
          query: 'Mechanic',
          location: center,
          radius: '300'
        };
        const service = new google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.setState({
              currentLocation: center,
              places: results
            }, () => {
              map.setCenter(this.state.currentLocation);
            });
          }
        });
      });
  }

  openInfoWindow(index) {
    this.setState({
      infoWindow: index
    });
  }

  closeInfoWindow() {
    this.setState({
      infoWindow: null
    });
  }

  myLocationMarker(location) {
    return (
      <>
        <Marker icon={'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png'} position={location} onClick={() => this.openInfoWindow('myLocation')}>
          {this.state.infoWindow === 'myLocation' && <InfoWindow position={location} onCloseClick={() => this.closeInfoWindow()}>
            <div>
              <p className='fw-bolder m-0'>Your Location</p>
            </div>
          </InfoWindow>}
        </Marker>
      </>
    );
  }

  createMarker(place, index) {
    const { formatted_address: address, geometry, name } = place;
    const splitAddress = address.split(',');
    return (
      <>
        <Marker key={index} position={geometry.location} onClick={() => this.openInfoWindow(index)}>
          {this.state.infoWindow === index && <InfoWindow position={geometry.location} key={`A${index}`} onCloseClick={() => this.closeInfoWindow()}>
            <div key={`B${index}`}>
              <p className='fw-bolder m-0'>{name}</p>
              <p className='m-0'>{splitAddress[0]}</p>
              <p className='m-0'>{splitAddress[1]}</p>
              <p className='m-0'>{splitAddress[2]}</p>
            </div>
          </InfoWindow>}
        </Marker>
      </>
    );
  }

  render() {
    const defaultMapOptions = {
      disableDefaultUI: true
    };
    return (
      <>
        <div className=' h-100 position-relative'>
          <button className='mt-2 btn btn-light search-button position-absolute' onClick={this.getLocation}>Search Mechanics Near Me</button>
          <div id="map"></div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            mapContainerClassName=''
            center={this.state.currentLocation ? this.state.currentLocation : center}
            zoom={14}
            options={defaultMapOptions}
          >
            {this.state.places && this.state.places.map((place, index) => this.createMarker(place, index))}
            {this.state.places && this.myLocationMarker(this.state.currentLocation)}
          </GoogleMap>
        </div>
      </>
    );
  }
}

export default MyComponents;
