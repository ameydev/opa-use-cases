import React, { Component } from 'react';
import { Form, Card,Button } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';


class RegisterUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 'admin',
            name: ''
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    handleChangeRole(event) {
        this.setState({
            role: event.target.value
        });
    }

    handleSubmit(event) {

        fetch('http://localhost:8081/user', {
            method: 'POST',
            body: JSON.stringify(this.state)
        }).then(function (response) {
            console.log(response)
            if (response.status == 201 || response.status == 200)  {
                // alert('A form was successfully submitted');
            } else if (response.status == 403){
                alert('Unauthorized');
            } else {
                alert('Internal error');
            }
            // return response.json();
            return  <Redirect  to="http://localhost:3000/getAllEvents" />

        });
        
        event.preventDefault();
        this.setState({
            name: '',
            role: ''
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
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="eg. Amey"
                                    value={this.state.name} onChange={this.handleChangeName} />
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

export default RegisterUser;