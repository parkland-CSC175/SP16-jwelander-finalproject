// https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function () {

    console.log("hello categories");

    function ViewModel() {
        var self = this;
        var storedApiKey = null;
        self.displayKey = ko.observable();
        function init() {
            var storedApiKey = localStorage.getItem("inputAPI");
            var urlPrefix = "http://api.bestbuy.com/v1/categories";
            var urlPostfix = "?pageSize=20&format=json&apiKey=";
            var idSelectors = "(id=\"pcmcat209400050001\"|id=\"abcat0501000\"|id=\"abcat0401000\"|id=\"pcmcat242800050021\"|id=\"abcat0204000\"|id=\"pcmcat241600050001\"|id=\"pcmcat254000050002\"|id=\"pcmcat209000050006\"|id=\"abcat0502000\"|id=\"pcmcat232900050000\"|id=\"pcmcat295700050012\"|id=\"pcmcat310200050004\"|id=\"pcmcat243400050029\"|id=\"abcat0904000\"|id=\"abcat0901000\"|id=\"abcat0912000\"|id=\"abcat0101000\"|id=\"abcat0910000\"|id=\"pcmcat273800050036\"|id=\"pcmcat300300050002\")";
            var catsUrl = (urlPrefix + idSelectors + urlPostfix + storedApiKey);
            var url = "https://parkland-csc175.github.io/csc175data/bestbuy/categories-list.json"
            $.get(catsUrl, function (result) {
                var categories = [];
                result.categories.forEach(function (item) {
                    var category = new Category(item);
                    categories.push(category);
                });

                self.categories(categories);
            });
        }

        self.categories = ko.observableArray();
        self.setAPI = function (enteredAPI) {
            localStorage.setItem("inputAPI", $("#usersAPI").val());
            init();
        };
        var storedApiKey = localStorage.getItem("inputAPI");
        self.displayKey(storedApiKey);
        console.log(storedApiKey);
        if (storedApiKey !== null) {
            init();
        }
        //   init();
    }
    //------------------End of View Model---------------------------

    function Category(data) {
        var self = this;
        var productsUrlBase = "http://parkland-csc175.github.io/SP16-jwelander-finalproject/products-list.html"

        this.id = ko.observable();
        this.name = ko.observable();
        this.linkUrl = ko.observable();

        if (data && data.id) {
            self.id(data.id);
        }

        if (data && data.name) {
            self.name(data.name);
        }
        self.linkUrl(productsUrlBase + "?" + data.id);
    }

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});