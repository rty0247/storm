const sequelize = require('../config/db');

exports.getAllDMAsWithClientIdAndZoneId = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetDMADetails(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    const dmaDetails = result.map(dma => ({
        dmaId : dma.ZoneID,
	    region : dma.Region,
	    gatewayId : dma.GatewayID,
	    lastCommunicationTime : dma.LastCommunicationTime,
	    reading : dma.Reading,
      dmas: dma.DMA,
	    meters : dma.Meters,
	    status : dma.Status
    }));

    res.status(200).json({
        dmasList: dmaDetails
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

exports.getDMAOutFlowInGateWayDashBoard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetTotalDMAOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let count = 0;

    result.forEach(dmaCount => {
      const totalInFlow = parseFloat(dmaCount.TotalInFlow) || 0;
      const totalOutFlow = parseFloat(dmaCount.TotalOutFlow) || 0;

      if (totalInFlow > 0) {
        count += totalInFlow;
      }
      if (totalOutFlow > 0) {
        count += totalOutFlow;
      }
    });

    const roundedCount = Math.round(count / 500) * 500;
    const diff = Math.round(roundedCount/5);

    const totalDmaOutFlow = result.map(dma => ({
      dmaId: dma.DMAID,
      name: dma.DMA,
      totalFlow: Math.round(dma.TotalInFlow),
      totalOutFlow: Math.round(dma.TotalOutFlow)
    }));

    res.status(200).json({
      minRange: 0,
      maxRange: roundedCount,
      difference: diff,
      totalDmaOutFlow: totalDmaOutFlow
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

exports.getDMAWiseConsumptionInClientDashboard = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    const dmaCount = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const dmaList = await sequelize.query('CALL USP_GetTotalDMAWiseConsumptionList(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    let totalConsumption = 0;

    dmaCount.forEach(dma => {
        totalConsumption += Math.round(parseFloat(dma.TotalConsumption)) || 0;
      });

      const dmaWiseConsumption = dmaCount.map(dma => ({
        dmaId: dma.DMAID,
        consumption:Math.round(dma.TotalConsumption)
      }));

      const dmaDetails = dmaList.map(dma => ({
        dmaId : dma.DMAID,
        gatewayId :dma.GatewayID,
        lastCommunication : dma.LastCommunicationDateTime,
        meters  :dma.MeterCount,
        status  : dma.DMAStatus
      }));

    res.status(200).json({
      totalConsumption : totalConsumption,
      dmaWiseConsumption : dmaWiseConsumption,
      dmaDetails: dmaDetails
    });
  } catch (error) {
    console.error('Error fetching DMA details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching DMA details.',
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

exports.getTotalZoneWiseSegementation = async (req, res) => {
  const { clientId, zoneId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetTotalZoneWiseSegmentation(:clientId, :zoneId)', {
      replacements: { clientId, zoneId },
      type: sequelize.QueryTypes.RAW
    });

    const dmaDetails = result.map(dma => ({
      dmaId : dma.ZoneID,
	    region : dma.Region,
	    gatewayId : dma.GatewayID,
	    lastCommunicationTime : dma.LastCommunicationTime,
	    reading : dma.Reading,
      dmas: dma.DMA,
	    meters : dma.Meters,
	    status : dma.Status
    }));

    res.status(200).json({
        dmasList: dmaDetails
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