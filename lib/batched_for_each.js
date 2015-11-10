/*
 * Adds an async and batched for each iteration to the Array prototype.
 * 
 * INPUT:
 *	1. batchSize 						The number of elements processed in each batch
 *	2. fn(element, index, callback) 	Function invoked on each element
 *			element 					The element to be processed
 *			index 						The index of <element> in the original array
 *			callback					Function to be called when processing of <element> is done
 * 	3. done() 							Function to be called when all elements have been processed
 *
 *
 * by Erik Broberg 2015
 */

Array.prototype.batchedForEach = function(batchSize, fn, done) {
	var numBatches = Math.ceil(this.length / batchSize);
	var batchIndex = 0;
	var thisArray = this;
	
	function recursiveForEach(array){
		var from = batchIndex*batchSize;
		var to = Math.min(from + batchSize, array.length);
		var batch = array.slice(from, to);

		batchedFn(batch, function (){
			batchIndex++;
			if(batchIndex < numBatches){
				recursiveForEach(array);	
			}
			else{
				done();
			}
		});
	};

	function batchedFn(batch, onBatchDone){
		var numProcessedElements = 0;
		batch.forEach(function (element, indexInBatch){
			var elementIndex = batchIndex*batchSize + indexInBatch;
			
			fn(element, elementIndex, function (){
				numProcessedElements++;
				if(numProcessedElements == batch.length){
					onBatchDone();
				}
			});	
		
		});
	}

	recursiveForEach(this);
}