const path = require('path');

/**
 * Formats a grievance document for API responses, including photo URLs.
 * @param {Object} grievance - The grievance document (Mongoose doc or plain object)
 * @param {Object} req - The Express request object (for protocol/host)
 * @returns {Object} - Normalized grievance object
 */
function formatGrievance(grievance, req) {
  // If grievance is a Mongoose document, convert to plain object
  const g = grievance.toObject ? grievance.toObject() : grievance;
  return {
    _id: g._id,
    trackingId: g.trackingId,
    description: g.description,
    address: g.address,
    status: g.status,
    photos: g.photos && Array.isArray(g.photos)
      ? g.photos.slice(0, 1).map(photo => {
          const normalizedPath = path.normalize(photo.path || photo).replace(/\\/g, '/');
          return {
            url: `${req.protocol}://${req.get('host')}/uploads/${path.basename(normalizedPath)}`,
            path: photo.path || photo
          };
        })
      : [],
    createdAt: g.createdAt,
    category: g.category || 'N/A',
    department: g.department || { name: 'N/A' },
    submittedBy: g.submittedBy
      ? typeof g.submittedBy === 'object'
        ? {
            _id: g.submittedBy._id,
            email: g.submittedBy.email,
          }
        : g.submittedBy
      : null,
    feedback: g.feedback || ""
  };
}

module.exports = formatGrievance;
