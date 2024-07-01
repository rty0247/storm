const sequelize = require('../config/db');

exports.getClientDetails = async (req, res) => {
  const { userId } = req.body;

  try {
    // Call the stored procedure
    const result = await sequelize.query('CALL USP_GetClientDetails(:userId)', {
      replacements: { userId },
      type: sequelize.QueryTypes.RAW
    });


    // Transform the result to match the desired output format
    const clientDetails = result.map(client => ({
      clientId: client.ClientID,
      clientName: client.ClientName,
      type: client.ClientType,
      region: client.Region,
      createdTime: client.CreatedDateTime,
      meters: client.Meters,
      status: client.Status,
      snumber: client.SNumber,
      totalZonesCount: client.TotalZonesCount,
      totalDMACount: client.TotalDMACount,
      totalMetersCount: client.TotalMetersCount,
      imageLink: client.Imagelink // Ensure this key exists in your stored procedure result
    }));

    res.status(200).json({
      clients: clientDetails
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


exports.getTotalCustomerWiseSegementation = async (req, res) => {
  const { clientId, zoneId, dmaId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetCustomerSegmentation(:clientId, :zoneId, :dmaId)', {
      replacements: { clientId, zoneId, dmaId },
      type: sequelize.QueryTypes.RAW
    });

    const customerDetails = result.map(customer => ({
      can : customer.can,
      type : customer.Type,
	    gatewayId : customer.GatewayID,
	    lastCommunicationTime : customer.LastCommunicationTime,
	    reading : parseFloat(customer.Reading.toFixed(3)),
      zone: customer.Zone,
	    status : customer.Status
    }));

    res.status(200).json({
      customerDetails: customerDetails
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

exports.getClientAlerts = async (req, res) => {
  const { clientId } = req.body;

  try {
    // Call the stored procedure
    const result = await sequelize.query('CALL USP_GetClientAlerts(:clientId)', {
      replacements: { clientId },
      type: sequelize.QueryTypes.RAW
    });

    // Transform the result to match the desired output format
    const clientAlerts = {};
    
    result.forEach(alert => {
      if (!clientAlerts[alert.DeviceType]) {
        clientAlerts[alert.DeviceType] = [];
      }
      clientAlerts[alert.DeviceType].push({
        AlertID: alert.AlertID,
        DeviceType: alert.DeviceType,
        DeviceID: alert.DeviceID,
        ClientID: alert.ClientID,
        AlertStatus: alert.AlertStatus,
        CreatedAt: alert.CreatedAt,
        gwid: alert.gwid
      });
    });

    res.status(200).json({
      clientAlerts
    });
  } catch (error) {
    console.error('Error fetching client alerts:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client alerts.',
      error: error.message
    });
  }
};
