import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaSearchLocation } from 'react-icons/fa';

class BasicSearch extends React.Component {
  handleSubmit() {
    alert("Submit");
  }

  render() {
    return (
      <Form>
        <InputGroup>
          <InputGroup.Prepend>
              <InputGroup.Text>
                  <FaSearchLocation/>
              </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" placeholder="Try 'New Haven, CT'"/>
          <Button className="d-block d-sm-none" type="submit" variant="primary" onClick={this.handleSubmit}>Search</Button>
        </InputGroup>
      </Form>
    );
  }
}

export default BasicSearch;
