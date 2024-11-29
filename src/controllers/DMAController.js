// const sequelize = require('../config/db');

// exports.getAllDMAsWithClientIdAndZoneId = async (req, res) => {
//   const { clientId, zoneId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetDMADetails(:clientId, :zoneId)', {
//       replacements: { clientId, zoneId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dmaDetails = result.map(dma => ({
//       dmaId : dma.DMAID,
//       displayName : 'DMA '+ dma.DMAID,
// 	    region : dma.Region,
// 	    gatewayId : dma.GatewayID,
// 	    lastCommunicationTime : dma.LastCommunicationTime,
// 	    reading : dma.Reading,
// 	    meters : dma.Meters,
// 	    status : dma.STATUS
//     }));

//     res.status(200).json({
//         dmasList: dmaDetails
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

// function roundToPlaces(num, decimalPlaces) {
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.round(num * factor) / factor;
// }

// exports.getDMAOutFlowInGateWayDashBoard = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetTotalDMAOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     let count = 0;

//     result.forEach(dmaCount => {
//       const totalInFlow = parseFloat(dmaCount.TotalInFlow) || 0;
//       const totalOutFlow = parseFloat(dmaCount.TotalOutFlow) || 0;

//       if (totalInFlow > 0) {
//         count += roundToPlaces(totalInFlow/1000, 2);
//       }
//       if (totalOutFlow > 0) {
//         count += roundToPlaces(totalOutFlow/1000, 2);
//       }
//     });
//     // count = roundToPlaces(count/1000, 2);
//     const roundedCount = Math.round(count / 1000) * 1000;
//     // const diff = Math.round(roundedCount/5);

//     const totalDmaOutFlow = result.map(dma => ({
//       dmaId: dma.DMAID,
//       displayName: 'DMA '+dma.DMAID,
//       name: dma.DMA,
//       totalFlow: roundToPlaces(dma.TotalInFlow / 1000, 2),
//       totalOutFlow: roundToPlaces(dma.TotalOutFlow / 1000, 2)
//     }));

//     res.status(200).json({
//       minRange: 0,
//       maxRange: roundedCount,
//       difference: roundedCount/5,
//       totalDmaOutFlow: totalDmaOutFlow
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

// exports.getDMAWiseConsumptionInClientDashboard = async (req, res) => {
//   const { clientId, zoneId, fromDate, toDate } = req.body;

//   try {
//     const dmaCount = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dmaList = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
//       replacements: { clientId, zoneId, fromDate, toDate },
//       type: sequelize.QueryTypes.RAW
//     });

//     let totalConsumption = 0;

//     dmaCount.forEach(dma => {
//         totalConsumption += Math.round(parseFloat(dma.TotalConsumption)) || 0; 
//       });

//       const dmaWiseConsumption = dmaCount.map(dma => ({
//         dmaId: dma.DMAID,
//         consumption:roundToPlaces(Math.round(dma.TotalConsumption)/1000, 2)
//       }));

//       const dmaDetails = dmaList.map(dma => ({
//         dmaId : dma.DMAID,
//         gatewayId :dma.GatewayID,
//         lastCommunication : dma.LastCommunicationDateTime,
//         meters  :dma.MeterCount,
//         status  : dma.DMAStatus
//       }));

//     res.status(200).json({
//       totalConsumption : roundToPlaces(totalConsumption/1000, 2),
//       dmaWiseConsumption : dmaWiseConsumption,
//       dmaDetails: dmaDetails
//     });
//   } catch (error) {
//     console.error('Error fetching DMA details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching DMA details.',
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

// exports.getTotalZoneWiseSegementation = async (req, res) => {
//   const { clientId, zoneId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
//       replacements: { clientId, zoneId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dmaDetails = result.map(dma => ({
//       dmaId : dma.ZoneID,
// 	    region : dma.Region,
// 	    gatewayId : dma.GatewayID,
// 	    lastCommunicationTime : dma.LastCommunicationTime,
// 	    reading : dma.Reading,
//       dmas: dma.DMA,
// 	    meters : dma.Meters,
// 	    status : dma.Status
//     }));

//     res.status(200).json({
//         dmasList: dmaDetails
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

// exports.getAllDMAsWithClientIdAndZoneIdForDropdown = async (req, res) => {
//   const { clientId, zoneId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetAllDMAsWithClientIdAndZoneId(:clientId, :zoneId)', {
//       replacements: { clientId, zoneId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const dmaDetails = result.map(dma => ({
//       dmaId : dma.DMAID,
//       displayName : dma.displayName
//     }));

//     res.status(200).json({
//         dmasList: dmaDetails
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

const sequelize = require('../config/db');

