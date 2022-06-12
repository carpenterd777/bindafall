echo "Generating data file..."

DATA_FILEPATH="./src/utils/data.ts"
CSV_FILEPATH="./public/bindafall_database.csv"

echo "// AUTOGENERATED FILE: DO NOT EDIT" > $DATA_FILEPATH
echo -n "export const data = \`" >> $DATA_FILEPATH
cat $CSV_FILEPATH >> $DATA_FILEPATH
echo "\`;" >> $DATA_FILEPATH
echo "export default data;" >> $DATA_FILEPATH

echo "Finished generating data file."