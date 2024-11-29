// const sequelize = require('../config/db');

// exports.getAllMetersWithClientIdZoneIdAndDmaId = async (req, res) => {
//   const { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetMeterDetails(:status, :clientId, :zoneId, :dmaId, :gatewayId, :startIndex, :rowCount)', {
//       replacements: { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount },
//       type: sequelize.QueryTypes.RAW
//     });

//     const meterDetails = result.map(meter => ({
//       canNo: meter.can || '000000',
//       meterId: meter.MeterID,
//       gatewayId: meter.GatewayID,
//       deveui: meter.DEVEUI,
//       zoneNo: meter.Zone,
//       dmaNo: meter.DMA,
//       timestamp: meter.LastReceivedTimeStamp,
//       reading: meter.LastReceivedReading,
//       consumed: meter.Consumption,
//       status: meter.status,
//       batteryLife: meter.BatteryLife,
//       remarks: meter.Remarks
      
//     }));

//     const totalCount = result?.[0]?.totalCount ?? 0;

//     res.status(200).json({
//       totalCount: totalCount,
//       meters: meterDetails
//     });
//   } catch (error) {
//     console.error('Error fetching Meter details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching Meter details.',
//       error: error.message
//     });
//   }
// };

// exports.getMeterDetailsWithMeterId = async (req, res) => { 
//   const { clientId, zoneId, dmaId, meterId, fromDate, toDate } = req.body;
//   try {
//     const meterAnalytics = await getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate);
//     const meterDetails = await getMeterDetails(clientId, zoneId, dmaId, meterId);
//     const deviceDetails = await getDeviceDetails(clientId, zoneId, dmaId, meterId);
//     res.status(200).json({
//       meterAnalytics: meterAnalytics,
//       meterDetails: meterDetails,
//       deviceDetails: deviceDetails
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching Meter details.',
//       error: error.message
//     });
//   }
// };

// async function getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetMeterDetailAnalytics(:clientId, :zoneId, :dmaId, :meterId, :fromDate, :toDate)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId, fromDate, toDate },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     const dates = getDatesBetween(fromDate, toDate);
//     const usageMap = new Map();

//     if (result && result.length > 0) {
//       const firstRow = result[0];

//       const extendedSummary = {
//         minUsagePerDay: firstRow.Minperday || 0,
//         maxUsagePerDay: firstRow.MaxperDay || 0,
//         avgUsagePerDay: firstRow.AvgperDay || 0,
//         medianUsagePerDay: firstRow.AvgperDay || 0
//       };

//       result.forEach(row => {
//         usageMap.set(row.ReadingDate, row.Reading || 0);
//       });

//       const usageDetails = dates.map(date => {
//         const reading = usageMap.get(date) || 0;
//         return {
//           date: convertYYYYMMDDtoMMDD(date),
//           value: reading
//         };
//       });

//       const minUsage = 0;
//       const maxUsage = Math.max(...usageDetails.map(detail => detail.value));
//       const diff = Math.round((maxUsage - minUsage) / 5);

//       return {
//         extendedSummary: extendedSummary,
//         usage: usageDetails,
//         minUsage,
//         maxUsage,
//         diff
//       };
//     } else {
//       const usageDetails = dates.map(date => ({
//         date: convertYYYYMMDDtoMMDD(date),
//         value: 0
//       }));

//       const minUsage = 0;
//       const maxUsage = 0;
//       const diff = 0;

//       return {
//         extendedSummary: {
//           minUsagePerDay: 0,
//           maxUsagePerDay: 0,
//           avgUsagePerDay: 0,
//           medianUsagePerDay: 0
//         },
//         usage: usageDetails,
//         minUsage,
//         maxUsage,
//         diff
//       };
//     }
//   } catch (error) {
//     console.error('Error fetching Meter details:', error);
//     throw new Error('An error occurred while fetching Meter details.');
//   }
// }

// async function getMeterDetails(clientId, zoneId, dmaId, meterId) {
//   try {
//     const consumerDetails = await getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
//     const meterDetails = await getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
//     const meterInfo = await getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId);

//     return {
//       consumerDetails: consumerDetails,
//       meterDetails: meterDetails,
//       meterInfo: meterInfo
//     };
//   } catch (error) {
//     console.error('Error fetching Meter details:', error);
//     throw new Error('An error occurred while fetching Meter details.');
//   }
// };

