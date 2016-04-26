// https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function () {

    console.log("hello world");
    var productsUrlPrefix = "http://api.bestbuy.com/v1/products(bestSellingRank<=50000&(categoryPath.id=";
    var productsUrlPostfix = "))?sort=name.asc&show=name,regularPrice,sku,manufacturer,salePrice&format=json&apiKey=";
    var tempUrl = "https://parkland-csc175.github.io/csc175data/bestbuy/products-list.json";
    var productsUrlId = document.location.search;
    productsUrlId = productsUrlId.substr(1, (productsUrlId.length) - 1);
    function ViewModel() {
        var self = this;
        var storedApiKey = localStorage.getItem("inputAPI");
        function init() {
            var productsUrl = (productsUrlPrefix + productsUrlId + productsUrlPostfix + storedApiKey);
            $.getJSON(productsUrl, function (result) {
                var products = [];
                result.products.forEach(function (item) {
                    var product = new Product(item);
                    products.push(product);
                });

                self.products(products);
            });
        }

        self.products = ko.observableArray();

        init();
    }
    //End of view model--------------------------
    function Product(data) {
        var self = this;
        //  var detailsUrlBase = "file:///C:/GitHub/SP16-jwelander/final%20project/product-details.html"
        var detailsUrlBase = "http://parkland-csc175.github.io/SP16-jwelander-finalproject/product-details.html";

        this.manufacturer = ko.observable();
        this.name = ko.observable();
        this.sku = ko.observable();
        this.regularPrice = ko.observable();
        this.salePrice = ko.observable();
        this.linkUrl = ko.observable();

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
            self.regularPrice(data.regularPrice);
        }
        if (data && data.salePrice) {
            self.salePrice(data.salePrice);
        }
        self.linkUrl(detailsUrlBase + "?" + data.sku);
    }
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});