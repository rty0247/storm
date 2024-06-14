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

    const totalDmaOutFlow = result.map(dma => ({
      dmaId: dma.DMAID,
      name: dma.DMA,
      totalFlow: dma.TotalInFlow,
      totalOutFlow: dma.TotalOutFlow
    }));

    res.status(200).json({
      minRange: 0,
      maxRange: roundedCount,
      difference: 200,
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
