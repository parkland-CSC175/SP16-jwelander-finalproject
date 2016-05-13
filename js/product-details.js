// https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function () {

    console.log("hello world");
    var urlSku = "";
    var detailUrlPrefix = "http://api.bestbuy.com/v1/products(sku=";
    var detailUrlPostfix = ")?format=json&apiKey=";
    var tempUrl = "https://welander.github.io/csc175data/bestbuy/products-list.json";
    var commentsUrlPrefix = "http://api.bestbuy.com/v1/reviews(sku=";
    var commentsUrlPostfix = ")?format=json&pageSize=4&apiKey=";
    var detailSku = document.location.search;
    detailSku = detailSku.substr(1, (detailSku.length) - 1);

    function ViewModel() {
        var self = this;
        var storedApiKey = localStorage.getItem("inputAPI");
        function init() {
            var detailUrl = (detailUrlPrefix + detailSku + detailUrlPostfix + storedApiKey);
            var commentsUrl = (commentsUrlPrefix + detailSku + commentsUrlPostfix + storedApiKey)
            $.getJSON(detailUrl, function (result) {
                var products = [];
                result.products.forEach(function (item) {
                    var product = new Detail(item);
                    products.push(product);
                });

                self.details(products);
            });

            $.getJSON(commentsUrl, function (commentsResult) {
                var remarks = [];
                commentsResult.reviews.forEach(function (item) {
                    var remark = new Comments(item);
                    remarks.push(remark);
                });
                self.comments(remarks);
            });
            self.formSku(detailSku);
        }
        self.details = ko.observableArray();
        self.comments = ko.observableArray();
        self.formSku = ko.observable();
        init();
    }
    //End of view model--------------------------
    function Comments(data) {
        var self = this;
        var calculateAge = function (aTimeStamp) {
            var nowDate = new Date();
            var postedDate = parseDate(aTimeStamp);
            return Math.round((nowDate - postedDate) / (1000 * 60 * 60 * 24));
        };
        var parseDate = function (aTimeStamp) {
            var dateOnly = aTimeStamp.substr(0, 10);
            var mdy = dateOnly.split('-');
            return new Date(mdy[0], mdy[1] - 1, mdy[2]);
        };
        this.comment = ko.observable();
        this.rating = ko.observable();
        this.submissionTime = ko.observable();
        this.daysOld = ko.observable();
        this.reviewerName = ko.observable();
        this.sku = ko.observable();

        if (data && data.comment) {
            self.comment(data.comment);
        }
        if (data && data.sku) {
            self.sku(data.sku);
        }
        if (data && data.rating) {
            self.rating(data.rating);
        }
        if (data && data.reviewer[0].name) {
            self.reviewerName(data.reviewer[0].name);
        } else {
            self.reviewerName("No name given");
        }
        if (data && data.submissionTime) {
            self.submissionTime(data.submissionTime);
            var ageInDays = calculateAge(self.submissionTime());
            self.daysOld(ageInDays);
        }
    }
    function Detail(data) {
        var self = this;
        this.manufacturer = ko.observable();
        this.name = ko.observable();
        this.sku = ko.observable();
        this.regularPrice = ko.observable();
        this.salePrice = ko.observable();
        this.customerReviewCount = ko.observable();
        this.customerReviewAverage = ko.observable();
        this.starsAverage = ko.observable();
        this.image = ko.observable();
        this.longDescription = ko.observable();
        this.showIt = ko.observable();

        self.showIt(true);

        if (data && data.sku) {
            self.sku(data.sku);
        }
        if (data && data.name) {
            self.name(data.name);
        }

        if (data && data.manufacturer) {
            self.manufacturer(data.manufacturer);
        }
        if (data && data.regularPrice) {
            self.regularPrice("$" + data.regularPrice);
        }
        if (data && data.salePrice) {
            self.salePrice(data.salePrice);
        }
        if (data && data.customerReviewAverage) {
            self.customerReviewAverage(data.customerReviewAverage + " Stars");
            self.starsAverage(data.customerReviewAverage);
        } else {
            self.customerReviewAverage("No Ratings");
            self.starsAverage("0.0");
        }
        if (data && data.customerReviewCount) {
            self.customerReviewCount(data.customerReviewCount);
        } else {
            self.customerReviewCount("0");
        }
        if (data && data.image) {
            self.image(data.image);
        }
        if (data && data.longDescription) {
            self.longDescription(data.longDescription);
        }
    }

    jQuery.validator.addMethod("isAlphabetic",
        function (value, element) {
            return /^[A-Za-z\d=#$%@_ -]+$/.test(value);
        },
        "Sorry, no special characters allowed"
    );
     jQuery.validator.addMethod("isOneToFive",
        function (value, element) {
            return /[1-5]/.test(value);
        },
        "Valid ratings are 1 - 5"
    );

    $("#comment-form").validate({
        rules: {
            "email": {
                required: true,
                email: true
            },
            "firstName": {
                required: true,
                isAlphabetic: true,
                minlength: 2
            },
            "lastName": {
                required: true,
                isAlphabetic: true,
                minlength: 2
            },
            "commentText": {
                required: true,
                minlength: 4
            },
            "rating": {
                required: true,
                maxlength: 1,
                isOneToFive: true
            }
        },
        messages: {
            "email": {
                required: "must enter an Email address",
                email: "Must enter a valid Email address"
            },
            "firstName": {
                required: "must enter your first name",
                isAlphabetic: "first Name must be alphabetic characters only",
                minlength: "first name must be at least 2 characters long"
            },
            "lastName": {
                required: "must enter your last name",
                isAlphabetic: "last Name must be alphabetic characters only",
                minlength: "last name must be at least 2 characters long"
            },
            "commentText": {
                required: "must enter some comment text before submitting",
                minlength: "comment must be at least 4 characters long"
            },
            "rating": {
                required: "must enter a rating before submitting",
                maxlength: "comment must be a single character, 1-5",
                isOneToFive: "Valid rating range is 1-5"
            }
        }

    });
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});