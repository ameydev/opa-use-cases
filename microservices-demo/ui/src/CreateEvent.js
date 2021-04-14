import React, { Component } from 'react';
import { Form, Card,Button } from 'react-bootstrap';

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 'admin',
            id: '',
            title: '',
            description: ''
        };

        this.handleChangeID = this.handleChangeID.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeID(event) {
        this.setState({
            id: event.target.value
        });
    }

    handleChangeTitle(event) {
        this.setState({
            title: event.target.value
        });
    }
    handleChangeDescription(event) {
        this.setState({
            description: event.target.value
        });
    }
    handleChangeRole(event) {
        this.setState({
            role: event.target.value
        });
    }

    handleSubmit(event) {

        fetch('/events', {
            method: 'POST',
            body: JSON.stringify(this.state)
        }).then(function (response) {
            console.log(response)
            if (response.status == 201 || response.status == 200)  {
                alert('A form was successfully submitted');
            } else if (response.status == 403){
                alert('Unauthorized');
            } else {
                alert('Internal error');
            }
            return response.json();

        });
        
        

        event.preventDefault();
        this.setState({
            id: '',
            title: '',
            description: ''
        });
    }

    render() {
        return (

            <div>
                <Card>
                    <Card.Body>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Select Presenter</Form.Label>
                                <Form.Control as="select" value={this.state.presenter} onChange={this.handleChangePresenter}>
                                    <option value="Sahil">Sahil</option>
                                    <option value="Amey">Amey</option>
                                    <option value="Tayyab">Tayyab</option>
                                    <option value="Anonymous">Anonymous</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Event Name"
                                    value={this.state.title} onChange={this.handleChangeTitle} />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" value={this.state.description}
                                    onChange={this.handleChangeDescription} rows={3} />
                            </Form.Group>
                            <Button variant="primary" type="submit" value="Submit">
                                Submit
                            </Button>
                        </Form>

                    </Card.Body>
                </Card>

            </div>
        );
    }
}

export default CreateEvent;