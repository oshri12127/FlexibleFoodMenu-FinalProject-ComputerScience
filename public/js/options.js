$(document).ready(function () //edit the data that user added/
{
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get('Search');
    SearchRestResult(result);
});

function SearchRestResult(loctionSearch) {
    document.getElementById("products-row").innerHTML = "";
    var target = document.querySelector(".products-row");
    var front; var i = 0;
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').once('value', function (snap) { //once - only for one time connected
        snap.forEach(function (item) {
            var itemVal = item.val();
            const city = itemVal.RestInfo.Location.address.split(",");
            if (city[1].includes(loctionSearch))
            {
                var imageRest = "/images/default_dish.jpg";
                if (itemVal.RestInfo.picUrl != "")
                    imageRest = itemVal.RestInfo.picUrl;
                if (i % 2 == 0) {
                    front = "<div class=\"front\"><img src=\"" + imageRest + "\" class=\"img-responsive\" alt=\"img\">" +
                        "<div class=\"agile-product-text\"><h5>" + itemVal.RestInfo.Name + "</h5>" +
                        "</div></div>";
                }
                else {
                    front = "<div class=\"front\">" +
                        "<div class=\"agile-product-text agile-product-text2\"><h5>" + itemVal.RestInfo.Name + "</h5>" +
                        "</div><img src=\"" + imageRest + "\" class=\"img-responsive\" alt=\"img\"></div>";
                }
                i++;
                target.insertAdjacentHTML("beforeend", "<div class=\"col-xs-6 col-sm-3 col-md-3 col-lg-3 product-grids\">" +
                
                    "<div id="+item.key+" class=\"flip-container\" style=\"cursor: pointer;\" onclick=\"EnterRest(this.id)\">" +
                    "<div class=\"flipper agile-products\">" +
                    front +
                    "<div class=\"back\"><h4>" + itemVal.RestInfo.Name + "</h4><p>" + itemVal.RestInfo.Description + "</p><h4>" + itemVal.RestInfo.Type + "</h4>" +
                    //"<form id="+item.key+" action=\"/restaurantPage.html\" method=\"GET\">"+
                    //"<input type=\"hidden\" id=\"Restaurant_Name\" name=\"Restaurant_Name\" value="+ itemVal.RestInfo.Name +">"+
                    //"<button id="+item.key+" name="+itemVal.RestInfo.Name+" class=\"w3ls-cart pw3ls-cart\" onclick=\"EnterRest(this.id,this.name)\">Enter</button>"+
                   //"<button id="+item.key+" type=\"submit\">Submit</button>"+
                   // "</form>"+
                    "</div></div></div></div>");
            }
        });
    });
}
function EnterRest(click_id) 
{
    console.log(click_id);
    localStorage.setItem('selectRestaurant', click_id);
    window.location.href = 'restaurantPage.html';
}


/*var form = document.createElement("form");
    var element1 = document.createElement("input");  

    form.method = "GET";
    form.action = "/restaurantPage.html";   

    element1.value=click_id;
    element1.name="click_id";
    form.appendChild(element1);  

    document.body.appendChild(form);

    form.submit();*/