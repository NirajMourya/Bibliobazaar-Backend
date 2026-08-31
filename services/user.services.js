import bcrypt from "bcryptjs";

import { generateAccessToken } from "../middlewares/auth";
import users from "../models/userModel"
import { isValidEmail, validateRequiredFields, sanitizeInput } from "../utils/validators.js"

const signUpService = async (params, callback) => {
  try {
    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields(params, ['emailId', 'password', 'firstName'])
    if (!isValid) {
      return callback(
        {
          message: `Missing required fields: ${missingFields.join(', ')}`,
        },
        ""
      );
    }

    // Validate email format
    if (!isValidEmail(params.emailId)) {
      return callback(
        {
          message: "Invalid email format",
        },
        ""
      );
    }

    const emailAddress = params.emailId.toLowerCase().trim()
    const existingUser = await users.findOne({ emailId: emailAddress });
    
    if (existingUser != null) {
      return callback({
        message: "Email ID already in use. Try logging in."
      }, null);
    }

    // Sanitize user input
    const sanitizedParams = {
      ...params,
      emailId: emailAddress,
      firstName: sanitizeInput(params.firstName),
      lastName: params.lastName ? sanitizeInput(params.lastName) : null
    }

    const newUser = new users(sanitizedParams);
    const response = await newUser.save()
    const userId = response._id.toString()
    const token = generateAccessToken({ emailId: params.emailId, userId, tokenVersion: response.tokenVersion })
    
    return callback(null, {
      ...response.toJSON(),
      token,
    });
  } catch (error) {
    return callback(error);
  }
}

const loginService = async ({ emailId, password }, callback) => {
  try {
    // Validate required fields
    const { isValid, missingFields } = validateRequiredFields({ emailId, password }, ['emailId', 'password'])
    if (!isValid) {
      return callback(
        {
          message: `Missing required fields: ${missingFields.join(', ')}`,
        },
        ""
      );
    }

    // Validate email format
    if (!isValidEmail(emailId)) {
      return callback(
        {
          message: "Invalid email format",
        },
        ""
      );
    }

    const user = await users.findOne({ emailId: emailId.toLowerCase().trim() });
    if (user != null) {
      const userId = user._id.toString()
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateAccessToken({ emailId, userId, tokenVersion: user.tokenVersion });
        return callback(null, { ...user.toJSON(), token });
      } else {
        return callback({
          message: "Incorrect Email ID or Password.",
        });
      }
    } else {
      return callback({
        message: "Incorrect Email ID or Password.",
      });
    }
  } catch (error) {
    return callback(error);
  }
}

const updateProfilePictureService = async ({ profilePicture, emailId, userId }, callback) => {
  if (profilePicture === undefined) {
    return callback(
      {
        message: "Profile Picture url is required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });
  // return callback({}, "")

  if (user != null) {
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { profilePicture },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const getUserAccountService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {
    return callback(null, user);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const getUpdateAccountService = async ({ emailId, userId, firstName, lastName, phoneNumber, gender, dob }, callback) => {
  const user = await users.findOne({ emailId });

  const data = {
    firstName: firstName ? firstName : user?.firstName,
    lastName: lastName ? lastName : null, //? lastName : user?.lastName,
    phoneNumber: phoneNumber ? phoneNumber : null, //? phoneNumber : user?.phoneNumber,
    gender: gender ? gender : null, //? gender : user?.gender,
    dob: dob ? dob : null,//? dob : user?.dob,
  }
  console.log({ ...data })
  if (user != null) {
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { ...data },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });
  let currentAddresses = user?.addresses ? user.addresses : []
  if (user != null) {
    if (data?.isDefault) {
      currentAddresses.map((address) => address.isDefault = false)
    }
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: [...currentAddresses, data] },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const editAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentAddresses = [...user.addresses]
    let filteredAddresses = currentAddresses.filter(item => item._id.toString() !== data?.addressId);
    delete data?.addressId
    if (data?.isDefault) {
      filteredAddresses.map((address) => address.isDefault = false)
    }
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: [...filteredAddresses, { ...data }] },
      { new: true }
    )

    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentAddresses = [...user.addresses]
    let filteredAddresses = currentAddresses.filter(item => item._id.toString() !== data?.addressId);
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: filteredAddresses },
      { new: true }
    )

    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addressListService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {
    return callback(null, user.addresses);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addToCartService = async ({ emailId, userId, data }, callback) => {
  if (data.bookId === undefined || data.ownerId === undefined) {
    return callback(
      {
        message: "bookId, ownerUserId Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentCartItems = user?.cart.contents ? user.cart.contents : []

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [...currentCartItems, data] } },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteFromCartService = async ({ emailId, userId, data }, callback) => {
  if (data.id === undefined) {
    return callback(
      {
        message: "id Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentCartItems = [...user?.cart.contents]
    let filteredCartItems = currentCartItems.filter(item => item._id.toString() !== data?.id);

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [...filteredCartItems] } },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteAllFromCartService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [] } },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

// Increments tokenVersion so any previously issued JWTs fail authentication
const logoutService = async ({ userId }, callback) => {
  if (userId === undefined) {
    return callback(
      {
        message: "userId required",
      },
      ""
    );
  }

  try {
    const response = await users.findByIdAndUpdate(
      userId,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    if (!response) {
      return callback({
        message: "User not found",
      });
    }

    return callback(null, { loggedOut: true });
  } catch (error) {
    return callback(error);
  }
}



export {
  signUpService,
  loginService,
  updateProfilePictureService,
  getUserAccountService,
  getUpdateAccountService,
  addAddressService,
  editAddressService,
  deleteAddressService,
  addressListService,
  addToCartService,
  deleteFromCartService,
  deleteAllFromCartService,
  logoutService
}