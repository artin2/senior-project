import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
// import SearchCard from '../Search/SearchCard';
import Carousel from 'react-bootstrap/Carousel'
// import salon from '../../assets/salon.jpg';
import salon2 from '../../assets/salon2.jpeg';
import hair from '../../assets/hair_salon.jpg';
import { FaEdit } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

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
      fetch(fetchDomain + '/stores/users/' + this.props.match.params.user_id , {
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
      <Container fluid style={{backgroundColor: '#bdcddb'}}>
        {this.state.stores.map((store, index) => (
          <div key={"store" + index}>
            <Row className="justify-content-center" style={{height: 700}}>
              {/* <div className="style_column"> </div> */}
              <Col xs={6} sm={6} md={6} lg={6}>
                <Carousel className="dashboard_carousel" interval="">
                    <Carousel.Item className="item">
                      <img className="item" src={salon2} alt="test"/>
                    </Carousel.Item>
                    <Carousel.Item className="item">
                      <img className="item" src={hair} alt="test2"/>
                    </Carousel.Item>
                </Carousel>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} style={{top: 125}}>
                <span className="name" onClick={() => this.triggerStoreShow(store)} style={{cursor: 'pointer'}}> {store.name} </span>
                <FaEdit className="edit" size={25} onClick={() => this.triggerStoreEdit(store)}/>
                <p className="address">{store.street}, {store.city}, {store.state} </p>
                <div>
                  {store.category.map((category, index) => (
                    <div className="category" key={store.id + "-category-" + index}> <p style={{color: 'white'}}> {category} </p> </div>
                  ))}
                </div>
                <div>
                  <p className="description"> 
                    {store.description}
                  </p>
                </div>

                <Button onClick={() =>  this.triggerShowWorkers(store.id)}>View Workers</Button> &nbsp;
                <Button onClick={() =>  this.triggerAddWorker(store.id)}>Add Worker</Button> &nbsp;
                <Button onClick={() =>  this.triggerShowServices(store.id)}>View Services</Button> &nbsp;
                <Button onClick={() =>  this.triggerAddService(store.id)}>Add Service</Button>

              </Col>
            </Row>
          </div>
        ))}
      </Container>
    );
  }
}

export default withRouter(UserStoresDashboard);
