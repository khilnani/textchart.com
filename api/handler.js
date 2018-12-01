'use strict';

// ----------------------------------------------------------

const querystring = require('querystring');
const ddb_table = process.env.DDB_TABLE;

// ----------------------------------------------------------

const send_response = (body, callback, statusCode) => {
    const response = {
        statusCode: (statusCode) ? statusCode : 200,
        headers: {
            'Content-Type': "application/json",
            //"Access-Control-Allow-Origin" : "textchart.com",
            "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(body),
    };
    console.log('Response: ', response);
    callback(null, response);
};

// ----------------------------------------------------------

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
const ddb = new aws.DynamoDB();

// ----------------------------------------------------------

const read_data = (id) => {
    var params = {
        TableName: ddb_table,
        Key: {
            'id' : {S: id},
        }
    };

    console.log('read_data', params);

    let p = ddb.getItem(params).promise();
    return p;
};


const save_data = (id, data) => {
    let params = {
        TableName: ddb_table,
        Item: {
            'id' :      {S: String(id)},
            'data' :    {S: String(data)},
        }
    };

    console.log('save_data', params);

    let p = ddb.putItem(params).promise();
    return p;
}

// ----------------------------------------------------------

module.exports.handle_read = (event, context, callback) => {
    let body = {
      data: undefined
    };
    let id = event['queryStringParameters']['id'];

    console.log('id', id);

    read_data(id).then(function(data){
          console.log('Read Success');
          let result = undefined;
          try {
              body['data'] = data['Item']['data']['S'];
              body['status'] = 'success';
              console.log(body['data']);
              send_response(body, callback);
          } catch(e) {
              body['status'] = 'error';
              console.log('Read Access Error')
              console.log(e);
              send_response(body, callback, 500);
          }
      }, 
      function(error){
          console.log('Read Error');
          body['status'] = 'error';
          console.log(error);
          send_response(body, callback, 500);
      });
};


module.exports.handle_save = (event, context, callback) => {
    let body = {};
    let id = undefined;
    let data = undefined;

    try {
        console.log('Checking body...');
        let _params = querystring.parse(event['body']);
        id = _params['id'];
        data = _params['data'];
    } catch(e) {
        console.log('ERROR Checking body. Checking Query Params...');
        console.log(e);
        id = event['queryStringParameters']['id'];
        data = event['queryStringParameters']['data'];
    }

    console.log(event);
    console.log('id', id, 'data', data);
    
    save_data(id, data).then(function(data){
          console.log('Save Success');
          body['status'] = 'success';
          console.log(data);
          send_response(body, callback);
      }, 
      function(error){
          console.log('Save Error');
          body['status'] = 'error';
          console.log(error);
          send_response(body, callback, 500);
      });
    
};

// ----------------------------------------------------------



