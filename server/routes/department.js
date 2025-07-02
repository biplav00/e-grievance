const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: API endpoints for managing departments
 */

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Public GET endpoint for departments, but sets req.user if token is present
router.get("/", departmentController.getDepartments);

/**
 * @swagger
 * /api/department:
 *   post:
 *     summary: Add a new department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", departmentController.addDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   put:
 *     summary: Update an existing department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the department to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.put("/:id", departmentController.editDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the department to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Department deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
