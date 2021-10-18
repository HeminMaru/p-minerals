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
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import Cookies from 'js-cookie'


function DailyStockList() {
    const [tableContent, setTableContent] = useState([]);
    const [dataChanged, setDataChanged] = useState(false);
    const thead = ["Product", "Net"];
    const [user, setUser] = useState({});

    var loc;

    useEffect(() => {
        Apollo.query(Forms.getDailyAnalysis, {}, res => {
            if (res.data.products) setTableContent(res.data.products);
        });
        Apollo.query(Forms.getUsersByUUID, { uuid: Cookies.get("user_uuid") }, res => {
            if (res.data.users_by_pk) setUser(res.data.users_by_pk);
        });
    }, [dataChanged]);

    console.log(tableContent);
    if (tableContent)
        return ( <
            >
            <
            PanelHeader size = "sm" / >
            <
            div className = "content" >
            <
            Row >
            <
            Col xs = { 12 } >
            <
            Card >
            <
            CardHeader >
            <
            CardTitle tag = "h4" > Daily Stock Analysis < /CardTitle> <
            /CardHeader> <
            CardBody >
            <
            Table responsive hover >
            <
            thead className = "text-primary" >
            <
            tr > {
                thead.map((prop, key) => {
                    if (key === thead.length - 1)
                        return ( <
                            th key = { key } > { prop } <
                            /th>
                        );
                    return <th key = { key } > { prop } < /th>;
                })
            } <
            /tr> <
            /thead> <
            tbody > {
                tableContent.map((prop, key) => {
                    return ( <
                        tr key = { key } >
                        <
                        td >
                        <
                        a style = {
                            { "textDecoration": "none" } }
                        href = { "/admin/daily-stock/" + prop.uuid } > { prop.product_name } <
                        /a> <
                        /td> <
                        td > { prop.net_stock } <
                        /td> {
                            user.role === "ADMIN" &&
                                <
                                td >
                                <
                                a className = { "now-ui-icons files_box" }
                            /> <
                            /td>
                        } <
                        /tr>
                    );
                })
            } <
            /tbody> <
            /Table> <
            /CardBody> <
            /Card> <
            /Col> <
            /Row> <
            /div> <
            />
        );
}

export default DailyStockList;