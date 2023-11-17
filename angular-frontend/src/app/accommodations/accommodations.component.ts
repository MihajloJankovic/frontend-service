import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

class Accommodation {
  constructor(
    public name: string,
    public price: number,
    public owner: string,
    public amenities: string[]
  ) {}
}

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css']
})
export class AccommodationsComponent {
  amenities: string[] = ['Swimming Pool', 'Free Wi-Fi', 'Gym'];
  selectedAmenities: { [key: string]: boolean } = {};
  accommodations: Accommodation[] = [];
  searchText = '';
  minPrice: number | undefined; 
  maxPrice: number | undefined; 
  ownerFilter = '';

  constructor(private http: HttpClient) {}

  get filteredAccommodations(): Accommodation[] {
    return this.accommodations.filter(acc =>
      (this.searchText === '' || acc.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (this.minPrice === undefined || acc.price >= this.minPrice) &&
      (this.maxPrice === undefined || acc.price <= this.maxPrice) &&
      (this.ownerFilter === '' || acc.owner.toLowerCase().includes(this.ownerFilter.toLowerCase())) &&
      (this.amenities.length === 0 || this.hasAnyAmenity(acc, this.amenities))
    );
  }

  applyFilters(): void {
    const filters = {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      owner: this.ownerFilter,
      amenities: this.amenities
    };

    //ovde se doda zahtev
    this.http.post<any>('/api/filterAccommodations', filters)
      .subscribe(data => {
        this.accommodations = data.dummyList.dummy;
      });
  }

  private hasAnyAmenity(accommodation: Accommodation, selectedAmenities: string[]): boolean {
    return selectedAmenities.length === 0 || 
           selectedAmenities.some(amenity => accommodation.amenities.includes(amenity));
  }
}
