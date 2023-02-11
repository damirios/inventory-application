const Color = require("../models/color");
const ItemInstances = require("../models/itemInstance");

const async = require("async");
const { body, validationResult } = require("express-validator");

// display all categories
exports.color_list = (req, res, next) => {
    Color.find()
    .sort({title: 1})
    .exec((err, colors) => {
        if (err) {
            return next(err);
        }

        res.render("color_list", {title: "Список цветов", colors});
    });
};

// display color create form on GET
exports.color_create_get = (req, res) => {
    res.render("color_form", {title: "Создание нового цвета"});
};

// display color create form on POST
exports.color_create_post = [
    body("title").trim().isLength({min: 1}).escape()
        .withMessage("Введите название цвета"),
    
    (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            res.render("color_form", {
                title: "Создание нового цвета",
                color: req.body,
                errors: errors.array()
            });
        }

        const color = new Color({
            title: req.body.color_title
        });

        color.save(err => {
            if (err) {
                return next(err);
            }

            res.redirect("/catalog/colors");
        });
    }
];

// display color delete form on GET
exports.color_delete_get = (req, res, next) => {
    async.parallel({
        color(callback) {
            Color.findById(req.params.id).exec(callback);
        },
        instances(callback) {
            ItemInstances.find({color: req.params.id})
            .populate("item")
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.color === null) {
            const err = new Error("Цвет не найден");
            err.status = 404;
            return next(err);
        }

        res.render("color_delete", {
            title: "Удаление цвета",
            color: results.color,
            instances: results.instances
        });
    });
};

// handle color delete on POST
exports.color_delete_post = (req, res, next) => {
    async.parallel({
        color(callback) {
            Color.findById(req.body.colorid).exec(callback);
        },
        instances(callback) {
            ItemInstances.find({color: req.body.colorid})
            .populate("item")
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.color === null) {
            const err = new Error("Цвет не найден");
            err.status = 404;
            return next(err);
        }

        if (results.instances.length > 0) {
            res.render("color_delete", {
                title: "Удаление цвета",
                color: results.color,
                instances: results.instances
            });
            return;
        }

        Color.findByIdAndDelete(req.body.colorid, (err) => {
            if (err) {
                return next(err);
            }

            res.redirect("/catalog/colors");
        });
    });
};

// display color update form on GET
exports.color_update_get = (req, res, next) => {
    Color.findById(req.params.id, (err, color) => {
        if (err) {
            return next(err);
        }

        if (color === null) {
            const err = new Error("Цвет не найден");
            err.status = 404;
            return next(err);
        }

        res.render("color_form", {
            title: "Изменение информации о цвете",
            color
        });
    });
};

// handle color update on POST
exports.color_update_post = [
    body("title").trim().isLength({min: 1}).escape()
        .withMessage("Введите название цвета"),
    
    (req, res, next) => {
        const errors = validationResult(body);

        const color = new Color({
            title: req.body.color_title,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render("color_form", {
                title: "Изменение информации о цвете",
                color,
                errors: errors.array()
            });
        }

        Color.findByIdAndUpdate(req.params.id, color, {}, (err, thecolor) => {
            if (err) {
                return next(err);
            }

            res.redirect("/catalog/colors");
        });
    }
];