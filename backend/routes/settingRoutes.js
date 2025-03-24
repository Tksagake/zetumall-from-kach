const router = require("express").Router();

// Static store configuration
const storeConfig = {
  storeName: "ZetuMall Kenya",
  currency: "KES",
  seoTitle: "Shopping made easy",
  customization: {
    theme: "classic",
    banner: "ZetuMall Kenya, shopping made easier"
  }
};

// Get store details
router.get("/store-setting/all", (req, res) => {
  res.status(200).json(storeConfig);
});

// Get SEO settings
router.get("/store-setting/seo", (req, res) => {
  res.status(200).json({ seoTitle: storeConfig.seoTitle });
});

module.exports = router;
