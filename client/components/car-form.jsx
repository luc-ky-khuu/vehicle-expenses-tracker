import React from 'react';
import { Modal, Button, Form, CloseButton } from 'react-bootstrap';

class CarForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      year: '',
      make: '',
      model: '',
      modal: false,
      missingInput: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  carForm() {
    return (
      <>
        <a className='text-reset' href="#" onClick={this.toggleModal}>
          <i className="bi fs-1 bi-plus-circle-fill"></i>
        </a>
        <Modal size='sm' show={this.state.modal} onHide={this.toggleModal} centered>
          <Modal.Header>
            <Modal.Title className='work-sans'>Add Vehicle</Modal.Title>
            <CloseButton onClick={this.toggleModal}></CloseButton>
          </Modal.Header>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Body className='open-sans'>
              <Form.Group className='mb-3' controlId='year'>
                <Form.Control value={this.state.year} onChange={this.handleChange} name='year' type='text' placeholder='Year'></Form.Control>
              </Form.Group>
              <Form.Group className='mb-3' controlId='make'>
                <Form.Control value={this.state.make} onChange={this.handleChange} name='make' type='text' placeholder='Make'></Form.Control>
              </Form.Group>
              <Form.Group className='mb-3' controlId='model'>
                <Form.Control value={this.state.model} onChange={this.handleChange} name='model' type='text' placeholder='Model'></Form.Control>
              </Form.Group>
              <Form.Group controlId="photoUrl" className="mb-3">
                <Form.Control accept=".png, .jpg, .jpeg" ref={this.fileInputRef} name='photoUrl' type="file" />
              </Form.Group>
              {this.state.missingInput && <p className='text-danger m-0'>* Input Missing</p>}
            </Modal.Body>
            <Modal.Footer className="work-sans">
              <div className="col">
                <Button variant="outline-light" className='w-100 blue-button border-0 work-sans' type="submit">
                  Add Vehicle
                </Button>
              </div>
              <div className="col">
                <Button variant="outline-light" className='w-100 border-0 red-button work-sans' onClick={this.toggleModal}>
                  Close
                </Button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggleModal(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { year, make, model } = this.state;
    if (!year || !make || !model) {
      this.setState({
        missingInput: true
      });
      return;
    }
    const formData = new FormData();
    formData.append('year', year);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('photoUrl', this.fileInputRef.current.files[0]);
    fetch('/api/garage/add-car', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          cars: this.state.cars.concat([data]),
          year: '',
          make: '',
          model: '',
          modal: false
        });
        this.fileInputRef.current.value = null;
      })
      .catch(err => console.error(err));
  }
}

export default CarForm;
