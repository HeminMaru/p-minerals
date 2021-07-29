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
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";



function ProductDailyStock() {
  const { product_uuid } = useParams();
  const [uuid, setuuid] = useState(product_uuid);
  const [tableContent, setTableContent] = useState({"product_inward": [],"product_consumption": []});
  const [dataChanged, setDataChanged] = useState(false);
  const theadInwards = ["Date", "Updated By", "inward"];
  const theadConsumption = ["Date", "Updated By", "consumption"];

  useEffect(() => {
    Apollo.query(Forms.getProductDailyAnalysis, {uuid: uuid}, res => {
      if (res.data.products_by_pk) setTableContent(res.data.products_by_pk);
    });
  }, [dataChanged]);

  const insertStockInwards = (data) => {
    Apollo.mutate(Forms.insertStockInwards,{data: data}, res => {
      console.log("Stock inward inserted");
    });
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={6}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Inwards</CardTitle>
                <Form>
                <label>Inward Stocks</label>
                        <Input
                          placeholder="Enter your inward stocks here"
                          type="text"
                        />
                </Form>
                <a type="button" className="btn btn-primary" onClick="">ADD</a>
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
                    {
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
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Consumption</CardTitle>
                <a type="button" className="btn btn-primary">ADD</a>
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
                    {tableContent.product_consumption.map((prop, key) => {
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
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProductDailyStock;