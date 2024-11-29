// const sequelize = require('../config/db');


// exports.getTotalOutflow = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     // Call the stored procedure
//     const result = await sequelize.query('CALL USP_GetTotalOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dates = getDatesBetween(fromDate, toDate);
//     let maxReading = 0;
//     const readingsMap = new Map();

//     // Find the maximum reading and store them in a map
//     result.forEach(reading => {
//       if (reading.Reading > maxReading) {
//         maxReading = reading.Reading;
//       }

//       readingsMap.set(reading.ReadingDate, reading.Reading);
//     });

//     // Round the max reading to the nearest multiple of 500
//     const roundedMaxReading = Math.round(maxReading / 1000) * 1000;
//     const difference = Math.round(roundedMaxReading / 5);

//     // Ensure each date in the range has a reading
//     const readings = dates.map(date => {
//       const reading = readingsMap.get(date) || 0;
//       return {
//         date: convertYYYYMMDDtoMMDD(date),
//         count: Math.round(reading)
//       };
//     });

//     res.status(200).json({
//       minRange: 0,
//       maxRange: roundedMaxReading,
//       difference: difference,
//       totalOutFlow: readings
//     });
//   } catch (error) {
//     console.error('Error fetching Total Out Flow details:', error);
//     res.status(500).json({
//       statusCode: 500,
//       message: 'An error occurred while fetching Total Out Flow details.',
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

// exports.getAllDashboardValues = async (req, res) => {
//     const { clientId } = req.body;
  
//     try {
//         const zoneResult = await sequelize.query('CALL USP_GetZoneCountKPI(:clientId)', {
//             replacements: { clientId },
//             type: sequelize.QueryTypes.RAW
//         });

//         const dmaResult = await sequelize.query('CALL USP_GetDMACountKPI(:clientId)', {
//             replacements: { clientId },
//             type: sequelize.QueryTypes.RAW
//         });

//         const meterResult = await sequelize.query('CALL USP_GetMeterCountKPI(:clientId, 0, 0)', {
//           replacements: { clientId },
//           type: sequelize.QueryTypes.RAW
//         });

//         const gatewayResult = await sequelize.query('CALL USP_GetGatewayCountKPI(:clientId)', {
//           replacements: { clientId },
//           type: sequelize.QueryTypes.RAW
//         });


//         const dmaDetails = {
//             activeDma: dmaResult[0]?.ActiveDMA || 6,
//             inactiveDma: dmaResult[0]?.InActiveDMA || 0,
//             faultyDma: dmaResult[0]?.FaultyDAM || 0,
//             totalCount: dmaResult[0]?.TotalDMA || 6
//         };

//         const zoneDetails = {
//             activeZones: zoneResult[0]?.ActiveZone || 2,
//             inactiveZones: zoneResult[0]?.InActiveZone || 0,
//             totalCount: zoneResult[0]?.TotalZone || 2
//         };

//         const meterDetails = {
//             activeMeters: meterResult[0]?.ActiveMeters || 4445,
//             inactiveMeters: meterResult[0]?.InActiveMeters || 0,
//             faultyMeters: meterResult[0]?.FaultyMeters || 0,
//             totalCount: meterResult[0]?.TotalMeters || 4445,
//         }; 

//         const gatewayDetails = {
//             activeGateways: gatewayResult[0]?.ActiveGateway || 15,
//             inactiveGateways: gatewayResult[0]?.InActiveGateway || 0,
//             totalCount: gatewayResult[0]?.TotalGateways || 15
//         };

//         res.status(200).json({
//             totalZone: zoneDetails,
//             totalDma: dmaDetails,
//             totalMeters: meterDetails,
//             totalGateway: gatewayDetails
//         });
//     } catch (error) {
//         console.error('Error fetching client details:', error);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while fetching client details.',
//             error: error.message
//         });
//     }
// };
// function roundToPlaces(num, decimalPlaces) {
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.round(num * factor) / factor;
// }


// exports.getTotalConsumptionInClientDashboard = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     // Call the stored procedure
//     const result = await sequelize.query('CALL USP_GetTotalConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dates = getDatesBetween(fromDate, toDate);
//     let totalInFlow = 0;
//     let totalOutFlow = 0;
//     const readingsMap = new Map();

//     // Sum readings and store them in a map
//     result.forEach(reading => {
//       const inflow = parseFloat(reading.TotalInFlow) || 0;
//       const outflow = parseFloat(reading.TotalOutFlow) || 0;

