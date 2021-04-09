import { RegisteredUserDAO } from "../types/registeredUserdao.type";
import { AbstractRegisteredUser} from "./abstracts/AbstractRegisteredUser";

export class RegisteredUser extends AbstractRegisteredUser {
  
  constructor(registeredUser: RegisteredUserDAO) {
    super();
    this.setID(registeredUser._id);
    this.setUsername(registeredUser._username);
    this.setPassword(registeredUser._password);
    this.setRole(registeredUser._role);
    this.setTranslatedWords(registeredUser._translatedWords);
    this.setWordsAdded(registeredUser._wordsAdded);
    this.setEnglish(registeredUser._english);
    this.setSpanish(registeredUser._spanish);
    this.setItalian(registeredUser._italian);
  }
}