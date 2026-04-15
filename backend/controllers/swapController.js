exports.registerUser = async (req, res) => {
  try {
    console.log(req.body); // check frontend data
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering" });
  }
};
