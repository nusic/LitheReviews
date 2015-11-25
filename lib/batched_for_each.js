/*
 * Adds an async and batched for each iteration to the Array prototype.
 * 
 * INPUT:
 *	1. batchSize 						The number of elements processed in each batch
 *	2. fn(element, index, done) 		Function invoked on each element
 *			element 					The element to be processed
 *			index 						The index of <element> in the original array
 *			done						Function to be called when processing of <element> is done
 *
 * RETURNS:
 *	promise
 *
 * by Erik Broberg 2015
 */

Array.prototype.batchedForEach = function(batchSize, fn) {
	var numBatches = Math.ceil(this.length / batchSize);
	var batchIndex = 0;
	var thisArray = this;

	var results = new Array(this.length);

	var promise = new Promise(function (resolve, reject){
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
					resolve(results);
				}
			});
		};

		function batchedFn(batch, onBatchDone){
			var numProcessedElements = 0;
			batch.forEach(function (element, indexInBatch){
				var elementIndex = batchIndex*batchSize + indexInBatch;
				
				fn(element, elementIndex, function (result){
					results[elementIndex] = result;

					numProcessedElements++;
					if(numProcessedElements == batch.length){
						onBatchDone();
					}
				});
			});
		}

		recursiveForEach(thisArray);
	});

	return promise;
}