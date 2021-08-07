import React, { useEffect, useState } from 'react';
import Apollo from "../Apollo";
import { Forms, Forms as formsGql } from '../graphql';
import { useParams } from 'react-router-dom';
// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Form,
  Input,
  Button,
} from "reactstrap";

import {Modal} from "react-bootstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { data } from 'jquery';



function ProductDailyStock() {
  const { product_uuid } = useParams();
  const [uuid, setuuid] = useState(product_uuid);
  const [tableContent, setTableContent] = useState({"product_inward": [],"product_consumption": []});
  const [dataChanged, setDataChanged] = useState(false);
  const theadInwards = ["Date", "Updated By", "inward"];
  const theadConsumption = ["Date", "Updated By", "consumption"];
  const [transaction, setTransaction] = useState("")
  const [value, setValue] = useState("")

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  var parseValue;


  const getData = () => {
    Apollo.query(Forms.getProductDailyAnalysis, {uuid: uuid}, res => {
      if (res.data.products_by_pk) setTableContent(res.data.products_by_pk);
    });
    console.log("fetched")
  };
   useEffect(getData,[dataChanged]);

  const handleconsumptionSubmit = () => {
    if(parseValue) {
      setValue(parseValue);
      setTransaction("Consumption");
      handleShow();
    } else alert("Enter Consumption Stock Quantity");
    document.getElementById("ConsumptionInput").value = ""
    document.getElementById("InwardStockInput").value = ""
  }
  
  const handleInwardSubmit = () => {
    if(parseValue) {
      setValue(parseValue);
      setTransaction("Inward Stock");
      handleShow();
    } else alert("Enter Inward Stock Quantity");
    document.getElementById("ConsumptionInput").value = ""
    document.getElementById("InwardStockInput").value = ""
  }

  const handleConfirmationSubmit = () => {
    if(transaction === "Inward Stock") {
      Apollo.mutate(Forms.insertStockInwards, {data:{product_uuid: uuid, inward_stock: parseInt(value)}}, res =>{
        Apollo.mutate(Forms.updateProductDetail, {uuid: uuid, data: {net_stock: tableContent.net_stock+parseInt(value)}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
        });      
      });
      
    } else if(transaction === "Consumption") {
      Apollo.mutate(Forms.insertStockConsumption, {data:{product_uuid: uuid, stock_consumption: parseInt(value)}}, res =>{
        Apollo.mutate(Forms.updateProductDetail, {uuid: uuid, data: {net_stock: tableContent.net_stock-parseInt(value)}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
        });       
      });
    }
    handleClose();
  };

  const delItem = (tableName,itemUUID) => e =>{
    if (tableName === "inward") {
      Apollo.mutate(Forms.deleteInwardStock, {uuid: itemUUID}, res => {
        Apollo.mutate(Forms.updateProductDetail, {uuid: uuid, data: {net_stock: tableContent.net_stock-res.data.delete_stock_inwards_by_pk.inward_stock}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
        });
      });
    }
    else if (tableName ==="consumption") {
      Apollo.query(Forms.deleteStockConsumption, {uuid: itemUUID}, res => {
        Apollo.mutate(Forms.updateProductDetail, {uuid: uuid, data: {net_stock: tableContent.net_stock+res.data.delete_stock_consumption_by_pk.stock_consumption}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
        }); 
      });
    }
  };

  const dataTable = (tableName) => {
    if(tableName==="inward") {
      return (
        tableContent.product_inward.map((prop, key) => {
          return (
            <tr key={key}>
              <td>
                {prop.date}
              </td>
              <td>
                {prop.updated_by}
              </td>
              <td>
                {prop.inward_stock}
              </td>
              <td>
              <a className={"now-ui-icons files_box"} onClick={delItem("inward",prop.uuid)}/>
              </td>
            </tr>
          );
        })
      );
    } else if (tableName === "consumption") {
      return (
        tableContent.product_consumption.map((prop, key) => {
          return (
            <tr key={key}>
              <td>
                {prop.date}
              </td>
              <td>
                {prop.updated_by}
              </td>
              <td>
                {prop.stock_consumption}
              </td>
              <td>
              <a className={"now-ui-icons files_box"} onClick={delItem("consumption",prop.uuid)}/>
              </td>
            </tr>
          );
        })
      );
    }
  };
  
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
      <ToastContainer/>
        <Row>
          <Col xs={6}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Inwards</CardTitle>
                <label>Inward Stocks</label>
                <Input
                  id="InwardStockInput"
                  onChange={(e) => {
                    parseValue = e.target.value;
                  }}
                  placeholder="Enter your inward stocks here"
                  type="text"
                />
                <Row>
                  <Col xs={9}></Col>
                  <Col xs={3}>
                    <Button className="btn btn-primary" onClick={handleInwardSubmit}>ADD</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {theadInwards.map((prop, key) => {
                        if (key === theadInwards.length - 1)
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
                    {dataTable("inward")}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Consumption</CardTitle>
                <Form>
                <label>Consumption Stocks</label>
                        <Input
                            id="ConsumptionInput"
                            onChange={(e) => {
                            parseValue = e.target.value;
                          }}
                          placeholder="Enter your Consumption stocks here"
                          type="text"
                        />
                </Form>
                <Row>
                  <Col xs={8}></Col>
                  <Col xs={4}>
                    <Button className="btn btn-primary" onClick={handleconsumptionSubmit}>CONSUME</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {theadConsumption.map((prop, key) => {
                        if (key === theadConsumption.length - 1)
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
                    {dataTable("consumption")}
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
            <Modal.Title>Confirmation!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="typography-line">
              <h6>
                <span>Added By</span>Hemin{" "}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Product Name</span>{tableContent.product_name + " "}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>{transaction} By</span>{value + " "}
              </h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmationSubmit}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ProductDailyStock;