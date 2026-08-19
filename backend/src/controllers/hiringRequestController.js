const db = require("../config/db");

const createHiringRequest = async (req, res) => {
  try {
    const {
      requestorName,
      department,
      jobTitle,
      dateOfRequest,
      positionTitle,
      employmentType,
      workLocation,
      positionsNeeded,
      desiredStartDate,
      reportingTo,
      jobResponsibilities,
      requiredQualifications,
      preferredQualifications,
      proposedSalaryRange,
      budgetApproved,
      budgetCode,
      benefitsJson,
    } = req.body;

    // Validate minimal required fields
    if (!requestorName || !positionTitle) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (requestorName, positionTitle)",
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO hiring_requests (
          requestor_name,
          department,
          job_title,
          date_of_request,
          position_title,
          employment_type,
          work_location,
          positions_needed,
          desired_start_date,
          reporting_to,
          job_responsibilities,
          required_qualifications,
          preferred_qualifications,
          proposed_salary_range,
          budget_approved,
          budget_code,
          benefits_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        requestorName,
        department,
        jobTitle,
        dateOfRequest ? new Date(dateOfRequest) : null,
        positionTitle,
        employmentType,
        workLocation,
        positionsNeeded ? parseInt(positionsNeeded, 10) : null,
        desiredStartDate ? new Date(desiredStartDate) : null,
        reportingTo,
        jobResponsibilities,
        requiredQualifications,
        preferredQualifications,
        proposedSalaryRange,
        budgetApproved ? 1 : 0,
        budgetCode,
        JSON.stringify(benefitsJson || {}),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Hiring request created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating hiring request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createHiringRequest,
};