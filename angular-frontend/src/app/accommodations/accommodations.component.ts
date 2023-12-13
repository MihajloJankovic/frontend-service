import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {ReservationComponent} from "../reservation/reservation.component";
import {AccommodationCreateComponent} from "../accommodation-create/accommodation-create.component";
import {MatDialog} from "@angular/material/dialog";
import { AuthGuard } from '../services/auth.guard';
import { AccomondationService } from '../services/accomondation.service';
import {AuthService} from "../services/auth.service";

class Accommodation {
  constructor(
    public name: string,
    public price: number,
    public location:string,
    public owner: string,
    public amenities: string[]
  ) {}
}

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css']
})
export class AccommodationsComponent implements OnInit{
  amenities: string[] = ['Swimming Pool', 'Free Wi-Fi', 'Gym'];
  selectedAmenities: { [key: string]: boolean } = {};
  accommodations: Accommodation[] = [];
  searchText = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  ownerFilter = '';

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog,
    private authGuard: AuthGuard,
    private accommodationsService: AccomondationService,
  private auth: AuthService) {}
 b:any =5;


  get filteredAccommodations(): Accommodation[] {
    return this.accommodations.filter(acc =>
      (this.searchText === '' || acc.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (this.minPrice === undefined || acc.price >= this.minPrice) &&
      (this.maxPrice === undefined || acc.price <= this.maxPrice) &&
      (this.ownerFilter === '' || acc.owner.toLowerCase().includes(this.ownerFilter.toLowerCase())) &&
      (this.amenities.length === 0 || this.hasAnyAmenity(acc, this.amenities))
    );
  }

  ngOnInit(): void {

    // const canActivate = this.authGuard.canActivate(
    //   {} as ActivatedRouteSnapshot,
    //   {} as RouterStateSnapshot
    // );
    this.accommodationsService.getAllAccommodations().subscribe(
      (data) => {
        console.log("data:" + data)
        this.accommodations = data;
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
    // }
  }
  applyFilters(): void {
    const filters = {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      owner: this.ownerFilter,
      amenities: this.getSelectedAmenities()
    };
    // console.log("aa");
    //ovde se doda zahtev

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
    this.router.navigate(['/accommodation'])
    console.log('View details for accommodation:', accommodation);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

}
