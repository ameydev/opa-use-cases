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
        alert('A form was submitted: ' + this.state);

        fetch('http://localhost:8080/event', {
            method: 'POST',
            body: JSON.stringify(this.state)
        }).then(function (response) {
            console.log(response)
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
                                <Form.Label>Select Role</Form.Label>
                                <Form.Control as="select" value={this.state.role} onChange={this.handleChangeRole}>
                                    <option value="admin">Admin</option>
                                    <option value="presenter">Presenter</option>
                                    <option value="viewer">Viewer</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>ID</Form.Label>
                                <Form.Control type="text" placeholder="123"
                                    value={this.state.id} onChange={this.handleChangeID} />
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