import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';
import SearchCard from '../Search/SearchCard';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";



class StoreDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      stores: [
        {
          id: "",
          name: "",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          created_at: "",
          category: [],
          services: [],
          workers: [],
          pictures: [],
          owners: [],
          phone: "",
          clients: [],
          description: "",
          lat: "",
          lng: ""
        }
      ],
      redirectToWorkerForm: null,
      store_id: null
    }
  }

  triggerAddWorker(id) {
    this.setState({
      redirectToWorkerForm: true,
      store_id: id
    })
  }

  triggerShowWorkers(id) {
    this.setState({
      redirectToShowWorkers: true,
      store_id: id
    })
  }

  componentDidMount() {
    let owner_id = JSON.parse(Cookies.get('user').substring(2)).id
    fetch('http://localhost:8081/stores/users/' + owner_id , {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
      console.log(response)
      if(response.status!==200){
        // should throw an error here
        console.log("Error!", response.status)
        // throw new Error(response.status)
        window.location.href='/'
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      console.log("Retrieve store data successfully!", data)
      // let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      this.setState({
        stores: data,
      })
    });
  }

  render() {
    if(this.state.redirectToWorkerForm){
      return <Redirect to={{
        pathname: '/stores/addWorker/' + this.state.store_id,
        state: { 
          store_id: this.state.store_id
         }
        }}
       />
    }

    if(this.state.redirectToShowWorkers){
      return <Redirect to={{
        pathname: '/stores/' + this.state.store_id + '/workers',
        state: { 
          store_id: this.state.store_id
         }
        }}
       />
    }

    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.stores.map(store => (
            <Col key={"store-" + store.id}>
              <Button onClick={() =>  window.location.href='/stores/edit/' + store.id}>Edit Store</Button>
              <Button onClick={() =>  this.triggerShowWorkers(store.id)}>Show Workers</Button>
              <Button onClick={() => this.triggerAddWorker(store.id)}>Add Worker</Button>
              <SearchCard store={store} 
                          carousel={true} 
                          styleVal={{ width: '18rem' }}
                          omitBookOption={true}
                          onClickFunctionStore={() =>  window.location.href='/stores/' + store.id}/>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default StoreDashboard;