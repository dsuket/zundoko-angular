export class BmiModel {
  constructor(
    public weight: number,
    public height: number
  ) {}

  get bmi() {
    const heightMeters = this.height * 0.01;
    return Math.round(this.weight / (heightMeters * heightMeters));
  }

}
