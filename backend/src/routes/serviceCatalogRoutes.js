const express = require("express");
const router = express.Router();

const {
  listCatalog,
  createService,
  updateService,
  deleteService,
  createSubservice,
  updateSubservice,
  deleteSubservice,
} = require("../controllers/serviceCatalogController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

// Reading the catalogue is open — the public site needs it to render services.
router.get("/", listCatalog);

router.post("/services", authenticate, authorize("ADMIN"), createService);
router.put("/services/:id", authenticate, authorize("ADMIN"), updateService);
router.delete("/services/:id", authenticate, authorize("ADMIN"), deleteService);

router.post("/services/:serviceId/subservices", authenticate, authorize("ADMIN"), createSubservice);
router.put("/subservices/:id", authenticate, authorize("ADMIN"), updateSubservice);
router.delete("/subservices/:id", authenticate, authorize("ADMIN"), deleteSubservice);

module.exports = router;
