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

  const restaurantsArr = [];
  const DishesArr = [];
  
  function AddDish(e){
    //const dishImage = editFrom.dishPic.value;
    const type = document.getElementById('dishType').value;
    const dishPrice = document.getElementById('dishPrice').value;
    const dishDescription = document.getElementById('dishDescription').value;
    if((type!="")&&(dishPrice!="")&&(dishDescription!=""))
    {
      let dish = 
      {
        //"image": dishImage,
        "dishType": type,
        "dishPrice": dishPrice,
        "dishDescription": dishDescription
      }
      DishesArr.push(dish);
      alert('Dish Saved!');
      document.getElementById('dishPic').value=null;
      document.getElementById('dishType').value=null;
      document.getElementById('dishPrice').value=null;
      document.getElementById('dishDescription').value=null;
    }
    else
    {
      if(type=="")
        alert('Please choose type');
      if(dishPrice=="")
        alert('Please enter price');
      if(dishDescription=="")
        alert('Please enter description');
    }
  }
  

//var userNow2;
function UpdateAll(e){
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  //const LogoRestPic = document.getElementById('LogoRestPic').value;
  //const loc = document.getElementById('pac-input').value;
  const restaurantType = document.getElementById('restaurantType').value;
  kosher=0;//0=False
  if(document.getElementById('kosher').checked)
    {kosher = 1;}//1=True
firebase.auth().onAuthStateChanged(function (user){
userNow2 = user.uid;
var datesRef = firebase.database().ref();
datesRef.child('Restaurant').child(userNow2).child('RestInfo').set({
  Name: name,
  //picUrl: LogoRestPic,
  Description: description,
  //Location: loc,
  Type: restaurantType,
  Kosher: kosher,
  Dishes: DishesArr
});
demo();
});
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo()
{
  await sleep(3000);
  window.location.reload(); 
}