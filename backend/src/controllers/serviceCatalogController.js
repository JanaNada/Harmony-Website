const db = require("../config/db");

/**
 * The service catalogue: the services offered and the subservices under each.
 *
 * Each service carries an accent colour, which is what tints its page and its
 * cards, the same way the built-in services are colour-coded.
 */

const HEX = /^#[0-9a-fA-F]{6}$/;

const clean = (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);

/** Services with their subservices nested, ordered for display. */
const listCatalog = async (req, res) => {
  try {
    const [services] = await db.query(
      "SELECT * FROM services ORDER BY sort_order ASC, id ASC"
    );
    const [subservices] = await db.query(
      "SELECT * FROM subservices ORDER BY sort_order ASC, id ASC"
    );

    return res.status(200).json({
      success: true,
      services: services.map((s) => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        imageUrl: s.image_url,
        accentColor: s.accent_color,
        sortOrder: s.sort_order,
        isActive: !!s.is_active,
        subservices: subservices
          .filter((sub) => sub.service_id === s.id)
          .map((sub) => ({
            id: sub.id,
            serviceId: sub.service_id,
            title: sub.title,
            shortDescription: sub.short_description,
            description: sub.description,
            imageUrl: sub.image_url,
            sortOrder: sub.sort_order,
            isActive: !!sub.is_active,
          })),
      })),
    });
  } catch (error) {
    console.error("listCatalog error:", error);
    return res.status(500).json({ success: false, message: "Failed to load services" });
  }
};

const createService = async (req, res) => {
  try {
    const { title, tagline, description, accentColor, imageUrl, sortOrder } = req.body;

    if (!clean(title)) {
      return res.status(400).json({ success: false, message: "Give the service a name" });
    }
    if (accentColor && !HEX.test(accentColor)) {
      return res.status(400).json({ success: false, message: "Colour must be a hex value like #F5841F" });
    }

    const [result] = await db.query(
      `INSERT INTO services (title, tagline, description, accent_color, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        clean(tagline),
        clean(description),
        accentColor || "#F5841F",
        clean(imageUrl),
        Number.isInteger(sortOrder) ? sortOrder : 0,
      ]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("createService error:", error);
    return res.status(500).json({ success: false, message: "Failed to create the service" });
  }
};

const updateService = async (req, res) => {
  try {
    const { title, tagline, description, accentColor, imageUrl, sortOrder, isActive } = req.body;

    if (accentColor && !HEX.test(accentColor)) {
      return res.status(400).json({ success: false, message: "Colour must be a hex value like #F5841F" });
    }

    const [existing] = await db.query("SELECT id FROM services WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    /* Only touch the fields actually supplied, so a partial edit from one
       screen can't blank out values set on another. */
    const sets = [];
    const params = [];
    const put = (column, value) => { sets.push(`${column} = ?`); params.push(value); };

    if (title !== undefined) {
      if (!clean(title)) return res.status(400).json({ success: false, message: "Name cannot be empty" });
      put("title", title.trim());
    }
    if (tagline !== undefined) put("tagline", clean(tagline));
    if (description !== undefined) put("description", clean(description));
    if (accentColor !== undefined) put("accent_color", accentColor);
    if (imageUrl !== undefined) put("image_url", clean(imageUrl));
    if (sortOrder !== undefined) put("sort_order", Number(sortOrder) || 0);
    if (isActive !== undefined) put("is_active", isActive ? 1 : 0);

    if (sets.length === 0) return res.status(200).json({ success: true });

    params.push(req.params.id);
    await db.query(`UPDATE services SET ${sets.join(", ")} WHERE id = ?`, params);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("updateService error:", error);
    return res.status(500).json({ success: false, message: "Failed to update the service" });
  }
};

const deleteService = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    // Subservices have no cascade on this table, so clear them first.
    await connection.query("DELETE FROM subservices WHERE service_id = ?", [req.params.id]);
    const [result] = await connection.query("DELETE FROM services WHERE id = ?", [req.params.id]);
    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("deleteService error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete the service" });
  } finally {
    if (connection) connection.release();
  }
};

const createSubservice = async (req, res) => {
  try {
    const { title, shortDescription, description, imageUrl, sortOrder } = req.body;

    if (!clean(title)) {
      return res.status(400).json({ success: false, message: "Give the subservice a name" });
    }

    const [service] = await db.query("SELECT id FROM services WHERE id = ?", [req.params.serviceId]);
    if (service.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const [result] = await db.query(
      `INSERT INTO subservices (service_id, title, short_description, description, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.params.serviceId,
        title.trim(),
        clean(shortDescription),
        clean(description),
        clean(imageUrl),
        Number(sortOrder) || 0,
      ]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("createSubservice error:", error);
    return res.status(500).json({ success: false, message: "Failed to add the subservice" });
  }
};

const updateSubservice = async (req, res) => {
  try {
    const { title, shortDescription, description, imageUrl, sortOrder, isActive } = req.body;

    const sets = [];
    const params = [];
    const put = (column, value) => { sets.push(`${column} = ?`); params.push(value); };

    if (title !== undefined) {
      if (!clean(title)) return res.status(400).json({ success: false, message: "Name cannot be empty" });
      put("title", title.trim());
    }
    if (shortDescription !== undefined) put("short_description", clean(shortDescription));
    if (description !== undefined) put("description", clean(description));
    if (imageUrl !== undefined) put("image_url", clean(imageUrl));
    if (sortOrder !== undefined) put("sort_order", Number(sortOrder) || 0);
    if (isActive !== undefined) put("is_active", isActive ? 1 : 0);

    if (sets.length === 0) return res.status(200).json({ success: true });

    params.push(req.params.id);
    const [result] = await db.query(`UPDATE subservices SET ${sets.join(", ")} WHERE id = ?`, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Subservice not found" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("updateSubservice error:", error);
    return res.status(500).json({ success: false, message: "Failed to update the subservice" });
  }
};

const deleteSubservice = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM subservices WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Subservice not found" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteSubservice error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete the subservice" });
  }
};

const getHiddenServices = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT service_id FROM hidden_services");
    return res.status(200).json({ success: true, hidden: rows.map(r => r.service_id) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch hidden services" });
  }
};

const hideService = async (req, res) => {
  try {
    await db.query("INSERT IGNORE INTO hidden_services (service_id) VALUES (?)", [req.params.id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to hide service" });
  }
};

const unhideService = async (req, res) => {
  try {
    await db.query("DELETE FROM hidden_services WHERE service_id = ?", [req.params.id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to unhide service" });
  }
};

module.exports = {
  listCatalog,
  createService,
  updateService,
  deleteService,
  createSubservice,
  updateSubservice,
  deleteSubservice,
  getHiddenServices,
  hideService,
  unhideService,
};
