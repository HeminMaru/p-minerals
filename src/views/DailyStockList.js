/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
    Form,
    FormGroup,
    Input,
    Label,
    Popover,
    PopoverHeader,
    PopoverBody,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import Cookies from 'js-cookie'

import {Modal} from "react-bootstrap";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Calendar
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import moment from 'moment'
import User from './UserPage';
import {CalendarComponent} from '@syncfusion/ej2-react-calendars';


function DailyStockList() {
    const [tableContentInward, setTableContentInward] = useState([]);
    const [tableContentConsumption, setTableContentConsumption] = useState([]);

    const [dataChanged, setDataChanged] = useState(false);
    const thead = ["Date", "Stock Item","Quantity", "Remarks", "Actual Quantity", "Minimum Quantity"];
    const [user, setUser] = useState({});
    
    const [productList, setProductList] = useState([])
    const [productObj, setProductObj] = useState({"product_name":null})
    const [quantity, setQuantity] = useState()
    const [remark, setRemark] = useState()

    const [showInward, setShowInward] = useState(false);
    const [showConsumption, setShowConsumption] = useState(false);

    const [showInwardReview, setShowInwardReview] = useState(false);
    const [showConsumptionReview, setShowConsumptionReview] = useState(false);
  
    const [dateValue, setDateValue] = useState()
    const [inputDate, setInputDate] = useState("")

    var loc,process;
    
    const maxDateValue = new Date();

    const [popoverOpen, setPopoverOpen] = useState(false)

    useEffect(()=>{
      Apollo.query(Forms.findProductConsumption, {}, res => {
        if (res.data.stock_consumption) setTableContentConsumption(res.data.stock_consumption);
      });
    },[]);
  useEffect(() => {
      Apollo.query(Forms.getProducts, {}, res => {
          if (res.data.products) setProductList([ null,...res.data.products]);
      });
      Apollo.query(Forms.findProductInwards, {}, res => {
          if (res.data.stock_inwards) setTableContentInward(res.data.stock_inwards);
      });
      if(user.role === "SUPERVISOR")
        Apollo.query(Forms.findStockConsumptionDate, {date: dateValue.getFullYear()+"-"+(dateValue.getMonth()+1)+"-"+dateValue.getDate()}, res => {
            if (res.data.stock_consumption) setTableContentConsumption(res.data.stock_consumption);
        });
        if(user.role === "USER")
        Apollo.query(Forms.findStockConsumptionDate, {date: dateValue.getFullYear()+"-"+(dateValue.getMonth()+1)+"-"+dateValue.getDate()}, res => {
            if (res.data.stock_consumption) setTableContentConsumption(res.data.stock_consumption);
        });
      Apollo.query(Forms.getUsersByUUID, { uuid: Cookies.get("user_uuid") }, res => {
          if (res.data.users_by_pk) {
            setUser(res.data.users_by_pk);
            if(res.data.users_by_pk.role === "ADMIN") {
              process="inward";
            } else if(res.data.users_by_pk.role === "SUPERVISOR" || res.data.users_by_pk.role === "USER") {
              process="consume";
            }
          }
      });
  }, [dataChanged]);

  const getconsumptionDate = () => {
    Apollo.query(Forms.findStockConsumptionDate, {date: moment(dateState).format('YYYY-MM-DD')}, res => {
      if (res.data.stock_consumption) setTableContentConsumption(res.data.stock_consumption);
  });
  }
  
  const handleCloseInwardReview = () => {
    setShowInwardReview(false);
    setProductObj({"product_name":null});
    setQuantity();
    setRemark();
    setDataChanged(!dataChanged);
  }
  const handleCloseConsumptionReview = () => {
    setShowConsumptionReview(false);
    setProductObj({"product_name":null});
    setQuantity();
    setRemark();
    setDataChanged(!dataChanged);
  }

  const handleCloseConsumption = () => {setShowConsumption(false)};
  const handleCloseInward = () => {setShowInward(false)};

  const handleShowConsumption = () => {setShowConsumption(true)};
  const handleShowInward = () => {setShowInward(true)};



  const handleInwardReview = () => {
      if (!productObj || !quantity) {
        toast("Some Fields are empty!");
      } else {
          setShowInward(false);
          setShowInwardReview(true);
      }
  }

  const handleConsumptionReview = () => {
    if (!productObj || !quantity) {
      toast("Some Fields are empty!");
    } else {
        setShowConsumption(false);
        setShowConsumptionReview(true);
    }
}

  const handleSubmitInward = () => {
    Apollo.mutate(Forms.insertStockInwards, {
        data:
        {
            product_uuid: productObj.uuid, 
            inward_stock: parseInt(quantity), 
            remarks:remark, 
            updated_by: user.username, 
            remaining_stock: productObj.net_stock+parseInt(quantity),
        }}, res =>{
        Apollo.mutate(Forms.updateProductDetail, {uuid: productObj.uuid, data: {net_stock: productObj.net_stock+parseInt(quantity)}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
          handleCloseInwardReview();
        });      
      });
    }
    const handleSubmitConsumption = () => {
      Apollo.mutate(Forms.insertStockConsumption, {
        data:
        {
            product_uuid: productObj.uuid, 
            stock_consumption: parseInt(quantity), 
            remarks:remark, 
            updated_by: user.username, 
            remaining_stock: productObj.net_stock-parseInt(quantity),
        }}, res =>{
        Apollo.mutate(Forms.updateProductDetail, {uuid: productObj.uuid, data: {net_stock: productObj.net_stock-parseInt(quantity)}}, res => {
          toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
          setDataChanged(!dataChanged);
          handleCloseConsumptionReview();
        });      
      });
  }

    const delItem = (tableName,prop) => e =>{
        if (tableName === "inward") {
          Apollo.mutate(Forms.deleteInwardStock, {uuid: prop.uuid}, res => {
            Apollo.mutate(Forms.updateProductDetail, {uuid: prop.product_uuid, data: {net_stock: prop.remaining_stock-res.data.delete_stock_inwards_by_pk.inward_stock}}, res => {
              toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
              setDataChanged(!dataChanged);
            });
          });
        }
        else if (tableName ==="consumption") {
          Apollo.query(Forms.deleteStockConsumption, {uuid: prop.uuid}, res => {
            Apollo.mutate(Forms.updateProductDetail, {uuid: prop.product_uuid, data: {net_stock: prop.remaining_stock+res.data.delete_stock_consumption_by_pk.stock_consumption}}, res => {
              toast("Net Stock of Product: "+res.data.update_products_by_pk.net_stock);
              setDataChanged(!dataChanged);
            }); 
          });
        }
      };
 
  // const changeDate = () => {
  //     return  <CalendarComponent
  //               autoclose= {true}
  //               value={dateValue}
  //               max={maxDateValue}
  //             ></CalendarComponent>
  // }
  const togglepopover = () => {
    setPopoverOpen(!popoverOpen);
  }
    if (tableContentInward && tableContentConsumption)
        return ( <>
            <PanelHeader size = "sm"/>
            <div className = "content" >
            <ToastContainer/>

            <Row >
                <Col xs = { 12 } >
                    <Card >
                    <CardHeader>
                        <Row>
                            <Col xs={4}>
                            <CardTitle tag="h4">Daily Stock Analysis</CardTitle>
                            </Col>
                            <Col xs={6}>
                                {user.role === "SUPERVISOR" &&
                                <>
                                    <FormGroup>
                                        <Row>
                                          <div style={{display: "flex", width: "200px"}}>
                                          <Input
                                            disabled
                                            placeholder="DATE"
                                            type="text"
                                            value={inputDate}
                                            />
                                            <span id="changeDate" class="input-group-text" style={{height: "40px"}}>
                                              <i class="now-ui-icons ui-1_calendar-60"/>
                                              </span>
                                              <Popover
                                                isOpen={popoverOpen}
                                                placement="bottom"
                                                target="changeDate"
                                                trigger="legacy"
                                                toggle={togglepopover}
                                              >
                                                <PopoverHeader>
                                                  Choose Dates
                                                </PopoverHeader>
                                                <PopoverBody>
                                                  <CalendarComponent
                                                    change={(value)=>{
                                                      if(value.isInteracted){        
                                                        setDateValue(value.value);
                                                        setPopoverOpen(false);
                                                        setDataChanged(!dataChanged)
                                                        setInputDate(value.value.getDate()+"-"+(value.value.getMonth()+1)+"-"+value.value.getFullYear())
                                                      }
                                                    }}
                                                    value={dateValue}
                                                    max={maxDateValue}
                                      
                                                  ></CalendarComponent>  
                                                </PopoverBody>
                                              </Popover>
                                            

                                            
                                          </div>
                                        </Row>
                                    </FormGroup>
                                    </>
                                }
                            </Col>
                            <Col xs={1}>
                            {user.role === "ADMIN" &&
                            <Button className="btn btn-primary float-right" onClick={handleShowInward}>ADD</Button>
                            }
                            {user.role === "SUPERVISOR" &&
                            <Button className="btn btn-primary float-right" onClick={handleShowConsumption}>CONSUME</Button>
                            }
                            </Col>
                        </Row>    
                    </CardHeader>
                        <CardBody >
                        {
                            user.role === "ADMIN" &&
                            <Table responsive hover >
                                <thead className = "text-primary" >
                                <tr> {
                                    thead.map((prop, key) => {
                                        if (key === thead.length - 1)
                                            return ( <th key = { key } > { prop } </th>
                                            );
                                        return <th key = { key } > { prop } </th>;
                                    })
                                } </tr> 
                                </thead> 
                                <tbody> 
                                    {
                                    tableContentInward.map((prop, key) => {
                                        return ( 
                                        <tr key = { key } >
                                            <td >
                                                {prop.date}
                                            </td>
                                            <td >
                                               {prop.inward_product[0].product_name}
                                            </td> 
                                            <td> 
                                                {prop.inward_stock } 
                                            </td> 
                                            <td>
                                                {prop.remarks}
                                            </td>
                                            <td>
                                                {prop.remaining_stock}
                                            </td>
                                            <td>
                                                {prop.min_quantity}
                                            </td>
                                            <td >
                                                <a className = { "now-ui-icons files_box" } onClick={delItem("inward",prop)} /> 
                                            </td>
                                            </tr>
                                        );
                                    })
                                } 
                                </tbody> 
                            </Table> 
                            }
                            {
                                (user.role === "SUPERVISOR" || user.role === "USER")&&
                            <Table responsive hover >
                                <thead className = "text-primary" >
                                <tr> {
                                    thead.map((prop, key) => {
                                        if (key === thead.length - 1)
                                            return ( <th key = { key } > { prop } </th>
                                            );
                                        return <th key = { key } > { prop } </th>;
                                    })
                                } </tr> 
                                </thead> 
                                <tbody> 
                                    {
                                    tableContentConsumption.map((prop, key) => {
                                        return ( 
                                            <tr key = { key } >
                                            <td >
                                                {prop.date}
                                            </td>
                                            <td >
                                               {prop.consumption_product[0].product_name}
                                            </td> 
                                            <td> 
                                                {prop.stock_consumption } 
                                            </td> 
                                            <td>
                                                {prop.remarks}
                                            </td>
                                            <td>
                                                {prop.remaining_stock}
                                            </td>
                                            <td>
                                                {prop.min_quantity}
                                            </td>
                                            <td >
                                                <a className = { "now-ui-icons files_box" } onClick={delItem("consumption",prop)}/> 
                                            </td>
                                            </tr>
                                        );
                                    })
                                } 
                                </tbody> 
                            </Table> 
                            }
                        </CardBody> 
                    </Card> 
                </Col> 
            </Row> 
            <Modal
          className="modal"
          show={showInward}
          onHide={handleCloseInward}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Stock</Modal.Title>
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
                  placeholder="Anonymous"
                  type="text"
                  />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                  <Label for="product_name">Product Name</Label>
                  <Input type="select" name="select" id="product_name" onChange={(e)=> {
                      setProductObj(productList[e.target.selectedIndex])
                    }}>
                      <option>Select</option>
                      {productList.map((product,i) => {
                          if (i===0) return;
                          return <option>{product.product_name}</option>
                      })}
                  </Input>
                </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
              <FormGroup>
                <label>Quantity</label>
                <Input
                  placeholder="Enter Quantity Here"
                  type="text"
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
              </FormGroup>
              </Col>
              <Col>
              <FormGroup>
                <Label for="remarks">Remarks</Label>
                <Input type="text" onChange={(e) => {
                    setRemark(e.target.value);
                  }} id="remarks" placeholder="Enter Remarks" />
              </FormGroup>
              </Col>
            </Row>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseInward}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleInwardReview}>Review</Button>
          </Modal.Footer>
        </Modal>
        
        <Modal
          className="modal"
          show={showConsumption}
          onHide={handleCloseConsumption}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Consume Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <label>Consumed By</label>
                  <Input
                  defaultValue={user.username}
                  disabled
                  placeholder="Anonymous"
                  type="text"
                  />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                  <Label for="product_name">Product Name</Label>
                  <Input type="select" name="select" id="product_name" onChange={(e)=> {
                      setProductObj(productList[e.target.selectedIndex])
                    }}>
                      <option>Select</option>
                      {productList.map((product,i) => {
                          if (i===0) return;
                          return <option>{product.product_name}</option>
                      })}
                  </Input>
                </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
              <FormGroup>
                <label>Quantity</label>
                <Input
                  placeholder="Enter Quantity Here"
                  type="text"
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
              </FormGroup>
              </Col>
              <Col>
              <FormGroup>
                <Label for="remarks">Remarks</Label>
                <Input type="text" onChange={(e) => {
                    setRemark(e.target.value);
                  }} id="remarks" placeholder="Enter Remarks" />
              </FormGroup>
              </Col>
            </Row>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConsumption}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConsumptionReview}>Review</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="modal"
          show={showInwardReview}
          onHide={handleCloseInwardReview}
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
                <span>Product</span>{productObj.product_name}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Quantity</span>{quantity}
              </h6>
            </div>
            <div className="typography-line">
              <h6>
                <span>Remarks</span>{remark}
              </h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseInwardReview}>
              Cancel Transaction
            </Button>
            <Button variant="primary" onClick={handleSubmitInward}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="modal"
          show={showConsumptionReview}
          onHide={handleCloseConsumptionReview}
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
                <span>Product</span>{productObj.product_name}
              </h6>
              </div>
              <div className="typography-line">
              <h6>
                <span>Quantity</span>{quantity}
              </h6>
            </div>
            <div className="typography-line">
              <h6>
                <span>Remarks</span>{remark}
              </h6>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConsumptionReview}>
              Cancel Transaction
            </Button>
            <Button variant="primary" onClick={handleSubmitConsumption}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        
      </div> 
    </>
  );
}

export default DailyStockList;