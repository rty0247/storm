const sequelize = require('../config/db');

exports.getAllMetersWithClientIdZoneIdAndDmaId = async (req, res) => {
  const { clientId, zoneId, dmaId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetMeterDetails(:clientId, :zoneId, :dmaId)', {
      replacements: { clientId, zoneId, dmaId },
      type: sequelize.QueryTypes.RAW
    });

    const meterDetails = result.map(meter => ({
        meterId:meter.MeterID,
		gatewayId:meter.GatewayID,
		deveui:meter.DEVEUI,
		zoneNo:meter.Zone,
		dmaNo:meter.DMA,
		timestamp:meter.LastReceivedTimeStamp,
		reading:meter.LastReceivedReading,
		consumed:meter.Consumption,
		status:meter.status,
		batteryLife:meter.BatteryLife,
		remarks:meter.Remarks
    }));

    res.status(200).json({
        meters: meterDetails
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
