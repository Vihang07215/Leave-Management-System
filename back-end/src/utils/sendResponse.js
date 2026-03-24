exports.sendResponse = (data = null, isError = false, message = "", lang = "en") => {
  return {
    data,
    is_error: isError,
    message
  };
};
