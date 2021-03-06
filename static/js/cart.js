var CartViewModel = function() {
    var self = this;
    this.cartAmount = ko.observable(0)
    this.products = ko.observableArray()
    this.notFoundProducts = ko.observable()
    this.isLoading = ko.observable(true)

    this.formatCommerceId = function(id){
        return "Commerce ID: " + id
    }

    this.formatProductId = function(id){
        return "Product ID: " + id
    }

    this.formatCurrency = function(value){
        return "R$ " + value
    }
    
    this.formatTotalCurrency = function(value){
        return "Total R$ " + value
    }
    
    this.todo = function() {
        alert("TODO");
    };

    this.removeItem = function(item){
        self.isLoading(true);

        $.ajax({
            url: "https://shopping-cart-api-mcf.herokuapp.com/shoppingcart/items/" + item.id,
            type: "DELETE", // <- Change here
            contentType: "application/json",xhrFields: {
                withCredentials: true
             },
            success: function(resp) {
                self.isLoading(false);
                if(resp.error)
                    alert('Product not removed')
                else{
                    self.refresh();
                }  
            }
        })

        
    }

    
    this.refresh = function() {
        this.isLoading(true);
        $.ajax({
            url: "https://shopping-cart-api-mcf.herokuapp.com/shoppingcart",
            xhrFields: {
               withCredentials: true
            }
         }).done(function(resp){
            self.isLoading(false);
            resp = JSON.parse(resp);
            if(resp.items != null && resp.items.length > 0){
                self.cartAmount(resp.amount)
                self.products(resp.items)
            }else{
                self.products([])     
                self.cartAmount(0)           
                self.notFoundProducts(true)
            }
         });

    }
 
    this.refresh();
};

function formatCurrency(value) {
    return "R$ " + value.toFixed(2);
}
 
$(function() {    
    var viewModel = new CartViewModel();
 
    ko.applyBindings(viewModel);
});