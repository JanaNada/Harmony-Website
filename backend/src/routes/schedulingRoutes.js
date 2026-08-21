const express = require("express");
const router = express.Router();

const {
  listSlots,
  listCompanies,
  listProjects,
  updateProjectStatus,
  getOverviewStats,
  createSlots,
  deleteSlot,
  getCompanyProfile,
  proposeReschedule,
  listMyReschedules,
  respondToReschedule,
} = require("../controllers/schedulingController");

const { authenticate, optionalAuthenticate, authorize } = require("../middleware/authMiddleware");

/* Open on purpose: a visitor choosing a meeting time while booking needs to
   see the free slots. The controller only reveals who is on a slot to staff,
   and shows everyone else nothing but OPEN times. */
router.get("/slots", optionalAuthenticate, listSlots);

/* Publishing availability is the one scheduling power a coordinator does not
   have — they work with the times an admin has opened up. */
router.post("/slots", authenticate, authorize("ADMIN"), createSlots);
router.delete("/slots/:id", authenticate, authorize("ADMIN"), deleteSlot);

router.get("/stats", authenticate, authorize("ADMIN", "COORDINATOR"), getOverviewStats);
// Listed before /companies/:id so "companies" isn't read as an id.
router.get("/companies", authenticate, authorize("ADMIN", "COORDINATOR"), listCompanies);
router.get("/companies/:id", authenticate, authorize("ADMIN", "COORDINATOR"), getCompanyProfile);

router.get("/projects", authenticate, authorize("ADMIN", "COORDINATOR"), listProjects);
router.patch("/projects/:id/status", authenticate, authorize("ADMIN", "COORDINATOR"), updateProjectStatus);
router.post("/requests/:id/reschedule", authenticate, authorize("ADMIN", "COORDINATOR"), proposeReschedule);

router.get("/my-reschedules", authenticate, authorize("COMPANY"), listMyReschedules);
router.post("/reschedules/:id/respond", authenticate, authorize("COMPANY"), respondToReschedule);

module.exports = router;
