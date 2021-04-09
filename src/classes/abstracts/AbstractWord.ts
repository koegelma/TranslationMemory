export class AbstractWord {
  private _id: String;
  private _word: String;
  private _english: String;
  private _spanish: String;
  private _italian: String;

  constructor() {
    this._id = "";
    this._word = "";
    this._english = "";
    this._spanish = "";
    this._italian = "";
  }

  public getID(): String {
    return this._id;
  }

  public setID(value: String) {
    this._id = value;
  }

  public getWord(): String {
    return this._word;
  }
  public setWord(value: String) {
    this._word = value;
  }

  public getEnglish(): String {
    return this._english;
  }

  public setEnglish(value: String) {
    this._english = value;
  }

  public getSpanish(): String {
    return this._spanish;
  }

  public setSpanish(value: String) {
    this._spanish = value;
  }

  public getItalian(): String {
    return this._italian;
  }

  public setItalian(value: String) {
    this._italian = value;
  }
}