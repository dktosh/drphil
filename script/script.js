
var records, datastoreId, username, apiKey, key;

$(document).ready(function() {
    
	
	$.ajax({
		   url: "config.json",
		   headers: { 'Content-Type': 'application/json' },
		   success: function(result){
				records = result["data"];
				datastoreId = result["datastoreId"];
				username = result["username"];
				apiKey = result["apiKey"];
				key = result["key"];
				
			},
			error: function(xhr, textStatus, errorThrown){
					console.log("error");
					/*records = [{"Device_Type" : "24", "Date_Time" : "10/3/2017  3:00:00 AM","Measurment_Dosage":"152","Units":"uM/mL","Drug":"","User":"387198398749832000"},
							  {"Device_Type" : "64", "Date_Time" : "10/3/2017  8:09:00 PM","Measurment_Dosage":"1000","Units":"mg","Drug":"Metformin","User":"387198398749832000"},
							  {"Device_Type" : "24", "Date_Time" : "10/3/2017  6:00:00 PM","Measurment_Dosage":"142","Units":"uM/mL","Drug":"","User":"387198398749832000"},
							  {"Device_Type" : "24", "Date_Time" : "10/3/2017  12:03:00 PM","Measurment_Dosage":"153","Units":"uM/mL","Drug":"","User":"387198398749832000"},
							  {"Device_Type" : "3", "Date_Time" : "10/3/2017  7:05:00 AM","Measurment_Dosage":"98.8","Units":"&#8451","Drug":"","User":"387198398749832000"},
							 {"Device_Type" : "84", "Date_Time" : "10/1/2017  3:07:00 AM","Measurment_Dosage":"7","Units":"%","Drug":"","User":"387198398749832000"},
						];

					datastoreId = 1015;
					username = 'sandipta87@gmail.com';
					apiKey = 'TH/flC/s+qEioktm+UXm/eF74VDK68bVaoWrraUIWnY=';
					key = 'VxWjvna7VEedVM8i2qOUGg';*/
			}
			
		});
	
	
    $('#preloadModal').on('shown.bs.modal', function() {
		loadData();
    });
	$('#historyModal').on('shown.bs.modal', function() {
		loadDataFromDB();
    });
	
	$('#userModal').on('shown.bs.modal', function() {
		$("#txtUserRecordID").val("");
		$('#divRecordData').html("");
    });
});


function loadData()
{
	var btnControls="<div class='divLoadControls'> <a href='#' onclick='rescanData();' class='btn btn-primary btn-lg'> RESCAN </a>";
			btnControls+="<a href='#' onclick='loadScanedData();' class='btn btn-primary btn-lg'> LOAD </a> </div>";
			
	defaultData();
    var tbl="<table class='table table-bordered'><tr><th>Device Type</th><th>Date/Time</th><th>Measurement/Dosage</th><th>Units</th><th>Drug</th><th>User</th></tr><tbody>";
        for (var i = 0; i < records.length; i++) {
            tbl+="<tr><td>";
            tbl+=records[i].Device_Type;
            tbl+="</td>";
            tbl+="<td>";
            tbl+=records[i].Date_Time;
            tbl+="</td>";
            tbl+="<td>";
            tbl+=records[i].Measurment_Dosage;
            tbl+="</td>";
            tbl+="<td>" ;
            tbl+=records[i].Units;
            tbl+="</td>";
            tbl+="<td>";
			tbl+=records[i].Drug;
            tbl+="</td>";
            tbl+="<td>";
            tbl+=records[i].User;
            tbl+="</td></tr>";
        }
    tbl+="</tbody></table>";
         
		
	setTimeout(function(){
		  $('#divScanData').html(btnControls+tbl);
		}, 3000);
}

function defaultData()
{
	var dataOld="<p>Scanning in progress ... <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></p> <div class='divImg'><img src='img/datastream0.gif' width='500px'/></div> ";
	$('#divScanData').html(dataOld);	  
}

function loadScanedData()
{
	var recordData=formateJson(records);
	$.post("https://tierion.com/form/submit",
        {
          _key: key,
		  recordData
        },
        function(data,status){
            alert("Your record is now on Blockchain...");
			
        });
}

function rescanData()
{
	defaultData();
	loadData();
	
}
function formateJson(jsonInput)
{
	var strJson="";
	
	var userName="'"+jsonInput[0]["User"]+"'";
	var Date_Time="[";
	var Device_Type="[";
	var Drug="[";
	var Measurment_Dosage="[";
	var Units="[";
	
	for(var iCounter=0;iCounter<jsonInput.length;iCounter++)
	{
		if(iCounter<jsonInput.length-1)
		{
			Date_Time+="'"+jsonInput[iCounter]["Date_Time"]+"',";
			Device_Type+="'"+jsonInput[iCounter]["Device_Type"]+"',";
			Drug+="'"+jsonInput[iCounter]["Drug"]+"',";
			Measurment_Dosage+="'"+jsonInput[iCounter]["Measurment_Dosage"]+"',";
			Units+="'"+jsonInput[iCounter]["Units"]+"',";
		}
		else
		{
			Date_Time+="'"+jsonInput[iCounter]["Date_Time"]+"'";
			Device_Type+="'"+jsonInput[iCounter]["Device_Type"]+"'";
			Drug+="'"+jsonInput[iCounter]["Drug"]+"'";
			Measurment_Dosage+="'"+jsonInput[iCounter]["Measurment_Dosage"]+"'";
			Units+="'"+jsonInput[iCounter]["Units"]+"'";
		}
	}
	Date_Time+="]";
	Device_Type+="]";
	Drug+="]";
	Measurment_Dosage+="]";
	Units+="]";
	
	strJson= "{'User':"+userName+",";
	strJson+= "'Device_Type' :" +Device_Type+",";
	strJson+= "'Date_Time' :" +Date_Time+",";
	strJson+= "'Measurment_Dosage' :" +Measurment_Dosage+",";
	strJson+= "'Drug' :" +Drug+",";
	strJson+= "'Units' :" +Units+"}";
	return strJson;
	
	
}

