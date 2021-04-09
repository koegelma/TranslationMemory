export class AbstractRegisteredUser {
  private _id: String;
  private _username: String;
  private _password: String;
  private _role: String;
  private _translatedWords: number;
  private _wordsAdded: number;
  private _english: Number;
  private _spanish: Number;
  private _italian: Number;

  constructor() {
    this._id = "";
    this._username = "";
    this._password = "";
    this._role = "";
    this._translatedWords = 0;
    this._wordsAdded = 0;
    this._english = 0
    this._spanish = 0;
    this._italian = 0;
  }

  public getID(): String {
    return this._id;
  }

  public setID(value: String) {
    this._id = value;
  }

  public getUsername(): String {
    return this._username;
  }

  public setUsername(value: String) {
    this._username = value;
  }

  public getPassword(): String {
    return this._password;
  }
  public setPassword(value: String) {
    this._password = value;
  }

  public getRole(): String {
    return this._role;
  }
  public setRole(value: String) {
    this._role = value;
  }

  public getTranslatedWords(): number {
    return this._translatedWords;
  }
  public setTranslatedWords(value: number) {
    this._translatedWords = value;
  }

  public getWordsAdded(): number {
    return this._wordsAdded;
  }
  public setWordsAdded(value: number) {
    this._wordsAdded = value;
  }

  public getEnglish(): Number {
    return this._english;
  }
  public setEnglish(value: Number) {
    this._english = value;
  }

  public getSpanish(): Number {
    return this._spanish;
  }
  public setSpanish(value: Number) {
    this._spanish = value;
  }

  public getItalian(): Number {
    return this._italian;
  }
  public setItalian(value: Number) {
    this._italian = value;
  }
}