var querystrifng = require("querystring");
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

var mysql = _mysql.createConnection({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
});

var interval =  60 * 50 * 50; // secs

setInterval(query, interval);
  
function query(){
  var data = mysql.query('select 1 from zendesk', function selectCb(err, results, fields) {
    if (err) {
       throw err;
       response.end();
    }
  });
};

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
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jan%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jan%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Feb%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Feb%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Mar%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Mar%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Apr%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Apr%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "May%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "May%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jun%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Jun%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jul%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Jul%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Aug%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Aug%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Sep%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Sep%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Oct%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Oct%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Nov%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Nov%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Dec%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where (solved like "Dec%") and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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

function Status2014(response, request) {

  var requested = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"MONTH","type":"string"};
  graphData.cols[1] = {"requested":"","label":"Requested","type":"number"};
  graphData.cols[2] = {"solved":"","label":"Solved","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Febuary","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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

function Status2015(response, request) {

  var requested = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"MONTH","type":"string"};
  graphData.cols[1] = {"requested":"","label":"Requested","type":"number"};
  graphData.cols[2] = {"solved":"","label":"Solved","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Feburary","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++

  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  console.log(graph);
  response.end(graph);

  });
  
}

function Status2016(response, request) {

  var requested = 0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"MONTH","type":"string"};
  graphData.cols[1] = {"requested":"","label":"Requested","type":"number"};
  graphData.cols[2] = {"solved":"","label":"Solved","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where requested like "Jan%" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  requested = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where solved like "Jan%" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":requested,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jan%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jan%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Feb%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Feb%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Mar%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Mar%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Apr%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Apr%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "May%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "May%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jun%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jun%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jul%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jul%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Aug%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Aug%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Sep%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Sep%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Oct%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Oct%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Nov%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Nov%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Dec%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Dec%" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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


function Compare2014(response, request) {
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
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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

function Compare2015(response, request) {
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
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Febuary","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });


  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};


  response.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*'
  });
  graph=JSON.stringify(graphData);
  console.log(graph);
  response.end(graph);

  });
  
}

function Compare2016(response, request) {
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
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeLoop" and requested like "Jan%" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  blazeloop = results[0]["count(*)"];
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where product ="BlazeCast" and requested like "Jan%" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"January","f":null},{"v":blazeloop,"f":null},{"v":results[0]["count(*)"],"f":null}]};
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
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Urgent" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Urgent","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "High" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"High","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Normal" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Normal","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Low" and id<965', function selectCb(err, results, fields) {
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

