import {
  BrowserModule,
  BrowserTransferStateModule
} from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

//components
import { AppComponent } from "./app.component";
import { MapsComponent } from "./components/maps/maps.component";

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "my-app" }),
    HttpClientModule,
    BrowserTransferStateModule,
    RouterModule.forRoot([
      //paths for the components
      { path: "**", redirectTo: "/", pathMatch: "full" }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
