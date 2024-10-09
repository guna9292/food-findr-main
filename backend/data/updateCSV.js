const fs = require('fs');
const csvParser = require('csv-parser');
const csvWriter = require('csv-writer');
const path = require('path');

// File paths relative to the current directory (data)
const csvFilePath = path.join(__dirname, 'cleaned_zomato.csv');
const jsonFiles = [
  path.join(__dirname, 'file1.json'),
  path.join(__dirname, 'file2.json'),
  // Add other JSON files here
  path.join(__dirname, 'file3.json'),
  path.join(__dirname, 'file4.json'),
  path.join(__dirname, 'file5.json')
];

// Read CSV data
const csvData = [];

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    csvData.push(row);
  })
  .on('end', () => {
    console.log('CSV data successfully read');

    // Read JSON data from each file
    jsonFiles.forEach((file) => {
      try {
        const jsonData = JSON.parse(fs.readFileSync(file, 'utf-8'));

        // Assuming the JSON starts with an array of objects
        jsonData.forEach(data => {
          if (!data.restaurants || !Array.isArray(data.restaurants)) {
            console.warn(`No 'restaurants' array found in ${file}`);
            return;
          }

          data.restaurants.forEach(r => {
            const restaurant = r.restaurant;
            const csvRestaurant = csvData.find(row => row['Restaurant ID'] == restaurant.R.res_id);

            if (csvRestaurant) {
              csvRestaurant['url'] = restaurant.url || '';
              csvRestaurant['featured_image'] = restaurant.featured_image || '';
              csvRestaurant['share_url'] = restaurant.zomato_events && restaurant.zomato_events[0] ? restaurant.zomato_events[0].event.share_url : '';
            }
          });
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });

    // Write updated data back to CSV
    const updatedCsvFilePath = path.join(__dirname, 'updated_cleaned_zomato.csv');
    const writer = csvWriter.createObjectCsvWriter({
      path: updatedCsvFilePath,
      header: Object.keys(csvData[0]).map(key => ({ id: key, title: key }))
    });

    writer.writeRecords(csvData)
      .then(() => {
        console.log('CSV file successfully updated');
      })
      .catch(err => {
        console.error('Error writing updated CSV file:', err);
      });
  });