//       totalInFlow += inflow;
//       totalOutFlow += outflow;

//       readingsMap.set(reading.ReadingDate, { inflow, outflow });
      
//     });

//     // Generate dmaDetails and calculate maxValue from inflow and outflow in the same step
//     let maxValue = 0;

//     const dmaDetails = dates.map(date => {
      
//       const reading = readingsMap.get(date) || { inflow: 0, outflow: 0 };
//       const inflow = roundToPlaces(reading.inflow / 1000, 2);
//       const outflow = roundToPlaces(reading.outflow / 1000, 2);

//       // Update maxValue with the largest of inflow or outflow
//       maxValue = Math.max(maxValue, inflow, outflow);

//       return {
//         date: convertYYYYMMDDtoMMDD(date),
//         inflow,
//         consumption: outflow
//       };
//     });

//     // Round up maxValue to the nearest 1000
//     maxValue = Math.ceil(maxValue / 1000) * 1000;

//     const inFlowDetails = {
//       count: roundToPlaces(totalInFlow / 1000, 2),
//       label: "In Flow",
//       lastWeekPercentage: "7",
//       action: "increased"
//     };

//     const consumptionDetails = {
//       count: roundToPlaces(totalOutFlow / 1000, 2),
//       label: "Consumption",
//       lastWeekPercentage: "7",
//       action: "decreased"
//     };

//     res.status(200).json({
//       maxValue: maxValue !== 0 ? maxValue : 100,
//       minValue: 0,
//       inFlowDetails,
//       consumptionDetails,
//       totalConsumption: dmaDetails
//     });
//   } catch (error) {
//     console.error('Error fetching values:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching total consumption values.',
//       error: error.message
//     });
//   }
// };



// function convertYYYYMMDDtoMMDD(dateString) {
//   // Split the date string into an array
//   const [year, month, day] = dateString.split('-');
  
//   // Return the formatted date string as mm/dd
//   return `${month}/${day}`;
// };

const sequelize = require('../config/db'); // Import the Sequelize instance for database operations.

// Handler to fetch the total outflow for a client within a date range.
exports.getTotalOutflow = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body; // Extract parameters from the request body.

  try {
    // Call the stored procedure to fetch outflow data.
    const result = await sequelize.query('CALL USP_GetTotalOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW // Use RAW query type for stored procedure calls.
    });

    // Get a list of all dates between the provided range.
    const dates = getDatesBetween(fromDate, toDate);

    let maxReading = 0; // Variable to store the maximum reading.
    const readingsMap = new Map(); // Map to associate dates with readings.

    // Populate the map and find the maximum reading.
    result.forEach(reading => {
      if (reading.Reading > maxReading) {
        maxReading = reading.Reading;
      }
      readingsMap.set(reading.ReadingDate, reading.Reading);
    });

    // Round the maximum reading to the nearest multiple of 1000.
    const roundedMaxReading = Math.round(maxReading / 1000) * 1000;
    const difference = Math.round(roundedMaxReading / 5); // Determine the step size.

    // Ensure each date in the range has a reading, defaulting to 0 if missing.
    const readings = dates.map(date => {
      const reading = readingsMap.get(date) || 0;
      return {
        date: convertYYYYMMDDtoMMDD(date), // Convert date format to MM/DD.
        count: Math.round(reading) // Round reading value to nearest integer.
      };
    });

    // Send the response with the processed data.
    res.status(200).json({
      minRange: 0,
      maxRange: roundedMaxReading,
      difference: difference,
      totalOutFlow: readings
    });
  } catch (error) {
    // Handle errors and send an error response.
    console.error('Error fetching Total Out Flow details:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching Total Out Flow details.',
      error: error.message
    });
  }
};

// Utility function to get all dates between a start and end date.
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  // Iterate over each date in the range and format it as 'YYYY-MM-DD'.
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day.
  }

  return dates;
}

