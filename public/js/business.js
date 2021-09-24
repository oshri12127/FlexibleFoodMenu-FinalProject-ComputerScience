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
var imageURL;

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
async function AddDish(e) {
  const name = document.getElementById('dishName').value;
  const dishImageFile = document.querySelector('#dishPic').files[0];
  const type = document.getElementById('dishType').value;
  const dishPrice = document.getElementById('dishPrice').value;
  const dishDescription = document.getElementById('dishDescription').value;
  if ((name != "") && (type != "") && (dishPrice != "") && (dishDescription != "")) {

    UplodeImage(dishImageFile);
    await sleep(3000);
    let dish =
    {
      "name": name,
      "imageUrl": imageURL,
      "dishType": type,
      "dishPrice": dishPrice,
      "dishDescription": dishDescription
    }
    DishesArr.push(dish);
    alert('Dish Saved!');

    document.getElementById('dishName').value = null;
    document.getElementById('dishPic').value = null;
    document.getElementById('dishType').value = null;
    document.getElementById('dishPrice').value = null;
    document.getElementById('dishDescription').value = null;
    //console.log(DishesArr);
  }
  else {
    if (name == "")
      alert('Please enter name');
    if (type == "")
      alert('Please choose type');
    if (dishPrice == "")
      alert('Please enter price');
    if (dishDescription == "")
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
  UplodeImage(LogoRestPic);
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
        restaurantsArr.push(itemVal);

        document.getElementById('PicRestPreview').style.backgroundImage='url(' + restaurantsArr[0].picUrl + ')';
        document.getElementById('NameRestPreview').innerHTML=restaurantsArr[0].Name;
        
      });
    });
  });
  //restaurantsArr=[];//clean the arr
}