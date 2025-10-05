import * as fs from 'fs'; // Node.js file system module (built-in)

// Define an interface for type safety (optional but recommended)
interface YearData {
  mainBalance: number;  // Adjust types as needed (e.g., string, object)
  subBalance: number;
}

interface JsonData {
  [year: string]: YearData;  // Dynamic keys for years
}

export function updateMainBalanceAndExportJson(
  filePath: string,
  year: string,
  mainBalance: number,
): void {
    let data: JsonData;
  try {
    // Step 1: Read the existing JSON file
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(rawData);
      } else {
        console.log(`File ${filePath} doesn't exist. Creating with default data.`);
        data = {} as JsonData; // Empty object
        // Optionally merge defaults: Object.assign(data, defaultData || {});
      }

    // Step 2: Update only the specific value (value2 remains unchanged)
    if (!data[year]) {
        data[year] = { mainBalance: 0, subBalance: 0 }; // Initialize with defaults
      }
  
      // Step 3: Update only the specific value (value2 remains unchanged)
      data[year].mainBalance = mainBalance;

    // Step 3: Write the updated object back to the JSON file (export)
    const updatedJson = JSON.stringify(data, null, 2);  // Pretty-print with 2 spaces
    fs.writeFileSync(filePath, updatedJson, 'utf-8');
    console.log(`Updated mainBalance for ${year} to ${mainBalance} and exported to ${filePath}.`);

  } catch (error) {
    console.error('Error updating JSON:', error);
  }
}
export function updateSubBalanceAndExportJson(
    filePath: string,
    year: string,
    subBalance: number,
  ): void {
      let data: JsonData;
    try {
      // Step 1: Read the existing JSON file
      if (fs.existsSync(filePath)) {
          const rawData = fs.readFileSync(filePath, 'utf-8');
          data = JSON.parse(rawData);
        } else {
          console.log(`File ${filePath} doesn't exist. Creating with default data.`);
          data = {} as JsonData; // Empty object
          // Optionally merge defaults: Object.assign(data, defaultData || {});
        }
  
      // Step 2: Update only the specific value (value2 remains unchanged)
      if (!data[year]) {
          data[year] = { mainBalance: 0, subBalance: 0 }; // Initialize with defaults
        }
    
        // Step 3: Update only the specific value (value2 remains unchanged)
        data[year].subBalance = subBalance;
  
      // Step 3: Write the updated object back to the JSON file (export)
      const updatedJson = JSON.stringify(data, null, 2);  // Pretty-print with 2 spaces
      fs.writeFileSync(filePath, updatedJson, 'utf-8');
      console.log(`Updated subBalance for ${year} to ${subBalance} and exported to ${filePath}.`);
  
    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  }
