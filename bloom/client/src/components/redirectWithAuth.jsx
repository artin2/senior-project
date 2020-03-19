import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
export default function redirectWithAuth(ComponentToProtect) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      fetch('http://localhost:8081/checkToken' , {
        method: "GET",
        headers: {
          'Content-type': 'application/json'
        },
        credentials: 'include'
      }).then(res => {
          if (res.status === 200) {
            this.setState({ loading: false, redirect: true });
          } else {
            this.setState({ loading: false, redirect: false });
          }
        })
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/"/>;
      }
      else {
        return <ComponentToProtect {...this.props}/>;
      }
    }
  }
}