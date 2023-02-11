const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const async = require("async");

// display all categories
exports.category_list = (req, res) => {
    Category.find()
    .sort({title: 1})
    .exec(function(err, categories) {
        if (err) {
            return next(err);
        }

        res.render("category_list", {
            title: "Список категорий",
            categories
        });
    });

};

// display detail page for a specific category
exports.category_detail = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        category_items(callback) {
            Item.find({category: req.params.id}, "title price description").exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.category === null) {
            const err = new Error("Категория не найдена");
            err.status = 404;
            return next(err);
        }

        res.render("category_detail", {
            title: `Подробная информация о категории "${results.category.title}"`,
            category: results.category,
            category_items: results.category_items
        });
    });
};

// display category create form on GET
exports.category_create_get = (req, res) => {
    res.render("category_form", {
       title: "Создание новой категории", 
    });
};

// display category create form on POST
exports.category_create_post = [
    body("category_title").trim().isLength({min: 1}).escape()
        .withMessage("Введите название категории")
        .isAlphanumeric()
        .withMessage("Название категории должно содержать только алфавитно-цифровые символы"),
    body("category_description").trim().isLength({min: 1}).escape()
        .withMessage("Введите название категории"),
    
    (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Создание новой категории",
                category: req.body,
                errors: errors.array()
            });
        }

        const category = new Category({
            title: req.body.category_title,
            description: req.body.category_description
        });

        category.save((err) => {
            if (err) {
                return next(err);
            }

            res.redirect(category.url);
        });
    }
];

// display category delete form on GET
exports.category_delete_get = (req, res, next) => {
    async.parallel({
        items(callback) {
            Item.find({category: req.params.id}).exec(callback);
        },
        category(callback) {
            Category.findById(req.params.id).exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.category === null) {
            const err = new Error("Категория не найдена");
            err.status = 404;
            return next(err);
        }

        res.render("category_delete", {
            title: "Удаление категории",
            category: results.category,
            items: results.items
        });
    });
};

// handle category delete on POST
exports.category_delete_post = (req, res, next) => {
    async.parallel({
        category(callback) {
            Category.findById(req.body.categoryid).exec(callback);
        },
        items(callback) {
            Item.find({category: req.body.categoryid}).exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.items.length > 0) {
            res.render("category_delete", {
                title: "Удаление категории",
                category: results.category,
                items: results.items
            });
            return;
        }

        Category.findByIdAndRemove(req.body.categoryid, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/catalog/categories");
        });
    });
};

// display category update form on GET
exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            return next(err);
        }

        if (category === null) {
            const err = new Error("Категория не найдена");
            err.status = 404;
            return next(err);
        }

        res.render("category_form", {
            title: "Изменение информации о категории",
            category
        });
    });
};

// handle category update on POST
exports.category_update_post = [
    body("category_title").trim().isLength({min: 1}).escape()
        .withMessage("Введите название категории")
        .isAlphanumeric()
        .withMessage("Название категории должно содержать только алфавитно-цифровые символы"),
    body("category_description").trim().isLength({min: 1}).escape()
        .withMessage("Введите название категории"),

        (req, res, next) => {
            const errors = validationResult(body);
            
            const category = new Category({
                title: req.body.category_title,
                description: req.body.category_description,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Изменение информации о категории",
                category,
                errors: errors.array()
            });
        }


        Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
            if (err) {
                return next(err);
            }

            res.redirect(thecategory.url);
        });
    }
];