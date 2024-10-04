const APIFeatures = require("./../utils/apiFeatures");
const Travel = require("../models/travelModel");

// exports.checkID = (req, res, next, val) => {
//   console.log("id is : ", val);

//   if (req.params.id * 1 > Travel.length) {
//     return res.status(404).json({
//       status: fail,
//       message: "Invalid Id",
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   console.log("id is : ", val);

//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: fail,
//       message: "missing name or price",
//     });
//   }
// };

exports.aliasTopTravel = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTravel = async (req, res) => {
  try {
    const features = new APIFeatures(Travel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const travels = await features.query;

    // const travels = await query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: travels.length,
      data: travels,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTravel = async (req, res) => {
  try {
    const travels = await Travel.findById(req.params.id);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: Travel.length,
      data: travels,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createTravel = async (req, res) => {
  try {
    const newTravel = await Travel.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        travel: newTravel,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTravel = async (req, res) => {
  try {
    const travel = await Travel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: "<Updated Travel>",
      updatedData: travel,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTravel = async (req, res) => {
  try {
    await Travel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getTravelStats = async (req, res) => {
  try {
    const stats = await Travel.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }, // Using the correct field name
      },
      {
        $group: {
          _id: {$toUpper:'$difficulty'}, // Grouping all documents together
          numTravels: { $sum: 1 },
          numRating: { $sum: "$ratingAverage" }, // Using the correct field name
          avgRating: { $avg: "$ratingAverage" }, // Using the correct field name
          avgPrice: { $avg: "$price" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Travel.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: "$startDates" },
          numTravelStats: { $sum: 1 },
          travels: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTravelStats: -1 },
      },
      // {
      //   $limit:1
      // }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
