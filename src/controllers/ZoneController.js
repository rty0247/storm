const sequelize = require('../config/db');

exports.getAllZoneDetailsWithClientId = async (req, res) => {
  const { clientId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetZoneDetails(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    const zoneDetails = result.map(zone => ({
        zoneId : zone.ZoneID,
	    region : zone.Region,
	    gatewayId : zone.GatewayID,
	    lastCommunicationTime : zone.LastCommunicationTime,
	    reading : zone.Reading,
	    meters : zone.Meters,
	    status : zone.Status
    }));

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


exports.getZoneWiseConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    const zoneCount = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionKPI(:clientId, :fromDate, :toDate)', {
      replacements: { clientId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const zoneList = await sequelize.query('CALL USP_GetTotalZoneWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let totalConsumption = 0;

    zoneCount.forEach(reading => {
        totalConsumption += parseFloat(reading.TotalConsumption) || 0;
      });

      const zoneWiseConsumption = zoneCount.map(zone => ({
        zoneId: zone.ZoneID,
        consumption:zone.TotalConsumption
      }));

    const zoneDetails = zoneList.map(zone => ({
      zoneId: zone.ZoneID,
      gatewayId: zone.GatewayID,
      reading: zone.Reading,
      date: zone.ReadingTime,
      dma: zone.DMACount,
      meters:zone.MeterCount,
      consumed:zone.ConsumptionPercent,
      status: zone.ZoneStatus
    }));

    res.status(200).json({
      totalConsumption : totalConsumption,
      zoneWiseConsumption : zoneWiseConsumption,
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

async function fetchZoneConsumption(clientId, zoneId, fromDate, toDate) {
  return await sequelize.query(
    'CALL USP_GetConsumptionByZone(:clientId, :zoneId, :fromDate, :toDate)',
    {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    }
  );
}

function formatResult(result) {
  const formattedResult = {};

  result.forEach(reading => {
    const date = reading.ReadingTime; 
    
    if (!formattedResult[date]) {
      formattedResult[date] = {
        average: 0,
        zoneDetails: []
      };
    }
    
    formattedResult[date].zoneDetails.push({
      zoneId: reading.ZoneID,
      zoneName: `Zone ${reading.ZoneID}`, // Assuming you want to use ZoneID for ZoneName
      inflow: parseFloat(reading.Inflow).toFixed(1),
      consumption: parseFloat(reading.Consumption).toFixed(1),
      total: parseFloat(reading.Total).toFixed(1)
    });

    // Sum total for average calculation
    formattedResult[date].average += parseFloat(reading.Total);
  });

  return formattedResult;
}

function calculateAverages(formattedResult) {
  Object.keys(formattedResult).forEach(date => {
    const totalZones = formattedResult[date].zoneDetails.length;
    formattedResult[date].average = (formattedResult[date].average / totalZones).toFixed(1);
  });

  return formattedResult;
}

exports.getDayWiseZoneConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    const result = await fetchZoneConsumption(clientId, zoneId, fromDate, toDate);
    let formattedResult = formatResult(result);
    formattedResult = calculateAverages(formattedResult);

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
