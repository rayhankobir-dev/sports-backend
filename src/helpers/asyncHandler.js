// handle asynchrnous task
const asyncHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    return next(err);
  }
};

export default asyncHandler;
