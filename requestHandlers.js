var querystring = require("querystring");
var https = require('https');
var fs = require("fs");
var events = require("events");
var  util = require("util");
//var Quiche = require('quiche');
var moment = require('moment');

var _mysql = require('mysql');

var HOST = '192.168.223.58';
var PORT = 3306;
var MYSQL_USER = 'mysql';
var MYSQL_PASS = 'Must0ng11';
var DATABASE = 'stats';

var mysql = _mysql.createClient({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
});

function dateDifference(endDate, startDate) {
  var one_day=1000*60*60*24;

  var x=endDate.split("/");     
  var y=startDate.split("/");

  var date1=new Date(x[2],(x[1]-1),x[0]);  
  var date2=new Date(y[2],(y[1]-1),y[0]);
  var month1=x[1]-1;
  var month2=y[1]-1; 

  Diff=Math.ceil((date1.getTime()-date2.getTime())/(one_day));

  return Diff;

}

function convertMonth(hold_month) {
  switch(hold_month) {
            case 'Jan':
              request_month=01;
              break;
            case 'Feb':
              request_month=02;
              break;
            case 'Mar':
              request_month=03;
              break;
            case 'Apr':
              request_month=04;
              break;
            case 'May':
              request_month=05;
              break;
            case 'Jun':
              request_month=06;
              break;
            case 'Jul':
              request_month=07;
              break;
            case 'Aug':
              request_month=08;
              break;
            case 'Sep':
              request_month=09;
              break;
            case 'Oct':
              request_month=10;
              break;
            case 'Nov':
              request_month=11;
              break;
            case 'Dec':
              request_month=12;
              break;
            }

            return request_month;
}
 
function storeCat (description, count) {
    graphData = {"c":[{"v":description,"f":null},{"v":count,"f":null}]};
    return graphData;
}

function Start(response, postData) {
  console.log("Request handler 'Start' was called.");
      var title = "Home Page";
      var label = "BlazeLoop";
      var form = [];
      var formHeaders = new Array("Tickets");
      var top = writeTop(title, label);
      var form = writeForm(formHeaders);
    
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(top);
      for (var i = 0; i < form.length; i++) {
          var line = form[i];
          response.write(line);
          console.log(line);
      }
      response.end();
}

function Tickets(response, request) {
  console.log("request for handler 'Tickets' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"id":"","label":"ID","type":"number"};
  graphData.cols[1] = {"subject":"","label":"SUBJECT","type":"string"};
  graphData.cols[2] = {"type":"","label":"TYPE","type":"string"};
  graphData.cols[3] = {"priority":"","label":"PRIORITY","type":"string"};
  graphData.cols[4] = {"product":"","label":"PRODUCT","type":"string"};
  graphData.cols[5] = {"customer":"","label":"CUSTOMER","type":"string"};
  graphData.cols[6] = {"category":"","label":"CATEGORY","type":"string"};
  graphData.cols[7] = {"requested":"","label":"REQUESTED","type":"string"};
  graphData.cols[8] = {"solved":"","label":"SOLVED","type":"string"};
  graphData.cols[9] = {"status":"","label":"STATUS","type":"string"};
  
  mysql.query('use ' + DATABASE);
  var data = mysql.query('select * from zendesk order by id DESC', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  for (var i in results) {
    var tickets = results[i];
    graphData.rows[a] = {"c":[{"v":tickets.id,"f":null},{"v":tickets.subject,"f":null},{"v":tickets.type,"f":null},{"v":tickets.priority,"f":null},{"v":tickets.product,"f":null},{"v":tickets.customer,"f":null},{"v":tickets.category,"f":null},{"v":tickets.requested,"f":null},{"v":tickets.solved,"f":null},{"v":tickets.status,"f":null},]};
    a++;
  }
  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  response.end(graph);
  });
}

