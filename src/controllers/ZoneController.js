// const sequelize = require('../config/db');

// exports.getAllZoneDetailsWithClientId = async (req, res) => {
//   const { clientId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetZoneDetails(:clientId)', {
//       replacements: { clientId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const zoneDetails = result.map(zone => ({
//       zoneId : zone.ZoneID,
//       displayName : 'Zone ' + zone.ZoneID,
// 	    region : zone.Region,
// 	    gatewayId : zone.GatewayID,
// 	    lastCommunicationTime : zone.LastCommunicationTime,
// 	    reading : zone.Reading,
// 	    meters : zone.Meters,
// 	    status : zone.Status
//     }));

//     res.status(200).json({
//       zonesList: zoneDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client details.',
//       error: error.message
//     });
//   }
// };

// function getDatesBetween(startDate, endDate) {
//   const dates = [];
//   let currentDate = new Date(startDate);

//   while (currentDate <= new Date(endDate)) {
//     dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dates;
// };

// function convertYYYYMMDDtoMMDD(dateString) {
//   // Split the date string into an array
//   const [year, month, day] = dateString.split('-');
  
//   // Return the formatted date string as mm/dd
//   return `${month}/${day}`;
// };

// exports.getZoneWiseConsumptionInClientDashboard = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     const zoneCount = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionKPI(:clientId, :fromDate, :toDate)', {
//       replacements: { clientId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     const zoneList = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     let totalConsumption = 0;

//     zoneCount.forEach(reading => {
//         totalConsumption += Math.round(parseFloat(reading.TotalConsumption)) || 0;
        
//       });

//       const zoneWiseConsumption = zoneCount.map(zone => ({
//         zoneId: zone.ZoneID,
//         consumption:Math.round(zone.TotalConsumption)
//       }));

//     const zoneDetails = zoneList.map(zone => ({
//       zoneId: zone.ZoneID,
//       gatewayId: zone.GatewayID,
//       reading: Math.round(zone.Reading),
//       date: zone.ReadingTime,
//       dma: zone.DMACount,
//       meters:zone.MeterCount,
//       consumed:zone.ConsumptionPercent,
//       status: zone.ZoneStatus
//     }));

//     res.status(200).json({
//       totalConsumption : totalConsumption,
//       zoneWiseConsumption : zoneWiseConsumption,
//       zoneDetails: zoneDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client details.',
//       error: error.message
//     });
//   }
// };

// async function fetchZoneConsumption(clientId, zoneId, fromDate, toDate) {
//   return await sequelize.query(
//     'CALL USP_GetConsumptionByZone(:clientId, :zoneId, :fromDate, :toDate)',
//     {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     }
//   );
// }

// function formatResult(result, dates) {
//   const formattedResult = {};

//   // Initialize the formatted result with all dates
//   dates.forEach(date => {
//     formattedResult[date] = {
//       average: 0,
//       zoneDetails: []
//     };
//   });

//   result.forEach(reading => {
//     const date = reading.ReadingTime;

//     if (!formattedResult[date]) {
//       formattedResult[date] = {
//         average: 0,
//         zoneDetails: []
//       };
//     }

//     formattedResult[date].zoneDetails.push({
//       zoneId: reading.ZoneID,
//       zoneName: `Zone ${reading.ZoneID}`, // Assuming you want to use ZoneID for ZoneName
//       inflow: Math.round(parseFloat(reading.Inflow).toFixed(1)),
//       consumption: Math.round(parseFloat(reading.Consumption).toFixed(1)),
//       total: parseFloat(reading.Total).toFixed(1)
//     });

//     // Sum total for average calculation
//     formattedResult[date].average += parseFloat(reading.Total);
//   });

//   return formattedResult;
// }

// function calculateAverages(formattedResult) {
//   Object.keys(formattedResult).forEach(date => {
//     const totalZones = formattedResult[date].zoneDetails.length;
//     if (totalZones > 0) {
//       formattedResult[date].average = (formattedResult[date].average / totalZones).toFixed(1);
//     } else {
//       formattedResult[date].average = 0;
//     }
//   });

//   return formattedResult;
// }

// exports.getDayWiseZoneConsumptionInClientDashboard = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     const result = await fetchZoneConsumption(clientId, zoneId, fromDate, toDate);

//     const dates = getDatesBetween(fromDate, toDate);
//     let formattedResult = formatResult(result, dates);
//     formattedResult = calculateAverages(formattedResult);

//     res.status(200).json(formattedResult);
//   } catch (error) {
//     console.error('Error fetching zone wise consumption details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching zone wise consumption details.',
//       error: error.message
//     });
//   }
// };

// function roundToPlaces(num, decimalPlaces) {
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.round(num * factor) / factor;
// }

// exports.getTotalZoneWiseSegementation = async (req, res) => {
//   const { clientId, zoneId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
//       replacements: { clientId, zoneId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const zoneDetails = result.map(zone => ({
//       zoneId : zone.ZoneID,
//       displayName : 'Zone '+zone.ZoneID,
// 	    gatewayId : zone.GatewayID,
// 	    lastCommunicationTime : zone.LastCommunicationTime,
// 	    // reading : parseFloat(zone.Reading.toFixed(3)),
//       reading : roundToPlaces(zone.Reading, 2),
//       dmas: zone.DMAs,
// 	    meters : zone.Meters,
// 	    status : zone.Status
//     }));

