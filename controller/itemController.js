const Item = require("../models/item");
const ItemInstance = require("../models/itemInstance");
const Category = require("../models/category");
const Color = require("../models/color");

const { body, validationResult } = require('express-validator');
const async = require("async");


// Site Home Page 
exports.index = (req, res) => {
    async.parallel({
        item_count(callback) {
            Item.countDocuments({}, callback);
        },
        item_instance_count(callback) {
            ItemInstance.countDocuments({}, callback);
        },
        item_instance_available_count(callback) {
            ItemInstance.countDocuments({status: "Available"}, callback);
        },
        category_count(callback) {
            Category.countDocuments({}, callback);
        },
        color_count(callback) {
            Color.countDocuments({}, callback);
        }
    },
    (err, results) => {
        res.render("index", {
            title: "Irina Shop HomePage",
            error: err,
            data: results
        });
    });
};

// display all items
exports.item_list = (req, res) => {
    Item.find({}, )
    .sort({title: 1})
    .populate("category")
    .exec(function(err, item_list) {
        if (err) {
            return next(err);
        }

        res.render("item_list", {title: "Список всех товаров", item_list});
    });
};

// display detail page for a specific item
exports.item_detail = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id)
            .populate("category")
            .exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.params.id})
            .populate("item")
            .populate("color")
            .exec(callback);
        }
    },
    function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.item == null) {
            const err = new Error("Товар не найден");
            err.status = 404;
            return next(err);
        }
        res.render("item_detail", {
            title: `Подробная информация о товаре "${results.item.title}"`,
            item: results.item,
            colors: Object.values(results.item_instances).map(instance => instance.color.title),
            item_instances: results.item_instances
        });
    });
};

// display item create form on GET
exports.item_create_get = (req, res, next) => {
    async.parallel({
        categories(callback) {
            Category.find(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        res.render("item_form", {
            title: "Создание нового товара",
            categories: results.categories
        });
    });
};

// display item create form on POST
exports.item_create_post = [
    body("title", "Введите название")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("category", "Выберите категорию")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description", "Введите описание товара (мин. 7 символов)")
        .trim()
        .isLength({min: 7})
        .escape(),
    body("price", "Введите цену товара")
        .trim()
        .isLength({min: 1})
        .escape()
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(body);

        const item = new Item({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
        });

        if (!errors.isEmpty()) {
            async.parallel({
                categories(callback) {
                    Category.find(callback);
                }
            },
            (err, results) => {
                if (err) {
                    return next(err);
                }
        
                res.render("item_form", {
                    title: "Создайте новый товар",
                    categories: results.categories,
                    item,
                    errors: errors.array()
                });
            });
            return;
        }

        // нет ошибок, тогда сохраняем новый товар
        item.save((err) => {
            if (err) {
                return next(err);
            }

            res.redirect(item.url);
        });
    }
];

// display item delete form on GET
exports.item_delete_get = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id)
            .populate("category")
            .exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.params.id})
            .populate("item")
            .populate("color")
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.item === null) {
            res.redirect("/catalog/items");
        }

        res.render("item_delete", {
            title: "Удаление товара",
            item: results.item,
            item_instances: results.item_instances
        });
    });
};

// handle item delete on POST
exports.item_delete_post = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id)
            .populate("category")
            .exec(callback);
        },
        item_instances(callback) {
            ItemInstance.find({item: req.params.id})
            .populate("item")
            .populate("color")
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        // если у товара есть экземпляры, тогда не позволяю удалить и возвращаю на GET страницу удаления
        if (results.item_instances.length > 0) {
            res.render("item_delete", {
                title: "Удаление товара",
                item: results.item,
                item_instances: results.item_instances
            });
            return;
        }

        // если экземпляров нет, удаляю
        Item.findByIdAndRemove(req.body.itemid, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/catalog/items");
        });
    });
};

// display item update form on GET
exports.item_update_get = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id)
            .populate("category")
            .exec(callback);
        },
        categories(callback) {
            Category.find(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.item === null) {
            const err = new Error("Товар не найден!")
            err.status = 404;
            return next(err);
        }

        for (let category of results.categories) {
            if (category._id.toString() === results.item.category._id.toString()) {
                category.checked = true;
            }
        }

        res.render("item_form", {
            title: "Изменение данных о товаре",
            item: results.item,
            categories: results.categories
        });
    });
};

// handle item update on POST
exports.item_update_post = [
    body("title", "Введите название")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("category", "Выберите категорию")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description", "Введите описание товара (мин. 7 символов)")
        .trim()
        .isLength({min: 7})
        .escape(),
    body("price", "Введите цену товара")
        .trim()
        .isLength({min: 1})
        .escape()
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(body);

        const item = new Item({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            _id: req.params.id //This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            async.parallel({
                categories(callback) {
                    Category.find(callback);
                }
            },
            (err, results) => {
                if (err) {
                    return next(err);
                }
        
                res.render("item_form", {
                    title: "Изменение данных о товаре",
                    categories: results.categories,
                    item,
                    errors: errors.array()
                });
            });
            return;
        }

        Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
            if (err) {
                return next(err);
            }
            res.redirect(theitem.url);
        });
    }
];