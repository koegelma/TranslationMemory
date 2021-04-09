import { AbstractRegisteredUser } from "./abstracts/AbstractRegisteredUser";

export class NullRegisteredUser extends AbstractRegisteredUser {
  constructor() {
    super();
    this.setID("");
    this.setUsername("User does not exist or wrong password");
    this.setPassword("");
    this.setRole("");
    this.setTranslatedWords(0);
    this.setWordsAdded(0);
    this.setEnglish(0);
    this.setSpanish(0);
    this.setItalian(0);
  }
}