//     res.status(200).json({
//       zoneDetails: zoneDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client details.',
//       error: error.message
//     });
//   }
// };

// exports.getAllZonesForDropdown = async (req, res) => {
//   const { clientId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetAllZones(:clientId)', {
//       replacements: { clientId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const zoneDetails = result.map(zone => ({
//       zoneId : zone.ZoneID,
//       displayName : zone.ZoneDisplayName
//     }));

//     res.status(200).json({
//       zonesList: zoneDetails
//     });
//   } catch (error) {
//     console.error('Error fetching zone details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching zone details.',
//       error: error.message
//     });
//   }
// };

// Importing sequelize to interact with the database
const sequelize = require('../config/db');

// Endpoint to fetch all zone details for a specific client
exports.getAllZoneDetailsWithClientId = async (req, res) => {
  const { clientId } = req.body;  // Destructure clientId from the request body

  try {
    // Query to fetch zone details for the specified client using a stored procedure
    const result = await sequelize.query('CALL USP_GetZoneDetails(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    // Map the result to a desired format for the response
    const zoneDetails = result.map(zone => ({
      zoneId: zone.ZoneID,  // Zone ID
      displayName: 'Zone ' + zone.ZoneID,  // Display name in the format 'Zone X'
      region: zone.Region,  // Region for the zone
      gatewayId: zone.GatewayID,  // Gateway ID for the zone
      lastCommunicationTime: zone.LastCommunicationTime,  // Last communication time with the zone
      reading: zone.Reading,  // Reading from the zone
      meters: zone.Meters,  // Number of meters in the zone
      status: zone.Status  // Status of the zone
    }));

    // Respond with the zone details in the expected format
    res.status(200).json({
      zonesList: zoneDetails  // List of zone details
    });
  } catch (error) {
    // Log the error and send a 500 server error response if the query fails
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Utility function to get all dates between a given start and end date
function getDatesBetween(startDate, endDate) {
  const dates = [];  // Array to hold the dates
  let currentDate = new Date(startDate);  // Start date as a Date object

  // Loop through all dates from startDate to endDate
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);  // Add the date in 'YYYY-MM-DD' format
    currentDate.setDate(currentDate.getDate() + 1);  // Move to the next day
  }

  return dates;  // Return the array of dates
}

// Utility function to convert date in 'YYYY-MM-DD' format to 'MM/DD'
function convertYYYYMMDDtoMMDD(dateString) {
  // Split the date string into year, month, and day components
  const [year, month, day] = dateString.split('-');
  
  // Return the formatted date string as 'MM/DD'
  return `${month}/${day}`;
}

// Endpoint to fetch zone-wise consumption for the client dashboard
exports.getZoneWiseConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;  // Destructure necessary values from the request body

  try {
    // Query to fetch the total zone-wise consumption KPI (Key Performance Indicator)
    const zoneCount = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionKPI(:clientId, :fromDate, :toDate)', {
      replacements: { clientId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    // Query to fetch detailed zone consumption list
    const zoneList = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let totalConsumption = 0;  // Variable to hold the total consumption value

    // Sum up the total consumption from all the zoneCount results
    zoneCount.forEach(reading => {
        totalConsumption += Math.round(parseFloat(reading.TotalConsumption)) || 0;  // Round and add the consumption value
      });

    // Map the zone consumption data into a formatted structure
    const zoneWiseConsumption = zoneCount.map(zone => ({
      zoneId: zone.ZoneID,  // Zone ID
      consumption: Math.round(zone.TotalConsumption)  // Round the consumption value
    }));

    // Map the detailed zone data into a formatted structure
    const zoneDetails = zoneList.map(zone => ({
      zoneId: zone.ZoneID,  // Zone ID
      gatewayId: zone.GatewayID,  // Gateway ID
      reading: Math.round(zone.Reading),  // Round the reading value
      date: zone.ReadingTime,  // Reading time for the zone
      dma: zone.DMACount,  // DMA count for the zone
      meters: zone.MeterCount,  // Meter count for the zone
      consumed: zone.ConsumptionPercent,  // Consumption percentage
      status: zone.ZoneStatus  // Status of the zone
    }));

    // Respond with the total consumption and zone-wise details
    res.status(200).json({
      totalConsumption: totalConsumption,  // Total consumption value
      zoneWiseConsumption: zoneWiseConsumption,  // List of zone-wise consumption
      zoneDetails: zoneDetails  // List of detailed zone information
    });
  } catch (error) {
    // Log the error and send a 500 server error response if the query fails
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Helper function to fetch consumption data for a specific zone
async function fetchZoneConsumption(clientId, zoneId, fromDate, toDate) {
  return await sequelize.query(
    'CALL USP_GetConsumptionByZone(:clientId, :zoneId, :fromDate, :toDate)',  // Call the stored procedure to fetch zone consumption data
    {
      replacements: { clientId, zoneId, fromDate, toDate },  // Replace placeholders with the actual values
      type: sequelize.QueryTypes.RAW  // Specify the query type as RAW for direct SQL query execution
    }
  );
}

// Function to format the result with dates and zone details
function formatResult(result, dates) {
  const formattedResult = {};

  // Initialize the formatted result with all dates, setting average to 0 and empty zoneDetails
  dates.forEach(date => {
    formattedResult[date] = {
      average: 0,  // Initialize average consumption to 0
      zoneDetails: []  // Initialize an empty array to hold the zone details for each date
    };
  });

  // Iterate through each reading in the result
  result.forEach(reading => {
    const date = reading.ReadingTime;  // Extract the reading time (date) for this reading

    // If the date doesn't exist in the formattedResult, initialize it
    if (!formattedResult[date]) {
      formattedResult[date] = {
        average: 0,
        zoneDetails: []
      };
    }

    // Add the zone details for this particular reading
    formattedResult[date].zoneDetails.push({
      zoneId: reading.ZoneID,  // Zone ID
      zoneName: `Zone ${reading.ZoneID}`,  // Display 'Zone X' where X is the Zone ID
      inflow: Math.round(parseFloat(reading.Inflow).toFixed(1)),  // Rounded inflow value
      consumption: Math.round(parseFloat(reading.Consumption).toFixed(1)),  // Rounded consumption value
      total: parseFloat(reading.Total).toFixed(1)  // Rounded total value
    });

    // Sum total for average calculation
    formattedResult[date].average += parseFloat(reading.Total);  // Add to the running total for this date
  });

  return formattedResult;  // Return the formatted result object
}

// Function to calculate average consumption for each date
function calculateAverages(formattedResult) {
  Object.keys(formattedResult).forEach(date => {
    const totalZones = formattedResult[date].zoneDetails.length;  // Number of zones for this date
    if (totalZones > 0) {
      // Calculate average consumption by dividing total by the number of zones
      formattedResult[date].average = (formattedResult[date].average / totalZones).toFixed(1);
    } else {
      formattedResult[date].average = 0;  // If no zones, set average to 0
    }
  });

  return formattedResult;  // Return the updated formatted result with averages
}

// Endpoint to fetch day-wise zone consumption in the client dashboard
exports.getDayWiseZoneConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;  // Extract necessary values from request body

  try {
    // Fetch the consumption data for the specified client, zone, and date range
    const result = await fetchZoneConsumption(clientId, zoneId, fromDate, toDate);

    // Get all the dates between fromDate and toDate
    const dates = getDatesBetween(fromDate, toDate);

    // Format the result with the fetched data and dates
    let formattedResult = formatResult(result, dates);

    // Calculate the average consumption for each date
    formattedResult = calculateAverages(formattedResult);

    // Respond with the formatted result
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Error fetching zone wise consumption details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching zone wise consumption details.',
      error: error.message
    });
  }
};

