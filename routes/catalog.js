const express = require("express");
const router = express.Router();

// require controller modules
const item_controller = require("../controller/itemController");
const category_controller = require("../controller/categoryController");
const itemInstance_controller = require("../controller/itemInstanceController");
const color_controller = require("../controller/colorController");

router.get('/', item_controller.index);

/// ITEM ROUTES ///

// GET request for creating an Item (handcraft). NOTE This must come before routes that display Item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all items.
router.get("/items", item_controller.item_list);


/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories.
router.get("/categories", category_controller.category_list);


/// ITEM INSTANCES ROUTES ///

// GET request for creating an Instance. NOTE This must come before routes that display Instance (uses id).
router.get("/iteminstance/create", itemInstance_controller.itemInstance_create_get);

// POST request for creating Instance.
router.post("/iteminstance/create", itemInstance_controller.itemInstance_create_post);

// GET request to delete Instance.
router.get("/iteminstance/:id/delete", itemInstance_controller.itemInstance_delete_get);

// POST request to delete Instance.
router.post("/iteminstance/:id/delete", itemInstance_controller.itemInstance_delete_post);

// GET request to update Instance.
router.get("/iteminstance/:id/update", itemInstance_controller.itemInstance_update_get);

// POST request to update Instance.
router.post("/iteminstance/:id/update", itemInstance_controller.itemInstance_update_post);

// GET request for one Instance.
router.get("/iteminstance/:id", itemInstance_controller.itemInstance_detail);

// GET request for list of all Instances.
router.get("/iteminstances", itemInstance_controller.itemInstance_list);


/// COLOR ROUTES ///

// GET request for creating a Color. NOTE This must come before routes that display Category (uses id).
router.get("/color/create", color_controller.color_create_get);

// POST request for creating Color.
router.post("/color/create", color_controller.color_create_post);

// GET request to delete Color.
router.get("/color/:id/delete", color_controller.color_delete_get);

// POST request to delete Color.
router.post("/color/:id/delete", color_controller.color_delete_post);

// GET request to update Color.
router.get("/color/:id/update", color_controller.color_update_get);

// POST request to update Color.
router.post("/color/:id/update", color_controller.color_update_post);

// GET request for list of all Colors.
router.get("/colors", color_controller.color_list);

// =====================================
module.exports = router;