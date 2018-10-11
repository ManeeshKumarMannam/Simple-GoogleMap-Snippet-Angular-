import { Component, OnInit, ViewChild, Injector } from "@angular/core";
import { BaseComponent } from "../../common/commonComponent";
declare const $: any;
declare const google: any;
// import { DirectionsTravelMode } from "@types/googlemaps";

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent extends BaseComponent implements OnInit {
  constructor(inj: Injector) {
    super(inj);
    this.selectedMode = "DRIVING";
    // this.getuserlocation();
  }

  ngOnInit() {
    this.getuserlocation();
  }
  public selectedMode: string;
  public directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#754C24"
    }
  });
  public directionsService = new google.maps.DirectionsService();
  public lat: any;
  public lng: any;
  public dest_lat: any = 23.2156;
  public dest_lng: any = 72.6369;
  public map: any = new google.maps.DirectionsRenderer();
  public pickupLocation: any = { lat: 23.0225, lng: 72.5714 };
  public dropoffLocation: any = { lat: 21.1702, lng: 72.8311 };
  public mapOptions: any = {
    zoom: 20,
    center: { lat: 23.0225, lng: 72.5714 }
  };
  public distance: any;
  public duraiton: any;

  getuserlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log("position:", position);
        this.initMap();
      });
    } else {
      this.popToast("error", "error in google Maps");
    }
    // this.lat = 23.0225;
    // this.lng = 72.5714;
    this.initMap();
  }

  public markers: any;
  makeMarker(position, icon, title, id) {
    this.markers = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
    });
  }

  public icons: any = {
    start: new google.maps.MarkerImage(
      // URL
      "assets/images/ic_pickup.png",
      // (width,height)
      new google.maps.Size(44, 44),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(10, 10)
    ),
    end: new google.maps.MarkerImage(
      // URL
      "assets/images/drop-icon.png",
      // (width,height)
      new google.maps.Size(44, 44),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(10, 10)
    ),
    truck: new google.maps.MarkerImage(
      // URL
      "assets/images/truck_track.png",
      // (width,height)
      new google.maps.Size(44, 44),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(10, 10)
    )
  };

  initMap() {
    console.log("lat, lng:", this.lat, this.lng);
    this.map = new google.maps.Map(
      document.getElementById("map"),
      this.mapOptions
    );
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map
    });
    // var directionsDisplay = new google.maps.DirectionsRenderer(
    // {
    //     map: map
    // });

    this.calculateAndDisplayRoute();
    // document.getElementById("mode").addEventListener("change", function() {
    //   this.calculateAndDisplayRoute(directionsService, directionsDisplay);
    // });
  }

  calculateAndDisplayRoute(event?) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map
    });
    if(event){
      console.log("selectedMode", this.selectedMode)
      this.selectedMode = event;
    }
    this.pickupLocation = {
      lat: parseFloat(this.lat),
      lng: parseFloat(this.lng)
    };
    this.dropoffLocation = {
      lat: parseFloat(this.dest_lat),
      lng: parseFloat(this.dest_lng)
    };
    console.log(
      "calculateAndDisplayRoute",
      this.pickupLocation,
      this.dropoffLocation
    );
    var selectedMode = this.selectedMode;
    console.log("mode:", this.selectedMode);
    //var selectedMode = mode;
    // var findRoute = function(Response?, status?) {
    //   if (status == "OK") {
    //     directionsDisplay.setDirections(Response);
    //   } else {
    //     window.alert("Directions request failed due to " + status);
    //   }
    // };

    var self = this;
    // var request = {
    //   origin: { lat: 23.022505, lng: 72.571365 },
    //   destination: { lat: 23.215635, lng: 72.63694 },
    //   travelMode: google.maps.TravelMode.DRIVING
    // };
    var request = {
      destination: this.dropoffLocation,
      origin: this.pickupLocation, // Haight.
      // destination: { lat: 37.768, lng: -122.511 }, // Ocean Beach.
      // origin: { lat: 37.77, lng: -122.447 }, // Haight.
      travelMode: this.selectedMode
      };
    directionsService.route(request, function(response, status) {
      if (status == "OK") {
        console.log(
          "DirectionsService: Response and Status:",
          response,
          status
        );
        directionsDisplay.setDirections(response);
        var leg = response.routes[0].legs[0];
        this.distance = response.routes[0].legs[0].distance.text;
        this.duration = response.routes[0].legs[0].duration.text;
        self.makeMarker(
          leg.start_location,
          self.icons.start,
          "Pickup Location",
          "one"
        );
        self.makeMarker(
          leg.end_location,
          self.icons.end,
          "Dropoff Location",
          "two"
        );
      } else {
        window.alert("Directions request failed due to " + status);
        // self.popToast("error", `status`);
      }
    });
  }
  mapClicked(event) {
    let lat = event.center.lat;
    console.log("Mapclicked", lat);
  }
}
