import React from 'react';
import { Card, Table } from 'react-bootstrap';

class CarDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car: {}
    };
    this.makeTable = this.makeTable.bind(this);
  }

  componentDidMount() {
    fetch(`/api/garage/recent-history/${this.props.vehicleId}`)
      .then(result => result.json())
      .then(result => {
        this.setState({
          car: result
        });
      })
      .catch(err => console.error(err));
  }

  combineSameDayRecords(records) {
    const newArr = [];
    let newObj = {
      datePerformed: records[0].datePerformed,
      maintenanceName: records[0].maintenanceName,
      mileage: records[0].mileage
    };
    for (let i = 1; i < records.length; i++) {
      if (newObj.datePerformed === records[i].datePerformed) {
        newObj.datePerformed = records[i].datePerformed;
        newObj.maintenanceName += `, ${records[i].maintenanceName}`;
        newObj.mileage = records[i].mileage;
      } else {
        newArr.push(newObj);
        newObj = {
          datePerformed: records[i].datePerformed,
          maintenanceName: records[i].maintenanceName,
          mileage: records[i].mileage
        };
      }

    }
    newArr.push(newObj);
    return newArr;
  }

  makeTable() {
    const newDesc = (this.combineSameDayRecords(this.state.car.records));
    return newDesc.map((car, index) => {
      const { datePerformed, maintenanceName: name, mileage } = car;
      return (
        <tr key={index} className='open-sans'>
          <td colSpan={1} className='text-start'>{datePerformed}</td>
          <td colSpan={2} className='text-start'>{name}</td>
          <td colSpan={1} className='text-end'>{mileage.toLocaleString()}</td>
        </tr>
      );
    });

  }

  render() {
    let { year, make, model, photoUrl } = this.state.car;
    if (!photoUrl) {
      photoUrl = 'https://proximaride.com/images/car_placeholder2.png';
    }
    return (
      <>
        <div className="row">
          <h1 className='py-3 work-sans fw-bold text-capitalize'>{year} {make} {model}</h1>
        </div>
        <div className="row ">
          <Card.Img className='shadow p-0' src={photoUrl} alt="" />
        </div>
        <div className="row my-3 rounded overflow-hidden">
          <Table className='m-0' hover striped>
            <thead className=''>
              <tr className='bg-navbar-menu'>
                <th colSpan={4}>
                  <h2 className=' text-start m-0 work-sans'>Recent Records</h2>
                </th>
              </tr>
            </thead>
            <tbody className='fs-4'>
              {this.state.car.records && this.state.car.records.length > 1 ? this.makeTable() : <tr className='disabled'><td>No Records To Display</td></tr>}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default CarDetails;