// Handler to fetch all dashboard KPI values for a client.
exports.getAllDashboardValues = async (req, res) => {
  const { clientId } = req.body; // Extract clientId from the request body.

  try {
    // Call stored procedures to fetch counts for zones, DMAs, meters, and gateways.
    const zoneResult = await sequelize.query('CALL USP_GetZoneCountKPI(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    const dmaResult = await sequelize.query('CALL USP_GetDMACountKPI(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    const meterResult = await sequelize.query('CALL USP_GetMeterCountKPI(:clientId, 0, 0)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    const gatewayResult = await sequelize.query('CALL USP_GetGatewayCountKPI(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    // Transform the results into structured objects with default values.
    const dmaDetails = {
      activeDma: dmaResult[0]?.ActiveDMA || 6,
      inactiveDma: dmaResult[0]?.InActiveDMA || 0,
      faultyDma: dmaResult[0]?.FaultyDAM || 0,
      totalCount: dmaResult[0]?.TotalDMA || 6
    };

    const zoneDetails = {
      activeZones: zoneResult[0]?.ActiveZone || 2,
      inactiveZones: zoneResult[0]?.InActiveZone || 0,
      totalCount: zoneResult[0]?.TotalZone || 2
    };

    const meterDetails = {
      activeMeters: meterResult[0]?.ActiveMeters || 4445,
      inactiveMeters: meterResult[0]?.InActiveMeters || 0,
      faultyMeters: meterResult[0]?.FaultyMeters || 0,
      totalCount: meterResult[0]?.TotalMeters || 4445,
    };

    const gatewayDetails = {
      activeGateways: gatewayResult[0]?.ActiveGateway || 15,
      inactiveGateways: gatewayResult[0]?.InActiveGateway || 0,
      totalCount: gatewayResult[0]?.TotalGateways || 15
    };

    // Send the aggregated dashboard values as a response.
    res.status(200).json({
      totalZone: zoneDetails,
      totalDma: dmaDetails,
      totalMeters: meterDetails,
      totalGateway: gatewayDetails
    });
  } catch (error) {
    // Handle errors and send an error response.
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
}

// Utility function to round a number to a specified number of decimal places.
function roundToPlaces(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces); // Calculate the rounding factor.
  return Math.round(num * factor) / factor; // Perform rounding and return the result.
}

// Handler to fetch total consumption and inflow details for a client dashboard.
exports.getTotalConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body; // Extract parameters from the request body.

  try {
    // Call the stored procedure to fetch consumption and inflow data.
    const result = await sequelize.query('CALL USP_GetTotalConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const dates = getDatesBetween(fromDate, toDate);
    let totalInFlow = 0;
    let totalOutFlow = 0;
    const readingsMap = new Map();

    // Aggregate readings and store them in a map.
    result.forEach(reading => {
      const inflow = parseFloat(reading.TotalInFlow) || 0;
      const outflow = parseFloat(reading.TotalOutFlow) || 0;

      totalInFlow += inflow;
      totalOutFlow += outflow;

      readingsMap.set(reading.ReadingDate, { inflow, outflow });
    });

    // Determine the maximum value and prepare data for the response.
    let maxValue = 0;

    const dmaDetails = dates.map(date => {
      const reading = readingsMap.get(date) || { inflow: 0, outflow: 0 };
      const inflow = roundToPlaces(reading.inflow / 1000, 2);
      const outflow = roundToPlaces(reading.outflow / 1000, 2);

      maxValue = Math.max(maxValue, inflow, outflow); // Update the maximum value.

      return {
        date: convertYYYYMMDDtoMMDD(date),
        inflow,
        consumption: outflow
      };
    });

    // Round up the maximum value to the nearest 1000.
    maxValue = Math.ceil(maxValue / 1000) * 1000;

    // Prepare details for inflow and consumption.
    const inFlowDetails = {
      count: roundToPlaces(totalInFlow / 1000, 2),
      label: "In Flow",
      lastWeekPercentage: "7",
      action: "increased"
    };

    const consumptionDetails = {
      count: roundToPlaces(totalOutFlow / 1000, 2),
      label: "Consumption",
      lastWeekPercentage: "7",
      action: "decreased"
    };

    // Send the response with all calculated data.
    res.status(200).json({
      maxValue: maxValue !== 0 ? maxValue : 100,
      minValue: 0,
      inFlowDetails,
      consumptionDetails,
      totalConsumption: dmaDetails
    });
  } catch (error) {
    // Handle errors and send an error response.
    console.error('Error fetching values:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching total consumption values.',
      error: error.message
    });
  }
};

// Utility function to convert a date string from 'YYYY-MM-DD' to 'MM/DD'.
function convertYYYYMMDDtoMMDD(dateString) {
  const [year, month, day] = dateString.split('-'); // Split the date into components.
  return `${month}/${day}`; // Reformat and return the date string.
};
