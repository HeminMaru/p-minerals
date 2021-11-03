import gql from "graphql-tag";

export const Forms = {
    getDailyAnalysis: gql `query MyQuery {
      products(order_by: {product_name: asc}) {
        product_name
        uuid
        net_stock
      }
    }`,
    getProductDailyAnalysis: gql `query GetProductDailyAnalysis($uuid: uuid!) {
      products_by_pk(uuid: $uuid) {
        product_consumption(order_by: {date: desc}) {
          updated_by
          date
          stock_consumption
          uuid
        }
        product_inward(order_by: {date: desc}) {
          updated_by
          date
          inward_stock
          uuid
        }
        net_stock
        product_name
      }
    }    
    `,
    getPaymentDetails: gql `query MyQuery {
      payments {
        added_by
        uuid
        amount
        date
        particular
        payment_mode
      }
    }
    `,
    delPayment: gql `mutation DelPayment($payment_uuid: uuid!) {
      delete_payments_by_pk(uuid: $payment_uuid) {
        uuid
      }
    }
    `,
    getReceiptDetails: gql `query MyQuery {
      receipts {
        added_by
        uuid
        amount
        date
        particular
        payment_mode
      }
    }
    `,
    delReceipt: gql `mutation DelReceipt($receipt_uuid: uuid!) {
      delete_receipts_by_pk(uuid: $receipt_uuid) {
        uuid
      }
    }
    `,
    insertStockInwards: gql `mutation InsertStockInwards($data: [stock_inwards_insert_input!]!) {
      insert_stock_inwards(objects: $data) {
        returning {
          product_uuid
          updated_by
        }
      }
    }
    `,
    insertStockConsumption: gql `mutation InsertStockConsumption($data: [stock_consumption_insert_input!]!) {
      insert_stock_consumption(objects: $data) {
        returning {
          product_uuid
          updated_by
        }
      }
    }
    `,
    findStockConsumptionDate: gql `query MyQuery($date: date) {
      stock_consumption(order_by: {date: desc}, where: {date: {_eq: $date}}) {
        date
        product_uuid
        remaining_stock
        remarks
        stock_consumption
        updated_by
        uuid
        consumption_product {
          product_name
        }
      }
    }`,
    findStockConsumptionDateRange: gql `query FindStockConsumptionDateRange($start_date: date,$end_date:date) {
      stock_consumption(order_by: {date: desc}, where: {date: {_gte: $start_date, _lte: $end_date}}) {
        date
        product_uuid
        remaining_stock
        remarks
        stock_consumption
        updated_by
        uuid
        consumption_product {
          product_name
        }
      }
    }`,
    deleteInwardStock: gql `mutation DeleteInwardStock($uuid: uuid!) {
      delete_stock_inwards_by_pk(uuid: $uuid) {
        inward_stock
      }
    }    
    `,
    deleteStockConsumption: gql `mutation DeleteStockConsumption($uuid: uuid!) {
      delete_stock_consumption_by_pk(uuid: $uuid) {
        stock_consumption
      }
    }
    
    `,
    updateProductDetail: gql `mutation UpdateProductDetail($uuid: uuid!, $data: products_set_input) {
      update_products_by_pk(pk_columns: {uuid: $uuid}, _set: $data) {
        net_stock
      }
    }
    `,
    insertPayment: gql `mutation InsertPayment($data: [payments_insert_input!]!) {
      insert_payments(objects: $data) {
        returning {
          amount
        }
      }
    }`,
    insertReceipt: gql `mutation insertReceipt($data: [receipts_insert_input!]!) {
      insert_receipts(objects: $data) {
        returning {
          amount
        }
      }
    }`,
    insertUser: gql `mutation InsertUser($data: [users_insert_input!]!) {
      insert_users(objects: $data) {
        returning {
          UUID
        }
      }
    }`,
    getUsers: gql `query GetUsers {
      users {
        UUID
        password
        role
        username
      }
    }
    `,
    getUserByUsernamePass: gql `query GetUserByUsernamePass($username: String,$password: String) {
      users(where: {username: {_eq: $username}, password: {_eq: $password}}) {
        UUID
      }
    }`,
    getUsersByUUID: gql `query GetUsersByUUID($uuid: uuid!) {
      users_by_pk(UUID: $uuid) {
        role
        username
      }
    }`,
    deleteUser: gql `mutation DeleteUser($user_uuid: uuid!) {
      delete_users_by_pk(UUID: $user_uuid) {
        UUID
      }
    }
    `,
    findProduct: gql `query FindProduct($data:String) {
      products(where: {product_name: {_iregex: $data}}) {
        product_name
      }
    }
    `,
    findProductInwards: gql `query MyQuery {
      stock_inwards(order_by: {date: desc}) {
        date
        inward_stock
        remaining_stock
        updated_by
        uuid
        product_uuid
        remarks
        min_quantity
        inward_product {
          product_name
        }
      }
    }
    `,
    findProductConsumption: gql `query MyQuery {
      stock_consumption(order_by: {date: desc}) {
        date
        product_uuid
        remaining_stock
        remarks
        stock_consumption
        updated_by
        min_quantity
        uuid
        consumption_product {
          product_name
        }
      }
    }
    `,
    getProducts: gql `query GetProducts {
      products(order_by: {product_name: asc}) {
        net_stock
        product_name
        uuid
      }
    }
    
    `,
}