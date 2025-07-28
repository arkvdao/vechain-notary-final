export function buildSuccessResponse(res, data) {
  return res.status(200).json({ success: true, data });
}

export function buildErrorResponse(res, statusCode, message, errorDetails = null) {
  return res.status(statusCode).json({ success: false, error: { message, details: errorDetails } });
}
