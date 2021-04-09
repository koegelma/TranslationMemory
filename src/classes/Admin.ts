import ConsoleHandling from "./ConsoleHandling";
import { Word } from "./Word";
import { NullWord } from "./NullWord";
import { AbstractWord } from "./abstracts/AbstractWord";
import { WordDAO } from "../types/worddao.type";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { RegisteredUser } from "./RegisteredUser";
import { RegisteredUserDAO } from "../types/registeredUserdao.type";

export class Admin {
  private _wordArr: Word[] = [];
  private _registeredUsersArr: RegisteredUser[] = [];

  private _id: String;
  private _username: String;

  constructor(id: String, username: String) {
    this._id = id;
    this._username = username;

    let wordsRaw = fs.readFileSync(path.resolve(__dirname, '../data/words.json'));
    let wordsJson: WordDAO[] = JSON.parse(wordsRaw.toString());

    let regUserRaw = fs.readFileSync(path.resolve(__dirname, '../data/registeredUsers.json'));
    let regUserJson: RegisteredUserDAO[] = JSON.parse(regUserRaw.toString());

    for (let word of wordsJson) {
      this._wordArr.push(new Word(word));
    }

    for (let regUser of regUserJson) {
      this._registeredUsersArr.push(new RegisteredUser(regUser));
    }
  }

  public async showFunctionalities(): Promise<void> {
    let answer: String = await ConsoleHandling.showPossibilities(
      [
        "1. Search for word",
        "2. Add a language to database",
        "3. Assign a language to translator",
      ],
      "Which function do you want to use? (default 1): ");

    this.handleAnswer(answer);
  }

  private async handleAnswer(answer: String): Promise<void> {
    switch (answer) {
      case "1":
        await this.searchWord();
        break;
      case "2":
        console.log("function not yet implemented");
        break;
      case "3":
        await this.assignLanguage();
        break;
      default:
        this.searchWord();
        break;
    }
    await this.goNext();
  }

  private async searchWord(): Promise<void> {
    let searchedWord: String = await ConsoleHandling.question("Which word are you looking for? ")
    let word: AbstractWord = this._wordArr.filter((word) => word.getWord().match(new RegExp(`${searchedWord}`, 'gi')))[0];

    ConsoleHandling.printInput("")
    word = word !== undefined ? word : new NullWord();

    ConsoleHandling.printInput("German: " + word.getWord());
    ConsoleHandling.printInput("English: " + word.getEnglish());
    ConsoleHandling.printInput("Spanish: " + word.getSpanish());
    ConsoleHandling.printInput("Italian: " + word.getItalian());
  }

  private async assignLanguage(): Promise<void> {
    let _translatorName: String = await ConsoleHandling.question("\nTo which Translator would you like to assign a new language to? Username: ")

    for (let index in this._registeredUsersArr) {
      let regUser: RegisteredUser = this._registeredUsersArr[index];
      let _index = Number.parseInt(index);

      if (regUser.getUsername() === _translatorName && regUser.getRole() === "translator") {
        let _selectLanguage: String = await ConsoleHandling.question("\nSelect a language you would like to assign: \n\n1. English \n2. Spanish \n3. Italian \n\nLanguage: ");
        switch (_selectLanguage) {
          case "1":
          case "English":

            if (regUser.getEnglish() == 0) {

              let _translatorData = {
                _id: regUser.getID(),
                _username: regUser.getUsername(),
                _password: regUser.getPassword(),
                _role: regUser.getRole(),
                _translatedWords: regUser.getTranslatedWords(),
                _wordsAdded: regUser.getWordsAdded(),
                _english: 1,
                _spanish: regUser.getSpanish(),
                _italian: regUser.getItalian()
              };

              this._registeredUsersArr.splice(_index, 1, new RegisteredUser(_translatorData));
              let newRegUsersJSON = JSON.stringify(this._registeredUsersArr, null, 2);
              fs.writeFileSync(path.resolve(__dirname, '../data/registeredUsers.json'), newRegUsersJSON);
              ConsoleHandling.printInput("\n Language has been set.");
            } else {
              ConsoleHandling.printInput("\nThis language is already set.");
            }

            break;
          case "2":
          case "Spanish":

            if (regUser.getSpanish() == 0) {

              let _translatorData = {
                _id: regUser.getID(),
                _username: regUser.getUsername(),
                _password: regUser.getPassword(),
                _role: regUser.getRole(),
                _translatedWords: regUser.getTranslatedWords(),
                _wordsAdded: regUser.getWordsAdded(),
                _english: regUser.getEnglish(),
                _spanish: 1,
                _italian: regUser.getItalian()
              };

              this._registeredUsersArr.splice(_index, 1, new RegisteredUser(_translatorData));
              let newRegUsersJSON = JSON.stringify(this._registeredUsersArr, null, 2);
              fs.writeFileSync(path.resolve(__dirname, '../data/registeredUsers.json'), newRegUsersJSON);
              ConsoleHandling.printInput("\n Language has been set");
            } else {
              ConsoleHandling.printInput("\nThis language is already set.");
            }

            break;
          case "3":
          case "Italian":

            if (regUser.getItalian() == 0) {

              let _translatorData = {
                _id: regUser.getID(),
                _username: regUser.getUsername(),
                _password: regUser.getPassword(),
                _role: regUser.getRole(),
                _translatedWords: regUser.getTranslatedWords(),
                _wordsAdded: regUser.getWordsAdded(),
                _english: regUser.getEnglish(),
                _spanish: regUser.getSpanish(),
                _italian: 1
              };

              this._registeredUsersArr.splice(_index, 1, new RegisteredUser(_translatorData));
              let newRegUsersJSON = JSON.stringify(this._registeredUsersArr, null, 2);
              fs.writeFileSync(path.resolve(__dirname, '../data/registeredUsers.json'), newRegUsersJSON);
              ConsoleHandling.printInput("\n Language has been set");
            } else {
              ConsoleHandling.printInput("\nThis language is already set.");
            }
            break;
        }
      }
    }
  }

  private async goNext(): Promise<void> {
    let answer: String = await ConsoleHandling.question("\n" + "Want to use another function? (y/n) ");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
        this.showFunctionalities();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole()
        break;
      default:
        this.showFunctionalities();
        break;
    }
  }
}