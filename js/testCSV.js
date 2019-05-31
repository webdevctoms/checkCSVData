function TestCSV(variantMap,csvData){
	this.variantMap = variantMap;
	this.incorrectOptions = [];
	this.csvData = csvData;
}

TestCSV.prototype.findOptionColumn = function(option){
	let column;
	let columnValue;
	let optionKey = String(option).replace(",","");

	for(let key in this.variantMap){
		if(this.variantMap[key][optionKey]){
			column = this.variantMap[key].index;
			columnValue = this.variantMap[key][optionKey];
			break;
		}
	}

	return {column,columnValue};
};

TestCSV.prototype.findOptions = function(itemCodeArr,startIndex){
	let options = [];
	for(let i = startIndex;i < itemCodeArr.length;i++){
		options.push(itemCodeArr[i]);
	}

	return options;
};

TestCSV.prototype.captureOptions = function(itemCode) {
	let splitItemCode = itemCode.split("-");
	let itemCodeRegex = /\d{5}/g
	let options = [];

	if(splitItemCode.length <= 1){
		return;
	}
	//mostly catch discountinued case
	else if(itemCodeRegex.test(splitItemCode[1])){
		options = this.findOptions(splitItemCode,1);
	}
	//normal case
	else if(itemCodeRegex.test(splitItemCode[0])){
		options = this.findOptions(splitItemCode,0);
	}
	
	return options;
};

TestCSV.prototype.testOptions = function() {
	for(let i = 1;i < this.csvData.length;i++){
		let options = this.captureOptions(this.csvData[i][0]);
		console.log(this.csvData[i][0],options);
		if(options){
			for(let k = 0;k < options.length;k++){
				let columnData = this.findOptionColumn(options[k]);
				console.log("column data: ",columnData);
			}
		}
	}
};