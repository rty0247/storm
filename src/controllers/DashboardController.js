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
    const difference  = Math.round(roundedCount / 5);

    // Ensure each date in the range has a reading
    const readings = dates.map(date => {
      const reading = readingsMap.get(date) || 0;
      return {
        date: convertYYYYMMDDtoMMDD(date),
        //count: Math.round(reading)
        count: 80
      };
    });

    res.status(200).json({
      minRange: 0,
      maxRange: 100,
      difference: 25,
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

        const meterResult = await sequelize.query('CALL USP_GetMeterCountKPI(:clientId, 0, 0)', {
          replacements: { clientId },
          type: sequelize.QueryTypes.RAW
        });

        const gatewayResult = await sequelize.query('CALL USP_GetGatewayCountKPI(:clientId)', {
          replacements: { clientId },
          type: sequelize.QueryTypes.RAW
        });


        // const dmaDetails = {
        //     activeDma: dmaResult[0]?.ActiveDMA || 0,
        //     inactiveDma: dmaResult[0]?.InActiveDMA || 0,
        //     faultyDma: dmaResult[0]?.FaultyDAM || 0,
        //     totalCount: dmaResult[0]?.TotalDMA || 0
        // };

        // const zoneDetails = {
        //     activeZones: zoneResult[0]?.ActiveZone || 0,
        //     inactiveZones: zoneResult[0]?.InActiveZone || 0,
        //     totalCount: zoneResult[0]?.TotalZone || 0
        // };

        // const meterDetails = {
        //     activeMeters: meterResult[0]?.ActiveMeters || 0,
        //     inactiveMeters: meterResult[0]?.InActiveMeters || 0,
        //     faultyMeters: meterResult[0]?.FaultyMeters || 0,
        //     totalCount: meterResult[0]?.TotalMeters || 0,
        // }; 

        // const gatewayDetails = {
        //     activeGateways: gatewayResult[0]?.ActiveGateway || 0,
        //     inactiveGateways: gatewayResult[0]?.InActiveGateway || 0,
        //     totalCount: gatewayResult[0]?.TotalGateways || 0
        // };

        const dmaDetails = {
          activeDma: 50,
          inactiveDma: 50,
          faultyDma: 100,
          totalCount: 200
      };

      const zoneDetails = {
          activeZones: 50,
          inactiveZones: 100,
          totalCount: 150
      };

      const meterDetails = {
          activeMeters: 500,
          inactiveMeters: 500,
          faultyMeters: 1000,
          totalCount: 2000
      }; 

      const gatewayDetails = {
          activeGateways: 5,
          inactiveGateways: 10,
          totalCount: 15
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
function roundToPlaces(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

exports.getTotalConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
      const result = await sequelize.query('CALL USP_GetTotalConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
          replacements: { clientId, zoneId, fromDate, toDate },
          type: sequelize.QueryTypes.RAW
      });

      
      let totalInFlow = 0;
      let totalOutFlow = 0; 

      result.forEach(reading => {
        totalInFlow += parseFloat(reading.TotalInFlow) || 0;
        totalOutFlow += parseFloat(reading.TotalOutFlow) || 0;
      });

      const inFlowDetails = {
        count : roundToPlaces(totalInFlow/1000, 2),
        label : "In Flow",
        lastWeekPercentage : "7",
        action : "increased"
      };

      const consumptionDetails = {
        count : roundToPlaces(totalOutFlow/1000, 2),
        label : "Consumption",
        lastWeekPercentage : "7",
        action : "decreased"
      };

      const dmaDetails = result.map(dma => ({
        date : dma.ReadingDate,
        inflow : roundToPlaces(parseFloat(dma.TotalInFlow)/1000, 2) || 0,
        consumption : roundToPlaces(parseFloat(dma.TotalOutFlow)/1000, 2) || 0
      }));


      res.status(200).json({
        inFlowDetails: inFlowDetails,
        consumptionDetails: consumptionDetails,
        totalConsumption: dmaDetails
      });
  } catch (error) {
      console.error('Error fetching values :', error);
      res.status(500).json({
          success: false,
          message: 'An error occurred while fetching total consumption values.',
          error: error.message
      });
  }
};

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
      totalInFlow += parseFloat(reading.TotalInFlow) || 0;
      totalOutFlow += parseFloat(reading.TotalOutFlow) || 0;

      readingsMap.set(reading.ReadingDate, {
        inflow: parseFloat(reading.TotalInFlow) || 0,
        outflow: parseFloat(reading.TotalOutFlow) || 0
      });
    });

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

    // Ensure each date in the range has a reading
    const dmaDetails = dates.map(date => {
      const reading = readingsMap.get(date) || { inflow: 0, outflow: 0 };
      console.log(date, 'DAte')
      return {
        date: convertYYYYMMDDtoMMDD(date),
        inflow: roundToPlaces(reading.inflow / 1000, 2),
        consumption: roundToPlaces(reading.outflow / 1000, 2)
      };
    });

    res.status(200).json({
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