import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ReservationComponent} from "../reservation/reservation.component";

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent {
  accommodationTitle: string = 'Beautiful Accommodation';
  accommodationDescription: string = 'A wonderful place to relax and enjoy your vacation.';
  locationDescription: string = 'Located in a peaceful area with stunning views.';
  facilities: string[] = ['Free Wi-Fi', 'Swimming Pool', 'Gym', 'Restaurant'];

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

  currentImageIndex: number = 0;

  constructor(private dialog: MatDialog) {
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

  openReservationDialog(): void {
    const dialogRef = this.dialog.open(ReservationComponent, {
      // Optional: Set additional options for the reservation dialog
    });

    // Optional: Add logic after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Reservation dialog closed. Result: ${result}`);
    });
  }



}
