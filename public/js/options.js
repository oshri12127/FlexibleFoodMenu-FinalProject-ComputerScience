$(document).ready(function () //edit the data that user added/
{
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get('Search');
    document.getElementById("RecommendedAreas").value=null;
    if (result != null) {
        document.getElementById("Search").setAttribute('value', result);
        //document.getElementById("Search").value=result;
        SearchRestResult(result);
    }
    else {
        document.getElementById("Search").value=null;
        document.getElementById("SearchResultDiv").style.display = 'block';
        document.getElementById("SearchResult").innerHTML = "Enter your area name in search box.";
    }
});

async function SearchRestResult(loctionSearch) {
    document.getElementById("products-row").innerHTML = "";
    document.getElementById("SearchResultDiv").style.display = 'none';
    document.getElementById("SearchRadiusDiv").style.display = 'none';
    var target = document.querySelector(".products-row");
    var front; var i = 0;
    var datesRef = firebase.database().ref();
    await datesRef.child('Restaurants').once('value', async function (snap) { //once - only for one time connected
        await snap.forEach(function (item) {
            var itemVal = item.val();
            const city = itemVal.RestInfo.Location.address.split(",");
            if (city[1].includes(loctionSearch)&&loctionSearch!="") {
                var response = IsInsideRadius(itemVal.RestInfo.Location.address);
                response.then(function (result) {
                    if (w3ls.cart.items(0) == null || result == true) {
                        i++;
                        var imageRest = "/images/restaurant_default.jpg";
                        if (itemVal.RestInfo.picUrl != "")
                            imageRest = itemVal.RestInfo.picUrl;
                        var Kosher="";
                        if(itemVal.RestInfo.Kosher == 1)
                            Kosher="kosher";    
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

                        target.insertAdjacentHTML("beforeend", "<div class=\"col-xs-6 col-sm-4 col-md-4 col-lg-4 product-grids " + itemVal.RestInfo.Type + Kosher + " hide\">" +

                            "<div id=" + item.key + " class=\"flip-container\" style=\"cursor: pointer;\" onclick=\"EnterSelsectRestaurant(this.id)\">" +
                            "<div class=\"flipper agile-products\">" +
                            front +
                            "<div class=\"back\"><h4><strong>" + itemVal.RestInfo.Name + "</strong></h4><p>" + itemVal.RestInfo.Description + "</p><h9 style=\"font-size: 15px;color: whitesmoke;\">" + itemVal.RestInfo.Type + "</h9><p></p><span style=\"font-size: 15px;color: whitesmoke;\">" + itemVal.RestInfo.Location.address + "</span>" +
                            "</div></div></div></div>");
                    }
                });
            }
        });
    });
    await sleep(1000);
    filterSelection("all");
    if (i == 0) {
        document.getElementById("SearchResultDiv").style.display = 'block';
        document.getElementById("SearchResult").innerHTML = "no result,try search again.";
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function EnterSelsectRestaurant(click_id) {
    localStorage.setItem('selectRestaurant', click_id);
    window.location.href = 'restaurantPage';
}
const RADIUS = 2.0;
async function IsInsideRadius(addressTarget) {
    var length;
    if (w3ls.cart.items(0) != null) {
        var addressSource = w3ls.cart.items(0)._data.location;
        document.getElementById("SearchRadiusDiv").style.display = 'block';
        document.getElementById("SearchRadius").innerHTML = "Your cart is not empty so you are searching in a radius of " + addressSource + " .";
        length = await CalculatDistanceBetween2Addresses(addressSource, addressTarget);
        if (length <= RADIUS)
            return true;
    }
    return false;
}
async function CalculatDistanceBetween2Addresses(addressSource, addressTarget) {
    var lengthReturn;
    var data = {
        "routing_type": govmap.routing_type.routing,
        "adresses": [addressSource, addressTarget],
        "costing": govmap.costing.auto
    };
    await govmap.getRoutingData(data).then(function (response) {//use algorithm
        lengthReturn = response.trip.summary.length;
    });
    return lengthReturn;
}

var flagFilterResultDiv;
var saveC;
function filterSelection(c) {
    var x, i, arrHtmlElement = [];
    x = document.getElementsByClassName("col-xs-6 col-sm-4 col-md-4 col-lg-4 product-grids");
    if (c == "kosher") {
        for (let index = 0; index < x.length; index++) {
            if ($(x[index]).is(":visible")) {
                arrHtmlElement.push(x[index]);
            }
        }
        x = arrHtmlElement;
    }
    else if (c == "not_kosher") {
        c = saveC;
    }
    else {
        saveC = c;
    }
    if (document.getElementById("SearchResult").innerHTML != "no result,try search again." && document.getElementById("SearchResult").innerHTML != "Enter your area name in search box.") {
        document.getElementById("SearchResultDiv").style.display = 'none';
        flagFilterResultDiv = 1;
    } flagFilterResultDiv = 0;
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");

        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
    if (flagFilterResultDiv == 0) {
        document.getElementById("SearchResultDiv").style.display = 'block';
        document.getElementById("SearchResult").innerHTML = "There are no " + c + " restaurants in this area.";
    }
    if (c != "kosher" && document.getElementById('KosherCheck').checked) {
        filterSelection("kosher");
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    flagFilterResultDiv = 1;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) { element.className += " " + arr2[i]; }
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

$("#KosherCheck").change(function() {
    if(this.checked) {
        filterSelection("kosher");
    }
    else
    {
        filterSelection("not_kosher");
    }
});
$('#RecommendedAreas').on('change', function () 
{
    document.getElementById("Search").value=document.getElementById("RecommendedAreas").value;
    document.getElementById('formSearch').submit();
    
});