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
      displayName : 'Zone ' + zone.ZoneID,
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

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

function convertYYYYMMDDtoMMDD(dateString) {
  // Split the date string into an array
  const [year, month, day] = dateString.split('-');
  
  // Return the formatted date string as mm/dd
  return `${month}/${day}`;
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
        totalConsumption += Math.round(parseFloat(reading.TotalConsumption)) || 0;
      });

      const zoneWiseConsumption = zoneCount.map(zone => ({
        zoneId: zone.ZoneID,
        consumption:4570,
        //consumption:Math.round(zone.TotalConsumption)
      }));

    const zoneDetails = zoneList.map(zone => ({
      zoneId: zone.ZoneID,
      gatewayId: zone.GatewayID,
      reading: Math.round(zone.Reading),
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

function formatResult(result, dates) {
  const formattedResult = {};

  // Initialize the formatted result with all dates
  dates.forEach(date => {
    formattedResult[date] = {
      average: 0,
      zoneDetails: []
    };
  });

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
      inflow: Math.round(parseFloat(reading.Inflow).toFixed(1)),
      consumption: Math.round(parseFloat(reading.Consumption).toFixed(1)),
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
    if (totalZones > 0) {
      formattedResult[date].average = (formattedResult[date].average / totalZones).toFixed(1);
    } else {
      formattedResult[date].average = 0;
    }
  });

  return formattedResult;
}

exports.getDayWiseZoneConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    const result = await fetchZoneConsumption(clientId, zoneId, fromDate, toDate);

    const dates = getDatesBetween(fromDate, toDate);
    let formattedResult = formatResult(result, dates);
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

exports.getTotalZoneWiseSegementation = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    const zoneDetails = result.map(zone => ({
      zoneId : zone.ZoneID,
      displayName : 'Zone '+zone.ZoneID,
	    gatewayId : zone.GatewayID,
	    lastCommunicationTime : zone.LastCommunicationTime,
	    reading : parseFloat(zone.Reading.toFixed(3)),
      dmas: zone.DMAs,
	    meters : zone.Meters,
	    status : zone.Status
    }));

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

exports.getAllZonesForDropdown = async (req, res) => {
  const { clientId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetAllZones(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    const zoneDetails = result.map(zone => ({
      zoneId : zone.ZoneID,
      displayName : zone.ZoneDisplayName
    }));

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