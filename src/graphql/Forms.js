import gql from "graphql-tag";

export const Forms = {
    getDailyAnalysis: gql `query MyQuery {
      products {
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
        }
        product_inward(order_by: {date: desc}) {
          updated_by
          date
          inward_stock
        }
        net_stock
      }
    }    
    `,
    getPaymentDetails: gql `query MyQuery {
      payments {
        amount
        date
        particular
      }
    }
    `,
    getReceiptDetails: gql `query MyQuery {
      receipts {
        amount
        date
        particular
      }
    }
    `,
    insertStockInwards: gql `mutation InsertStockInwards($data: [stock_inwards_insert_input!]!) {
      insert_stock_inwards(objects: $data) {
        returning {
          uuid
        }
      }
    }
    `
}