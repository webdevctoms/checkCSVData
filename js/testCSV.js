function TestCSV(variantMap,csvData){
	this.variantMap = variantMap;
	this.incorrectOptions = [];
	this.csvData = csvData;
}

TestCSV.prototype.fixXLarge = function(arr){
	let fixedArr = [];
	fixedArr.push(arr[0]);
	for(let i = 1;i < arr.length;i++){
		let row = arr[i];
		if(row[15] === "X-Large,"){
			console.log("found one");
			row[15] = "Extra Large";
		}
		fixedArr.push(row);
	}

	return fixedArr;
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
//error because some XL = extra large other will = X-large
TestCSV.prototype.testOptions = function() {
	let newData = [];
	for(let i = 1;i < this.csvData.length;i++){
		let options = this.captureOptions(this.csvData[i][0]);
		
		if(options){
			console.log(this.csvData[i][0],options);
			for(let k = 0;k < options.length;k++){
				let columnData;
				if(k === 3 && options[k] === "XL,"){
					columnData = this.findOptionColumn("XLL");
				}
				else if(k === 3 && options[k] === "S,"){
					columnData = this.findOptionColumn("SH");
				}
				else{
					columnData = this.findOptionColumn(options[k]);
				}
				
				//console.log("column data: ",columnData);
				if(columnData.column && this.csvData[i][columnData.column] !== (columnData.columnValue + ",")){
					//copy over data to empty correct location
					if(this.csvData[i][columnData.column] === ","){
						this.csvData[i][columnData.column] = columnData.columnValue + ",";
					}
					else{
						console.log("column data: ",this.csvData[i][0],columnData,options[k]);
						this.incorrectOptions.push(this.csvData[i]);
					}
					
				}
			}
		}
		newData.push(this.csvData[i])
	}

	console.log(this.incorrectOptions);

	return newData;

};