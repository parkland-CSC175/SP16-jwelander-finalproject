// https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function () {

    console.log("hello world");
    var productsUrlPrefix = "http://api.bestbuy.com/v1/products(bestSellingRank<=50000&(categoryPath.id=";
    var productsUrlPostfix = "))?sort=name.asc&show=name,regularPrice,sku,manufacturer,salePrice&format=json&apiKey=";
    var tempUrl = "https://parkland-csc175.github.io/csc175data/bestbuy/products-list.json";
    var pageSize = 15;
    var page = 1;
    var pageSizeUrl = "&pageSize=";
    var pageUrl = "&page=";
    var productsUrlId = document.location.search;
    productsUrlId = productsUrlId.substr(1, (productsUrlId.length) - 1);
    function ViewModel() {
        var self = this;
        self.currentPage = ko.observable();
        var storedApiKey = localStorage.getItem("inputAPI");
        function init() {
            var productsUrl = (productsUrlPrefix + productsUrlId + productsUrlPostfix + storedApiKey + pageSizeUrl + pageSize + pageUrl + page);
            $.getJSON(productsUrl, function (result) {
                var products = [];
                result.products.forEach(function (item) {
                    var product = new Product(item);
                    products.push(product);
                });
                self.currentPage(page);
                self.products(products);
            });
        }
        self.incrementPage = function (activePage) {
            console.log("In incr " + self.totalPages());
            if ((self.currentPage() + 1) <= self.totalPages()){
                self.currentPage(self(currentPage() + 1));
                console.log(self.currentPage());
            }
            
        };
        self.decrementPage = function (activePage) {
            console.log("In decr " + activePage);
        };
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
        this.totalPages = ko.observable();
        this.totalPagesText = ko.observable();
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
        if (data && data.totalPages) {
            self.totalPages(data.totalPages);
            self.totalPagesText(" (" + self.totalPages() + " pages total)" );
        }
        self.linkUrl(detailsUrlBase + "?" + data.sku);
    }
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});