function Priority2014(response, request) {
  console.log("request for handler PRIORITY was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"priority":"","label":"Priority","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Urgent" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Urgent","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "High" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"High","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Normal" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Normal","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Low" and id>964 and id<1915', function selectCb(err, results, fields) {
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

function Priority2015(response, request) {
  console.log("request for handler PRIORITY was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"priority":"","label":"Priority","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Urgent" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Urgent","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "High" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"High","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Normal" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Normal","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Low" and id>1914 and id<2595', function selectCb(err, results, fields) {
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

function Priority2016(response, request) {
  console.log("request for handler PRIORITY was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"priority":"","label":"Priority","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Urgent" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Urgent","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "High" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"High","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Normal" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Normal","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where priority = "Low" and id>2594', function selectCb(err, results, fields) {
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
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Incident" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Incident","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Problem" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Problem","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Question" and id<965', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Information","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Task" and id<965', function selectCb(err, results, fields) {
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

function Type2014(response, request) {
  console.log("request for handler 'Type' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"type":"","label":"Type","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Incident" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Incident","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Problem" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Problem","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Question" and id>964 and id<1915', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Information","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Task" and id>964 and id<1915', function selectCb(err, results, fields) {
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

function Type2015(response, request) {
  console.log("request for handler 'Type' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"type":"","label":"Type","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Incident" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Incident","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Problem" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Problem","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Question" and id>1914 and id<2595', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Information","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Task" and id>1914 and id<2595', function selectCb(err, results, fields) {
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

function Type2016(response, request) {
  console.log("request for handler 'Type' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  var a = 0;
  graphData.cols[0] = {"type":"","label":"Type","type":"string"};
  graphData.cols[1] = {"count":"","label":"Count","type":"number"};
  
  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Incident" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Incident","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Problem" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Problem","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Question" and id>2594', function selectCb(err, results, fields) {
  if (err) {
     throw err;
     response.end();
  }
  graphData.rows[a] = {"c":[{"v":"Information","f":null},{"v":results[0]["count(*)"],"f":null}]};
  a++;
  });

  mysql.query('use ' + DATABASE);
  var data1 = mysql.query('SELECT count(*) from zendesk where type = "Task" and id>2594', function selectCb(err, results, fields) {
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
  var closingDecDays = 0;
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
  var openDecDays = 0;
  var a = 0;
  var year = "2013"

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jan%" and id<735', function selectCb(err, results, fields) {
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
      if (solve_month == "1" && tickets.id > 800) {
        year = "2014";
      }
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJanDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jan%" and id<965', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    // GET THE CURRENT DATE
    year="2013"
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Feb%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Feb%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Mar%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Mar%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Apr%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Apr%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "May%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "May%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jun%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Jun%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jul%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Jul%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Aug%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Aug%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Sep%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Sep%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Oct%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Oct%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Nov%" and id<965', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Nov%" and id<965', function selectCb(err, results, fields) {
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
        if (solve_month == "1") {
            year = "2014";
        }
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
    });

   mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Dec%" and id<965', function selectCb(err, results, fields) {
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
    closingDecDays = Days.toFixed(0);
  });
  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Dec%" and id<965', function selectCb(err, results, fields) {
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
      var year = "2013";
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        if (solve_month == "1") {
            year = "2014";
        }
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('DECEMBER - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }

      // CALCULATE THE DAYS BETWEEN REQUEST AND TODAY
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;

    }

    var Days = totalDays / count;
    var openDecDays = Days.toFixed(0);
    console.log ('Closing December Days '+closingDecDays+' Open December Days '+openDecDays);
    graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":closingDecDays,"f":null},{"v":openDecDays,"f":null}]};
    a++
 
    response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
    });
    graph=JSON.stringify(graphData);
    response.end(graph);
  });
}


function Metrics2014(response, request) {
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
  var closingJunDays = 0;
  var closingJulDays = 0;
  var closingAugDays = 0;
  var closingSepDays = 0;
  var closingOctDays = 0;
  var closingNovDays = 0;
  var closingDecDays = 0;
  var openJanDays = 0;
  var openFebDays = 0;
  var openMarDays = 0;
  var openAprDays = 0;
  var openMayDays = 0;
  var openJunDays = 0;
  var openJulDays = 0;
  var openAugDays = 0;
  var openSepDays = 0;
  var openOctDays = 0;
  var openNovDays = 0;
  var openDecDays = 0;
  var a = 0;
  var year = "2014"

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      year="2014";
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
      if (solve_month == "1" && tickets.id > 1875) {
        year = "2015";
      }
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJanDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jan%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    closingFebDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Feb%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openFebDays = Days.toFixed(0);
    console.log ('Closing Feb Days '+closingFebDays+' Open Feb Days '+openFebDays);
    graphData.rows[a] = {"c":[{"v":"February","f":null},{"v":closingFebDays,"f":null},{"v":openFebDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Mar%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openMarDays = Days.toFixed(0);
    console.log ('Closing March Days '+closingMarDays+' Open March Days '+openMarDays);
    graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":closingMarDays,"f":null},{"v":openMarDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Apr%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openAprDays = Days.toFixed(0);
    console.log ('Closing April Days '+closingAprDays+' Open April Days '+openAprDays);
    graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":closingAprDays,"f":null},{"v":openAprDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "May%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openMayDays = Days.toFixed(0);
    console.log ('Closing May Days '+closingMayDays+' Open May Days '+openMayDays);
    graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":closingMayDays,"f":null},{"v":openMayDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    closingJunDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jun%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openJunDays = Days.toFixed(0);
    console.log ('Closing June Days '+closingJunDays+' Open June Days '+openJunDays);
    graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":closingJunDays,"f":null},{"v":openJunDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    closingJulDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jul%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openJulDays = Days.toFixed(0);
    console.log ('Closing July Days '+closingJulDays+' Open July Days '+openJulDays);
    graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":closingJulDays,"f":null},{"v":openJulDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Aug%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openAugDays = Days.toFixed(0);
    console.log ('Closing August Days '+closingAugDays+' Open August Days '+openAugDays);
    graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":closingAugDays,"f":null},{"v":openAugDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Sep%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openSepDays = Days.toFixed(0);
    console.log ('Closing September Days '+closingSepDays+' Open September Days '+openSepDays);
    graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":closingSepDays,"f":null},{"v":openSepDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Oct%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openOctDays = Days.toFixed(0);
    console.log ('Closing October Days '+closingOctDays+' Open October Days '+openOctDays);
    graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":closingOctDays,"f":null},{"v":openOctDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Nov%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    var openNovDays = Days.toFixed(0);
    console.log ('Closing November Days '+closingNovDays+' Open November Days '+openNovDays);
    graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":closingNovDays,"f":null},{"v":openNovDays,"f":null}]};
    a++
    });
    
    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
    closingDecDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Dec%" and id>964 and id<1915', function selectCb(err, results, fields) {
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
      var year = "2014";
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        //console.log(tickets.solved);
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        if (solve_month == "1") {
            year = "2015";
        }
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        console.log ('DECEMBER - GOT HERE '+nDate+ ' FOR REQUEST DATE '+rDate);
        sDate = nDate;
      }
       
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;    
    }
    
    var Days = totalDays / count;
    var openDecDays = Days.toFixed(0);
    console.log ('Closing December Days '+closingDecDays+' Open December Days '+openDecDays);
    graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":closingDecDays,"f":null},{"v":openDecDays,"f":null}]};
    a++

    response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
    });
    graph=JSON.stringify(graphData);
    response.end(graph);
  });
}

