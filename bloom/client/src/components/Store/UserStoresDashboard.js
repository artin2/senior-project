import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import SearchCard from '../Search/SearchCard';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class UserStoresDashboard extends React.Component {
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

  triggerStoreEdit(passedStore) {
    this.props.history.push({
      pathname: '/stores/edit/' + passedStore.id,
      state: {
        store: passedStore
      }
    })
  }

  triggerAddWorker(id) {
    this.props.history.push({
      pathname: '/stores/addWorker/' + id
    })
  }

  triggerShowWorkers(id) {
    this.props.history.push({
      pathname: '/stores/' + id + '/workers'
    })
  }

  triggerStoreShow(passedStore) {
    this.props.history.push({
      pathname: '/stores/' + passedStore.id,
      state: {
        store: passedStore
      }
    })
  }

  triggerShowServices(id) {
    this.props.history.push({
      pathname: '/stores/' + id + '/services'
    })
  }

  triggerAddService(id) {
    this.props.history.push({
      pathname: '/stores/addService/' + id,
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.stores){
      this.setState({
        stores: this.props.location.state.stores
      })
    }
    else{
      fetch('http://localhost:8081/stores/users/' + this.props.match.params.user_id , {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        console.log(response)
        if(response.status!==200){
          // throw an error alert
          store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          console.log("Retrieve store data successfully!", data)
          // let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
          this.setState({
            stores: data,
          })
        }
        
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.stores.map(store => (
            <Col key={"store-" + store.id}>
              <Button onClick={() => this.triggerStoreEdit(store)}>Edit Store</Button>
              <Button onClick={() => this.triggerShowWorkers(store.id)}>Show Workers</Button>
              <Button onClick={() => this.triggerAddWorker(store.id)}>Add Worker</Button>
              <Button onClick={() => this.triggerShowServices(store.id)}>Show Services</Button>
              <Button onClick={() => this.triggerAddService(store.id)}>Add Service</Button>
              <SearchCard store={store} 
                          carousel={true} 
                          styleVal={{ width: '18rem' }}
                          omitBookOption={true}
                          onClickFunctionStore={() => this.triggerStoreShow(store)}/>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default withRouter(UserStoresDashboard);