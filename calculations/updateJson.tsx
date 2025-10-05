interface YearData {
  mainBalance: number;
  subBalance: number;
}

interface JsonData {
  [year: string]: YearData;
}

let fs: typeof import('fs') | null = null;

if (typeof window === 'undefined') {
  try {
    fs = require('fs');
  } catch {
    fs = null;
  }
}

export function updateMainBalanceAndExportJson(
  filePath: string,
  year: string,
  mainBalance: number,
): void {
    if (!fs) {
      console.warn('File system not available in browser environment');
      return;
    }

    let data: JsonData;
  try {
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(rawData);
      } else {
        console.log(`File ${filePath} doesn't exist. Creating with default data.`);
        data = {} as JsonData;
      }

    if (!data[year]) {
        data[year] = { mainBalance: 0, subBalance: 0 };
      }

      data[year].mainBalance = mainBalance;

    const updatedJson = JSON.stringify(data, null, 2);
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
      if (!fs) {
        console.warn('File system not available in browser environment');
        return;
      }

      let data: JsonData;
    try {
      if (fs.existsSync(filePath)) {
          const rawData = fs.readFileSync(filePath, 'utf-8');
          data = JSON.parse(rawData);
        } else {
          console.log(`File ${filePath} doesn't exist. Creating with default data.`);
          data = {} as JsonData;
        }

      if (!data[year]) {
          data[year] = { mainBalance: 0, subBalance: 0 };
        }

        data[year].subBalance = subBalance;

      const updatedJson = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, updatedJson, 'utf-8');
      console.log(`Updated subBalance for ${year} to ${subBalance} and exported to ${filePath}.`);

    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  }