function Status(response, request) {

  var requested = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"MONTH","type":"string"};
  graphData.cols[1] = {"requested":"","label":"Requested","type":"number"};
  graphData.cols[2] = {"solved":"","label":"Solved","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jan%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jan%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Feb%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Feb%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Mar%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Mar%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Apr%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Apr%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "May%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "May%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jun%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Jun%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jul%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Jul%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Aug%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Aug%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Sep%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Sep%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Oct%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Oct%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Nov%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Nov%") and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;

  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  console.log(graph);
  response.end(graph);

  });
  
}

function Compare(response, request) {
  console.log("request for handler COMPARE was called.");
  var blazeloop = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"MONTH","type":"string"};
  graphData.cols[1] = {"blazeloop":"","label":"BlazLoop","type":"number"};
  graphData.cols[2] = {"blazeloop":"","label":"BlazeCast","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jan%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jan%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Feb%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Feb%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Mar%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Mar%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Apr%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Apr%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "May%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "May%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jun%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jun%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jul%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jul%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Aug%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Aug%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Sep%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Sep%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Oct%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Oct%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Nov%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Nov%" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;


  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  console.log(graph);
  response.end(graph);

  });
  
}


function Priority(response, request) {
  console.log("request for handler PRIORITY was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"priority":"","label":"Priority","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Urgent" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Urgent","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "High" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"High","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Normal" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Normal","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Low" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Low","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  

  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  response.end(graph);
  });
  
}

function Type(response, request) {
  console.log("request for handler 'Type' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"type":"","label":"Type","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Incident" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Incident","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Problem" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Problem","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Question" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Information","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Task" and id>290', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Task","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  

  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  response.end(graph);
  });
  
}

