/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 87.4439461883408, "KoPercent": 12.556053811659194};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5102880658436214, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4"], "isController": false}, {"data": [0.7, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1"], "isController": false}, {"data": [0.45, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0"], "isController": false}, {"data": [0.85, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [0.1, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [0.35, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [0.3, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7"], "isController": false}, {"data": [0.15, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.3, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits"], "isController": false}, {"data": [0.3, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 223, 28, 12.556053811659194, 1273.7488789237661, 0, 11159, 334.0, 3857.7999999999993, 5822.999999999997, 10663.359999999993, 4.712595097210482, 1528.2544378698224, 4.3785166155959425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", 10, 0, 0.0, 6825.8, 3955, 11159, 5647.0, 11125.9, 11159.0, 11159.0, 0.3198362438431523, 1136.1787139984328, 1.1119306914859592], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5", 10, 0, 0.0, 5637.400000000001, 2702, 10142, 4166.5, 10105.9, 10142.0, 10142.0, 0.34839563808661117, 496.6094027627774, 0.20379783907605478], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4", 10, 0, 0.0, 3718.5999999999995, 2312, 6436, 3135.5, 6334.200000000001, 6436.0, 6436.0, 0.35955702574428305, 407.4767776724076, 0.21383811394362146], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1", 10, 0, 0.0, 453.9, 138, 768, 528.5, 757.8000000000001, 768.0, 768.0, 0.38955979742890534, 0.6368389657187378, 0.22863812329567587], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0", 10, 0, 0.0, 1107.1000000000001, 707, 2468, 991.5, 2336.5000000000005, 2468.0, 2468.0, 0.3611803373424351, 1.5573785756853396, 0.19011347834723877], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 10, 0, 0.0, 519.3000000000001, 269, 950, 382.5, 946.9, 950.0, 950.0, 0.27855929134516283, 0.4573105709769074, 0.22472444392601465], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3", 10, 0, 0.0, 2300.7000000000003, 1310, 4305, 2149.0, 4205.700000000001, 4305.0, 4305.0, 0.3761236694625193, 179.66626958193854, 0.22075227084665439], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 10, 0, 0.0, 337.1, 277, 427, 327.0, 424.9, 427.0, 427.0, 0.27831895352073477, 0.9822973924993043, 0.17452011724185917], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2", 10, 0, 0.0, 2971.1000000000004, 1802, 6299, 2107.0, 6240.6, 6299.0, 6299.0, 0.3668244011591651, 187.10193820842963, 0.2188766690510253], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 10, 0, 0.0, 249.79999999999998, 131, 431, 203.0, 426.1, 431.0, 431.0, 0.27905678805636946, 0.8355625174410493, 0.19354114343518905], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 10, 0, 0.0, 1183.0, 704, 1935, 1009.5, 1922.2, 1935.0, 1935.0, 0.2747856671795999, 3.3898998234502087, 1.440800004121785], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 10, 0, 0.0, 187.39999999999998, 140, 245, 185.5, 241.60000000000002, 245.0, 245.0, 0.2791580592931718, 0.2705434160571715, 0.20293482357210652], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 10, 0, 0.0, 193.4, 138, 245, 194.0, 243.0, 245.0, 245.0, 0.27909572983533354, 0.2706465427016467, 0.20196282793748258], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 10, 7, 70.0, 295.5, 214, 377, 285.5, 375.2, 377.0, 377.0, 0.2777469170092212, 0.1619286225141651, 0.14728181243750696], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 10, 0, 0.0, 184.4, 140, 244, 181.5, 242.0, 244.0, 244.0, 0.2792282132186636, 0.2709658940189317, 0.20295855380727668], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 10, 0, 0.0, 193.40000000000003, 136, 245, 205.0, 242.60000000000002, 245.0, 245.0, 0.27926720285969614, 0.271085546525916, 0.2018141895665773], "isController": false}, {"data": ["login", 10, 7, 70.0, 2752.9, 1824, 4070, 2476.5, 4050.9, 4070.0, 4070.0, 0.368908400044269, 7.673618956819272, 2.9549418738702182], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7", 3, 0, 0.0, 177.0, 142, 207, 182.0, 207.0, 207.0, 207.0, 0.3616200578592093, 0.35102572022661527, 0.2602675611740598], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 10, 7, 70.0, 375.09999999999997, 213, 685, 286.0, 682.7, 685.0, 685.0, 0.27804810232170163, 1.214478268803003, 0.17269393855136936], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages", 20, 0, 0.0, 512.5, 250, 1537, 332.0, 1074.6000000000001, 1514.2999999999997, 1537.0, 0.49469440253283536, 23.271603459150608, 0.2688451513764872], "isController": false}, {"data": ["Debug Sampler", 10, 0, 0.0, 0.6, 0, 3, 0.0, 2.8000000000000007, 3.0, 3.0, 0.2789089083505327, 0.20986261121492722, 0.0], "isController": false}, {"data": ["Test", 10, 0, 0.0, 6825.8, 3955, 11159, 5647.0, 11125.9, 11159.0, 11159.0, 0.3186235462800701, 1131.8707558347937, 1.1077146726143061], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 10, 7, 70.0, 296.09999999999997, 210, 404, 292.5, 399.40000000000003, 404.0, 404.0, 0.27724638886578507, 0.24115562359644013, 0.14403816296542737], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 10, 7, 70.0, 296.79999999999995, 212, 373, 286.5, 371.6, 373.0, 373.0, 0.27757730527952035, 0.44865058395325597, 0.14475222755787487], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 28, 100.0, 12.556053811659194], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 223, 28, "401/Unauthorized", 28, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 10, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 10, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 10, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 10, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
