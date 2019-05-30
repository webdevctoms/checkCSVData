function App(dropZoneID,downloadID,testButtonID){
	this.csvDropZone = document.getElementById(dropZoneID);
	this.testButton = document.getElementById(testButtonID);
	this.downloadLink = document.getElementById(downloadID);

	this.newShopifyData;
	this.templateHeadingLength = 19;
	this.commaSplitData;

	this.captureCSV = new CaptureCSV();
	this.testCSV;
	this.initApp();
}

App.prototype.initApp = function() {
	this.csvDropZone.addEventListener("drop",function(e){
		e.preventDefault();
		this.fileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.csvDropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);

	this.testButton.addEventListener("click",function(e){
		e.preventDefault();
		this.runTests();
	}.bind(this),false);

};

App.prototype.runTests = function(){
	console.log("run tests");
	try{
		Tests.checkLength(this.commaSplitData,this.commaSplitData[0].length);
		Tests.checkLength(this.newShopifyData,this.newShopifyData[0].length);
		Tests.checkTags(this.newShopifyData);
	}
	catch(err){
		console.log("error testing ",err);
	}
};

App.prototype.createDownload = function(csvData,downloadLink){
	downloadLink.classList.remove("hide");
	downloadLink.setAttribute("href","");
	downloadLink.setAttribute("href",csvData);
	downloadLink.setAttribute("download", "new_data.csv");
};

App.prototype.createBlob = function(arr){
	let lineArray = [];

	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		lineArray.push(row);	
	});
	let csvContent = lineArray.join("\n");
	let csvData = new Blob([csvContent],{type:'text/csv'});
	let csvURL = URL.createObjectURL(csvData);
	return csvURL;
};

App.prototype.fileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		console.log(commaSplitData);
		this.commaSplitData = commaSplitData;
		this.testCSV = new TestCSV(variantMap,commaSplitData);
	})

	.catch(err => {
		console.log("error reading file", err);
	});
};

let app = new App("drop_zone","downloadLink","testData");