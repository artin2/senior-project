import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import SearchCard from '../Search/SearchCard';
import Carousel from 'react-bootstrap/Carousel'
import salon from '../../assets/salon.jpg';
import salon2 from '../../assets/salon2.jpeg';
import hair from '../../assets/hair_salon.jpg';
import { FaEdit } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

// ***** NOTE: fix to properly display all the stores

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
          // let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
          this.setState({
            stores: data,
          })
        }

      });
    }
  }

  // {this.state.stores.map(store => (
  //   <Col key={"store-" + store.id}>
  //     <Button onClick={() => this.triggerStoreEdit(store)}>Edit Store</Button>
  //     <Button onClick={() => this.triggerShowWorkers(store.id)}>Show Workers</Button>
  //     <Button onClick={() => this.triggerAddWorker(store.id)}>Add Worker</Button>
  //     <Button onClick={() => this.triggerShowServices(store.id)}>Show Services</Button>
  //     <Button onClick={() => this.triggerAddService(store.id)}>Add Service</Button>
  //     <SearchCard store={store}
  //                 carousel={true}
  //                 styleVal={{ width: '18rem' }}
  //                 omitBookOption={true}
  //                 onClickFunctionStore={() => this.triggerStoreShow(store)}/>
  //   </Col>
  // ))}

  render() {
    return (
      <Container fluid>
        {this.state.stores.map((store, index) => (
          <div key={"store" + index}>
            <div className="style_column"> </div>
            <FaEdit className="edit" size={25} onClick={() => this.triggerStoreEdit(store)}/>
            <Row className="justify-content-center">
              <Carousel className="dashboard_carousel" interval="">
                  <Carousel.Item className="item">
                    <img className="item" src={salon2} />
                  </Carousel.Item>
                  <Carousel.Item className="item">
                    <img className="item" src={hair} />
                  </Carousel.Item>
              </Carousel>
              <Col style={{marginLeft: 450, marginTop: 100}}>
                  <p className="name" onClick={() => this.triggerAddService(store.id)}> {store.name} </p>
                  <p className="address">{store.street}, {store.city}, {store.state} </p>
                <div style={{marginLeft:200}}>
                  {store.category.map(category => (
                    <div className="category"> <p style={{color: 'white'}}> {category} </p> </div>
                  ))}
                </div>
                <div style={{width: 500, marginLeft: 330}}>
                <p className="description"> 
                  {store.description}
                </p>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Container>
    );
  }
}

export default withRouter(UserStoresDashboard);