function Metrics(response, request) {
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"month":"","label":"Month","type":"string"};
  graphData.cols[1] = {"closing":"","label":"Avg. Days to Close/Solve","type":"number"};
  graphData.cols[2] = {"open":"","label":"Avg. Age of Open Tickets","type":"number"};
  var closingJanDays = 0;
  var closingFebDays = 0;
  var closingMarDays = 0;
  var closingAprDays = 0;
  var closingMayDays = 0;
  var closingJuneDays = 0;
  var closingJulyDays = 0;
  var closingAugDays = 0;
  var closingSepDays = 0;
  var closingOctDays = 0;
  var closingNovDays = 0;
  var openJanDays = 0;
  var openFebDays = 0;
  var openMarDays = 0;
  var openAprDays = 0;
  var openMayDays = 0;
  var openJuneDays = 0;
  var openJulyDays = 0;
  var openAugDays = 0;
  var openSepDays = 0;
  var openOctDays = 0;
  var openNovDays = 0;
  var a = 0;
  var year = "2013"

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jan%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
          
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJanDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jan%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        //console.log(tickets.solved);
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        sDate = nDate;
      }
       
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openJanDays = Days.toFixed(0);
    console.log ('Closing Jan Days '+closingJanDays+' Open Jan Days '+openJanDays);
    graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":closingJanDays,"f":null},{"v":openJanDays,"f":null}]};
    a++
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Feb%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
          
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
      
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingFebDays = Days.toFixed(0);
    });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Feb%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      // var rDate = new Date(Date.parse(request_month+"/"+request_day+"/"+year, "mm/dd/yyyy"));
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('FEB - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openFebDays = Days.toFixed(0);
    console.log ('Closing Feb Days '+closingFebDays+' Open Feb Days '+openFebDays);
    graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":closingFebDays,"f":null},{"v":openFebDays,"f":null}]};
    a++
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Mar%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
                
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingMarDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Mar%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('MAR - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openMarDays = Days.toFixed(0);
    console.log ('Closing Mar Days '+closingMarDays+' Open Mar Days '+openMarDays);
    graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":closingMarDays,"f":null},{"v":openMarDays,"f":null}]};
    a++
  });

   mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Apr%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
        
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingAprDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Apr%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('APR - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openAprDays = Days.toFixed(0);
    console.log ('Closing Apr Days '+closingAprDays+' Open Apr Days '+openAprDays);
    graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":closingAprDays,"f":null},{"v":openAprDays,"f":null}]};
    a++
   });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "May%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
        
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingMayDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "May%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('MAY - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openMayDays = Days.toFixed(0);
    console.log ('Closing May Days '+closingMayDays+' Open May Days '+openMayDays);
    graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":closingMayDays,"f":null},{"v":openMayDays,"f":null}]};
    a++
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jun%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
        
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJuneDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jun%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('JUNE - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openJuneDays = Days.toFixed(0);
    console.log ('Closing June Days '+closingJuneDays+' Open May Days '+openJuneDays);
    graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":closingJuneDays,"f":null},{"v":openJuneDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jul%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
        
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJulyDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jul%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('JULY - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openJulyDays = Days.toFixed(0);
    console.log ('Closing July Days '+closingJulyDays+' Open July Days '+openJulyDays);
    graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":closingJulyDays,"f":null},{"v":openJulyDays,"f":null}]};
    a++
   });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Aug%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
        
      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingAugDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Aug%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);
      
      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('AUGUST - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
        
    }
    
    var Days = totalDays / count;
    var openAugDays = Days.toFixed(0);
    console.log ('Closing August Days '+closingAugDays+' Open Aug Days '+openAugDays);
    graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":closingAugDays,"f":null},{"v":openAugDays,"f":null}]};
    a++
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Sep%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);

      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    }
    var Days = totalDays / count;
    closingSepDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Sep%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('SEPTEMBER - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;

    }

    var Days = totalDays / count;  
    var openSepDays = Days.toFixed(0);
    console.log ('Closing September Days '+closingSepDays+' Open September Days '+openSepDays);
    graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":closingSepDays,"f":null},{"v":openSepDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Oct%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);

      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    }
    var Days = totalDays / count;
    closingOctDays = Days.toFixed(0);
  });
  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Oct%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('OCTOBER - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;

    }

    var Days = totalDays / count;
    var openOctDays = Days.toFixed(0);
    console.log ('Closing October Days '+closingOctDays+' Open October Days '+openOctDays);
    graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":closingOctDays,"f":null},{"v":openOctDays,"f":null}]};
    a++
   });

   mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Nov%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // GET THE SOLVED DATE
      date=tickets.solved;
      var hold_month = date.substring(0,3);
      var solve_day = date.substring(4,6);
      var solve_month = convertMonth(hold_month);
      sDate = (solve_day+"/"+solve_month+"/"+year);

      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    }
    var Days = totalDays / count;
    closingNovDays = Days.toFixed(0);
  });
  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Nov%" and id>290', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    var now = new Date();
    var mm = now.getMonth() +1;
    var nDate = now.getDate()+"/"+mm+"/"+now.getFullYear();
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      var tickets= results[i];
      count++;
      // GET THE REQUEST_DATE
      var date=tickets.requested;
      var hold_month = date.substring(0,3);
      var request_day = date.substring(4,6);
      var year = "2013"
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('NOVEMBER - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;

    }

    var Days = totalDays / count;
    var openNovDays = Days.toFixed(0);
    console.log ('Closing November Days '+closingNovDays+' Open November Days '+openNovDays);
    graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":closingNovDays,"f":null},{"v":openNovDays,"f":null}]};
    a++
 
    response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
    });
    graph=JSON.stringify(graphData);
    response.end(graph);
  });
}

function WeekOpen(response, request) {
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"day":"","label":"Day","type":"string"};
  graphData.cols[1] = {"open":"","label":"Tickets Opened","type":"number"};
 // graphData.cols[2] = {"closed":"","label":"Tickets Closed","type":"number"};
 
  var test7=moment().subtract('days', 7);
  var test6=moment().subtract('days', 6);
  var test5=moment().subtract('days', 5);
  var test4=moment().subtract('days', 4);
  var test3=moment().subtract('days', 3);
  var test2=moment().subtract('days', 2);
  var test1=moment().subtract('days', 1);
  var test=moment();
  var holdDate7=test7.format("MMM-DD");
  var holdDate6=test6.format("MMM-DD");
  var holdDate5=test5.format("MMM-DD");
  var holdDate4=test4.format("MMM-DD");
  var holdDate3=test3.format("MMM-DD");
  var holdDate2=test2.format("MMM-DD");
  var holdDate1=test1.format("MMM-DD");
  var holdDate=test.format("MMM-DD");
  var a = 0; 

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate7+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate7,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate6+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate6,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate5+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate5,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate4+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate4,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate3+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate3,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate2+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate2,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate1+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate1,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        //console.log(graph);
        response.end(graph);
  });
}

