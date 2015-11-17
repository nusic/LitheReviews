#!/bin/sh

# Get fresh data
node get_exam_data.js exam_data.json --all

THISHASH=`cat exam_data.json | md5`
LASTHASH=`cat last_exam_data_hash.txt`

# Only update mongolab if we have new data, i.e. hash mismatch
if [[ $THISHASH != $LASTHASH ]]; then

	# Update mongolab with our fresh data
	node update_examdatas.js exam_data.json

	# Save hash of last data dump
	rm -f last_exam_data_hash.txt
	echo $THISHASH >> last_exam_data_hash.txt
else 
	echo 'No update since last time.'	
fi

# Cleanup - no need to store the data locally anymore
rm -f exam_data.json