// async function getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetConsumerDetails(:clientId, :zoneId, :dmaId, :meterId)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     if (result && result.length > 0) {
//       const firstRow = result[0];

//       const consumerDetails = {
//         can: firstRow.can,
//         name: firstRow.Name,
//         address: firstRow.Address,
//         contactPerson: firstRow.ContactPerson,
//         mobile: firstRow.Mobile,
//         remarks: firstRow.Remarks
//       };

//       return consumerDetails;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching Consumer details:', error);
//     throw new Error('An error occurred while fetching Consumer details.');
//   }
// };

// async function getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetMeterDetailsByID(:clientId, :zoneId, :dmaId, :meterId)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     if (result && result.length > 0) {
//       const firstRow = result[0];

//       const deviceDetails = {
//         meterNumber: firstRow.MeterNumber,
//         meterType: firstRow.MeterType,
//         size: firstRow.Size,
//         zone: firstRow.Zone,
//         dma: firstRow.DMA,
//         installDate: firstRow.InstallDate,
//         status: firstRow.Status
//       };

//       return deviceDetails;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching Device details:', error);
//     throw new Error('An error occurred while fetching Device details.');
//   }
// };

// async function getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetMeterInfoById(:clientId, :zoneId, :dmaId, :meterId)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     if (result && result.length > 0) {
//       const firstRow = result[0];

//       const meterInfo = {
//         deveui: firstRow.Deveui,
//         devadd: firstRow.Devadd,
//         mode: firstRow.Mode,
//         gps: firstRow.GPS,
//         battery: firstRow.Battery,
//         remarks: firstRow.Remarks
//       };

//       return meterInfo;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching Device details:', error);
//     throw new Error('An error occurred while fetching Device details.');
//   }
// };

// async function getDeviceDetails(clientId, zoneId, dmaId, meterId) {
//   try {
//     const latestFrameData = await getLatestFrameMeterData(clientId, zoneId, dmaId, meterId);
//     const gatewayList = await getGatewayListByMeterId(clientId, zoneId, dmaId, meterId);

//     return {
//       latestFrameData: latestFrameData,
//       gatewayList: gatewayList
//     };
//   } catch (error) {
//     console.error('Error fetching Meter details:', error);
//     throw new Error('An error occurred while fetching Meter details.');
//   }
// };

// async function getLatestFrameMeterData(clientId, zoneId, dmaId, meterId) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetFrameDataByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     if (result && result.length > 0) {
//       const firstRow = result[0];

//       const lastFrameData = {
//         gatewayId: firstRow.GatewayID,
//         reading: firstRow.Reading,
//         latestCommunication: firstRow.LatestCommunication,
//         rssi: firstRow.RSSI,
//         snr: firstRow.SNR,
//         freq: firstRow.FREQ,
//         status: firstRow.status
//       };

//       return lastFrameData;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching Consumer details:', error);
//     throw new Error('An error occurred while fetching Consumer details.');
//   }
// };

// async function getGatewayListByMeterId(clientId, zoneId, dmaId, meterId) {
//   try {
//     const result = await sequelize.query(
//       'CALL USP_GetGatewayListByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
//       {
//         replacements: { clientId, zoneId, dmaId, meterId },
//         type: sequelize.QueryTypes.RAW
//       }
//     );
 
//     const gatewayList = result.map(gateway => ({
//     gatewayId: gateway.GatewayID,
//     rssi: gateway.RSSI,
//     snr: gateway.SNR,
//     temperature: gateway.temperature,
//     status: gateway.status
//   }));

//   return gatewayList;
//   } catch (error) {
//     console.error('Error fetching Gateway details:', error);
//     throw new Error('An error occurred while fetching Gateway details.');
//   }
  
// };

// exports.getMeterDetailsWithClientIdZoneIdDMAIdAndMeterId = async (req, res) => {
//   const { clientId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetZoneDetails(:clientId)', {
//       replacements: { clientId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const zoneDetails = result.map(zone => ({
//         zoneId : zone.ZoneID,
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

// function convertYYYYMMDDtoMMDD(dateString) {
//   // Split the date string into an array
//   const [year, month, day] = dateString.split('-');
  
//   // Return the formatted date string as mm/dd
//   return `${month}/${day}`;
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

