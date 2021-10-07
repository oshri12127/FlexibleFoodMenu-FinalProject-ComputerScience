selectRestaurant = localStorage.getItem('selectRestaurant');

$(document).ready(function () {
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').child(selectRestaurant).once('value', function (snap) { //once - only for one time connected
        snap.forEach(function (item) {
            var itemVal = item.val();
            document.getElementById('PicRestPreview').style.backgroundImage = 'url(' + itemVal.picUrl + ')';
            document.getElementById('NameRestPreview').innerHTML = itemVal.Name;
            var target = document.querySelector(".products-row");
            var front; var i = 0;
            document.getElementById("products-row").innerHTML = "";
            itemVal.Dishes.forEach(function (dish) {
                var imagedish = "/images/default_dish.jpg";
                if (dish.imageUrl != "")
                    imagedish = dish.imageUrl;
                if (i % 2 == 0) {
                    front = "<div class=\"front\"><img src=\"" + imagedish + "\" class=\"img-responsive\" alt=\"img\">" +
                        "<div class=\"agile-product-text\"><h5>" + dish.name + "</h5>" +
                        "</div></div>";
                }
                else {
                    front = "<div class=\"front\">" +
                        "<div class=\"agile-product-text agile-product-text2\"><h5>" + dish.name + "</h5>" +
                        "</div><img src=\"" + imagedish + "\" class=\"img-responsive\" alt=\"img\"></div>";
                }
                i++;
                target.insertAdjacentHTML("beforeend", "<div class=\"col-xs-6 col-sm-3 col-md-3 col-lg-3  product-grids\">" +
                    "<div id=\""+dish.name+"\" class=\"flip-container\" style=\"cursor: pointer;\" onclick=\"AddModelDish(this.id)\" data-toggle=\"modal\" data-target=\"#myModal1\">" +
                    "<div class=\"flipper agile-products\">" +
                    front +
                    "<div class=\"back\"><h4>" + dish.name + "</h4><p>" + dish.dishDescription + "</p><h6>" + dish.dishPrice + "<sup><i class=\"fa fa-shekel\"></i></sup></h6>" +
                    //"<form id="+item.key+" action=\"/restaurantPage.html\" method=\"GET\">"+
                    //"<input type=\"hidden\" id=\"Restaurant_Name\" name=\"Restaurant_Name\" value="+ itemVal.RestInfo.Name +">"+
                    //"<button id="+item.key+" name="+itemVal.RestInfo.Name+" class=\"w3ls-cart pw3ls-cart\" onclick=\"EnterRest(this.id,this.name)\">Enter</button>"+
                   // "</form>"+
                   //"<a href=\"#\" id=\""+dish.name+"\" data-toggle=\"modal\" onclick=\"AddModelDish(this.id)\" data-target=\"#myModal1\">More</a>"+
                    "<div class=\"clearfix\"> </div>" +
                    "</div></div></div></div>");

            });
        });
    });
});
function AddModelDish(NameDish) {
    document.getElementById('ModelNameDish').innerHTML = NameDish;
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').child(selectRestaurant).once('value', function (snap) { //once - only for one time connected
        snap.forEach(function (item) {
            var itemVal = item.val();
            itemVal.Dishes.forEach(function (dish) {
                if (dish.name == NameDish) {
                    document.getElementById('model_img-responsive').src = dish.imageUrl;
                    document.getElementById('ModelPrice').innerHTML = dish.dishPrice;
                    document.getElementById('modelDescription').innerHTML = dish.dishDescription;
                    document.getElementById('nameToCart').value = NameDish;
                    document.getElementById('priceToCart').value = dish.dishPrice;                }
            });
        });
    });
}