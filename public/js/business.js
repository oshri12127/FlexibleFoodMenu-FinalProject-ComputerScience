// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

/////////////////////////////////////////////////
//const EditArr = [];
//const restaurantsArr = [];
var DishesArr = [];
var imageURL;
$(document).ready(function () //edit the data that user added/
{
  firebase.auth().onAuthStateChanged(function (user) {
    userNow2 = user.uid;
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').child(userNow2).once('value', function (snap) { //once - only for one time connected
      snap.forEach(function (item) {
        var itemVal = item.val();
        //EditArr.push(itemVal);
        //console.log(EditArr);
        if (itemVal != null) {
          document.getElementById('divImageMedia').src = itemVal.picUrl;
          document.getElementById('divImageMedia').value = itemVal.picUrl;
          if (document.getElementById('divImageMedia').value != "")
            document.getElementById('pic-form-edit').style.display = 'block';
          document.getElementById('name').value = itemVal.Name;
          document.getElementById('description').innerHTML = itemVal.Description;
          document.getElementById('restaurantType').value = itemVal.Type;
          if (itemVal.Kosher == 1)
            document.getElementById('kosher').checked = true;
          if (itemVal.Dishes != "") {
            itemVal.Dishes.forEach(function (dish) {
              DishesArr.push(dish);
            });
            DishOptionRefresh();
          }
        }
      });
    });
  });
});

function UplodeImage(file) {
  const ref = firebase.storage().ref();
  const fname = (+new Date()) + '-' + file.name;
  const metadata = {
    contentType: file.type
  };
  const task = ref.child(fname).put(file, metadata);
  task.then(snapshot => snapshot.ref.getDownloadURL())
    .then((url) => {
      imageURL = url;
    })
    .catch(console.error);
}

function DishOptionRefresh() 
{
  document.getElementById('DishOption').length = 1;
  const selectS = document.getElementById('DishOption');
        for (let i = 0; i < DishesArr.length; i++) {
          const opt = DishesArr[i].name;
          const el = document.createElement('option');
          el.textContent = opt;
          el.value = DishesArr[i].name;
          selectS.appendChild(el);
        }
}

$('#DishOption').on('change', function () {
  dish_op = $(this).val();
  document.getElementById('dishPic-form-edit').style.display = 'none';
  if (dish_op == 'Add new dish') {
    $('#dishName').val('');
    $('#dishPic').val('');
    $('#dishType').val('');
    $('#dishPrice').val('');
    $('#dishDescription').val('');
  }
  for (let i = 0; i < DishesArr.length; i++) {
    if (dish_op == DishesArr[i].name) {
      $('#dishName').val(DishesArr[i].name);
      document.getElementById('divDishImageMedia').src = DishesArr[i].imageUrl;
      document.getElementById('divDishImageMedia').value = DishesArr[i].imageUrl;
      if(document.getElementById('divDishImageMedia').value!="")
            document.getElementById('dishPic-form-edit').style.display = 'block';
      $('#dishType').val(DishesArr[i].dishType);
      $('#dishPrice').val(DishesArr[i].dishPrice);
      $('#dishDescription').val(DishesArr[i].dishDescription);
    }
  }
});

function checkIsDishExists(name)
{
  for (let i = 0; i < DishesArr.length; i++) {
    if(DishesArr[i].name==name)
      return i;
  }
  return -1;
}

async function AddDish(e) {
  const name = document.getElementById('dishName').value;
  const dishImageFile = document.querySelector('#dishPic').files[0];
  const type = document.getElementById('dishType').value;
  const dishPrice = document.getElementById('dishPrice').value;
  const dishDescription = document.getElementById('dishDescription').value;
  if ((name.trim() != "") && (type != "") && (dishPrice != ""||dishPrice>=0) && (dishDescription.trim() != "")) {
    if (dishImageFile != null) {
      UplodeImage(dishImageFile);
      await sleep(3000);
    }
    else {
      imageURL = "";
      if (document.getElementById('divDishImageMedia').value != "")
        imageURL = document.getElementById('divDishImageMedia').src;
    }
    let dish =
    {
      "name": name,
      "imageUrl": imageURL,
      "dishType": type,
      "dishPrice": dishPrice,
      "dishDescription": dishDescription
    }
    if (checkIsDishExists(name) != -1) {
      DishesArr.splice(checkIsDishExists(name), 1);
    }
    DishesArr.push(dish);
    alert('Dish Saved!');
    document.getElementById('DishOption').value = "Add new dish";
    document.getElementById('dishPic-form-edit').style.display = 'none';
    document.getElementById('dishName').value = null;
    document.getElementById('dishPic').value = null;
    document.getElementById('dishType').value = null;
    document.getElementById('dishPrice').value = null;
    document.getElementById('dishDescription').value = null;
    DishOptionRefresh();
    //console.log(DishesArr);
  }
  else {
    if (name.trim() == "")
      alert('Please enter name');
    if (type == "")
      alert('Please choose type');
    if (dishPrice == ""||dishPrice <= 0)
      alert('Please enter price');
    if (dishDescription.trim() == "")
      alert('Please enter description');
  }
}

