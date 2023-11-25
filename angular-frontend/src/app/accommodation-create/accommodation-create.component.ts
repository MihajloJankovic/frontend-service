import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-accommodation-create',
  templateUrl: './accommodation-create.component.html',
  styleUrls: ['./accommodation-create.component.css']
})
export class AccommodationCreateComponent {
  accommodationForm: FormGroup;
  accommodationName: string = '';
  accommodationDescription: string = '';
  priceMode: string = '';
  totalPrice: number = 0;
  pricePerPerson: number = 0;
  numberOfPersons: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.accommodationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priceMode: ['', Validators.required],
      totalPrice: [0, Validators.required],
      pricePerPerson: [0, Validators.required],
      numberOfPersons: [0, Validators.required]
    });
  }

  submitForm() {
    if (this.accommodationForm.valid) {
      // Ako je forma validna, obavi željenu akciju
      console.log('Forma je validna. Podaci:', this.accommodationForm.value);
    } else {
      // Ako forma nije validna, prikaži greške ili obavi odgovarajuće akcije
      console.log('Forma nije validna. Popravi greške.');
    }
  }
}
