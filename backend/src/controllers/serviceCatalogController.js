const db = require("../config/db");

const HEX = /^#[0-9a-fA-F]{6}$/;

const clean = (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);
const asBool = (v) => v === true || v === 1 || v === "1" || v === "true";

async function hasColumn(table, column) {
  const [rows] = await db.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function hasTable(table) {
  const [rows] = await db.query(
    `SELECT 1
       FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = ?`,
    [table]
  );
  return rows.length > 0;
}

async function loadSections() {
  if (!(await hasTable("service_sections"))) return [];

  const [sections] = await db.query(
    `SELECT ss.*
       FROM service_sections ss
      ORDER BY ss.service_id ASC, ss.sort_order ASC, ss.id ASC`
  );

  const [subservices] = await db.query(
    `SELECT *
       FROM subservices
      ORDER BY service_id ASC, sort_order ASC, id ASC`
  );

  const bySection = new Map();
  for (const sub of subservices) {
    if (!sub.section_id) continue;
    if (!bySection.has(sub.section_id)) bySection.set(sub.section_id, []);
    bySection.get(sub.section_id).push(sub);
  }

  return sections.map((section) => ({
    id: section.id,
    serviceId: section.service_id,
    title: section.title,
    sortOrder: section.sort_order,
    createdAt: section.created_at,
    updatedAt: section.updated_at,
    subservices: (bySection.get(section.id) || []).map((sub) => ({
      id: sub.id,
      serviceId: sub.service_id,
      sectionId: sub.section_id,
      title: sub.title,
      shortDescription: sub.short_description,
      description: sub.description,
      imageUrl: sub.image_url,
      sortOrder: sub.sort_order,
      isActive: !!sub.is_active,
    })),
  }));
}

/** Services with nested sections and subservices, ordered for display. */
const listCatalog = async (req, res) => {
  try {
    const [serviceHasSort, subserviceHasSort] = await Promise.all([
      hasColumn("services", "sort_order"),
      hasColumn("subservices", "sort_order"),
    ]);

    const [services] = await db.query(
      `SELECT * FROM services ORDER BY ${serviceHasSort ? "sort_order ASC, " : ""}id ASC`
    );

    const [subservices] = await db.query(
      `SELECT * FROM subservices ORDER BY ${subserviceHasSort ? "sort_order ASC, " : ""}id ASC`
    );

    const sections = await loadSections();

    const sectionsByService = new Map();
    for (const section of sections) {
      if (!sectionsByService.has(section.serviceId)) sectionsByService.set(section.serviceId, []);
      sectionsByService.get(section.serviceId).push(section);
    }

    const subservicesByService = new Map();
    for (const sub of subservices) {
      if (!subservicesByService.has(sub.service_id)) subservicesByService.set(sub.service_id, []);
      subservicesByService.get(sub.service_id).push(sub);
    }

    return res.status(200).json({
      success: true,
      services: services.map((s) => {
        const serviceSections = sectionsByService.get(s.id) || [];
        return {
          id: s.id,
          title: s.title,
          tagline: s.tagline,
          description: s.description,
          imageUrl: s.image_url,
          icon: s.icon,
          accentColor: s.accent_color,
          sortOrder: s.sort_order,
          isActive: !!s.is_active,
          sections: serviceSections,
          subservices: subservicesByService.get(s.id)?.map((sub) => ({
            id: sub.id,
            serviceId: sub.service_id,
            sectionId: sub.section_id,
            title: sub.title,
            shortDescription: sub.short_description,
            description: sub.description,
            imageUrl: sub.image_url,
            sortOrder: sub.sort_order,
            isActive: !!sub.is_active,
            sectionTitle: serviceSections.find((section) => section.id === sub.section_id)?.title ?? null,
          })) || [],
        };
      }),
    });
  } catch (error) {
    console.error("listCatalog error:", error);
    return res.status(500).json({ success: false, message: "Failed to load services" });
  }
};

const createService = async (req, res) => {
  try {
    const { title, tagline, description, accentColor, imageUrl, icon, sortOrder } = req.body;

    if (!clean(title)) {
      return res.status(400).json({ success: false, message: "Give the service a name" });
    }
    if (accentColor && !HEX.test(accentColor)) {
      return res.status(400).json({ success: false, message: "Colour must be a hex value like #F5841F" });
    }

    const [result] = await db.query(
      `INSERT INTO services (title, tagline, description, accent_color, image_url, icon, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        clean(tagline),
        clean(description),
        accentColor || "#F5841F",
        clean(imageUrl),
        clean(icon) || "Box",
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
    const { title, tagline, description, accentColor, imageUrl, icon, sortOrder, isActive } = req.body;

    if (accentColor && !HEX.test(accentColor)) {
      return res.status(400).json({ success: false, message: "Colour must be a hex value like #F5841F" });
    }

    const [existing] = await db.query("SELECT id FROM services WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const sets = [];
    const params = [];
    const put = (column, value) => {
      sets.push(`${column} = ?`);
      params.push(value);
    };

    if (title !== undefined) {
      if (!clean(title)) return res.status(400).json({ success: false, message: "Name cannot be empty" });
      put("title", title.trim());
    }
    if (tagline !== undefined) put("tagline", clean(tagline));
    if (description !== undefined) put("description", clean(description));
    if (accentColor !== undefined) put("accent_color", accentColor);
    if (imageUrl !== undefined) put("image_url", clean(imageUrl));
    if (icon !== undefined) put("icon", clean(icon));
    if (sortOrder !== undefined) put("sort_order", Number(sortOrder) || 0);
    if (isActive !== undefined) put("is_active", asBool(isActive) ? 1 : 0);

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

const createSection = async (req, res) => {
  try {
    const title = clean(req.body.title);
    if (!title) return res.status(400).json({ success: false, message: "Give the section a name" });

    const [service] = await db.query("SELECT id FROM services WHERE id = ?", [req.params.serviceId]);
    if (service.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const [nextOrder] = await db.query(
      `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort
         FROM service_sections
        WHERE service_id = ?`,
      [req.params.serviceId]
    );

    const [result] = await db.query(
      `INSERT INTO service_sections (service_id, title, sort_order)
       VALUES (?, ?, ?)`,
      [req.params.serviceId, title, nextOrder[0].next_sort]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("createSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to create the section" });
  }
};

const updateSection = async (req, res) => {
  try {
    const title = clean(req.body.title);
    if (!title) return res.status(400).json({ success: false, message: "Section name cannot be empty" });

    const [result] = await db.query(
      `UPDATE service_sections SET title = ? WHERE id = ?`,
      [title, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("updateSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to update the section" });
  }
};

// const deleteSection = async (req, res) => {
//   try {
//     const [subservices] = await db.query(
//       "SELECT id FROM subservices WHERE section_id = ? LIMIT 1",
//       [req.params.id]
//     );
//     if (subservices.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "This section contains subservices. Move them to another section before deleting it.",
//       });
//     }

//     const [result] = await db.query("DELETE FROM service_sections WHERE id = ?", [req.params.id]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Section not found" });
//     }
//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("deleteSection error:", error);
//     return res.status(500).json({ success: false, message: "Failed to delete the section" });
//   }
// };
const deleteSection = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [section] = await connection.query(
      "SELECT id, service_id FROM service_sections WHERE id = ?",
      [req.params.id]
    );

    if (section.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const serviceId = section[0].service_id;

    // Delete all subservices belonging to this section first.
    await connection.query(
      "DELETE FROM subservices WHERE section_id = ?",
      [req.params.id]
    );

    // Delete the section.
    await connection.query(
      "DELETE FROM service_sections WHERE id = ?",
      [req.params.id]
    );

    // Normalize the remaining section sort order.
    const [remainingSections] = await connection.query(
      `SELECT id
         FROM service_sections
        WHERE service_id = ?
        ORDER BY sort_order ASC, id ASC`,
      [serviceId]
    );

    for (let i = 0; i < remainingSections.length; i += 1) {
      await connection.query(
        "UPDATE service_sections SET sort_order = ? WHERE id = ?",
        [i, remainingSections[i].id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("deleteSection error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the section",
    });
  } finally {
    if (connection) connection.release();
  }
};
const moveSection = async (req, res) => {
  try {
    const direction = req.body.direction;
    if (!["up", "down"].includes(direction)) {
      return res.status(400).json({ success: false, message: "Direction must be up or down" });
    }

    const [currentRows] = await db.query(
      "SELECT * FROM service_sections WHERE id = ?",
      [req.params.id]
    );
    if (currentRows.length === 0) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    const current = currentRows[0];

    const comparator = direction === "up" ? "<" : ">";
    const orderDir = direction === "up" ? "DESC" : "ASC";
    const [neighbors] = await db.query(
      `SELECT *
         FROM service_sections
        WHERE service_id = ?
          AND sort_order ${comparator} ?
        ORDER BY sort_order ${orderDir}, id ${orderDir}
        LIMIT 1`,
      [current.service_id, current.sort_order]
    );

    if (neighbors.length === 0) {
      return res.status(200).json({ success: true });
    }

    const neighbor = neighbors[0];
    await db.query("UPDATE service_sections SET sort_order = ? WHERE id = ?", [neighbor.sort_order, current.id]);
    await db.query("UPDATE service_sections SET sort_order = ? WHERE id = ?", [current.sort_order, neighbor.id]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("moveSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to reorder the section" });
  }
};

const moveSubservice = async (req, res) => {
  try {
    const direction = req.body.direction;
    if (!["up", "down"].includes(direction)) {
      return res.status(400).json({ success: false, message: "Direction must be up or down" });
    }

    const [currentRows] = await db.query(
      "SELECT * FROM subservices WHERE id = ?",
      [req.params.id]
    );
    if (currentRows.length === 0) {
      return res.status(404).json({ success: false, message: "Subservice not found" });
    }
    const current = currentRows[0];

    const [siblings] = await db.query(
      `SELECT id, sort_order
         FROM subservices
        WHERE section_id = ?
        ORDER BY sort_order ASC, id ASC`,
      [current.section_id]
    );

    const index = siblings.findIndex((sub) => sub.id === current.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= siblings.length) {
      return res.status(200).json({ success: true });
    }

    const nextOrder = [...siblings];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIndex, 0, moved);

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (let i = 0; i < nextOrder.length; i += 1) {
        await connection.query("UPDATE subservices SET sort_order = ? WHERE id = ?", [i, nextOrder[i].id]);
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("moveSubservice error:", error);
    return res.status(500).json({ success: false, message: "Failed to reorder the subservice" });
  }
};

const createSubservice = async (req, res) => {
  try {
    const { title, shortDescription, description, imageUrl, sortOrder, sectionId } = req.body;

    if (!clean(title)) {
      return res.status(400).json({ success: false, message: "Give the subservice a name" });
    }
    if (!sectionId) {
      return res.status(400).json({ success: false, message: "Choose a section for the subservice" });
    }

    const [service] = await db.query("SELECT id FROM services WHERE id = ?", [req.params.serviceId]);
    if (service.length === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const [section] = await db.query(
      "SELECT id FROM service_sections WHERE id = ? AND service_id = ?",
      [sectionId, req.params.serviceId]
    );
    if (section.length === 0) {
      return res.status(400).json({ success: false, message: "Choose a valid section for this service" });
    }

    const [nextOrder] = await db.query(
      `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort
         FROM subservices
        WHERE section_id = ?`,
      [sectionId]
    );

    const [result] = await db.query(
      `INSERT INTO subservices (service_id, section_id, title, short_description, description, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.params.serviceId,
        sectionId,
        title.trim(),
        clean(shortDescription),
        clean(description),
        clean(imageUrl),
        Number.isInteger(sortOrder) ? sortOrder : nextOrder[0].next_sort,
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
    const { title, shortDescription, description, imageUrl, sortOrder, isActive, sectionId } = req.body;

    const sets = [];
    const params = [];
    const put = (column, value) => {
      sets.push(`${column} = ?`);
      params.push(value);
    };

    if (title !== undefined) {
      if (!clean(title)) return res.status(400).json({ success: false, message: "Name cannot be empty" });
      put("title", title.trim());
    }
    if (shortDescription !== undefined) put("short_description", clean(shortDescription));
    if (description !== undefined) put("description", clean(description));
    if (imageUrl !== undefined) put("image_url", clean(imageUrl));
    if (sortOrder !== undefined) put("sort_order", Number(sortOrder) || 0);
    if (isActive !== undefined) put("is_active", asBool(isActive) ? 1 : 0);
    if (sectionId !== undefined) {
      const [subservice] = await db.query("SELECT service_id FROM subservices WHERE id = ?", [req.params.id]);
      if (subservice.length === 0) {
        return res.status(404).json({ success: false, message: "Subservice not found" });
      }
      const [section] = await db.query(
        "SELECT id FROM service_sections WHERE id = ? AND service_id = ?",
        [sectionId, subservice[0].service_id]
      );
      if (section.length === 0) {
        return res.status(400).json({ success: false, message: "Choose a valid section for this service" });
      }
      put("section_id", sectionId);
    }

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

// const deleteSubservice = async (req, res) => {
//   try {
//     const [result] = await db.query("DELETE FROM subservices WHERE id = ?", [req.params.id]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Subservice not found" });
//     }
//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("deleteSubservice error:", error);
//     return res.status(500).json({ success: false, message: "Failed to delete the subservice" });
//   }
// };
const deleteSubservice = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [subservice] = await connection.query(
      "SELECT id, section_id FROM subservices WHERE id = ?",
      [req.params.id]
    );

    if (subservice.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Subservice not found",
      });
    }

    const sectionId = subservice[0].section_id;

    await connection.query(
      "DELETE FROM subservices WHERE id = ?",
      [req.params.id]
    );

    // Normalize the remaining subservice order within this section.
    const [remaining] = await connection.query(
      `SELECT id
         FROM subservices
        WHERE section_id = ?
        ORDER BY sort_order ASC, id ASC`,
      [sectionId]
    );

    for (let i = 0; i < remaining.length; i += 1) {
      await connection.query(
        "UPDATE subservices SET sort_order = ? WHERE id = ?",
        [i, remaining[i].id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("deleteSubservice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the subservice",
    });
  } finally {
    if (connection) connection.release();
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
  createSection,
  updateSection,
  deleteSection,
  moveSection,
  moveSubservice,
  createSubservice,
  updateSubservice,
  deleteSubservice,
  getHiddenServices,
  hideService,
  unhideService,
};
