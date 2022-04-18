import React from 'react';
import { Card, Modal, Table } from 'react-bootstrap';
import AddForm from '../components/add-record';
class CarDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car: {},
      modal: false,
      records: null
    };
    this.makeTable = this.makeTable.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getNextOilChange = this.getNextOilChange.bind(this);
  }

  componentDidMount() {
    fetch(`/api/garage/recent-history/${this.props.vehicleId}`)
      .then(result => result.json())
      .then(result => {
        this.setState({
          car: result,
          records: result.records
        });
      })
      .catch(err => console.error(err));
  }

  addRecord(data) {
    const splitDate = data[0].datePerformed.split('T');
    data[0].datePerformed = splitDate[0];
    const newRecord = data.concat(this.state.records);
    this.setState({
      records: newRecord
    });
  }

  getNextOilChange() {
    const { records } = this.state;
    if (!this.state.records) {
      return;
    }
    for (let i = 0; i < records.length; i++) {
      if (records[i].maintenanceName.toLowerCase().includes('oil')) {
        return records[i].mileage + 3000;
      }
    }
  }

  calculateTotalCost() {
    const { records } = this.state;
    let total = 0;
    if (!this.state.records) {
      return;
    }
    for (let i = 0; i < records.length; i++) {
      total += records[i].cost;
    }
    return total;
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
    const { records } = this.state;
    const combinedRecords = (this.combineSameDayRecords(records));
    const firstFourRecords = combinedRecords.slice(0, 4);
    return firstFourRecords.map((car, index) => {
      const { datePerformed, maintenanceName: name, mileage } = car;
      return (
        <tr key={index} className='open-sans'>
          <td className='col-4 text-start'>{datePerformed}</td>
          <td colSpan={2} className='text-start'>{name}</td>
          <td className='text-end'>{mileage.toLocaleString()}</td>
        </tr>
      );
    });
  }

  showAddForm() {
    return (
      <Modal size='md' show={this.state.modal} onHide={this.toggleModal} centered>
        <AddForm vehicleId={this.props.vehicleId} toggleModal={this.toggleModal} addRecord={this.addRecord}/>
      </Modal>
    );
  }

  toggleModal(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const nextOilChange = this.getNextOilChange();
    let { year, make, model, photoUrl } = this.state.car;
    if (!photoUrl) {
      photoUrl = 'https://proximaride.com/images/car_placeholder2.png';
    }
    return (
      <>
        <div className="row mt-3 rounded overflow-hidden">
          <div className="col-lg-12">
            <h1 className='py-3 work-sans fw-bold text-capitalize'>{year} {make} {model}</h1>
            <div className="row">
              <div className="col-lg-9">
                <Card.Img className='shadow p-0 mb-3 rounded' src={photoUrl} alt="" />
              </div>
              <div className='col-lg-3 mb-3 ps-lg-0'>
                <Card className='h-100'>
                  <Card.Header className='bg-navbar-menu work-sans fs-3 py-md-3'>Next Oil Change</Card.Header>
                  <Card.Body className='row body-sans fs-1 py-sm-5 py-md-5 py-5'>
                    <p className='m-auto'>
                      {nextOilChange ? nextOilChange.toLocaleString() + ' Miles' : 'No Past Oil Changes'}
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0 overflow-hidden rounded'>
          <div className="row py-2 mx-0 bg-navbar-menu">
            <h2 className='col text-start'>Recent Records</h2>
            <div className="col text-end">
              <a href="" onClick={this.toggleModal} className='text-reset'><i className="fs-3 bi bi-plus-circle pe-2"></i></a>
            </div>
          </div>
          <Table hover striped>
            <tbody className='fs-4'>
              {this.state.records && this.state.records.length > 0 ? this.makeTable() : <tr className='disabled'><td colSpan={4}>No Records To Display</td></tr>}
            </tbody>
          </Table>
        </div>
        <div>
          {this.showAddForm()}
        </div>
      </>
    );
  }
}

export default CarDetails;
