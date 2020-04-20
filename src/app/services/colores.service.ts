import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColoresService {
  private colors: string[];

  constructor() {
    this.colors = [
      '#2980B9',
      '#AED6F1',
      '#F39C12',
      '#16A085',
      '#34495E',
      '#D68910',
      '#1ABC9C',
      '#2ECC71',
      '#F1C40F',
      '#7F8C8D',
      '#C0392B',
      '#FC1CE8',
      '#FC1C1C',
      '#0E6655',
      '#F7DC6F',
      '#9A7D0A',
      '#935116',
      '#D2B4DE',
      '#7B7D7D',
      '#4D5656'
    ];
  }

  /**
   * Consultar siguiente código de color.
   */
  getColor(num: number) {
    const colorCode = this.colors[num];
    return colorCode;
  }
}
