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
        amount
        date
        particular
        payment_mode
      }
    }
    `,
    getReceiptDetails: gql `query MyQuery {
      receipts {
        amount
        date
        particular
        payment_mode
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
}