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
