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

import Cookies from 'js-cookie'


function Receipts() {
  const [tableContent, setTableContent] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const thead = ["Sr.No", "Username", "Password", "Role"];

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showReview, setShowReview] = useState(false);
  const handleCloseReview = () => {
    setShowReview(false);
    setRole();
    setPassword();
    setUsername();
  }
  const handleShowReview = () => setShowReview(true);

  const [role, setRole] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const [user, setUser] = useState({});

  var loc, roles = [undefined, "ADMIN", "SUPERVISOR", "USER"];

  useEffect(() => {
    Apollo.query(Forms.getUsers, {}, res => {
      if (res.data.users)  setTableContent(res.data.users);
    });
    Apollo.query(Forms.getUsersByUUID, {uuid: Cookies.get("user_uuid")}, res => {
      if (res.data) setUser(res.data.users_by_pk);
    });
  }, [dataChanged]);

  const handleReview = () => {
    if (!roles || !username || !password) {
      toast("Some Fields are empty!");
    } else {
      handleClose();
      handleShowReview();
    }
  }

  const handleSubmit = () => {
    Apollo.mutate(Forms.insertUser, {data: {username: username, password: password, role: role}}, res => {
      toast("User with UUID " + res.data.insert_users.returning[0].UUID + " added Successfully!");
      handleCloseReview();
      setDataChanged(!dataChanged);
    });
  }

  const handleDelete = (user_uuid)=> e => {
    Apollo.mutate(Forms.deleteUser, {user_uuid: user_uuid}, res => {
      toast("User with UUID " + res.data.delete_users_by_pk.UUID + " Deleted Successfully!");
      setDataChanged(!dataChanged);
    });
  }


  if (tableContent)
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
      <ToastContainer/>
        <Row>
          <Col xs={12}>
            <Card>
            {user.role === "ADMIN" &&
            <div>
              <CardHeader>
                <Row>
                  <Col xs={9}>
                <CardTitle tag="h4">Users</CardTitle>
                </Col><Col xs={3}>
                <Button className="btn btn-primary float-right" onClick={handleShow}>ADD NEW USER</Button>
                </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} >
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tableContent.map((prop, key) => {
                      return (
                        <tr key={key}>
                          <td>
                              {prop.UUID}
                          </td>
                          <td>
                            {prop.username}
                          </td>
                          <td>
                            {prop.password}
                          </td>
                          <td>
                            {prop.role}
                          </td>
                          <td>
                            <a onClick={handleDelete(prop.UUID)} className={"now-ui-icons files_box"}/>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
              </div>
              }
              {user.role === "USER" &&
              <div className="text-center">
              <br/>
              <br/>
              <h1>You Dont have Access To This Page.</h1>
              <h3>Contact Admin!</h3>
              </div>
              }
            </Card>
          
          </Col>
        </Row>
        <Modal
          className="modal"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <label>Username</label>
                  <Input
                  placeholder="Username"
                  type="text"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                <label>Password</label>
                <Input
                  placeholder="Password"
                  type="text"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FormGroup>
                
                </Col>
            </Row>
            <Row>
            <FormGroup>
                  <Label for="role">Role</Label>
                  <Input type="select" name="select" id="role" onChange={(e)=> {setRole(roles[e.target.selectedIndex])}}>
                    <option>Select</option>
                    <option>ADMIN</option>
                    <option>SUPERVISOR</option>
                    <option>USER</option>
                  </Input>
                </FormGroup>
            </Row>
            
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReview}>Review</Button>
          </Modal.Footer>
        </Modal>


        <Modal
          className="modal"
          show={showReview}
          onHide={handleCloseReview}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="typography-line">
              <h6>
                <span>Username</span>{username}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Password</span>{password}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Role</span>{role}
              </h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReview}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>ADD</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Receipts;
