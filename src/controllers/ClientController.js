// const sequelize = require('../config/db');

// exports.getClientDetails = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     // Call the stored procedure
//     const result = await sequelize.query('CALL USP_GetClientDetails(:userId)', {
//       replacements: { userId },
//       type: sequelize.QueryTypes.RAW
//     });


//     // Transform the result to match the desired output format
//     const clientDetails = result.map(client => ({
//       clientId: client.ClientID,
//       clientName: client.ClientName ? client.ClientName.toUpperCase() : null,
//       type: client.ClientType,
//       region: client.Region,
//       createdTime: client.CreatedDateTime,
//       meters: client.Meters,
//       status: client.Status,
//       snumber: client.SNumber,
//       totalZonesCount: client.TotalZonesCount,
//       totalDMACount: client.TotalDMACount,
//       totalMetersCount: client.TotalMetersCount,
//       imageLink: client.Imagelink // Ensure this key exists in your stored procedure result
//     }));

//     res.status(200).json({
//       clients: clientDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client details.',
//       error: error.message
//     });
//   }
// };


// exports.getTotalCustomerWiseSegementation = async (req, res) => {
//   const { clientId, zoneId, dmaId } = req.body;

//   try {
//     const result = await sequelize.query('CALL USP_GetCustomerSegmentation(:clientId, :zoneId, :dmaId)', {
//       replacements: { clientId, zoneId, dmaId },
//       type: sequelize.QueryTypes.RAW
//     });

//     const customerDetails = result.map(customer => ({
//       can : customer.can,
//       type : customer.Type,
// 	    gatewayId : customer.GatewayID,
// 	    lastCommunicationTime : customer.LastCommunicationTime,
// 	    reading : parseFloat(customer.Reading.toFixed(3)),
//       zone: customer.Zone,
// 	    status : customer.Status
//     }));

//     res.status(200).json({
//       customerDetails: customerDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client details.',
//       error: error.message
//     });
//   }
// };

// const convertTimestamp = (stamp) => {
//   return stamp.replace('T', ' ').split('.')[0];
// };

// exports.getClientAlerts = async (req, res) => {
//   const { clientId } = req.body;

//   try {
//     // Call the stored procedure
//     const result = await sequelize.query('CALL USP_GetClientAlerts(:clientId)', {
//       replacements: { clientId },
//       type: sequelize.QueryTypes.RAW
//     });

//     // Transform the result to match the desired output format
//     const clientAlerts = {};
    
//     result.forEach(alert => {
//       if (!clientAlerts[alert.DeviceType]) {
//         clientAlerts[alert.DeviceType] = [];
//       }
//       clientAlerts[alert.DeviceType].push({
//         AlertID: alert.AlertID,
//         DeviceType: alert.DeviceType,
//         DeviceID: alert.DeviceID,
//         ClientID: alert.ClientID,
//         AlertStatus: alert.AlertStatus,
//         CreatedAt: convertTimestamp(alert.CreatedAt.toISOString()),
//         gwid: alert.gwid
//       });
//     });

//     res.status(200).json({
//       clientAlerts
//     });
//   } catch (error) {
//     console.error('Error fetching client alerts:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching client alerts.',
//       error: error.message
//     });
//   }
// };
const sequelize = require('../config/db'); // Import the Sequelize instance for database operations.

