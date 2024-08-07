const sequelize = require('../config/db');

exports.getAllMetersWithClientIdZoneIdAndDmaId = async (req, res) => {
  const { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetMeterDetails(:status, :clientId, :zoneId, :dmaId, :gatewayId, :startIndex, :rowCount)', {
      replacements: { status, clientId, zoneId, dmaId, gatewayId, startIndex, rowCount },
      type: sequelize.QueryTypes.RAW
    });

    const meterDetails = result.map(meter => ({
      canNo: meter.can,
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

    const totalCount = result?.[0]?.totalCount ?? 0;

    res.status(200).json({
      totalCount: totalCount,
      meters: meterDetails
    });
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

exports.getMeterDetailsWithMeterId = async (req, res) => { 
  const { clientId, zoneId, dmaId, meterId, fromDate, toDate } = req.body;
  try {
    const meterAnalytics = await getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate);
    const meterDetails = await getMeterDetails(clientId, zoneId, dmaId, meterId);
    const deviceDetails = await getDeviceDetails(clientId, zoneId, dmaId, meterId);
    res.status(200).json({
      meterAnalytics: meterAnalytics,
      meterDetails: meterDetails,
      deviceDetails: deviceDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

async function getMeterAnalytics(clientId, zoneId, dmaId, meterId, fromDate, toDate) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetMeterDetailAnalytics(:clientId, :zoneId, :dmaId, :meterId, :fromDate, :toDate)',
      {
        replacements: { clientId, zoneId, dmaId, meterId, fromDate, toDate },
        type: sequelize.QueryTypes.RAW
      }
    );

    const dates = getDatesBetween(fromDate, toDate);
    const usageMap = new Map();

    if (result && result.length > 0) {
      const firstRow = result[0];

      const extendedSummary = {
        minUsagePerDay: firstRow.Minperday || 25.75,
        maxUsagePerDay: firstRow.MaxperDay || 35.55,
        avgUsagePerDay: firstRow.AvgperDay || 65.24,
        medianUsagePerDay: firstRow.AvgperDay || 96.64
      };

      result.forEach(row => {
        usageMap.set(row.ReadingDate, row.Reading || 55.55);
      });

      // result.forEach(row => {
      //   usageMap.set(row.ReadingDate, 55.55);
      // });

      const usageDetails = dates.map(date => {
        const reading = usageMap.get(date) || 0;
        return {
          date: convertYYYYMMDDtoMMDD(date),
          value: 55.55
        };
      });

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
      const usageDetails = dates.map(date => ({
        date: convertYYYYMMDDtoMMDD(date),
        value: 0
      }));

      const minUsage = 0;
      const maxUsage = 0;
      const diff = 0;

      return {
        extendedSummary: {
          minUsagePerDay: 25.75,
          maxUsagePerDay: 35.55,
          avgUsagePerDay: 65.24,
          medianUsagePerDay: 96.64
        },
        usage: usageDetails,
        minUsage,
        maxUsage,
        diff
      };
    }
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
}

async function getMeterDetails(clientId, zoneId, dmaId, meterId) {
  try {
    const consumerDetails = await getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
    const meterDetails = await getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId);
    const meterInfo = await getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId);

    return {
      consumerDetails: consumerDetails,
      meterDetails: meterDetails,
      meterInfo: meterInfo
    };
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
};

async function getConsumerDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetConsumerDetails(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

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
      return null;
    }
  } catch (error) {
    console.error('Error fetching Consumer details:', error);
    throw new Error('An error occurred while fetching Consumer details.');
  }
};

async function getMeterDetailsWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetMeterDetailsByID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

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
      return null;
    }
  } catch (error) {
    console.error('Error fetching Device details:', error);
    throw new Error('An error occurred while fetching Device details.');
  }
};

async function getMeterInfoWithMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetMeterInfoById(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

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
      return null;
    }
  } catch (error) {
    console.error('Error fetching Device details:', error);
    throw new Error('An error occurred while fetching Device details.');
  }
};

async function getDeviceDetails(clientId, zoneId, dmaId, meterId) {
  try {
    const latestFrameData = await getLatestFrameMeterData(clientId, zoneId, dmaId, meterId);
    const gatewayList = await getGatewayListByMeterId(clientId, zoneId, dmaId, meterId);

    return {
      latestFrameData: latestFrameData,
      gatewayList: gatewayList
    };
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    throw new Error('An error occurred while fetching Meter details.');
  }
};

async function getLatestFrameMeterData(clientId, zoneId, dmaId, meterId) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetFrameDataByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );

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
      return null;
    }
  } catch (error) {
    console.error('Error fetching Consumer details:', error);
    throw new Error('An error occurred while fetching Consumer details.');
  }
};

async function getGatewayListByMeterId(clientId, zoneId, dmaId, meterId) {
  try {
    const result = await sequelize.query(
      'CALL USP_GetGatewayListByMeterID(:clientId, :zoneId, :dmaId, :meterId)',
      {
        replacements: { clientId, zoneId, dmaId, meterId },
        type: sequelize.QueryTypes.RAW
      }
    );
 
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

exports.getMeterDetailsWithClientIdZoneIdDMAIdAndMeterId = async (req, res) => {
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

function convertYYYYMMDDtoMMDD(dateString) {
  // Split the date string into an array
  const [year, month, day] = dateString.split('-');
  
  // Return the formatted date string as mm/dd
  return `${month}/${day}`;
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