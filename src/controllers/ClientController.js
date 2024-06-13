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
      snumber: client.SNumber // Ensure this key exists in your stored procedure result
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
