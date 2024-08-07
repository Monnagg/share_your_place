const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/locations");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require('fs')

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   // {
//   //   id: "p2",
//   //   title: "Emp. State Building",
//   //   description: "One of the most famous sky scrapers in the world!",
//   //   imageUrl:
//   //     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//   //   address: "20 W 34th St, New York, NY 10001",
//   //   location: {
//   //     lat: 40.7484405,
//   //     lng: -73.9878584,
//   //   },
//   //   creator: "u2",
//   // },
// ];

const getPlaceById = async (req, res, next) => {
  console.log("Get Request in Places");
  const placeId = req.params.pid;
  console.log(placeId)

  let place;
  try {
    place = await Place.findById(placeId);
    console.log(place)

  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place", 500)
    );
  }
  console.log(place)
  //   const place = DUMMY_PLACES.find((p) => {
  //     return p.id === placeId; //{place} =>{place:place}
  //   });
  if (!place) {
    return next(new HttpError("Could not find a place for the place id", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};
// function getPlaceById() { ... }
// const getPlaceById = function() { ... }
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  //   const places = DUMMY_PLACES.filter((p) => {
  //     return p.creator == userId;
  //   });
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try it again", 500)
    );
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("Could not find a place for the user id", 404));
  }
  res.json({
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs parameters, please check your data.", 422)
    );
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
    console.log(`coordinates: ${coordinates}****`);
  } catch (error) {
    return next(error);
  }
  //   const createdPlace = {
  //     id: uuidv4(),
  //     // id:'p2',
  //     title,
  //     description,
  //     location: coordinates,
  //     address,
  //     creator,
  //   };
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:req.file.path,
    creator:req.userData.userId
  });
  console.log(`createdPlace ${createdPlace}`);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Fetching user failed, please try again"), 500);
  }
  if (!user) {
    return next(new HttpError("Could not find the user"), 404);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(`error ${error}`);
    return next(new HttpError("Creating place failed, Please try again"), 500);
  }
  //   console.log(createdPlace)
  //   DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs parameters, please check your data.", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  //   const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  //   const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update the place", 500)
    );
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update the place", 500)
    );
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete the place", 500)
    );
  }
  if (!place) {
    return next(new HttpError("Could not find place for this id", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError(
        'You are not allowed to delete this place.',
        401
      ));
  }

  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete the place"),
      500
    );
  }
  fs.unlink(imagePath, err=>{
    console.log(err)
  });
  res.status(200).json({ message: "Deleted place." });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
