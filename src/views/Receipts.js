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
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";



function Receipts() {
  const [tableContent, setTableContent] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const thead = ["Date", "Particular", "Amount"];
  var loc;

  useEffect(() => {
    Apollo.query(Forms.getReceiptDetails, {}, res => {
      if (res.data.receipts)  setTableContent(res.data.receipts);
    });
  }, [dataChanged]);

  console.log(tableContent);
  if (tableContent)
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Reciepts</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
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
                              {prop.date}
                          </td>
                          <td>
                            {prop.particular}
                          </td>
                          <td>
                            {prop.amount}
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

export default Receipts;