// exports.getMeterSearch = async (req, res) => {
//   const { type, value } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetMeterinfoByString(:type, :value)', {
//       replacements: { type, value },
//       type: sequelize.QueryTypes.RAW
//     });
    
//     const meterList = result.map(meter => ({
//       canNo: meter.can || "000000",
//       meterId: meter.meterId,
//       gatewayId: meter.gatewayID,
//       deveui: meter.deveui,
//       zoneNo: meter.zone,
//       dmaNo: meter.dma,
//       timestamp: meter.timestamp,
//       reading: meter.reading,
//       consumed: meter.consumption,
//       batteryLife: meter.status,
//       battery: meter.battery,
//       remarks: meter.Remarks
//     }));

//     res.status(200).json({
//       meterList: meterList
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

// Importing sequelize instance for interacting with the database
const sequelize = require('../config/db');

// Function to retrieve all meters based on clientId, zoneId, dmaId, and other parameters
exports.getAllMetersWithClientIdZoneIdAndDmaId = async (req, res) => {
  // Destructuring parameters from request body
  const { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount } = req.body;

  try {
    // Querying the database with a stored procedure to get meter details
    const result = await sequelize.query('CALL USP_GetMeterDetails(:status, :clientId, :zoneId, :dmaId, :gatewayId, :startIndex, :rowCount)', {
      replacements: { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount },
      type: sequelize.QueryTypes.RAW // Use raw SQL query results
    });

    // Formatting the result into a structured object for meter details
    const meterDetails = result.map(meter => ({
      canNo: meter.can || '000000', // Default to '000000' if 'can' is null
      meterId: meter.MeterID,
      gatewayId: meter.GatewayID,
      deveui: meter.DEVEUI,
      zoneNo: meter.Zone,
      dmaNo: meter.DMA,
      timestamp: meter.LastReceivedTimeStamp,
      reading: meter.LastReceivedReading,
      consumed: meter.Consumption,
      status: meter.status,
      batteryLife: meter.BatteryLife,
      remarks: meter.Remarks
    }));

    // Extracting the total count of meters from the first row of the result
    const totalCount = result?.[0]?.totalCount ?? 0;

    // Responding with the meter details and total count
    res.status(200).json({
      totalCount: totalCount,
      meters: meterDetails
    });
  } catch (error) {
    // Handling errors and sending error response
    console.error('Error fetching Meter details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

// Function to retrieve detailed meter information with analytics, device info, etc.
exports.getMeterDetailsWithMeterId = async (req, res) => { 
  // Destructuring parameters from the request body
  const { clientId, zoneId, dmaId, meterId, fromDate, toDate } = req.body;

  try {
    // Fetching meter analytics, meter details, and device details
    const meterAnalytics = await getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate);
    const meterDetails = await getMeterDetails(clientId, zoneId, dmaId, meterId);
    const deviceDetails = await getDeviceDetails(clientId, zoneId, dmaId, meterId);

    // Responding with the fetched data
    res.status(200).json({
      meterAnalytics: meterAnalytics,
      meterDetails: meterDetails,
      deviceDetails: deviceDetails
    });
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

// Function to fetch meter analytics based on date range and meterId
async function getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate) {
  try {
    // Querying the database with the stored procedure to get analytics data
    const result = await sequelize.query(
      'CALL USP_GetMeterDetailAnalytics(:clientId, :zoneId, :dmaId, :meterId, :fromDate, :toDate)',
      {
        replacements: { clientId, zoneId, dmaId, meterId, fromDate, toDate },
        type: sequelize.QueryTypes.RAW // Use raw SQL query results
      }
    );

    // Getting all dates between the given date range
    const dates = getDatesBetween(fromDate, toDate);
    const usageMap = new Map();

    // Checking if analytics data exists and processing it
    if (result && result.length > 0) {
      const firstRow = result[0];

      // Preparing an extended summary of the analytics
      const extendedSummary = {
        minUsagePerDay: firstRow.Minperday || 0,
        maxUsagePerDay: firstRow.MaxperDay || 0,
        avgUsagePerDay: firstRow.AvgperDay || 0,
        medianUsagePerDay: firstRow.AvgperDay || 0
      };

      // Mapping the readings data into a map for quick lookup by date
      result.forEach(row => {
        usageMap.set(row.ReadingDate, row.Reading || 0);
      });

      // Formatting the usage data for each date
      const usageDetails = dates.map(date => {
        const reading = usageMap.get(date) || 0;
        return {
          date: convertYYYYMMDDtoMMDD(date), // Convert date to MM-DD format
          value: reading
        };
      });

      // Calculating min, max, and diff values for usage
      const minUsage = 0;
      const maxUsage = Math.max(...usageDetails.map(detail => detail.value));
      const diff = Math.round((maxUsage - minUsage) / 5);

      return {
        extendedSummary: extendedSummary,
        usage: usageDetails,
        minUsage,
        maxUsage,
        diff
      };
    } else {
      // If no data found, return zeros for all usage details
      const usageDetails = dates.map(date => ({
        date: convertYYYYMMDDtoMMDD(date),
        value: 0
      }));

      const minUsage = 0;
      const maxUsage = 0;
      const diff = 0;

      return {
        extendedSummary: {
          minUsagePerDay: 0,
          maxUsagePerDay: 0,
          avgUsagePerDay: 0,
          medianUsagePerDay: 0
        },
        usage: usageDetails,
        minUsage,
        maxUsage,
        diff
      };
    }
  } catch (error) {
    // Error handling for analytics fetching
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
}

// Function to fetch meter details by clientId, zoneId, dmaId, and meterId
async function getMeterDetails(clientId, zoneId, dmaId, meterId) {
  try {
    // Fetching consumer details, meter details, and meter info
    const consumerDetails = await getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
    const meterDetails = await getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
    const meterInfo = await getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId);

    // Returning all the details as a structured object
    return {
      consumerDetails: consumerDetails,
      meterDetails: meterDetails,
      meterInfo: meterInfo
    };
  } catch (error) {
    // Error handling for fetching meter details
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
};

// Function to fetch consumer details for a specific meter
async function getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    // Querying the database to fetch consumer details for the given meterId
    const result = await sequelize.query(
      'CALL USP_GetConsumerDetails(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW // Use raw SQL query results
      }
    );

    // If consumer details are found, return them
    if (result && result.length > 0) {
      const firstRow = result[0];

      const consumerDetails = {
        can: firstRow.can,
        name: firstRow.Name,
        address: firstRow.Address,
        contactPerson: firstRow.ContactPerson,
        mobile: firstRow.Mobile,
        remarks: firstRow.Remarks
      };

      return consumerDetails;
    } else {
      // If no consumer details found, return null
      return null;
    }
  } catch (error) {
    // Error handling for fetching consumer details
    console.error('Error fetching Consumer details:', error);
    throw new Error('An error occurred while fetching Consumer details.');
  }
};

// Function to fetch meter details by meterId
async function getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    // Querying the database to fetch meter details
    const result = await sequelize.query(
      'CALL USP_GetMeterDetailsByID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

    // If meter details are found, return them
    if (result && result.length > 0) {
      const firstRow = result[0];

      const deviceDetails = {
        meterNumber: firstRow.MeterNumber,
        meterType: firstRow.MeterType,
        size: firstRow.Size,
        zone: firstRow.Zone,
        dma: firstRow.DMA,
        installDate: firstRow.InstallDate,
        status: firstRow.Status
      };

      return deviceDetails;
    } else {
      // If no meter details found, return null
      return null;
    }
  } catch (error) {
    // Error handling for fetching meter details
    console.error('Error fetching Device details:', error);
    throw new Error('An error occurred while fetching Device details.');
  }
};

