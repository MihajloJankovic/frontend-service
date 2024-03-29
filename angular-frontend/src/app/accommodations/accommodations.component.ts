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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

class Availability {
  constructor(
    public from: Date,
    public to: Date,
    public price_hole: number,
    public price_per_person: number,
    public number_of_people: number,


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
  filteredAccommodations: Accommodation[] = [];
  searchText = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  ownerFilter = '';
  private accommodationsSubscription: Subscription | undefined;
  emaila: any;
  changePasswordForm: FormGroup;


  constructor(private http: HttpClient,private fb: FormBuilder, private router: Router,public jwtHelper: JwtHelperService, private dialog: MatDialog, private userService: UserService,
    private authGuard: AuthGuard,
    private accommodationsService: AccomondationService,
  private auth: AuthService, private reservation: ReservationService) {
    this.changePasswordForm = this.fb.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', [Validators.required]],
  });
  }
 b:any =5;
  flagg:any =0;

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
              accommodation.availabilities = res.body.dummy;
              console.log("aaa" + accommodation.availabilities[0].price_hole);
            }
          });
        }
        this.filteredAccommodations = JSON.parse(JSON.stringify(this.accommodations));
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
  getNumberOfGuests(): number {
    const numberOfGuests = parseFloat(this.numberOfGuestsInput.nativeElement.value);
    return isNaN(numberOfGuests) || numberOfGuests < 1 ? 1 : numberOfGuests;
  }


  onLocationInputChange(event: any): void {

    this.applyFilters();
  }

  private a: Accommodation[] = [];
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
     this.a = JSON.parse(JSON.stringify(this.accommodations));
    this.filteredAccommodations = this.a.filter(acc =>
      (locationValue === '' || acc.location.includes(locationValue)) &&
      (this.isDateInRange(acc, dateFromValue, dateToValue)) &&
      (this.isGuestOKey(acc, dateFromValue, dateToValue))
    );

  }
  public countDays() {
    // Convert both dates to milliseconds
    const fromDate = new Date(this.changePasswordForm.value.dateFrom);
    const toDate = new Date(this.changePasswordForm.value.dateTo);


    var startMillis = fromDate.getTime();
    var endMillis = toDate.getTime();

    // Calculate the difference in milliseconds
    var differenceMillis = Math.abs(endMillis - startMillis);

    // Convert milliseconds to days
    var daysDifference = Math.ceil(differenceMillis / (1000 * 3600 * 24));

    return daysDifference;
  }
  private isGuestOKey(accommodation: Accommodation, dateFrom: string, dateTo: string): boolean {
    if (!dateFrom || !dateTo) {
      return true;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    if (fromDate >= toDate ) {
      return false;
      alert("FromDate must be before ToDate");
    }
    let arrayCopy = JSON.parse(JSON.stringify(accommodation.availabilities));
    for (const availability of arrayCopy) {
      if (availability.price_hole > 1 || (availability.price_per_person > 0 && availability.number_of_people >= this.getNumberOfGuests())) {

      } else {
        for (const tempa of this.a) {
          if (JSON.stringify(tempa) === JSON.stringify(accommodation)) {
            return false;
          }
        }

      }
    }
    return true;
  }
  private isDateInRange(accommodation: Accommodation, dateFrom: string, dateTo: string): boolean {
    if (!dateFrom || !dateTo) {
      return true;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    if (fromDate >= toDate ) {
      return false;
      alert("FromDate must be before ToDate");
    }
    let arrayCopy = JSON.parse(JSON.stringify(accommodation.availabilities));

    for (const availability of arrayCopy) {
      const availFrom = new Date(availability.from);
      const availTo = new Date(availability.to);

      // Check if the availability range overlaps with the specified date range
      if (availFrom <= fromDate && availTo >= toDate) {

      }else {

          for(const tempa of accommodation.availabilities){
            if(JSON.stringify(tempa) === JSON.stringify(availability)){
              let a = accommodation.availabilities.indexOf(tempa)
              accommodation.availabilities.splice(a, 1);
            }
          }



      }
    }
    if(accommodation.availabilities.length > 0 ){
      this.flagg = 1;
      return true;
    }else {
      return false;
    }
  }

  clearFilters(): void {
    this.flagg = 0;
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
              accommodation.availabilities = res.body.dummy;
            }
          });
        }
        this.filteredAccommodations = this.accommodations;
        this.b=1;

      },
      (error) => {
        console.error("error fetching accommodations", error);
      }

    )
    this.locationInput.nativeElement.value = '';
    this.numberOfGuestsInput.nativeElement.value = '';
    this.dateFromInput.nativeElement.value = '';
    this.dateToInput.nativeElement.value = '';
    this.applyFilters();
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
