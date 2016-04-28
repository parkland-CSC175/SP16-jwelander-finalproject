// https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function () {

    console.log("hello world");
    var urlSku = "";
    var detailUrlPrefix = "http://api.bestbuy.com/v1/products(sku=";
    var detailUrlPostfix = ")?format=json&apiKey=";
    var tempUrl = "https://parkland-csc175.github.io/csc175data/bestbuy/products-list.json";
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
                console.log(remarks);
            });
        }
        self.details = ko.observableArray();
        self.comments = ko.observableArray();
        init();
    }
    //End of view model--------------------------
    function Comments(data) {
        var self = this;
        console.log(self);
        this.comment = ko.observable();
        this.rating = ko.observable();
        this.submissionTime = ko.observable();
        this.daysOld = ko.observable();

        if (data && data.comment) {
            self.comment(data.comment);
        }
        if (data && data.rating) {
            self.rating(data.rating);
        }
        if (data && data.submissionTime) {
            self.submissionTime(data.submissionTime);
            //       self.daysOld(function () {
            //         return 999;
            //   });
            self.daysOld(999);
        }
        console.log(self);
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
            console.log(data.name);
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
        console.log(self);
    }
    var viewModel = new ViewModel();
    console.log(viewModel);
    ko.applyBindings(viewModel);
});