function Metrics2015(response, request) {
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
  var closingJunDays = 0;
  var closingJulDays = 0;
  var closingAugDays = 0;
  var closingSepDays = 0;
  var closingOctDays = 0;
  var closingNovDays = 0;
  var closingDecDays = 0;
  var openJanDays = 0;
  var openFebDays = 0;
  var openMarDays = 0;
  var openAprDays = 0;
  var openMayDays = 0;
  var openJunDays = 0;
  var openJulDays = 0;
  var openAugDays = 0;
  var openSepDays = 0;
  var openOctDays = 0;
  var openNovDays = 0;
  var openDecDays = 0;
  var a = 0;
  var year = "2015"

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
    if (err) {
      throw err;
    }
    var count = 0;
    var totalDays = 0;
    for (var i in results) {
      year = "2015";
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
      if (solve_month == "1" && tickets.id > 2591) {
        year = "2016";
      }
      sDate = (solve_day+"/"+solve_month+"/"+year);
       
      // CALCULATE THE DAYS BETWEEN REQUEST AND SOLVE
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    } 
    var Days = totalDays / count;
    closingJanDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    closingFebDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Feb%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openFebDays = Days.toFixed(0);
    console.log ('Closing Feb Days '+closingFebDays+' Open Feb Days '+openFebDays);
    graphData.rows[a] = {"c":[{"v":"Febuary","f":null},{"v":closingFebDays,"f":null},{"v":openFebDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Mar%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openMarDays = Days.toFixed(0);
    console.log ('Closing March Days '+closingMarDays+' Open March Days '+openMarDays);
    graphData.rows[a] = {"c":[{"v":"March","f":null},{"v":closingMarDays,"f":null},{"v":openMarDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Apr%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openAprDays = Days.toFixed(0);
    console.log ('Closing April Days '+closingAprDays+' Open April Days '+openAprDays);
    graphData.rows[a] = {"c":[{"v":"April","f":null},{"v":closingAprDays,"f":null},{"v":openAprDays,"f":null}]};
    a++

    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "May%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openMayDays = Days.toFixed(0);
    console.log ('Closing May Days '+closingMayDays+' Open May Days '+openMayDays);
    graphData.rows[a] = {"c":[{"v":"May","f":null},{"v":closingMayDays,"f":null},{"v":openMayDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    closingJunDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jun%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openJunDays = Days.toFixed(0);
    console.log ('Closing June Days '+closingJunDays+' Open June Days '+openJunDays);
    graphData.rows[a] = {"c":[{"v":"June","f":null},{"v":closingJunDays,"f":null},{"v":openJunDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    closingJulDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Jul%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openJulDays = Days.toFixed(0);
    console.log ('Closing July Days '+closingJulDays+' Open July Days '+openJulDays);
    graphData.rows[a] = {"c":[{"v":"July","f":null},{"v":closingJulDays,"f":null},{"v":openJulDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Aug%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openAugDays = Days.toFixed(0);
    console.log ('Closing August Days '+closingAugDays+' Open August Days '+openAugDays);
    graphData.rows[a] = {"c":[{"v":"August","f":null},{"v":closingAugDays,"f":null},{"v":openAugDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Sep%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openSepDays = Days.toFixed(0);
    console.log ('Closing September Days '+closingSepDays+' Open September Days '+openSepDays);
    graphData.rows[a] = {"c":[{"v":"September","f":null},{"v":closingSepDays,"f":null},{"v":openSepDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Oct%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openOctDays = Days.toFixed(0);
    console.log ('Closing October Days '+closingOctDays+' Open October Days '+openOctDays);
    graphData.rows[a] = {"c":[{"v":"October","f":null},{"v":closingOctDays,"f":null},{"v":openOctDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Nov%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    var openNovDays = Days.toFixed(0);
    console.log ('Closing November Days '+closingNovDays+' Open November Days '+openNovDays);
    graphData.rows[a] = {"c":[{"v":"November","f":null},{"v":closingNovDays,"f":null},{"v":openNovDays,"f":null}]};
    a++
    });

    mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
    closingDecDays = Days.toFixed(0);
  });

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where requested like "Dec%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
      var year = "2015";
      var request_month = convertMonth(hold_month);
      var rDate = (request_day+"/"+request_month+"/"+year);

      // IF SOLVED GET SOVLED DATE ELSE COMPARE TO TODAY
      if (tickets.solved.length > 1) {
        //console.log(tickets.solved);
        var sdate=tickets.solved;
        var shold_month = sdate.substring(0,3);
        var solve_day = sdate.substring(4,6);
        var solve_month = convertMonth(shold_month);
        if (solve_month == "1") {
            year = "2016";
        }
        sDate = (solve_day+"/"+solve_month+"/"+year);
      } else {
        sDate = nDate;
      }
       
      var diffDate = dateDifference(sDate, rDate);
      totalDays += diffDate;
    }
    
    var Days = totalDays / count;
    var openDecDays = Days.toFixed(0);
    console.log ('Closing December Days '+closingDecDays+' Open December Days '+openDecDays);
    graphData.rows[a] = {"c":[{"v":"December","f":null},{"v":closingDecDays,"f":null},{"v":openDecDays,"f":null}]};

    response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*'
    });
    graph=JSON.stringify(graphData);
    response.end(graph);
  });
}

function Metrics2016(response, request) {
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
  var closingJunDays = 0;
  var closingJulDays = 0;
  var closingAugDays = 0;
  var closingSepDays = 0;
  var closingOctDays = 0;
  var closingNovDays = 0;
  var closingDecDays = 0;
  var openJanDays = 0;
  var openFebDays = 0;
  var openMarDays = 0;
  var openAprDays = 0;
  var openMayDays = 0;
  var openJunDays = 0;
  var openJulDays = 0;
  var openAugDays = 0;
  var openSepDays = 0;
  var openOctDays = 0;
  var openNovDays = 0;
  var openDecDays = 0;
  var a = 0;
  var year = "2016"

  mysql.query('use ' + DATABASE);
    var data = mysql.query('select * from zendesk where (status="Closed" or status="Solved") and solved like "Jan%" and id>2594', function selectCb(err, results, fields) {
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
    var data = mysql.query('select * from zendesk where requested like "Jan%" and id>1914 and id<2595', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate7+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate7,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate6+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate6,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate5+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate5,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate4+'" and id>>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate4,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate3+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate3,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate2+'" and id>1914 and id<2595', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate2,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate1+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate1,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where requested="'+holdDate+'" and id>2594', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate7+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        closed = results[0]["count(*)"];
        graphData.rows[a] = {"c":[{"v":holdDate7,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate6+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate6,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate5+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate5,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate4+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate4,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate3+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate3,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate2+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate2,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate1+'" and id>2594', function selectCb(err, results, fields) {
        if (err) {
          throw err;
          response.end();
        }
        graphData.rows[a] = {"c":[{"v":holdDate1,"f":null},{"v":results[0]["count(*)"],"f":null}]};
        a++;
  });

  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT count(*) from zendesk where solved="'+holdDate+'" and id>2594', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>2594 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustJan2014(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustJan2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

function CustJan2016(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>2594 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustFeb2014(response, request) {

  console.log("request for handler 'Customer Febuary' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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


function CustFeb2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustMar2014(response, request) {

  console.log("request for handler 'Customer March' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustMar2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustApr2014(response, request) {

  console.log("request for handler 'Customer April' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustApr2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustMay2014(response, request) {

  console.log("request for handler 'Customer May' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustMay2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustJune2014(response, request) {

  console.log("request for handler 'Customer June' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustJune2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustJuly2014(response, request) {

  console.log("request for handler 'Customer July' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustJuly2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustAug2014(response, request) {

  console.log("request for handler 'Customer August' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustAug2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustSep2014(response, request) {

  console.log("request for handler 'Customer September' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustSep2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustOct2014(response, request) {

  console.log("request for handler 'Customer October' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustOct2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustNov2014(response, request) {

  console.log("request for handler 'Customer October' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustNov2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

function CustDec(response, request) {

  console.log("request for handler 'Customer December' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function CustDec2014(response, request) {

  console.log("request for handler 'Customer October' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function CustDec2015(response, request) {

  console.log("request for handler 'Customer' was called.");
  var westquebec=0;
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0; 
  
  mysql.query('use ' + DATABASE);
        
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>2594 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatJan2014(response, request) {

  console.log("request for handler 'Category JAN' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatJan2015(response, request) {

  console.log("request for handler 'Category JAN' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

function CatJan2016(response, request) {

  console.log("request for handler 'Category JAN' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jan%" and id>2594 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatFeb2014(response, request) {

  console.log("request for handler 'Category FEB' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatFeb2015(response, request) {

  console.log("request for handler 'Category FEB' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Feb%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatMar2014(response, request) {

  console.log("request for handler 'Category MARCH' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatMar2015(response, request) {

  console.log("request for handler 'Category MARCH' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Mar%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatApr2014(response, request) {

  console.log("request for handler 'Category April' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatApr2015(response, request) {

  console.log("request for handler 'Category APRIL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Apr%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatMay2014(response, request) {

  console.log("request for handler 'Category May' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatMay2015(response, request) {

  console.log("request for handler 'Category APRIL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "May%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatJune2014(response, request) {

  console.log("request for handler 'Category June' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatJune2015(response, request) {

  console.log("request for handler 'Category June' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jun%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatJuly2014(response, request) {

  console.log("request for handler 'Category July' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatJuly2015(response, request) {

  console.log("request for handler 'Category July' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Jul%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatAug2014(response, request) {

  console.log("request for handler 'Category August' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatAug2015(response, request) {

  console.log("request for handler 'Category August' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Aug%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatSep2014(response, request) {

  console.log("request for handler 'Category September' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatSep2015(response, request) {

  console.log("request for handler 'Category September' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Sep%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatOct2014(response, request) {

  console.log("request for handler 'Category October' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatOct2015(response, request) {

  console.log("request for handler 'Category October' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Oct%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatNov2014(response, request) {

  console.log("request for handler 'Category November' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatNov2015(response, request) {

  console.log("request for handler 'Category November' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Nov%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

function CatDec(response, request) {
  console.log("request for handler 'Category December' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id<965 group by category', function selectCb(err, results, fields) {
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

function CatDec2014(response, request) {

  console.log("request for handler 'Category December' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function CatDec2015(response, request) {

  console.log("request for handler 'Category December' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeCast" and requested like "Dec%" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jan%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function BlJan2014 (response, request) {
      console.log("request for handler 'BlazeLoop JAN' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jan%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function BlJan2015 (response, request) {
      console.log("request for handler 'BlazeLoop JAN' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jan%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

function BlJan2016 (response, request) {
      console.log("request for handler 'BlazeLoop JAN' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jan%" and id>2594 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Feb%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function BlFeb2014 (response, request) {
      console.log("request for handler 'BlazeLoop FEB' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Feb%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function BlFeb2015 (response, request) {
      console.log("request for handler 'BlazeLoop FEB' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Feb%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Mar%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function BlMar2014 (response, request) {
      console.log("request for handler 'BlazeLoop MARCH' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Mar%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function BlMar2015 (response, request) {
      console.log("request for handler 'BlazeLoop MARCH' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Mar%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

function BlApr (response, request) {
      console.log("request for handler 'BlazeLoop APRIL' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Apr%" and id<965 group by customer', function selectCb(err, results, fields) {
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

function BlApr2014 (response, request) {
      console.log("request for handler 'BlazeLoop April' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Apr%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

function BlApr2015 (response, request) {
      console.log("request for handler 'BlazeLoop APRIL' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Apr%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "May%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlMay2014 (response, request) {
      console.log("request for handler 'BlazeLoop May' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "May%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlMay2015 (response, request) {
      console.log("request for handler 'BlazeLoop April' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "May%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jun%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlJune2014 (response, request) {
      console.log("request for handler 'BlazeLoop June' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jun%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlJune2015 (response, request) {
      console.log("request for handler 'BlazeLoop June' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jun%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jul%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlJuly2014 (response, request) {
      console.log("request for handler 'BlazeLoop July' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jul%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlJuly2015 (response, request) {
      console.log("request for handler 'BlazeLoop July' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Jul%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Aug%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlAug2014 (response, request) {
      console.log("request for handler 'BlazeLoop August' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Aug%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlAug2015 (response, request) {
      console.log("request for handler 'BlazeLoop August' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Aug%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Sep%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlSep2014 (response, request) {
      console.log("request for handler 'BlazeLoop September' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Sep%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlSep2015 (response, request) {
      console.log("request for handler 'BlazeLoop September' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Sep%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Oct%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlOct2014 (response, request) {
      console.log("request for handler 'BlazeLoop October' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Oct%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlOct2015 (response, request) {
      console.log("request for handler 'BlazeLoop October' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Oct%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Nov%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlNov2014 (response, request) {
      console.log("request for handler 'BlazeLoop NOVEMBER' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Nov%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlNov2015 (response, request) {
      console.log("request for handler 'BlazeLoop November' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Nov%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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

   function BlDec (response, request) {
      console.log("request for handler 'BlazeLoop DECEMBER' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
      var a = 0;
      mysql.query('use ' + DATABASE);

        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Dec%" and id<965 group by customer', function selectCb(err, results, fields) {
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

   function BlDec2014 (response, request) {
      console.log("request for handler 'BlazeLoop December' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Dec%" and id>964 and id<1915 group by customer', function selectCb(err, results, fields) {
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

  function BlDec2015 (response, request) {
      console.log("request for handler 'BlazeLoop December' was called.");
      var graphData = {};
      graphData.cols = [];
      graphData.rows = [];
      graphData.cols[0] = {"id":"","label":"Customer","type":"string"};
      graphData.cols[1] = {"id":"","label":"COUNT","type":"number"}; 
      var a = 0;
      mysql.query('use ' + DATABASE);
                
        var data1 = mysql.query('SELECT customer, count(*) as count from zendesk where product = "BlazeLoop" and requested like "Dec%" and id>1914 and id<2595 group by customer', function selectCb(err, results, fields) {
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
                  
          var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and (requested="'+holdDate+'" or requested ="'+holdDate1+'" or requested ="'+holdDate6+'" or requested ="'+holdDate7+'" or requested ="'+holdDate2+'" or requested ="'+holdDate3+'" or requested ="'+holdDate4+'" or requested ="'+holdDate5+'") and id>2594 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jan%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatJan2014(response, request) {
  console.log("request for handler 'BlazeLoop Category January' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jan%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatJan2015(response, request) {
  console.log("request for handler 'BlazeLoop Category January' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jan%" and category not like "-" and id>1914 and id<2595 group by category', function selectCb(err, results, fields) {
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

function BlCatJan2016(response, request) {
  console.log("request for handler 'BlazeLoop Category January' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jan%" and category not like "-" and id>2594 group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Feb%" and category and id<965 not like "-" group by category', function selectCb(err, results, fields) {
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

function BlCatFeb2014(response, request) {
  console.log("request for handler 'BlazeLoop Category Febuary' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Feb%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatFeb2015(response, request) {
  console.log("request for handler 'BlazeLoop Category Febuary' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Feb%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Mar%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatMar2014(response, request) {
  console.log("request for handler 'BlazeLoop Category March' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Mar%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatMar2015(response, request) {
  console.log("request for handler 'BlazeLoop Category MARCH' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Mar%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "April%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatApr2014(response, request) {
  console.log("request for handler 'BlazeLoop Category March' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Apr%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatApr2015(response, request) {
  console.log("request for handler 'BlazeLoop Category APRIL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Apr%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "May%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatMay2014(response, request) {
  console.log("request for handler 'BlazeLoop Category May' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "May%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatMay2015(response, request) {
  console.log("request for handler 'BlazeLoop Category APRIL' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "May%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jun%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatJune2014(response, request) {
  console.log("request for handler 'BlazeLoop Category June' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jun%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatJune2015(response, request) {
  console.log("request for handler 'BlazeLoop Category JUNE' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jun%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jul%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatJuly2014(response, request) {
  console.log("request for handler 'BlazeLoop Category July' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jul%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatJuly2015(response, request) {
  console.log("request for handler 'BlazeLoop Category JULY' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Jul%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Aug%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatAug2014(response, request) {
  console.log("request for handler 'BlazeLoop Category August' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Aug%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatAug2015(response, request) {
  console.log("request for handler 'BlazeLoop Category AUGUST' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Aug%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Sep%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatSep2014(response, request) {
  console.log("request for handler 'BlazeLoop Category September' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Sep%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatSep2015(response, request) {
  console.log("request for handler 'BlazeLoop Category SEPTEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Sep%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Oct%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatOct2014(response, request) {
  console.log("request for handler 'BlazeLoop Category October' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Oct%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatOct2015(response, request) {
  console.log("request for handler 'BlazeLoop Category OCTOBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Oct%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Nov%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatNov2014(response, request) {
  console.log("request for handler 'BlazeLoop Category NOVEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Nov%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatNov2015(response, request) {
  console.log("request for handler 'BlazeLoop Category NOVEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Nov%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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

function BlCatDec(response, request) {
  console.log("request for handler 'BlazeLoop Category DECEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);

  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Dec%" and category not like "-" and id<965 group by category', function selectCb(err, results, fields) {
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

function BlCatDec2014(response, request) {
  console.log("request for handler 'BlazeLoop Category December' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Dec%" and category not like "-" and id>964 and id<1915 group by category', function selectCb(err, results, fields) {
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

function BlCatDec2015(response, request) {
  console.log("request for handler 'BlazeLoop Category DECEMBER' was called.");
  var graphData = {};
  graphData.cols = [];
  graphData.rows = [];
  graphData.cols[0] = {"id":"","label":"Category","type":"string"};
  graphData.cols[1] = {"id":"","label":"COUNT","type":"number"};
  var a = 0;

  mysql.query('use ' + DATABASE);
                
  var data1 = mysql.query('SELECT category, count(*) as count from zendesk where product="BlazeLoop" and requested like "Dec%" and category not like "-" and id>1914 and id<2595  group by category', function selectCb(err, results, fields) {
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



exports.Start = Start;
exports.Tickets = Tickets;
exports.Status = Status;
exports.Status2014 = Status2014;
exports.Status2015 = Status2015;
exports.Status2016 = Status2016;
exports.Priority = Priority;
exports.Priority2014 = Priority2014;
exports.Priority2015 = Priority2015;
exports.Priority2016 = Priority2016;
exports.Type = Type;
exports.Type2014 = Type2014;
exports.Type2015 = Type2015;
exports.Type2016 = Type2016;
exports.Compare = Compare;
exports.Compare2014 = Compare2014;
exports.Compare2015 = Compare2015;
exports.Compare2016 = Compare2016;
exports.Metrics = Metrics;
exports.Metrics2014 = Metrics2014;
exports.Metrics2015 = Metrics2015;
exports.Metrics2016 = Metrics2016;
exports.WeekOpen = WeekOpen;
exports.WeekClose = WeekClose;
exports.CustAll = CustAll;
exports.CustWeek = CustWeek;
exports.CustJan = CustJan;
exports.CustJan2014 = CustJan2014;
exports.CustFeb2014 = CustFeb2014;
exports.CustMar2014 = CustMar2014;
exports.CustApr2014 = CustApr2014;
exports.CustMay2014 = CustMay2014;
exports.CustJune2014 = CustJune2014;
exports.CustJuly2014 = CustJuly2014;
exports.CustAug2014 = CustAug2014;
exports.CustSep2014 = CustSep2014;
exports.CustOct2014 = CustOct2014;
exports.CustNov2014 = CustNov2014;
exports.CustDec2014 = CustDec2014;
exports.CustJan2015 = CustJan2015;
exports.CustFeb2015 = CustFeb2015;
exports.CustMar2015 = CustMar2015;
exports.CustApr2015 = CustApr2015;
exports.CustMay2015 = CustMay2015;
exports.CustJune2015 = CustJune2015;
exports.CustJuly2015 = CustJuly2015;
exports.CustAug2015 = CustAug2015;
exports.CustSep2015 = CustSep2015;
exports.CustOct2015 = CustOct2015;
exports.CustNov2015 = CustNov2015;
exports.CustDec2015 = CustDec2015;
exports.CustJan2016 = CustJan2016;
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
exports.CustDec = CustDec;
exports.CatAll = CatAll;
exports.CatWeek = CatWeek;
exports.CatJan = CatJan;
exports.CatJan2014 = CatJan2014;
exports.CatFeb2014 = CatFeb2014;
exports.CatMar2014 = CatMar2014;
exports.CatApr2014 = CatApr2014;
exports.CatMay2014 = CatMay2014;
exports.CatJune2014 = CatJune2014;
exports.CatJuly2014 = CatJuly2014;
exports.CatAug2014 = CatAug2014;
exports.CatSep2014 = CatSep2014;
exports.CatOct2014 = CatOct2014;
exports.CatNov2014 = CatNov2014;
exports.CatDec2014 = CatDec2014;
exports.CatJan2015 = CatJan2015;
exports.CatFeb2015 = CatFeb2015;
exports.CatMar2015 = CatMar2015;
exports.CatApr2015 = CatApr2015;
exports.CatMay2015 = CatMay2015;
exports.CatJune2015 = CatJune2015;
exports.CatJuly2015 = CatJuly2015;
exports.CatAug2015 = CatAug2015;
exports.CatSep2015 = CatSep2015;
exports.CatOct2015 = CatOct2015;
exports.CatNov2015 = CatNov2015;
exports.CatDec2015 = CatDec2015;
exports.CatJan2016 = CatJan2016;
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
exports.CatDec = CatDec;
exports.BlAll = BlAll;
exports.BlWeek = BlWeek;
exports.BlJan = BlJan;
exports.BlJan2014 = BlJan2014;
exports.BlFeb2014 = BlFeb2014;
exports.BlMar2014 = BlMar2014;
exports.BlApr2014 = BlApr2014;
exports.BlMay2014 = BlMay2014;
exports.BlJune2014 = BlJune2014;
exports.BlJuly2014 = BlJuly2014;
exports.BlAug2014 = BlAug2014;
exports.BlSep2014 = BlSep2014;
exports.BlOct2014 = BlOct2014;
exports.BlNov2014 = BlNov2014;
exports.BlDec2014 = BlDec2014;
exports.BlJan2015 = BlJan2015;
exports.BlFeb2015 = BlFeb2015;
exports.BlMar2015 = BlMar2015;
exports.BlApr2015 = BlApr2015;
exports.BlMay2015 = BlMay2015;
exports.BlJune2015 = BlJune2015;
exports.BlJuly2015 = BlJuly2015;
exports.BlAug2015 = BlAug2015;
exports.BlSep2015 = BlSep2015;
exports.BlOct2015 = BlOct2015;
exports.BlNov2015 = BlNov2015;
exports.BlDec2015 = BlDec2015;
exports.BlJan2016 = BlJan2016;
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
exports.BlDec = BlDec;
exports.BlCat = BlCat;
exports.BlCatWeek = BlCatWeek;
exports.BlCatJan = BlCatJan;
exports.BlCatJan2014 = BlCatJan2014;
exports.BlCatFeb2014 = BlCatFeb2014;
exports.BlCatMar2014 = BlCatMar2014;
exports.BlCatApr2014 = BlCatApr2014;
exports.BlCatMay2014 = BlCatMay2014;
exports.BlCatJune2014 = BlCatJune2014;
exports.BlCatJuly2014 = BlCatJuly2014;
exports.BlCatAug2014 = BlCatAug2014;
exports.BlCatSep2014 = BlCatSep2014;
exports.BlCatOct2014 = BlCatOct2014;
exports.BlCatNov2014 = BlCatNov2014;
exports.BlCatDec2014 = BlCatDec2014;
exports.BlCatJan2015 = BlCatJan2015;
exports.BlCatFeb2015 = BlCatFeb2015;
exports.BlCatMar2015 = BlCatMar2015;
exports.BlCatApr2015 = BlCatApr2015;
exports.BlCatMay2015 = BlCatMay2015;
exports.BlCatJune2015 = BlCatJune2015;
exports.BlCatJuly2015 = BlCatJuly2015;
exports.BlCatAug2015 = BlCatAug2015;
exports.BlCatSep2015 = BlCatSep2015;
exports.BlCatOct2015 = BlCatOct2015;
exports.BlCatNov2015 = BlCatNov2015;
exports.BlCatDec2015 = BlCatDec2015;
exports.BlCatJan2016 = BlCatJan2016;
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
exports.BlCatDec = BlCatDec;
exports.ticketDetails = ticketDetails;
exports.ForumList = ForumList;
exports.ForumDetail = ForumDetail;
exports.TicketsTest = TicketsTest;
