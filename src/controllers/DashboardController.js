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

    // Group readings by date
    const readingsByDate = new Map();

    result.forEach(reading => {
      const { ReadingDate, Reading } = reading;

      if (!readingsByDate.has(ReadingDate)) {
        readingsByDate.set(ReadingDate, 0); // Initialize with 0
      }

      readingsByDate.set(ReadingDate, readingsByDate.get(ReadingDate) + Reading); // Add reading
    });

    // Combine data for each date and calculate totalOutFlow
    const readings = dates.map(date => {
      const totalReading = readingsByDate.get(date) || 0;

      return {
        date: convertYYYYMMDDtoMMDD(date),
        count: Math.round(totalReading) // Sum of all zone readings for the date
      };
    });

    // Find the maximum count in totalOutFlow
    const maxCount = Math.max(...readings.map(r => r.count));

    // Adjust maxRange and difference based on maxCount
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
    const maxRange = Math.ceil(maxCount / magnitude) * magnitude; // Round to nearest power-of-ten multiple
    const difference = Math.round(maxRange / 5);

    res.status(200).json({
      minRange: 0,
      maxRange: maxRange,
      difference: difference,
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

exports.getAllDashboardValues = async (req, res) => {
    const { clientId,fromDate,toDate } = req.body;
  
    try {
        const zoneResult = await sequelize.query('CALL USP_GetZoneCountKPI(:clientId)', {
            replacements: { clientId },
            type: sequelize.QueryTypes.RAW
        });

        const dmaResult = await sequelize.query('CALL USP_GetDMACountKPI(:clientId)', {
            replacements: { clientId },
            type: sequelize.QueryTypes.RAW
        });

        const meterResult = await sequelize.query('CALL USP_GetMeterCountKPI(:clientId, 0, 0,:fromDate,:toDate)', {
          replacements: { clientId,fromDate,toDate },
          type: sequelize.QueryTypes.RAW
        });

        const gatewayResult = await sequelize.query('CALL USP_GetGatewayCountKPI(:clientId)', {
          replacements: { clientId },
          type: sequelize.QueryTypes.RAW
        });


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

      //   const dmaDetails = {
      //     activeDma: 50,
      //     inactiveDma: 50,
      //     faultyDma: 100,
      //     totalCount: 200
      // };

      // const zoneDetails = {
      //     activeZones: 50,
      //     inactiveZones: 100,
      //     totalCount: 150
      // };

      // const meterDetails = {
      //     activeMeters: 500,
      //     inactiveMeters: 500,
      //     faultyMeters: 1000,
      //     totalCount: 2000
      // }; 

      // const gatewayDetails = {
      //     activeGateways: 5,
      //     inactiveGateways: 10,
      //     totalCount: 15
      // };

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
function roundToPlaces(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}


exports.getTotalConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    // Call the stored procedure
    const result = await sequelize.query('CALL USP_GetTotalConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const dates = getDatesBetween(fromDate, toDate);
    let totalInFlow = 0;
    let totalOutFlow = 0;
    const readingsMap = new Map();

    // Sum readings and store them in a map
    result.forEach(reading => {
      const inflow = parseFloat(reading.TotalInFlow) || 0;
      const outflow = parseFloat(reading.TotalOutFlow) || 0;

      totalInFlow += inflow;
      totalOutFlow += outflow;

      readingsMap.set(reading.ReadingDate, { inflow, outflow });
      
    });

    // Generate dmaDetails and calculate maxValue from inflow and outflow in the same step
    let maxValue = 0;

    const dmaDetails = dates.map(date => {
      
      const reading = readingsMap.get(date) || { inflow: 0, outflow: 0 };
      const inflow = roundToPlaces(reading.inflow / 1000, 2);
      const outflow = roundToPlaces(reading.outflow / 1000, 2);

      // Update maxValue with the largest of inflow or outflow
      maxValue = Math.max(maxValue, inflow, outflow);

      return {
        date: convertYYYYMMDDtoMMDD(date),
        inflow,
        consumption: outflow
      };
    });

    // Round up maxValue to the nearest 1000
    maxValue = Math.ceil(maxValue / 1000) * 1000;

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

    res.status(200).json({
      maxValue: maxValue !== 0 ? maxValue : 100,
      minValue: 0,
      inFlowDetails,
      consumptionDetails,
      totalConsumption: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching values:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching total consumption values.',
      error: error.message
    });
  }
};



function convertYYYYMMDDtoMMDD(dateString) {
  // Split the date string into an array
  const [year, month, day] = dateString.split('-');
  
  // Return the formatted date string as mm/dd
  return `${month}/${day}`;
};