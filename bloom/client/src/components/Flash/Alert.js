import React from 'react';
import store from '../../reduxFolder/store';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        status: "",
        statusText: ""
      }
    };

    store.subscribe(() => {
      this.setState({
        message: store.getState().alert
      });
    });

    this.removeMessage = this.removeMessage.bind(this);
    this.alertClass = this.alertClass.bind(this);
  }
  
  componentWillUnmount() {
    store.unsubscribe()
  }
  
  alertClass (status) {
    let classes = {
      400: 'alert-danger',
      300: 'alert-warning',
      500: 'alert-info',
      200: 'alert-success'
    };
    return classes[status] || classes.success;
  }

  removeMessage() {
    // return <div></div>
    // const index = this.state.messages.indexOf(statusText);
    // const statusText = React.addons.update(this.state.statusText, { $splice: [[index, 1]] });
    this.setState({ message: { status: "", statusText: ""} });
  }

  render() {
    let message = this.state.message;
    let alert = null
    if(!(Object.keys(message).length === 0 && message.constructor === Object) && !(message.status === "")){
      let alertClassName = `alert ${ this.alertClass(message.status) } mb-0`;
      alert = <div className={ alertClassName }>
                <button className='close'
                  onClick={ this.removeMessage }>
                  &times;
                </button>
                { message.statusText }
              </div>
    }
 
    return(
      <div>
        {alert}
      </div>
    );
  }
}

export default Alert;
