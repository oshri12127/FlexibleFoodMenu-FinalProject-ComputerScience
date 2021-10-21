selectRestaurant = localStorage.getItem('selectRestaurant');

$(document).ready(function () {
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').child(selectRestaurant).once('value', async function (snap) { //once - only for one time connected
        await snap.forEach(function (item) {
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
                target.insertAdjacentHTML("beforeend", "<div class=\"col-xs-6 col-sm-3 col-md-3 col-lg-3  product-grids "+ dish.dishType +" hide\">" +
                    "<div id=\"" + dish.name + "\" class=\"flip-container\" style=\"cursor: pointer;\" onclick=\"AddModelDish(this.id)\" data-toggle=\"modal\" data-target=\"#myModal1\">" +
                    "<div class=\"flipper agile-products\">" +
                    front +
                    "<div class=\"back\"><h4>" + dish.name + "</h4><p>" + dish.dishDescription + "</p><h6>" + dish.dishPrice + "<sup><i class=\"fa fa-shekel\"></i></sup></h6>" +
                    "<div class=\"clearfix\"> </div>" +
                    "</div></div></div></div>");

            });
        });
       filterSelection("all"); 
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
          if (dish.imageUrl != "") {
            document.getElementById('model_img-responsive').src = dish.imageUrl;
          }
          document.getElementById('ModelPrice').innerHTML = dish.dishPrice;
          document.getElementById('modelDescription').innerHTML = dish.dishDescription;
          document.getElementById('nameToCart').value = NameDish;
          document.getElementById('priceToCart').value = dish.dishPrice;
          document.getElementById('FullLocation').value = itemVal.Location.address;
          const city = itemVal.Location.address.split(",");
          document.getElementById('name+location').value = itemVal.Name + " - " + city[1];
          document.getElementById('inputSpinnerAmountCart').value = 1;
        }
      });
    });
  });
}
var flagFilterResultDiv;
function filterSelection(c) {
  var x, i;
  document.getElementById("FilterResultDiv").style.display = 'none';
  x = document.getElementsByClassName("col-xs-6 col-sm-3 col-md-3 col-lg-3  product-grids");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    flagFilterResultDiv=0;
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
  if(flagFilterResultDiv==0)
  {
    document.getElementById("FilterResultDiv").style.display = 'block';
    document.getElementById("FilterResult").innerHTML = "There are no "+c+" types in this restaurant.";
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  flagFilterResultDiv=1;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}