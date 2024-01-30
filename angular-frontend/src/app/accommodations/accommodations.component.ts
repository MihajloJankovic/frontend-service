import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {ReservationComponent} from "../reservation/reservation.component";
import {AccommodationCreateComponent} from "../accommodation-create/accommodation-create.component";
import {MatDialog} from "@angular/material/dialog";
import { AuthGuard } from '../services/auth.guard';
import { AccomondationService } from '../services/accomondation.service';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import { Subscription } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { JwtHelperService } from '@auth0/angular-jwt';

class Availability {
  constructor(
    public from: Date,
    public to: Date,
    public price: number
  ) {}
}

class Accommodation {
  uid: any;
  constructor(
    public name: string,
    public location: string,
    public owner: string,
    public amenities: string[],
    public price: number,
    public availabilities: Availability[]
  ) {}
}

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css']
})
export class AccommodationsComponent implements OnInit{
  @ViewChild('locationInput') locationInput!: ElementRef<HTMLInputElement>;
@ViewChild('numberOfGuestsInput') numberOfGuestsInput!: ElementRef<HTMLInputElement>;
@ViewChild('dateFromInput') dateFromInput!: ElementRef<HTMLInputElement>;
@ViewChild('dateToInput') dateToInput!: ElementRef<HTMLInputElement>;


  amenities: string[] = [
    'Free Wi-Fi',
    'Swimming Pool',
    'Gym',
    'Restaurant',
    'Parking',
    'Spa and Wellness Center',
    'Air Conditioning',
    'Business Center',
    'Pet-Friendly'
  ];
  selectedAmenities: { [key: string]: boolean } = {};
  accommodations: Accommodation[] = [];
  searchText = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  ownerFilter = '';
  private accommodationsSubscription: Subscription | undefined;
  emaila: any;
  constructor(private http: HttpClient, private router: Router,public jwtHelper: JwtHelperService, private dialog: MatDialog, private userService: UserService,
    private authGuard: AuthGuard,
    private accommodationsService: AccomondationService,
  private auth: AuthService, private reservation: ReservationService) {}
 b:any =5;


  // get filteredAccommodations(): Accommodation[] {
  //   return this.accommodations.filter(acc =>
  //     (this.searchText === '' || acc.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
  //     (this.minPrice === undefined || acc.price >= this.minPrice) &&
  //     (this.maxPrice === undefined || acc.price <= this.maxPrice) &&
  //     (this.ownerFilter === '' || acc.owner.toLowerCase().includes(this.ownerFilter.toLowerCase())) &&
  //     (this.amenities.length === 0 || this.hasAnyAmenity(acc, this.amenities))
  //   );
  // }

  ngOnInit(): void {

    // const canActivate = this.authGuard.canActivate(
    //   {} as ActivatedRouteSnapshot,
    //   {} as RouterStateSnapshot
    // );
    this.accommodationsService.getAllAccommodations().subscribe(
      (data) => {
        console.log(data)
        this.accommodations = data;
        for (const accommodation of this.accommodations) {
          this.reservation.get_avaibility(accommodation.uid).subscribe((res) => {
            if (res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse") {
              alert("Error");
            } else {
              console.log(res);
              // Stick the availability data to the accommodation
              accommodation.availabilities = res.body.dummy;
              console.log(accommodation.availabilities[0].from);
            }
          });
        }
        this.b=1;
        
      },
      (error) => {
        console.error("error fetching accommodations", error);
      }
      
    )
    
    // if (!canActivate) {
    //   console.log('Unauthorized access');
    //   this.router.navigate(['/login']);
    // } else {
    //   console.log('Component initialized');
    // // }
    // for (const accommodation of this.accommodations) {
    //   console.log(accommodation);
    // }
    
  }
  ngOnDestroy(): void {
    // EXIT, kada se komponenta zatvara
    if (this.accommodationsSubscription) {
      this.accommodationsSubscription.unsubscribe();
    }
  }
  onLocationInputChange(event: any): void {
    this.applyFilters();
  }
  applyFilters(): void {
    const locationValue = this.locationInput.nativeElement.value;
    const numberOfGuestsValue = this.numberOfGuestsInput.nativeElement.value;
    const dateFromValue = this.dateFromInput.nativeElement.value;
    const dateToValue = this.dateToInput.nativeElement.value;

    // Now you can use these values in your logic...
    console.log('Location:', locationValue);
    console.log('Number of Guests:', numberOfGuestsValue);
    console.log('Date From:', dateFromValue);
    console.log('Date To:', dateToValue);
  }

  private getSelectedAmenities(): string[] {
    return Object.keys(this.selectedAmenities).filter(key => this.selectedAmenities[key]);
  }

  private hasAnyAmenity(accommodation: Accommodation, selectedAmenities: string[]): boolean {
    return selectedAmenities.length === 0 ||
           selectedAmenities.some(amenity => accommodation.amenities.includes(amenity));
  }

  showCreateAccommodationDialog: boolean = false;

  openCreateAccommodationDialog() {
    const dialogRef = this.dialog.open(AccommodationCreateComponent, {

    });

    // Optional: Add logic after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Accommodation creating dialog closed. Result: ${result}`);
    });
  }

  viewAccommodationDetails(accommodation: any) {
    this.router.navigate(['/accommodation/'+accommodation.uid])
    console.log('View details for accommodation:', accommodation);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
  token: any;
  role:any;
  isHost(): boolean {
    // Pretpostavljamo da AuthService pruža informacije o trenutnom korisniku
    this.token = this.auth.getDecodedAccessToken();
    console.log(this.token)

    // Pretpostavljamo da ima property 'role' koji sadrži informacije o roli korisnika
    if (this.token.role === 'Host') {
      return true;
    }
    return false;
  }


}