function WeekClose(response, request) {
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"day":"","label":"Day","type":"string"};
  //graphData.cols[1] = {"open":"","label":"Tickets Opened","type":"number"};
  graphData.cols[1] = {"closed":"","label":"Tickets Closed","type":"number"};
 
  var test7=moment().subtract('days', 7);
  var test6=moment().subtract('days', 6);
  var test5=moment().subtract('days', 5);
  var test4=moment().subtract('days', 4);
  var test3=moment().subtract('days', 3);
  var test2=moment().subtract('days', 2);
  var test1=moment().subtract('days', 1);
  var test=moment();
  var holdDate7=test7.format("MMM-DD");
  var holdDate6=test6.format("MMM-DD");
  var holdDate5=test5.format("MMM-DD");
  var holdDate4=test4.format("MMM-DD");
  var holdDate3=test3.format("MMM-DD");
  var holdDate2=test2.format("MMM-DD");
  var holdDate1=test1.format("MMM-DD");
  var holdDate=test.format("MMM-DD");
  var a = 0;

 mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate7+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        closed = results[0]["count(*)"];
        graphData.rows[a] = {"c":[{"v":holdDate7,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate6+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate6,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate5+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate5,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate4+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate4,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate3+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate3,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate2+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate2,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate1+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate1,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate+'" and id>290', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        //console.log(graph);
        response.end(graph);
  });
}



function CustAll(response, request) {

  console.log("request for handler 'Customer ALL' was called.");
  var westquebec=0; var a = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }

        for (var i in results) {
          var tickets = results[i];
         //console.log ('customer '+tickets.customer+' count '+tickets.count);

         switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                console.log ('customer '+tickets.customer+' count '+tickets.count);
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
          }
        }
     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        //console.log(graph);
        response.end(graph);
            
      });
}

function CustWeek(response, request) {

  console.log("request for handler 'Customer WEEK' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;
  var test7=moment().subtract('days', 7);
  var test6=moment().subtract('days', 6);
  var test5=moment().subtract('days', 5);
  var test4=moment().subtract('days', 4);
  var test3=moment().subtract('days', 3);
  var test2=moment().subtract('days', 2);
  var test1=moment().subtract('days', 1);
  var test=moment();
  var holdDate7=test7.format("MMM-DD");
  var holdDate6=test6.format("MMM-DD");
  var holdDate5=test5.format("MMM-DD");
  var holdDate4=test4.format("MMM-DD");
  var holdDate3=test3.format("MMM-DD");
  var holdDate2=test2.format("MMM-DD");
  var holdDate1=test1.format("MMM-DD");
  var holdDate=test.format("MMM-DD");

  console.log(holdDate);

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         //console.log ('customer '+tickets.customer+' count '+tickets.count);

          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                console.log ('customer '+tickets.customer+' count '+tickets.count);
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        //console.log(graph);
        response.end(graph);
      });
}

