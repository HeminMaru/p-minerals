import React, { useEffect, useState } from 'react';
import Apollo from "../Apollo";
import { Forms, Forms as formsGql } from '../graphql';
// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  Label,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {Modal} from "react-bootstrap";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthApi from "../AuthApi";
import Cookies from 'js-cookie'


function Receipts() {
  const Auth = React.useContext(AuthApi);
  const [username, setUsername] = useState()
  const [password, setPassword] = useState();


  const handleOnClick = () => {
    if (!username || !password) {
      toast("Some Fields are empty!");
      return;
    } 
    Apollo.query(Forms.getUserByUsernamePass, {username: username,password: password}, res => {
      if (res.data.users[0]){
          Auth.SetAuth(true);
          Cookies.set('user_uuid', res.data.users[0].UUID);
      } else toast("Invalid Credentials!");
    });
    
    
    // Apollo.mutate(Forms.insertReceipt, {data: {particular: particular, amount: amount, payment_mode: pMode}}, res => {
    //   toast("Receipt of Amount Rs." + res.data.insert_receipts.returning[0].amount + " added Successfully!");
    //   handleCloseReview();
    // });
  }
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
      <ToastContainer/>
        <Row>
            <Col xs={3}>
                </Col>
          <Col xs={6}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">LOGIN</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                <FormGroup>
                <Label for="username">Username</Label>
                <Input type="text" onChange={(e) => {
                    setUsername(e.target.value);
                  }} id="username" placeholder="Username" />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="text" onChange={(e) => {
                    setPassword(e.target.value);
                  }} id="password" placeholder="Password" />
              </FormGroup>
              <Button variant="primary" onClick={handleOnClick}>LOGIN</Button>

                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Receipts;