// Fetches all DMA details for a given client ID and zone ID
exports.getAllDMAsWithClientIdAndZoneId = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    // Calls the stored procedure to get DMA details
    const result = await sequelize.query('CALL USP_GetDMADetails(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    // Maps the results to a structured format
    const dmaDetails = result.map(dma => ({
      dmaId: dma.DMAID,
      displayName: 'DMA ' + dma.DMAID,
      region: dma.Region,
      gatewayId: dma.GatewayID,
      lastCommunicationTime: dma.LastCommunicationTime,
      reading: dma.Reading,
      meters: dma.Meters,
      status: dma.STATUS
    }));

    // Sends the response with DMA details
    res.status(200).json({
      dmasList: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    // Handles errors and sends appropriate response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Utility function to round numbers to a specified number of decimal places
function roundToPlaces(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

// Fetches DMA outflow data for the gateway dashboard
exports.getDMAOutFlowInGateWayDashBoard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    // Calls the stored procedure to get total DMA outflow
    const result = await sequelize.query('CALL USP_GetTotalDMAOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let count = 0;

    // Calculates the total inflow and outflow
    result.forEach(dmaCount => {
      const totalInFlow = parseFloat(dmaCount.TotalInFlow) || 0;
      const totalOutFlow = parseFloat(dmaCount.TotalOutFlow) || 0;

      if (totalInFlow > 0) {
        count += roundToPlaces(totalInFlow / 1000, 2);
      }
      if (totalOutFlow > 0) {
        count += roundToPlaces(totalOutFlow / 1000, 2);
      }
    });

    // Rounds the total count to the nearest 1000
    const roundedCount = Math.round(count / 1000) * 1000;

    // Maps the result to a structured format for DMA outflow details
    const totalDmaOutFlow = result.map(dma => ({
      dmaId: dma.DMAID,
      displayName: 'DMA ' + dma.DMAID,
      name: dma.DMA,
      totalFlow: roundToPlaces(dma.TotalInFlow / 1000, 2),
      totalOutFlow: roundToPlaces(dma.TotalOutFlow / 1000, 2)
    }));

    // Sends the response with DMA outflow details
    res.status(200).json({
      minRange: 0,
      maxRange: roundedCount,
      difference: roundedCount / 5,
      totalDmaOutFlow: totalDmaOutFlow
    });

  } catch (error) {
    console.error('Error fetching client details:', error);
    // Handles errors and sends appropriate response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Fetches DMA-wise consumption data for the client dashboard
exports.getDMAWiseConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    // Calls the stored procedure to get DMA-wise consumption summary
    const dmaCount = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    // Calls the stored procedure to get detailed DMA-wise consumption
    const dmaList = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let totalConsumption = 0;

    // Calculates total consumption
    dmaCount.forEach(dma => {
      totalConsumption += Math.round(parseFloat(dma.TotalConsumption)) || 0;
    });

    // Maps the summary data to a structured format
    const dmaWiseConsumption = dmaCount.map(dma => ({
      dmaId: dma.DMAID,
      consumption: roundToPlaces(Math.round(dma.TotalConsumption) / 1000, 2)
    }));

    // Maps the detailed data to a structured format
    const dmaDetails = dmaList.map(dma => ({
      dmaId: dma.DMAID,
      gatewayId: dma.GatewayID,
      lastCommunication: dma.LastCommunicationDateTime,
      meters: dma.MeterCount,
      status: dma.DMAStatus
    }));

    // Sends the response with total consumption, DMA-wise consumption, and details
    res.status(200).json({
      totalConsumption: roundToPlaces(totalConsumption / 1000, 2),
      dmaWiseConsumption: dmaWiseConsumption,
      dmaDetails: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching DMA details:', error);
    // Handles errors and sends appropriate response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching DMA details.',
      error: error.message
    });
  }
};

// Converts a date string from 'YYYY-MM-DD' format to 'MM/DD' format
function convertYYYYMMDDtoMMDD(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}`;
}

// Fetches zone-wise segmentation details for a client
exports.getTotalZoneWiseSegementation = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    // Calls the stored procedure to get zone-wise segmentation
    const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    // Maps the results to a structured format
    const dmaDetails = result.map(dma => ({
      dmaId: dma.ZoneID,
      region: dma.Region,
      gatewayId: dma.GatewayID,
      lastCommunicationTime: dma.LastCommunicationTime,
      reading: dma.Reading,
      dmas: dma.DMA,
      meters: dma.Meters,
      status: dma.Status
    }));

    // Sends the response with zone-wise segmentation details
    res.status(200).json({
      dmasList: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    // Handles errors and sends appropriate response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Fetches a list of all DMAs with client ID and zone ID for dropdown options
exports.getAllDMAsWithClientIdAndZoneIdForDropdown = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    // Calls the stored procedure to get DMA list for dropdown
    const result = await sequelize.query('CALL USP_GetAllDMAsWithClientIdAndZoneId(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    // Maps the results to a structured format
    const dmaDetails = result.map(dma => ({
      dmaId: dma.DMAID,
      displayName: dma.displayName
    }));

    // Sends the response with DMA list for dropdown
    res.status(200).json({
      dmasList: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    // Handles errors and sends appropriate response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};
