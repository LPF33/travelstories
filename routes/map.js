const express = require("express");
const router = express.Router();
const geocoder = require("../config/geocode");
const authJWT = require("../middleware/auth");

router.use(authJWT);

router.get("/search/:search", async(req,res) => {
    const {search} = req.params;
    const loc = await geocoder.geocode(search);
    res.json({
        loc
    });
});

router.post("/coordinates", async(req,res) => {
    const {longitude, latitude} = req.body;
    const loc = await geocoder.reverse({lat:latitude,lon:longitude});
    res.json({
        loc
    });
});

module.exports = router;