// Helper function to round a number to a specified number of decimal places
function roundToPlaces(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);  // Calculate the factor to round to the desired decimal places
  return Math.round(num * factor) / factor;  // Round the number and return it
}

// Endpoint to fetch total zone-wise segmentation for a client and zone
exports.getTotalZoneWiseSegementation = async (req, res) => {
  const { clientId, zoneId } = req.body;  // Extract clientId and zoneId from the request body

  try {
    // Call the stored procedure to fetch total zone-wise segmentation details
    const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    // Map the result to a formatted structure
    const zoneDetails = result.map(zone => ({
      zoneId: zone.ZoneID,  // Zone ID
      displayName: 'Zone ' + zone.ZoneID,  // Display name in the format 'Zone X'
      gatewayId: zone.GatewayID,  // Gateway ID
      lastCommunicationTime: zone.LastCommunicationTime,  // Last communication time with the zone
      reading: roundToPlaces(zone.Reading, 2),  // Round the reading value to 2 decimal places
      dmas: zone.DMAs,  // DMA count for the zone
      meters: zone.Meters,  // Meter count for the zone
      status: zone.Status  // Status of the zone
    }));

    // Respond with the zone details
    res.status(200).json({
      zoneDetails: zoneDetails
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Endpoint to fetch all zones for a dropdown list (e.g., for selecting a zone in the UI)
exports.getAllZonesForDropdown = async (req, res) => {
  const { clientId } = req.body;  // Extract clientId from the request body

  try {
    // Call the stored procedure to fetch all zones for the given client
    const result = await sequelize.query('CALL USP_GetAllZones(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    // Map the result to a formatted structure suitable for dropdown selection
    const zoneDetails = result.map(zone => ({
      zoneId: zone.ZoneID,  // Zone ID
      displayName: zone.ZoneDisplayName  // Display name for the dropdown list
    }));

    // Respond with the list of zones
    res.status(200).json({
      zonesList: zoneDetails
    });
  } catch (error) {
    console.error('Error fetching zone details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching zone details.',
      error: error.message
    });
  }
};
