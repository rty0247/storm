const sequelize = require('../config/db');

exports.getTotalOutflow = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    // Call the stored procedure
    const result = await sequelize.query('CALL USP_GetTotalOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const dates = getDatesBetween(fromDate, toDate);
    let count = 0;
    const readingsMap = new Map();

    // Sum readings and store them in a map
    result.forEach(reading => {
      if (reading.Reading > 0) {
        count += reading.Reading;
      }
      readingsMap.set(reading.ReadingDate, reading.Reading);
    });

    // Round the count to the nearest multiple of 500
    const roundedCount = Math.round(count / 500) * 500;

    // Ensure each date in the range has a reading
    const readings = dates.map(date => {
      const reading = readingsMap.get(date) || 0;
      return {
        date: date,
        count: reading
      };
    });

    res.status(200).json({
      minRange: 0,
      maxRange: roundedCount,
      difference: 200,
      totalOutFlow: readings
    });
  } catch (error) {
    console.error('Error fetching Total Out Flow details:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching Total Out Flow details.',
      error: error.message
    });
  }
};

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// exports.getAllDashboardValues = async (req, res) => {
//     const { clientId } = req.body;
  
//     try {
//       const zoneResult = await sequelize.query('CALL USP_GetZoneCountKPI(:clientId)', {
//         replacements: { clientId },
//         type: sequelize.QueryTypes.RAW
//       });

//       const dmaResult = await sequelize.query('CALL USP_GetDMACountKPI(:clientId)', {
//         replacements: { clientId },
//         type: sequelize.QueryTypes.RAW
//       });

//       /*const meterResult = await sequelize.query('CALL USP_GetDMADetails(:clientId, :zoneId)', {
//         replacements: { clientId },
//         type: sequelize.QueryTypes.RAW
//       });

//       const gatewayResult = await sequelize.query('CALL USP_GetDMADetails(:clientId, :zoneId)', {
//         replacements: { clientId },
//         type: sequelize.QueryTypes.RAW
//       });*/

        
  
//         const dmaDetails = {
//             activeDma : dmaResult.ActiveDMA,
//             inactiveDma : dmaResult.InActiveDMA,
//             faultyDma : dmaResult.FaultyDAM,
//             totalCount : dmaResult.TotalDMA
//         };
//         const zoneDetails = {
//             activeZones: zoneResult.ActiveZone,
//             inactiveZones: zoneResult.InActiveZone,
//             totalCount: zoneResult.TotalZone
//         };
        
//         /*const meterDetails = meterResult.map(meter => ({
//             activeMeters : meter.ActiveMeter,
//             inactiveMeters : meter.InActiveMeter,
//             faultyMeters : meter.FaultyMeter,
//             totalCount : meter.TotalMeter
//         }));

//         const gatewayDetails = gatewayResult.map(gateway => ({
//             activeGateways : gateway.ActiveGateways,
//             inactiveGateways : gateway.InActiveGateways,
//             totalCount : gateway.TotalGateways
//         }))*/

//         const meterDetails = {
//             activeMeters : 4500,
//             inactiveMeters : 450,
//             faultyMeters : 50,
//             totalCount : 5000
//         }; 

//         const gatewayDetails = {
//             activeGateways : 45,
//             inactiveGateways : 5,
//             totalCount : 50
//         };

  
//       res.status(200).json({
//         totalZone : zoneDetails,
//         totalDma : dmaDetails,
//         totalMeters : meterDetails,
//         totalGateway : gatewayDetails
//       });
//     } catch (error) {
//       console.error('Error fetching client details:', error);
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while fetching client details.',
//         error: error.message
//       });
//     }
//   };
  

exports.getAllDashboardValues = async (req, res) => {
    const { clientId } = req.body;
  
    try {
        const zoneResult = await sequelize.query('CALL USP_GetZoneCountKPI(:clientId)', {
            replacements: { clientId },
            type: sequelize.QueryTypes.RAW
        });

        const dmaResult = await sequelize.query('CALL USP_GetDMACountKPI(:clientId)', {
            replacements: { clientId },
            type: sequelize.QueryTypes.RAW
        });

        const dmaDetails = {
            activeDma: dmaResult[0]?.ActiveDMA || 0,
            inactiveDma: dmaResult[0]?.InActiveDMA || 0,
            faultyDma: dmaResult[0]?.FaultyDAM || 0,
            totalCount: dmaResult[0]?.TotalDMA || 0
        };

        const zoneDetails = {
            activeZones: zoneResult[0]?.ActiveZone || 0,
            inactiveZones: zoneResult[0]?.InActiveZone || 0,
            totalCount: zoneResult[0]?.TotalZone || 0
        };

        const meterDetails = {
            activeMeters: 4500,
            inactiveMeters: 450,
            faultyMeters: 50,
            totalCount: 5000
        }; 

        const gatewayDetails = {
            activeGateways: 45,
            inactiveGateways: 5,
            totalCount: 50
        };

        res.status(200).json({
            totalZone: zoneDetails,
            totalDma: dmaDetails,
            totalMeters: meterDetails,
            totalGateway: gatewayDetails
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

