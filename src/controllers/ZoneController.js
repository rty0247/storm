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
