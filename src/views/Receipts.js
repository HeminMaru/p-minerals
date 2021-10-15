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
  const thead = ["Date", "Added by", "Particular", "Payment Mode", "Amount"];
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState({});


  const [showReview, setShowReview] = useState(false);
  const handleCloseReview = () => {
    setShowReview(false);
    setPMode();
    setParticular();
    setAmount();
    setConfirmAmount();
    setDataChanged(!dataChanged);
  }
  const handleShowReview = () => setShowReview(true);

  const [pMode, setPMode] = useState()
  const [particular, setParticular] = useState()
  const [amount, setAmount] = useState()
  const [confirmAmount, setConfirmAmount] = useState()

  var loc, pModes = [undefined,"Cash", "Bank"];

  useEffect(() => {
    Apollo.query(Forms.getReceiptDetails, {}, res => {
      if (res.data)  setTableContent(res.data.receipts);
    });
    Apollo.query(Forms.getUsersByUUID, {uuid: Cookies.get("user_uuid")}, res => {
      if (res.data) setUser(res.data.users_by_pk);
    });
  }, [dataChanged]);

  const handleReview = () => {
    console.log(confirmAmount);
    if (!pMode || !particular || !amount) {
      toast("Some Fields are empty!");
    } else if (amount != confirmAmount) {
      toast("Amount doesn't match");
    }
    else {
      handleClose();
      handleShowReview();
    }
  }

  const handleSubmit = () => {
    Apollo.mutate(Forms.insertReceipt, {data: {particular: particular, amount: amount, payment_mode: pMode, added_by: user.username}}, res => {
      toast("Receipt of Amount Rs." + res.data.insert_receipts.returning[0].amount + " added Successfully!");
      handleCloseReview();
    });
  }

  const delItem = (receipt_uuid) => e =>{
    Apollo.mutate(Forms.delReceipt, {receipt_uuid: receipt_uuid}, res => {
      toast("Receipt "+res.data.delete_receipts_by_pk.uuid+" deleted!");
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
              <CardHeader>
                <Row>
                  <Col xs={9}>
                <CardTitle tag="h4">RECEIPTS</CardTitle>
                </Col><Col xs={3}>
                {(user.role === "ADMIN" || user.role === "SUPERVISOR") &&
                <Button className="btn btn-primary float-right" onClick={handleShow}>ADD RECEIPT</Button>
                }
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
                        <tr key={key} >
                          <td className="date">
                              {prop.date}
                          </td>
                          <td>
                            {prop.added_by}
                          </td>
                          <td>
                            <div>
                            {prop.particular}
                            </div>
                          </td>
                          <td>
                            {prop.payment_mode}
                          </td>
                          <td>
                            Rs.{prop.amount}
                          </td>
                          {user.role === "ADMIN" &&
                            <td>
                              <a className={"now-ui-icons files_box"} onClick={delItem(prop.uuid)}/>
                            </td>
                          }
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
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
            <Modal.Title>Add New Reciept</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <label>Added By</label>
                  <Input
                  defaultValue={user.username}
                  disabled
                  placeholder="Added By"
                  type="text"
                  />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                  <Label for="PaymentMode">Payment Mode</Label>
                  <Input type="select" name="select" id="PaymentMode" onChange={(e)=> {setPMode(pModes[e.target.selectedIndex])}}>
                    <option>Select</option>
                    <option>Cash</option>
                    <option>Bank</option>
                  </Input>
                </FormGroup>
                </Col>
            </Row>
            <Row>
              <FormGroup>
                <label>Particular</label>
                <Input
                  cols="80"
                  placeholder="Enter Particular Here"
                  rows="4"
                  type="textarea"
                  onChange={(e) => {
                    setParticular(e.target.value);
                  }}
                />
              </FormGroup>
            </Row>
            <Row>
              <Col>
              <FormGroup>
                <Label for="Amount">Amount</Label>
                <Input type="text" onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }} id="Amount" placeholder="Enter Amount" />
              </FormGroup>
              </Col>
                <Col>
              <FormGroup>
                <Label for="confirmAmount">Confirm Amount</Label>
                <Input type="text" onChange={(e) => {
                    setConfirmAmount(parseInt(e.target.value));
                  }} id="confirmAmount" placeholder="Confirm Amount" />
              </FormGroup>
              </Col>
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
            <Modal.Title>Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="typography-line">
              <h6>
                <span>Added By</span>{user.username + " "}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Payment Mode</span>{pMode}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Particular</span>{particular}
              </h6>
            </div>
            <div className="typography-line">
              <h6>
                <span>Amount</span>{amount}
              </h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReview}>
              Cancel Recipt
            </Button>
            <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Receipts;
