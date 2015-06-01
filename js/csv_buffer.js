var fs = require('fs');
var readline = require('./readline');

var NL = '\n';
var GLUE = ', ';
var NEEDLE = '\t';
var INPUT_FILE = './data/SraRunTable.txt';
var OUTPUT_FILE = './out.csv';
var LAT_LON;

var HEADERS = 'Library_Name_s lat_lon_s env_biome_s env_feature_s'.split(' ');
var indexes = [];

// We create a write stream, we will append the
// transformed content to this file, line by line.
var outStream = fs.createWriteStream(OUTPUT_FILE);

readline(INPUT_FILE)
.on('header', function transformHeader(line){ // this handler only gets called for the first line
    var out = [];
    // Make an array with our line content using
    // the pipe symbol as breaking point
    var chunks = line.split(NEEDLE);

    chunks.forEach(function(chunk, i){
        if(HEADERS.indexOf(chunk) === -1) return;
        indexes.push(i);
        if(chunk === 'lat_lon_s'){
            chunk = 'lat, lon';
            LAT_LON = i;
        }
        out.push(chunk);
    });



    outStream.write(out.join(GLUE) + NL);
})
.on('line', function transformLine(line) {
    // Make an array with our line content using
    // the pipe symbol as breaking point
    var chunks = line.split(NEEDLE);

    var out = [], value;
    // And then appending each subsequent chunk item
    // to our out string buffer.
    indexes.forEach(function(index){
        value = chunks[index];
        if(index === LAT_LON) value = value.replace(' N', ',').replace(' W', '');
        out.push(value);
    });

    outStream.write(out.join(GLUE) + NL);

}).on('end', function endFile() {
    // Terminate file with new line.
    outStream.end(NL);
});