// Function to fetch meter info by meterId
async function getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    // Querying the database to fetch meter info
    const result = await sequelize.query(
      'CALL USP_GetMeterInfoById(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW // Use raw SQL query results
      }
    );

    // If meter info is found, return it
    if (result && result.length > 0) {
      const firstRow = result[0];

      const meterInfo = {
        deveui: firstRow.Deveui,
        devadd: firstRow.Devadd,
        mode: firstRow.Mode,
        gps: firstRow.GPS,
        battery: firstRow.Battery,
        remarks: firstRow.Remarks
      };

      return meterInfo;
    } else {
      // If no meter info is found, return null
      return null;
    }
  } catch (error) {
    // Error handling for fetching meter info
    console.error('Error fetching Device details:', error);
    throw new Error('An error occurred while fetching Device details.');
  }
};

// Function to retrieve device details such as the latest frame data and gateway list
async function getDeviceDetails(clientId, zoneId, dmaId, meterId) {
  try {
    // Fetch the latest frame data for the meter
    const latestFrameData = await getLatestFrameMeterData(clientId, zoneId, dmaId, meterId);
    
    // Fetch the list of gateways associated with the meter
    const gatewayList = await getGatewayListByMeterId(clientId, zoneId, dmaId, meterId);

    // Return both the latest frame data and gateway list as part of the response
    return {
      latestFrameData: latestFrameData,
      gatewayList: gatewayList
    };
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
};

// Function to get the latest frame data for a meter
async function getLatestFrameMeterData(clientId, zoneId, dmaId, meterId) {
  try {
    // Query the database to fetch the latest frame data by meterId
    const result = await sequelize.query(
      'CALL USP_GetFrameDataByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

    // If data is found, map the result to a structured object and return it
    if (result && result.length > 0) {
      const firstRow = result[0];

      const lastFrameData = {
        gatewayId: firstRow.GatewayID,
        reading: firstRow.Reading,
        latestCommunication: firstRow.LatestCommunication,
        rssi: firstRow.RSSI,
        snr: firstRow.SNR,
        freq: firstRow.FREQ,
        status: firstRow.status
      };

      return lastFrameData;
    } else {
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error('Error fetching Consumer details:', error);
    throw new Error('An error occurred while fetching Consumer details.');
  }
};

// Function to retrieve the gateway list for a specific meter
async function getGatewayListByMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    // Query the database to get a list of gateways by meterId
    const result = await sequelize.query(
      'CALL USP_GetGatewayListByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );
 
    // Map the result to a structured gateway list and return it
    const gatewayList = result.map(gateway => ({
      gatewayId: gateway.GatewayID,
      rssi: gateway.RSSI,
      snr: gateway.SNR,
      temperature: gateway.temperature,
      status: gateway.status
    }));

    return gatewayList;
  } catch (error) {
    console.error('Error fetching Gateway details:', error);
    throw new Error('An error occurred while fetching Gateway details.');
  }
};

// API handler to retrieve zone details for a client
exports.getMeterDetailsWithClientIdZoneIdDMAIdAndMeterId = async (req, res) => {
  const { clientId } = req.body;

  try {
    // Query the database to fetch zone details for the given clientId
    const result = await sequelize.query('CALL USP_GetZoneDetails(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    // Map the result to zone details
    const zoneDetails = result.map(zone => ({
        zoneId : zone.ZoneID,
        region : zone.Region,
        gatewayId : zone.GatewayID,
        lastCommunicationTime : zone.LastCommunicationTime,
        reading : zone.Reading,
        meters : zone.Meters,
        status : zone.Status
    }));

    // Send the zone details as part of the response
    res.status(200).json({
      zonesList: zoneDetails
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

// Function to convert a date string in 'YYYY-MM-DD' format to 'MM/DD' format
function convertYYYYMMDDtoMMDD(dateString) {
  // Split the date string into an array
  const [year, month, day] = dateString.split('-');
  
  // Return the formatted date string as mm/dd
  return `${month}/${day}`;
};

// Function to get all the dates between two given dates
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  // Loop through all the dates between the start and end date and store them
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// API handler to search for meters based on type and value
exports.getMeterSearch = async (req, res) => {
  const { type, value } = req.body;

  try {
    // Query the database to search for meters based on the given type and value
    const result = await sequelize.query('CALL USP_GetMeterinfoByString(:type, :value)', {
      replacements: { type, value },
      type: sequelize.QueryTypes.RAW
    });
    
    // Map the result to a structured meter list
    const meterList = result.map(meter => ({
      canNo: meter.can || "000000",  // Default to '000000' if 'can' is null
      meterId: meter.meterId,
      gatewayId: meter.gatewayID,
      deveui: meter.deveui,
      zoneNo: meter.zone,
      dmaNo: meter.dma,
      timestamp: meter.timestamp,
      reading: meter.reading,
      consumed: meter.consumption,
      batteryLife: meter.status,
      battery: meter.battery,
      remarks: meter.Remarks
    }));

    // Send the meter list as part of the response
    res.status(200).json({
      meterList: meterList
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