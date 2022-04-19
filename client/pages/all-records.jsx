import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

class AllRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: null
    };
  }

  componentDidMount() {
    fetch(`/api/vehicles/${this.props.vehicleId}/records`)
      .then(result => result.json())
      .then(result => {
        this.setState({
          records: result
        });
      })
      .catch(err => console.error(err));
  }

  displayRecordsList() {
    const { records } = this.state;
    return (
      <Accordion defaultActiveKey={0}>
        {
      records.map((item, index) => {
        return (
        <Accordion.Item key={index} eventKey={index}>
          <Accordion.Header>
            {
              <div className="row fs-5 w-100">
                <div className="col-4">
                  <p className="text-start m-lg-3 m-0">
                    {item.datePerformed}
                  </p>
                </div>
                <div className="col-5">
                  <p className="text-start m-lg-3 m-0 text-capitalize">
                    {item.names.join(', ')}
                  </p>
                </div>
                <div className="col-3 pe-4">
                  <p className="text-end m-lg-3 m-0">
                    {item.mileage.toLocaleString()}
                  </p>
                </div>
              </div>
            }
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              {item.names.map((name, number) => {
                return (
                  <li className='text-capitalize row fs-4 ms-4 ' key={number}>
                    <p className=" col-1 ps-3 border-start border-secondary m-0"></p>
                    <p className='col-6 text-start m-0 p-3 text-truncate'>
                      {name}
                    </p>
                    <p className='col-4 m-0 p-3 text-end'>
                      {`$${item.cost[number]}`}
                    </p>
                  </li>
                );
              })}
                <li className='text-capitalize row fs-3 ms-5'>
                  <p className='col-11 m-0 p-3 text-end'>
                    {<span className='fw-bolder'>Total: </span>} {`$${item.total}`}
                  </p>
                </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        );
      })
        }
      </Accordion>
    );
  }

  render() {
    return (
      <>
      <h1 className='m-3'>All Records</h1>
        {this.state.records ? this.displayRecordsList() : <p>no records</p>}
      </>
    );
  }
}

export default AllRecords;