function CustJan(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
          console.log ('customer '+tickets.customer+' count '+tickets.count);
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustFeb(response, request) {

  console.log("request for handler 'Customer FEBRUARY' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustMar(response, request) {

  console.log("request for handler 'Customer MARCH' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustApr(response, request) {

  console.log("request for handler 'Customer APRIL' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustMay(response, request) {

  console.log("request for handler 'Customer MAY' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustJune(response, request) {

  console.log("request for handler 'Customer June' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustJuly(response, request) {

  console.log("request for handler 'Customer July' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustAug(response, request) {

  console.log("request for handler 'Customer August' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];
         
          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }

     
        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustSep(response, request) {

  console.log("request for handler 'Customer September' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];

          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
	      case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }


        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustOct(response, request) {

  console.log("request for handler 'Customer October' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];

          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
	      case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }


        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CustNov(response, request) {

  console.log("request for handler 'Customer November' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var tickets = results[i];

          switch  (tickets.customer) {
              case 'Chelsea' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Darcy' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'Philemon' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'McDowell' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
	      case 'Poltimore' :
                westquebec += tickets.count;
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
                break;
              case 'WQSB' :
                westquebec += tickets.count;
                break;
              default :
                graphData.rows[a] = {"c":[{"v":tickets.customer,"f":null},{"v":tickets.count,"f":null}]};
                a++;
            }
          }


        response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
        });
        if (westquebec > 0) {
           graphData.rows[a] = {"c":[{"v":"WQSB Total","f":null},{"v":westquebec,"f":null}]};
        }
        graph=JSON.stringify(graphData);
        response.end(graph);
      });
}

function CatAll(response, request) {
  console.log("request for handler 'Category ALL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" group by category', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
          var category = results[i];

          if (category.count > 0) {
            graphData.rows[a] = storeCat(category.category, category.count);
            a++;
          }
        }
        response.writeHead(200, {
               'Content-Type': 'text/plain',
               'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
  }

 function CatWeek(response, request) {

  console.log("request for handler 'Category WEEK' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  var test7=moment().subtract('days', 7);
  var test6=moment().subtract('days', 6);
  var test5=moment().subtract('days', 5);
  var test4=moment().subtract('days', 4);
  var test3=moment().subtract('days', 3);
  var test2=moment().subtract('days', 2);
  var test1=moment().subtract('days', 1);
  var test=moment();
  var holdDate7=test7.format("MMM-DD");
  var holdDate6=test6.format("MMM-DD");
  var holdDate5=test5.format("MMM-DD");
  var holdDate4=test4.format("MMM-DD");
  var holdDate3=test3.format("MMM-DD");
  var holdDate2=test2.format("MMM-DD");
  var holdDate1=test1.format("MMM-DD");
  var holdDate=test.format("MMM-DD");


  mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>290 group by category', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }

        for (var i in results) {
          var category = results[i];

          if (category.count > 0) {
            graphData.rows[a] = storeCat(category.category, category.count);
            a++;
          }
        }
        response.writeHead(200, {
               'Content-Type': 'text/plain',
               'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
}
 
function CatJan(response, request) {

  console.log("request for handler 'Category JAN' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
} 

function CatFeb(response, request) {

  console.log("request for handler 'Category Feb' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatMar(response, request) {

  console.log("request for handler 'Category Mar' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatApr(response, request) {

  console.log("request for handler 'Category Apr' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatMay(response, request) {
  console.log("request for handler 'Category May' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatJune(response, request) {
  console.log("request for handler 'Category June' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatJuly(response, request) {
  console.log("request for handler 'Category July' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatAug(response, request) {
  console.log("request for handler 'Category August' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatSep(response, request) {
  console.log("request for handler 'Category September' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatOct(response, request) {
  console.log("request for handler 'Category October' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function CatNov(response, request) {
  console.log("request for handler 'Category November' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>290 group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}


function BlAll (response, request) {
  console.log("request for handler 'BlazeLoop ALL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }

        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
  });
    
}

function BlWeek (response, request) {
      console.log("request for handler 'Blazeloop WEEK' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
      var a = 0;
      var test7=moment().subtract('days', 7);
      var test6=moment().subtract('days', 6);
      var test5=moment().subtract('days', 5);
      var test4=moment().subtract('days', 4);
      var test3=moment().subtract('days', 3);
      var test2=moment().subtract('days', 2);
      var test1=moment().subtract('days', 1);
      var test=moment();
      var holdDate7=test7.format("MMM-DD");
      var holdDate6=test6.format("MMM-DD");
      var holdDate5=test5.format("MMM-DD");
      var holdDate4=test4.format("MMM-DD");
      var holdDate3=test3.format("MMM-DD");
      var holdDate2=test2.format("MMM-DD");
      var holdDate1=test1.format("MMM-DD");
      var holdDate=test.format("MMM-DD");

      console.log(holdDate);

      mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
}

function BlJan (response, request) {
      console.log("request for handler 'BlazeLoop JAN' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jan%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
}

function BlFeb (response, request) {
      console.log("request for handler 'BlazeLoop FEB' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Feb%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
}

function BlMar (response, request) {
      console.log("request for handler 'BlazeLoop MARCH' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Mar%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
	    console.log("Customer in MARCH "+customer.customer+" COUNT "+customer.count);
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        response.end(graph);
    });
}

function BlApr (response, request) {
      console.log("request for handler 'BlazeLoop APRIL' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Apr%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
}

function BlMay (response, request) {
      console.log("request for handler 'BlazeLoop MAY' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "May%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

   function BlJune (response, request) {
      console.log("request for handler 'BlazeLoop JUNE' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jun%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

   function BlJuly (response, request) {
      console.log("request for handler 'BlazeLoop JULY' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jul%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

   function BlAug (response, request) {
      console.log("request for handler 'BlazeLoop AUGUST' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Aug%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

  function BlSep (response, request) {
      console.log("request for handler 'BlazeLoop SEPTEMBER' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
      var a = 0;
      mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Sep%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

  function BlOct (response, request) {
      console.log("request for handler 'BlazeLoop OCTOBER' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
      var a = 0;
      mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Oct%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }

   function BlNov (response, request) {
      console.log("request for handler 'BlazeLoop NOVEMBER' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
      var a = 0;
      mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Nov%" and id>290 group by customer', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        for (var i in results) {
            var customer = results[i];

            graphData.rows[a] = {"c":[{"v":customer.customer,"f":null},{"v":customer.count,"f":null}]};
            a++;
        }
        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
        });
        graph=JSON.stringify(graphData);
        console.log(graph);
        response.end(graph);
    });
   }


  function BlCat(response, request) {
    console.log("request for handler 'Blazeloop Category ALL' was called.");
    var graphData = {};
    graphData.cols = [];
    graphData.rows = [];
    graphData.cols[0] = {"id":"","label":"Category","type":"string"};
    graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
    var a = 0;

    mysql.query('use ' + DATABASE);
                  
          var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and category not like "-" group by category', function selectCb(err, results, fields) {
          if (err) {
            throw err;
            response.end();
          }
          for (var i in results) {
            var category = results[i];

            if (category.count > 0) {
              graphData.rows[a] = storeCat(category.category, category.count);
              a++;
            }
          }
          response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
          });
          graph=JSON.stringify(graphData);
          console.log(graph);
          response.end(graph);
      });
  }

  function BlCatWeek(response, request) {

    console.log("request for handler 'BlazeLoop Category WEEK' was called.");
    var graphData = {};
    graphData.cols = [];
    graphData.rows = [];
    graphData.cols[0] = {"id":"","label":"Category","type":"string"};
    graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
    var a = 0;

    var test7=moment().subtract('days', 7);
    var test6=moment().subtract('days', 6);
    var test5=moment().subtract('days', 5);
    var test4=moment().subtract('days', 4);
    var test3=moment().subtract('days', 3);
    var test2=moment().subtract('days', 2);
    var test1=moment().subtract('days', 1);
    var test=moment();
    var holdDate7=test7.format("MMM-DD");
    var holdDate6=test6.format("MMM-DD");
    var holdDate5=test5.format("MMM-DD");
    var holdDate4=test4.format("MMM-DD");
    var holdDate3=test3.format("MMM-DD");
    var holdDate2=test2.format("MMM-DD");
    var holdDate1=test1.format("MMM-DD");
    var holdDate=test.format("MMM-DD");


    mysql.query('use ' + DATABASE);
                  
          var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>290 group by category', function selectCb(err, results, fields) {
          if (err) {
            throw err;
            response.end();
          }

          for (var i in results) {
            var category = results[i];

            if (category.count > 0) {
              graphData.rows[a] = storeCat(category.category, category.count);
              a++;
            }
          }
          response.writeHead(200, {
                 'Content-Type': 'text/plain',
                 'Access-Control-Allow-Origin' : '*'
          });
          graph=JSON.stringify(graphData);
          console.log(graph);
          response.end(graph);
      });
}

function BlCatJan(response, request) {
  console.log("request for handler 'BlazeLoop Category January' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jan%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatFeb(response, request) {
  console.log("request for handler 'BlazeLoop Category February' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Feb%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatMarch(response, request) {
  console.log("request for handler 'BlazeLoop Category March' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Mar%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatApril(response, request) {
  console.log("request for handler 'BlazeLoop Category April' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "April%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatMay(response, request) {
  console.log("request for handler 'BlazeLoop Category May' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "May%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatJune(response, request) {
  console.log("request for handler 'BlazeLoop Category June' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jun%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatJuly(response, request) {
  console.log("request for handler 'BlazeLoop Category July' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jul%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatAug(response, request) {
  console.log("request for handler 'BlazeLoop Category August' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Aug%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatSep(response, request) {
  console.log("request for handler 'BlazeLoop Category September' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Sep%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatOct(response, request) {
  console.log("request for handler 'BlazeLoop Category OCTOBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Oct%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function BlCatNov(response, request) {
  console.log("request for handler 'BlazeLoop Category NOVEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Nov%" and category not like "-" group by category', function selectCb(err, results, fields) {
    if (err) {
      throw err;
      response.end();
    }
    for (var i in results) {
      var category = results[i];

      if (category.count > 0) {
        graphData.rows[a] = storeCat(category.category, category.count);
        a++;
      }
    }
    response.writeHead(200, {
     'Content-Type': 'text/plain',
     'Access-Control-Allow-Origin' : '*'
   });
    graph=JSON.stringify(graphData);
    console.log(graph);
    response.end(graph);
  });
}

function ticketDetails (response, request) {
      console.log("request for handler 'TICKETDETAILS' was called.");
      var id  = request;
      console.log(id);
      var options = {
      host: 'benbria.zendesk.com',  
      port: 443,
      path: '/api/v2/tickets/'+id+'.json',
      method: 'GET',
      auth: 'drobern@benbria.com:Stwn1hgb4!'
      };

      var req = https.request(options, function(res) {
      
          res.on('data', function(d) {
            response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
            });
            response.write(d);
            response.end();
          });
      });

    req.end();
     
    req.on('error', function(e) {
    console.error(e);
  });

}

function ForumList (response, request) {
      var options = {
      host: 'benbria.zendesk.com',  
      port: 443,
      path: '/api/v2/forums.json',
      method: 'GET',
      auth: 'drobern@benbria.com:Stwn1hgb4!'
      };

      var req = https.request(options, function(res) {
      
          res.on('data', function(d) {
            response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
            });
            response.write(d);
            response.end();
          });
      });

    req.end();
     
    req.on('error', function(e) {
    console.error(e);
  });

}

function ForumDetail (response, request) {
      console.log("request for handler 'Forum' "+request+" was called.");
      var id  = request;
      var options = {
      host: 'benbria.zendesk.com',  
      port: 443,
      path: '/api/v2/forums/'+id+'/topics.json',
      method: 'GET',
      auth: 'drobern@benbria.com:Stwn1hgb4!'
      };

      var req = https.request(options, function(res) {
      
          res.on('data', function(d) {
            response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
            });
            response.write(d);
            response.end();
          });
      });

    req.end();
     
    req.on('error', function(e) {
    console.error(e);
  });

}

function TicketsTest (response, request) {
      console.log("request for handler 'TicketsTest' "+request+" was called.");
      var output = '';
      var options = {
      host: 'benbria.zendesk.com',  
      port: 443,
      path: '/api/v2/tickets.json',
      method: 'GET',
      auth: 'drobern@benbria.com:Stwn1hgb4!'
      };

      var req = https.request(options, function(res) {
      
          res.on('data', function(d) {
            
            output += d;
            response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
          });
          response.write(d);
          response.end();
            
          });
          
      });

    req.end();
     
    req.on('error', function(e) {
    console.error(e);
  });
}

/* function TicketsTest(response, request) {
  console.log("request for handler 'TicketsTest' was called.");
  var output = '';
  var options = {
  host: 'benbria.zendesk.com',
  port: 443,
  path: '/api/v2/tickets.json',
  method: 'GET',
  auth: 'drobern@benbria.com:Stwn1hgb4!'
  };
  
  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      response.writeHead(200, {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin' : '*'
      });
      output += d;
//var tickets = JSON.parse(d);
     // console.log(tickets);
    //  for (var i = 0; i < tickets.count; i++) {
      //  graphData.rows[i] = {"c":[{"v":tickets.tickets[i].id,"f":null},{"v":tickets.tickets[i].subject,"f":null},{"v":tickets.tickets[i].type,"f":null},{"v":tickets.tickets[i].priority,"f":null},{"v":tickets.tickets[i].requester_id,"f":null},{"v":tickets.tickets[i].created_at,"f":null},{"v":tickets.tickets[i].updated_at,"f":null},{"v":tickets.tickets[i].tags,"f":null},{"v":tickets.tickets[i].status,"f":null},{"v":tickets.tickets[i].assignee_id,"f":null}]};
    //  } 
     //console.log(output);
   // response.write(output);
     response.end(output);

    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });

} */

exports.Start = Start;
exports.Tickets = Tickets;
exports.Status = Status;
exports.Priority = Priority;
exports.Type = Type;
exports.Compare = Compare;
exports.Metrics = Metrics;
exports.WeekOpen = WeekOpen;
exports.WeekClose = WeekClose;
exports.CustAll = CustAll;
exports.CustWeek = CustWeek;
exports.CustJan = CustJan;
exports.CustFeb = CustFeb;
exports.CustMar = CustMar;
exports.CustApr = CustApr;
exports.CustMay = CustMay;
exports.CustJune = CustJune;
exports.CustJuly = CustJuly;
exports.CustAug = CustAug;
exports.CustSep = CustSep;
exports.CustOct = CustOct;
exports.CustNov = CustNov;
exports.CatAll = CatAll;
exports.CatWeek = CatWeek;
exports.CatJan = CatJan;
exports.CatFeb = CatFeb;
exports.CatMar = CatMar;
exports.CatApr = CatApr;
exports.CatMay = CatMay;
exports.CatJune = CatJune;
exports.CatJuly = CatJuly;
exports.CatAug = CatAug;
exports.CatSep = CatSep;
exports.CatOct = CatOct;
exports.CatNov = CatNov;
exports.BlAll = BlAll;
exports.BlWeek = BlWeek;
exports.BlJan = BlJan;
exports.BlFeb = BlFeb;
exports.BlMar = BlMar;
exports.BlApr = BlApr;
exports.BlMay = BlMay;
exports.BlJune = BlJune;
exports.BlJuly = BlJuly;
exports.BlAug = BlAug;
exports.BlSep = BlSep;
exports.BlOct = BlOct;
exports.BlNov = BlNov;
exports.BlCat = BlCat;
exports.BlCatWeek = BlCatWeek;
exports.BlCatJan = BlCatJan;
exports.BlCatFeb = BlCatFeb;
exports.BlCatMarch = BlCatMarch;
exports.BlCatApril = BlCatApril;
exports.BlCatMay = BlCatMay;
exports.BlCatJune = BlCatJune;
exports.BlCatJuly = BlCatJuly;
exports.BlCatAug = BlCatAug;
exports.BlCatSep = BlCatSep;
exports.BlCatOct = BlCatOct;
exports.BlCatNov = BlCatNov;
exports.ticketDetails = ticketDetails;
exports.ForumList = ForumList;
exports.ForumDetail = ForumDetail;
exports.TicketsTest = TicketsTest;
