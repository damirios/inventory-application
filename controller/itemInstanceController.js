const Color = require("../models/color");
const Item = require("../models/item");
const ItemInstance = require("../models/itemInstance");

const async = require("async");
const { body, validationResult } = require("express-validator");

// display all item instances
exports.itemInstance_list = (req, res, next) => {
    ItemInstance.find()
    .populate("item")
    .populate("color")
    .exec((err, instances) => {
        if (err) {
            return next(err);
        }

        res.render("instances_list", {title: "Список всех экземпляров товаров", instances});
    });
};

exports.itemInstance_detail = (req, res, next) => {
    ItemInstance.findById(req.params.id)
    .populate("item")
    .populate("color")
    .exec((err, instance) => {
        if (err) {
            return next(err);
        }

        if (instance === null) {
            const err = new Error("Экземпляр не найден");
            err.status = 404;
            return next(err);
        }

        res.render("instance_detail", {
            title: "Подробная информация об экземпляре товара",
            instance
        });
    }); 
};

// display item instance create form on GET
exports.itemInstance_create_get = (req, res, next) => {
    async.parallel({
        items(callback) {
            Item.find()
            .sort({title: 1})
            .exec(callback);
        },
        colors(callback) {
            Color.find()
            .sort({title: 1})
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        res.render("instance_form", {
            title: "Создание нового экземпляра товара",
            items: results.items,
            colors: results.colors
        });
    });
};

// display item instance create form on POST
exports.itemInstance_create_post = [
    body("item", "Выберите товар")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("color", "Выберите цвет")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("status", "Выберите статус")
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(body);

        const instance = new ItemInstance({
            item: req.body.item,
            color: req.body.color,
            status: (req.body.status) ? "Not available" : "Available"
        });

        if (!errors.isEmpty()) {
            async.parallel({
                items(callback) {
                    Item.find()
                    .sort({title: 1})
                    .exec(callback);
                },
                colors(callback) {
                    Color.find()
                    .sort({title: 1})
                    .exec(callback);
                }
            },
            (err, results) => {
                if (err) {
                    return next(err);
                }
        
                res.render("instance_form", {
                    title: "Создание нового экземпляра товара",
                    items: results.items,
                    colors: results.colors
                });
            });
            return;
        }

        instance.save(err => {
            if (err) {
                return next(err);
            }

            res.redirect(instance.url);
        });
    }
]

// display item instance delete form on GET
exports.itemInstance_delete_get = (req, res, next) => {
    ItemInstance.findById(req.params.id)
    .populate("item")
    .populate("color")
    .exec((err, instance) => {
        if (err) {
            return next(err);
        }

        if (instance === null) {
            const err = new Error("Экземпляр не найден");
            err.status = 404;
            return next(err);
        }

        res.render("instance_delete", {
            title: "Удаление экземпляра товара",
            instance
        });
    });
};

// handle item instance delete on POST
exports.itemInstance_delete_post = (req, res, next) => {
    ItemInstance.findById(req.body.instanceid, (err, instance) => {
        if (err) {
            return next(err);
        }

        if (instance === null) {
            const err = new Error("Экземпляр не найден");
            err.status = 404;
            return next(err);
        }

        ItemInstance.findByIdAndRemove(req.body.instanceid, (err) => {
            if (err) {
                return next(err);
            }

            res.redirect("/catalog/iteminstances");
        });
    });
};

// display item instance update form on GET
exports.itemInstance_update_get = (req, res, next) => {
    async.parallel({
        items(callback) {
            Item.find()
            .sort({title: 1})
            .exec(callback);
        }, 
        colors(callback) {
            Color.find()
            .sort({title: 1})
            .exec(callback);
        },
        instance(callback) {
            ItemInstance.findById(req.params.id)
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.instance === null) {
            const err = new Error("Экземпляр не найден");
            err.status = 404;
            return next(err);
        }

        for (let item of results.items) {
            if (item._id.toString() === results.instance.item._id.toString()) {
                item.checked = true;
            }
        }

        for (let color of results.colors) {
            if (color._id.toString() === results.instance.color._id.toString()) {
                color.checked = true;
            }
        }

        res.render("instance_form", {
            title: "Изменение информации об экземпляре товара",
            instance: results.instance,
            items: results.items,
            colors: results.colors
        });
    });
};

// handle item instance update on POST
exports.itemInstance_update_post = [
    body("item", "Выберите товар")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("color", "Выберите цвет")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("status", "Выберите статус")
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(body);

        const instance = new ItemInstance({
            item: req.body.item,
            color: req.body.color,
            status: (req.body.status) ? "Not available" : "Available",
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            async.parallel({
                items(callback) {
                    Item.find()
                    .sort({title: 1})
                    .exec(callback);
                },
                colors(callback) {
                    Color.find()
                    .sort({title: 1})
                    .exec(callback);
                }
            },
            (err, results) => {
                if (err) {
                    return next(err);
                }
        
                res.render("instance_form", {
                    title: "Изменение информации об экземпляре товара",
                    items: results.items,
                    colors: results.colors
                });
            });
            return;
        }

        ItemInstance.findByIdAndUpdate(req.params.id, instance, {}, (err, theinstance) => {
            if (err) {
                return next(err);
            }
            res.redirect(theinstance.url);
        });
    }
]