import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ReservationComponent} from "../reservation/reservation.component";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AccomondationService} from "../services/accomondation.service";
import {FormControl, FormGroup} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AvabilityComponent} from "../avability/avability.component";
import {AuthService} from "../services/auth.service";
import {ReservationService} from "../services/reservation.service";

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent {
  accommodationTitle: string = 'Beautiful Accommodation';
  location: string = 'Serbia';
  description: string = 'Located in a peaceful area with stunning views.';
  facilities: string[] = [
    'Free Wi-Fi',
    'Swimming Pool',
    'Gym',
    'Restaurant',
    'Parking',
    'Spa and Wellness Center',
    '24/7 Front Desk',
    'Air Conditioning',
    'Business Center',
    'Pet-Friendly'
  ];


  arrows: boolean[] = [false, true];


  images: string[] = [
    '/assets/images/image1.jpg',
    '/assets/images/image2.jpg',
    '/assets/images/image3.jpg',
    '/assets/images/image4.jpg',
    '/assets/images/image5.jpg',
    '/assets/images/image6.jpg',
    // Add more image paths as needed
  ];
  b:number  = 0
  currentImageIndex: number = 0;

  constructor(private dialog: MatDialog,private accservice : AccomondationService,public jwtHelper: JwtHelperService,private route: ActivatedRoute, private router: Router, private auth: AuthService, private reservation: ReservationService) {
    // ...
  }


  get currentImage(): string {
    return this.images[this.currentImageIndex];
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateArrows();
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateArrows();
  }

  updateArrows() {
    this.arrows[0] = this.currentImageIndex !== 0;
    this.arrows[1] = this.currentImageIndex !== this.images.length - 1;
  }
id:any;
  accommodations: any[] = [];
  post:any;
  owner:any;
  emaila: any;
  token:any;
    ngOnInit(): void {
    if(this.auth.isAuthenticated()){
      this.token = localStorage.getItem('jwt');
      let s = this.jwtHelper.decodeToken(this.token)
      this.emaila = s.email;
    }
        this.id = this.route.snapshot.paramMap.get('id');
        this.accservice.getOne(this.id).subscribe((data) => {
          this.post  = data;
          this.reservation.get_avaibility(this.id).subscribe((res) => {
            if(res.body == "NOT_ACCEPTABLE" || res.name == "HttpErrorResponse")
            {
              alert("Error")
            }else {
              console.log(res)
              this.accommodations = res.body.dummy;
            }
          });
          this.accommodationTitle = this.post.name;
          this.location = this.post.location;
          this.description = this.post.adress;
          this.facilities = this.post.amenities || [];
          this.owner = this.post.email;
          this.b = 1;
          console.log('Facilities:', this.facilities);
        },
          (error) => {
            console.error("error fetching accommodation", error);
          });

    }

  openAvaibilityDialog(): void {
    const dialogfdd = this.dialog.open(AvabilityComponent, {
      data: {
        uid: this.id,
        // Add any other data you want to pass to the dialog
      },
    });

    // Optional: Add logic after the dialog is closed
    dialogfdd.afterClosed().subscribe(result => {
      console.log(`Avability dialog closed. Result: ${result}`);
    });
  }
  openReservationDialog(): void {
    const dialogRef = this.dialog.open(ReservationComponent, {
      data: {
        id: this.id,
        key2: 'value2',
        // Add any other data you want to pass to the dialog
      },
    });

    // Optional: Add logic after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Reservation dialog closed. Result: ${result}`);
    });
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

}