function loadDataFromDB()
{
	var tbl="<table class='table table-bordered'><tr><th>Record</th><th>Record ID</th><th>Date/Time</th></tr>";
	var dataOld="<p>Loading in progress ... <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></p> <div class='divImg'><img src='img/datastream0.gif' width='500px'/></div> ";
	$('#divloadData').html(dataOld);
	$.ajax({
		   url: "https://api.tierion.com/v1/records?datastoreId="+datastoreId,
		   headers: { 'X-Username': username,
		   'X-Api-Key': apiKey,
		   'Content-Type': 'application/json' },
		   success: function(result){
				var getVal=result.records;
				for(var iCounter=0; iCounter < getVal.length; iCounter++)
				{
					tbl +='<tr><td><a onclick="showDetails(\''+getVal[iCounter]['id']+'\');" class="btn btn-primary" >Record '+(iCounter+1)+'</a></td>';
					tbl +="<td>"+getVal[iCounter]['id']+"</td>";
					tbl +="<td>"+timeConverter(getVal[iCounter]['timestamp'])+"</td></tr>";
				}
				tbl+="</table>";	
				$("#divloadData").html(tbl);
			},
			error: function(xhr, textStatus, errorThrown){
					$("#divloadData").html("<p> Sorry no records found. </p>");
			}
			
		});
	
}

function showDetails(recordID)
{
	
	var tbl="<table class='table table-bordered'><tr><th>Device Type</th><th>Date/Time</th><th>Measurement/Dosage</th><th>Units</th><th>Drug</th></tr><tbody>";
    var dataOld="<p>Loading in progress ... <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></p> <div class='divImg'><img src='img/datastream0.gif' width='500px'/></div> ";
	$('#divloadData').html(dataOld);
	$.ajax({
		   url: "https://api.tierion.com/v1/records/"+recordID,
		   headers: { 'X-Username': username,
		   'X-Api-Key': apiKey,
		   'Content-Type': 'application/json' },
		   success: function(result){
				var getVal=JSON.parse(result.json).recorddata;
				getVal=getVal.replaceAll('\'','"');
				var jsonVal=JSON.parse(getVal);
				for (var i = 0; i < jsonVal["Device_Type"].length; i++) {
					tbl+="<tr><td>";
					tbl+=jsonVal["Device_Type"][i];
					tbl+="</td>";
					tbl+="<td>";
					tbl+=jsonVal["Date_Time"][i];
					tbl+="</td>";
					tbl+="<td>";
					tbl+=jsonVal["Measurment_Dosage"][i];
					tbl+="</td>";
					tbl+="<td>" ;
					tbl+=jsonVal["Units"][i];
					tbl+="</td>";
					tbl+="<td>";
					tbl+=jsonVal["Drug"][i];
					tbl+="</td></tr>";
				}
				tbl+="</tbody></table>";
				$("#divloadData").html(tbl);
			},
			error: function(xhr, textStatus, errorThrown){
					$("#divloadData").html("<p> Sorry no records found. </p>");
			}
			
		});
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function showRecord()
{
	var recordID=$("#txtUserRecordID").val();
	var tbl="<table class='table table-bordered'><tr><th>Device Type</th><th>Date/Time</th><th>Measurement/Dosage</th><th>Units</th><th>Drug</th></tr><tbody>";
    
	if(recordID)
	{
		var dataOld="<p>Loading in progress ... <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></p> <div class='divImg'><img src='img/datastream0.gif' width='500px'/></div> ";
		$('#divRecordData').html(dataOld);
	
		$.ajax({
			   url: "https://api.tierion.com/v1/records/"+recordID,
			   headers: { 'X-Username': username,
			   'X-Api-Key': apiKey,
			   'Content-Type': 'application/json' },
			   success: function(result){
					var getVal=JSON.parse(result.json).recorddata;
					getVal=getVal.replaceAll('\'','"');
					var jsonVal=JSON.parse(getVal);
					for (var i = 0; i < jsonVal["Device_Type"].length; i++) {
						tbl+="<tr><td>";
						tbl+=jsonVal["Device_Type"][i];
						tbl+="</td>";
						tbl+="<td>";
						tbl+=jsonVal["Date_Time"][i];
						tbl+="</td>";
						tbl+="<td>";
						tbl+=jsonVal["Measurment_Dosage"][i];
						tbl+="</td>";
						tbl+="<td>" ;
						tbl+=jsonVal["Units"][i];
						tbl+="</td>";
						tbl+="<td>";
						tbl+=jsonVal["Drug"][i];
						tbl+="</td></tr>";
					}
					tbl+="</tbody></table>";
					$("#divRecordData").html(tbl);
				},
				error: function(xhr, textStatus, errorThrown){
					$("#divRecordData").html("<p> Sorry no records found. </p>");
				}
				
			});
	}
}