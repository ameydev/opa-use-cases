import React, { Component } from 'react';

import { Table } from 'react-bootstrap';

class GetAllEvents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventData: []
        };
    }


    componentDidMount() {
        fetch('http://localhost:8080/events')
            .then(res => res.json())
            .then((data) => {
                this.setState({ eventData: data })
            })
            .catch(console.log)

    }


    render() {

        return (

            <div>
                <center><h1>Event List</h1></center>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                          
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.eventData.map((eventDa, index) => (
                            <tr key={index}>
                                <td>{eventDa.ID}</td>
                                <td>{eventDa.Title}</td>
                                <td>{eventDa.Description}</td>
                                
                            </tr>

                        ))}
                    </tbody>
                </Table>

            </div>


        )
    }

}

export default GetAllEvents;