async function UpdateAll(e) {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const LogoRestPic = document.querySelector('#LogoRestPic').files[0];
  //const loc = document.getElementById('pac-input').value;
  const restaurantType = document.getElementById('restaurantType').value;
  kosher = 0;//0=False
  if (document.getElementById('kosher').checked) { kosher = 1; }//1=True
  if (name.trim() != "" && description.trim() != "") {

    if (LogoRestPic != null) {
      UplodeImage(LogoRestPic);
      await sleep(3000);
    }
    else {
      imageURL = "";
      if (document.getElementById('divImageMedia').value != "")
        imageURL = document.getElementById('divImageMedia').src;
    }
    if(DishesArr.length==0)
      DishesArr="";
    console.log(DishesArr);
    await sleep(3000);  
    firebase.auth().onAuthStateChanged(function (user) {
      userNow2 = user.uid;
      var datesRef = firebase.database().ref();
      datesRef.child('Restaurants').child(userNow2).child('RestInfo').set({
        Name: name,
        picUrl: imageURL,
        Description: description,
        //Location: loc,
        Type: restaurantType,
        Kosher: kosher,
        Dishes: DishesArr
      });
      demo();
    });
  }
  else {
    if (name.trim() == "")
      alert('Please enter name');
    if (description.trim() == "")
      alert('Please enter description');

  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo() {
  await sleep(3000);
  window.location.reload();
}

function Preview()
{
  firebase.auth().onAuthStateChanged(function (user) {
    userNow2 = user.uid;
    var datesRef = firebase.database().ref();
    datesRef.child('Restaurants').child(userNow2).once('value',function (snap) { //once - only for one time connected
      snap.forEach(function (item) {
        var itemVal = item.val();
        document.getElementById('PicRestPreview').style.backgroundImage='url(' + itemVal.picUrl + ')';
        document.getElementById('NameRestPreview').innerHTML=itemVal.Name;
        var target = document.querySelector(".products-row");
        var front;var i=0;
        document.getElementById("products-row").innerHTML = "";
        itemVal.Dishes.forEach(function (dish) 
        {
          var imagedish="/images/default_dish.jpg";
          if(dish.imageUrl!="")
            imagedish=dish.imageUrl;
          if(i%2==0)
          {
            front="<div class=\"front\"><img src=\""+imagedish+"\" class=\"img-responsive\" alt=\"img\">"+
             "<div class=\"agile-product-text\"><h5>"+dish.name+"</h5>"+
             "</div></div>";
          }
          else
          {
            front="<div class=\"front\">"+
             "<div class=\"agile-product-text agile-product-text2\"><h5>"+dish.name+"</h5>"+
             "</div><img src=\""+imagedish+"\" class=\"img-responsive\" alt=\"img\"></div>";
          }
          i++;  
          target.insertAdjacentHTML("beforeend","<div class=\"col-xs-6 col-sm-4 product-grids\">"+
                                                "<div class=\"flip-container\">"+
                                                "<div class=\"flipper agile-products\">"+
                                                front+
                                                "<div class=\"back\"><h4>"+dish.name+"</h4><p>"+dish.dishDescription+"</p><h6>"+dish.dishPrice+"<sup><i class=\"fa fa-shekel\"></i></sup></h6>"+
                                                "<div class=\"clearfix\"> </div>"+
                                                "</div></div></div></div>");
                                                                          
        });
      });
    });
  });
}



/*"<form action=\"#\" method=\"post\">"+
"<a href=\"#\" data-toggle=\"modal\" data-target=\"#myModal1\" onclick=\"AddModelDdta("+i+")\">More</a></form>"+

function AddModelDdta(i)
{
  document.getElementById('ModelNameDish').innerHTML = DishesArr[i].name;
  
}*/