// Handler to fetch client details using a stored procedure.
exports.getClientDetails = async (req, res) => {
  const { userId } = req.body; // Extract userId from the request body.

  try {
    // Call the stored procedure USP_GetClientDetails with the userId parameter.
    const result = await sequelize.query('CALL USP_GetClientDetails(:userId)', {
      replacements: { userId }, // Provide userId as a parameter to the stored procedure.
      type: sequelize.QueryTypes.RAW // Use RAW query type for the call.
    });

    // Transform the database result to match the required output format.
    const clientDetails = result.map(client => ({
      clientId: client.ClientID, // Map database field to output field.
      clientName: client.ClientName ? client.ClientName.toUpperCase() : null, // Convert name to uppercase if it exists.
      type: client.ClientType, // Map client type.
      region: client.Region, // Map region information.
      createdTime: client.CreatedDateTime, // Map creation timestamp.
      meters: client.Meters, // Map meters associated with the client.
      status: client.Status, // Map client status.
      snumber: client.SNumber, // Map SNumber.
      totalZonesCount: client.TotalZonesCount, // Map total zones count.
      totalDMACount: client.TotalDMACount, // Map total DMA count.
      totalMetersCount: client.TotalMetersCount, // Map total meters count.
      imageLink: client.Imagelink // Ensure Imagelink field exists in the stored procedure result.
    }));

    // Send the transformed data as a JSON response.
    res.status(200).json({
      clients: clientDetails
    });
  } catch (error) {
    // Handle errors and send a response with an error message.
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Handler to fetch customer segmentation details using a stored procedure.
exports.getTotalCustomerWiseSegementation = async (req, res) => {
  const { clientId, zoneId, dmaId } = req.body; // Extract parameters from the request body.

  try {
    // Call the stored procedure USP_GetCustomerSegmentation with the parameters.
    const result = await sequelize.query('CALL USP_GetCustomerSegmentation(:clientId, :zoneId, :dmaId)', {
      replacements: { clientId, zoneId, dmaId }, // Provide parameters to the stored procedure.
      type: sequelize.QueryTypes.RAW // Use RAW query type for the call.
    });

    // Transform the result into the desired format.
    const customerDetails = result.map(customer => ({
      can: customer.can, // Map customer CAN.
      type: customer.Type, // Map customer type.
      gatewayId: customer.GatewayID, // Map gateway ID.
      lastCommunicationTime: customer.LastCommunicationTime, // Map last communication time.
      reading: parseFloat(customer.Reading.toFixed(3)), // Format reading to 3 decimal places.
      zone: customer.Zone, // Map zone information.
      status: customer.Status // Map customer status.
    }));

    // Send the transformed data as a JSON response.
    res.status(200).json({
      customerDetails: customerDetails
    });
  } catch (error) {
    // Handle errors and send a response with an error message.
    console.error('Error fetching client details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client details.',
      error: error.message
    });
  }
};

// Utility function to convert a timestamp into a readable format.
const convertTimestamp = (stamp) => {
  // Replace the 'T' with a space and remove milliseconds.
  return stamp.replace('T', ' ').split('.')[0];
};

// Handler to fetch client alerts using a stored procedure.
exports.getClientAlerts = async (req, res) => {
  const { clientId } = req.body; // Extract clientId from the request body.

  try {
    // Call the stored procedure USP_GetClientAlerts with the clientId parameter.
    const result = await sequelize.query('CALL USP_GetClientAlerts(:clientId)', {
      replacements: { clientId }, // Provide clientId as a parameter to the stored procedure.
      type: sequelize.QueryTypes.RAW // Use RAW query type for the call.
    });

    // Initialize an empty object to group alerts by device type.
    const clientAlerts = {};
    
    // Iterate over the result and group alerts by their device type.
    result.forEach(alert => {
      if (!clientAlerts[alert.DeviceType]) {
        clientAlerts[alert.DeviceType] = []; // Initialize the array if not already present.
      }
      // Push the alert data into the corresponding device type array.
      clientAlerts[alert.DeviceType].push({
        AlertID: alert.AlertID, // Map alert ID.
        DeviceType: alert.DeviceType, // Map device type.
        DeviceID: alert.DeviceID, // Map device ID.
        ClientID: alert.ClientID, // Map client ID.
        AlertStatus: alert.AlertStatus, // Map alert status.
        CreatedAt: convertTimestamp(alert.CreatedAt.toISOString()), // Convert timestamp to readable format.
        gwid: alert.gwid // Map gateway ID.
      });
    });

    // Send the grouped alerts as a JSON response.
    res.status(200).json({
      clientAlerts
    });
  } catch (error) {
    // Handle errors and send a response with an error message.
    console.error('Error fetching client alerts:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client alerts.',
      error: error.message
    });
  }
};
