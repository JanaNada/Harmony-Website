const express = require("express");
const router = express.Router();

const {
    getDashboard,

    getAllCompanies,
    getCompanyById,
    activateCompany,
    deactivateCompany,

    getAllServices,
    getServiceById,
    createService,
    updateService,
    activateService,
    deactivateService
} = require("../controllers/adminController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

router.get("/dashboard", authenticate, authorize("ADMIN"), getDashboard);

router.get("/companies", authenticate, authorize("ADMIN"), getAllCompanies);
router.get("/companies/:id", authenticate, authorize("ADMIN"), getCompanyById);
router.put("/companies/:id/activate", authenticate, authorize("ADMIN"), activateCompany);
router.put("/companies/:id/deactivate", authenticate, authorize("ADMIN"), deactivateCompany);

router.get("/services", authenticate, authorize("ADMIN"), getAllServices);
router.get("/services/:id", authenticate, authorize("ADMIN"), getServiceById);
router.post("/services", authenticate, authorize("ADMIN"), createService);
router.put("/services/:id", authenticate, authorize("ADMIN"), updateService);
router.put("/services/:id/activate", authenticate, authorize("ADMIN"), activateService);
router.put("/services/:id/deactivate", authenticate, authorize("ADMIN"), deactivateService);

module.exports = router;